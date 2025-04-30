import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Grid, CircularProgress, Alert, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios'; // Assuming axios is configured

// Helper function to format numbers
const formatNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

const CashFlowStatement = () => {
  const { reportId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cashFlowStatement, setCashFlowStatement] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    const fetchCashFlowStatement = async () => {
      if (!user || !reportId) return;
      setLoading(true);
      setError('');
      setValidationResult(null);
      try {
        // Adjust API endpoint as needed
        const response = await axios.get(`/api/cash-flow-statements/annual-report/${reportId}`);
        setCashFlowStatement(response.data);
        setFormData(response.data || {}); // Initialize form data
      } catch (err) {
        console.error("Error fetching cash flow statement:", err);
        setError(err.response?.data?.message || 'Napaka pri nalaganju izkaza denarnih tokov.');
      }
      setLoading(false);
    };
    fetchCashFlowStatement();
  }, [user, reportId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear validation result on change
    setValidationResult(null);
    setSaveSuccess('');
  };

  const handleSave = async () => {
    if (!cashFlowStatement || !cashFlowStatement.id) return;
    setSaving(true);
    setError('');
    setSaveSuccess('');
    setValidationResult(null);
    try {
      // Adjust API endpoint as needed
      const response = await axios.put(`/api/cash-flow-statements/${cashFlowStatement.id}`, formData);
      setCashFlowStatement(response.data.cashFlowStatement); // Update state with saved data
      setFormData(response.data.cashFlowStatement);
      setSaveSuccess('Izkaz denarnih tokov uspešno shranjen.');
    } catch (err) {
      console.error("Error saving cash flow statement:", err);
      setError(err.response?.data?.message || 'Napaka pri shranjevanju izkaza denarnih tokov.');
    }
    setSaving(false);
  };

  const handleValidate = async () => {
    if (!cashFlowStatement || !cashFlowStatement.id) return;
    setValidating(true);
    setError('');
    setValidationResult(null);
    try {
      // Adjust API endpoint as needed
      const response = await axios.post(`/api/cash-flow-statements/${cashFlowStatement.id}/validate`);
      setValidationResult(response.data);
    } catch (err) {
      console.error("Error validating cash flow statement:", err);
      setError(err.response?.data?.message || 'Napaka pri validaciji izkaza denarnih tokov.');
    }
    setValidating(false);
  };

  // Calculate totals for display (read-only)
  const operatingCashFlow = 
    parseFloat(formData.operating_inflows || 0) - parseFloat(formData.operating_outflows || 0);
  const investingCashFlow = 
    parseFloat(formData.investing_inflows || 0) - parseFloat(formData.investing_outflows || 0);
  const financingCashFlow = 
    parseFloat(formData.financing_inflows || 0) - parseFloat(formData.financing_outflows || 0);
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
  const calculatedEndBalance = parseFloat(formData.beginning_balance || 0) + netCashFlow;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !cashFlowStatement) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!cashFlowStatement) {
    return <Typography>Izkaz denarnih tokov ni na voljo.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Izkaz denarnih tokov - Leto {cashFlowStatement.AnnualReport?.year}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>{saveSuccess}</Alert>}
      {validationResult && (
        <Alert severity={validationResult.valid ? "success" : "error"} sx={{ mb: 2 }}>
          {validationResult.valid ? "Izkaz denarnih tokov je veljaven." : `Napaka pri validaciji: ${validationResult.errors.join(', ')}`}
          {!validationResult.valid && ` (Izračunano končno stanje: ${formatNumber(validationResult.calculatedEndBalance)} EUR, Deklarirano: ${formatNumber(validationResult.declaredEndBalance)} EUR)`}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            {/* Beginning Balance */}
            <Grid item xs={12}>
              <TextField label="Začetno stanje denarnih sredstev" name="beginning_balance" value={formData.beginning_balance || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
            </Grid>

            {/* Operating Activities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>A. Denarni tok iz poslovanja</Typography>
              <Divider sx={{ mb: 2 }} />
              <TextField label="Prejemki iz poslovanja" name="operating_inflows" value={formData.operating_inflows || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Izdatki iz poslovanja" name="operating_outflows" value={formData.operating_outflows || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>Neto denarni tok iz poslovanja (A): {formatNumber(operatingCashFlow)} EUR</Typography>
            </Grid>

            {/* Investing Activities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>B. Denarni tok iz investiranja</Typography>
              <Divider sx={{ mb: 2 }} />
              <TextField label="Prejemki iz investiranja" name="investing_inflows" value={formData.investing_inflows || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Izdatki iz investiranja" name="investing_outflows" value={formData.investing_outflows || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>Neto denarni tok iz investiranja (B): {formatNumber(investingCashFlow)} EUR</Typography>
            </Grid>

            {/* Financing Activities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>C. Denarni tok iz financiranja</Typography>
              <Divider sx={{ mb: 2 }} />
              <TextField label="Prejemki iz financiranja" name="financing_inflows" value={formData.financing_inflows || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Izdatki iz financiranja" name="financing_outflows" value={formData.financing_outflows || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>Neto denarni tok iz financiranja (C): {formatNumber(financingCashFlow)} EUR</Typography>
            </Grid>

            {/* Net Change and Ending Balance */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Skupni denarni tok in končno stanje</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>Neto povečanje/zmanjšanje denarnih sredstev (A + B + C): {formatNumber(netCashFlow)} EUR</Typography>
              <TextField label="Končno stanje denarnih sredstev" name="end_balance" value={formData.end_balance || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>Izračunano končno stanje: {formatNumber(calculatedEndBalance)} EUR</Typography>
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleValidate} 
                  disabled={validating || saving}
                  startIcon={validating ? <CircularProgress size={20} /> : <CheckCircleOutlineIcon />}
                  sx={{ mr: 2 }}
                >
                  Validiraj
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave} 
                  disabled={saving || validating}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  Shrani
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CashFlowStatement;

