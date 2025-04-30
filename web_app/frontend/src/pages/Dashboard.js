import React, { useState, useEffect, useContext } from 'react';
import { Typography, Box, Paper, Grid, Button, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios'; // Assuming axios is configured for API calls

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return; // Wait for user context
      setLoading(true);
      setError('');
      try {
        // Fetch company associated with the user
        // Adjust API endpoint as needed
        const companyRes = await axios.get('/api/companies/me'); 
        setCompany(companyRes.data);

        if (companyRes.data && companyRes.data.id) {
          // Fetch annual reports for the company
          // Adjust API endpoint as needed
          const reportsRes = await axios.get(`/api/annual-reports/company/${companyRes.data.id}`);
          setReports(reportsRes.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Napaka pri nalaganju podatkov za nadzorno ploščo.');
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Nadzorna plošča
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {company ? (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Podatki o podjetju</Typography>
          <Typography>Naziv: {company.name}</Typography>
          <Typography>Matična številka: {company.registration_number}</Typography>
          <Typography>Davčna številka: {company.tax_number}</Typography>
          {/* Add more company details or a link to edit */} 
        </Paper>
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }}>Podatki o podjetju niso na voljo. Prosimo, dodajte jih v nastavitvah.</Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Letna poročila</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          component={RouterLink} 
          to="/annual-reports" // Link to page where new report can be created
          disabled={!company} // Disable if no company data
        >
          Novo poročilo
        </Button>
      </Box>

      {reports.length > 0 ? (
        <Grid container spacing={2}>
          {reports.slice(0, 3).map((report) => ( // Show latest 3 reports for example
            <Grid item xs={12} md={4} key={report.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Leto {report.year}</Typography>
                <Typography>Status: {report.status}</Typography>
                <Button 
                  component={RouterLink} 
                  to={`/annual-reports/${report.id}/balance-sheet`} // Link to view/edit report
                  sx={{ mt: 1 }}
                >
                  Odpri
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Ni oddanih letnih poročil.</Typography>
      )}

      {reports.length > 3 && (
        <Button component={RouterLink} to="/annual-reports" sx={{ mt: 2 }}>
          Prikaži vsa poročila
        </Button>
      )}

    </Box>
  );
};

export default Dashboard;

