import React, { useState, useEffect, useContext } from 'react';
import { Typography, Box, Paper, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios'; // Assuming axios is configured

const AnnualReports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newReportYear, setNewReportYear] = useState(new Date().getFullYear() - 1);
  const [dialogError, setDialogError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return;
      setLoading(true);
      setError('');
      try {
        const companyRes = await axios.get('/api/companies/me');
        setCompany(companyRes.data);
        if (companyRes.data && companyRes.data.id) {
          const reportsRes = await axios.get(`/api/annual-reports/company/${companyRes.data.id}`);
          setReports(reportsRes.data);
        }
      } catch (err) {
        console.error("Error fetching annual reports data:", err);
        setError('Napaka pri nalaganju letnih poročil.');
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleOpenDialog = () => {
    setNewReportYear(new Date().getFullYear() - 1); // Reset to previous year
    setDialogError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateReport = async () => {
    if (!company || !company.id) {
      setDialogError('Podatki o podjetju niso na voljo.');
      return;
    }
    if (!newReportYear || newReportYear < 1990 || newReportYear > new Date().getFullYear()) {
      setDialogError('Vnesite veljavno leto.');
      return;
    }
    setDialogError('');
    try {
      const response = await axios.post('/api/annual-reports', {
        companyId: company.id,
        year: newReportYear
      });
      setReports([response.data.annualReport, ...reports]);
      handleCloseDialog();
      // Optionally navigate to the newly created report
      // navigate(`/annual-reports/${response.data.annualReport.id}/balance-sheet`);
    } catch (err) {
      console.error("Error creating annual report:", err);
      setDialogError(err.response?.data?.message || 'Napaka pri ustvarjanju poročila.');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Ali ste prepričani, da želite izbrisati ta osnutek poročila?')) {
      try {
        await axios.delete(`/api/annual-reports/${reportId}`);
        setReports(reports.filter(report => report.id !== reportId));
      } catch (err) {
        console.error("Error deleting annual report:", err);
        setError(err.response?.data?.message || 'Napaka pri brisanju poročila.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Letna poročila
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenDialog}
          disabled={!company}
        >
          Novo poročilo
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!company && !loading && <Alert severity="warning" sx={{ mb: 2 }}>Podatki o podjetju niso na voljo. Prosimo, dodajte jih v nastavitvah.</Alert>}

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Leto</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ustvarjeno</TableCell>
                <TableCell>Posodobljeno</TableCell>
                <TableCell align="right">Dejanja</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow
                  key={report.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {report.year}
                  </TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(report.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />} 
                      component={RouterLink} 
                      to={`/annual-reports/${report.id}/balance-sheet`} // Start editing with balance sheet
                      sx={{ mr: 1 }}
                    >
                      Uredi
                    </Button>
                    {report.status === 'draft' && (
                      <Button 
                        size="small" 
                        color="error" 
                        startIcon={<DeleteIcon />} 
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        Izbriši
                      </Button>
                    )}
                    {/* Add buttons for validation, export, submission based on status */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {reports.length === 0 && <Typography sx={{ textAlign: 'center', mt: 3 }}>Ni najdenih letnih poročil.</Typography>}
      </Paper>

      {/* Dialog for creating new report */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ustvari novo letno poročilo</DialogTitle>
        <DialogContent>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            id="year"
            label="Leto poročila"
            type="number"
            fullWidth
            variant="standard"
            value={newReportYear}
            onChange={(e) => setNewReportYear(parseInt(e.target.value, 10))}
            inputProps={{ min: 1990, max: new Date().getFullYear() }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Prekliči</Button>
          <Button onClick={handleCreateReport}>Ustvari</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnualReports;

