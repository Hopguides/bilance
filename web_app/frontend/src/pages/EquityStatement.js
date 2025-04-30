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

const EquityStatement = () => {
  const { reportId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [equityStatement, setEquityStatement] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    const fetchEquityStatement = async () => {
      if (!user || !reportId) return;
      setLoading(true);
      setError('');
      setValidationResult(null);
      try {
        // Adjust API endpoint as needed
        const response = await axios.get(`/api/equity-statements/annual-report/${reportId}`);
        setEquityStatement(response.data);
        setFormData(response.data || {}); // Initialize form data
      } catch (err) {
        console.error("Error fetching equity statement:", err);
        setError(err.response?.data?.message || 'Napaka pri nalaganju izkaza gibanja kapitala.');
      }
      setLoading(false);
    };
    fetchEquityStatement();
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
    if (!equityStatement || !equityStatement.id) return;
    setSaving(true);
    setError('');
    setSaveSuccess('');
    setValidationResult(null);
    try {
      // Adjust API endpoint as needed
      const response = await axios.put(`/api/equity-statements/${equityStatement.id}`, formData);
      setEquityStatement(response.data.equityStatement); // Update state with saved data
      setFormData(response.data.equityStatement);
      setSaveSuccess('Izkaz gibanja kapitala uspešno shranjen.');
    } catch (err) {
      console.error("Error saving equity statement:", err);
      setError(err.response?.data?.message || 'Napaka pri shranjevanju izkaza gibanja kapitala.');
    }
    setSaving(false);
  };

  const handleValidate = async () => {
    if (!equityStatement || !equityStatement.id) return;
    setValidating(true);
    setError('');
    setValidationResult(null);
    try {
      // Adjust API endpoint as needed
      const response = await axios.post(`/api/equity-statements/${equityStatement.id}/validate`);
      setValidationResult(response.data);
    } catch (err) {
      console.error("Error validating equity statement:", err);
      setError(err.response?.data?.message || 'Napaka pri validaciji izkaza gibanja kapitala.');
    }
    setValidating(false);
  };

  // Calculate totals for display (read-only) - Simplified example
  const beginningTotalEquity = 
    parseFloat(formData.beginning_called_up_capital || 0) +
    parseFloat(formData.beginning_capital_reserves || 0) +
    parseFloat(formData.beginning_reserves_from_profit || 0) +
    parseFloat(formData.beginning_revaluation_reserves || 0) +
    parseFloat(formData.beginning_fair_value_reserves || 0) +
    parseFloat(formData.beginning_retained_earnings || 0);

  const changesTotalEquity = 
    parseFloat(formData.changes_called_up_capital || 0) +
    parseFloat(formData.changes_capital_reserves || 0) +
    parseFloat(formData.changes_reserves_from_profit || 0) +
    parseFloat(formData.changes_revaluation_reserves || 0) +
    parseFloat(formData.changes_fair_value_reserves || 0) +
    parseFloat(formData.changes_retained_earnings || 0) +
    parseFloat(formData.net_profit_for_period || 0); // Net profit is a change

  const endingTotalEquity = 
    parseFloat(formData.ending_called_up_capital || 0) +
    parseFloat(formData.ending_capital_reserves || 0) +
    parseFloat(formData.ending_reserves_from_profit || 0) +
    parseFloat(formData.ending_revaluation_reserves || 0) +
    parseFloat(formData.ending_fair_value_reserves || 0) +
    parseFloat(formData.ending_retained_earnings || 0) +
    parseFloat(formData.ending_net_profit || 0); // Ending net profit is part of ending equity

  const calculatedEndingTotalEquity = beginningTotalEquity + changesTotalEquity;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !equityStatement) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!equityStatement) {
    return <Typography>Izkaz gibanja kapitala ni na voljo.</Typography>;
  }

  return (
    <Container maxWidth="lg"> {/* Use larger container for table-like structure */}
      <Typography variant="h4" gutterBottom>
        Izkaz gibanja kapitala - Leto {equityStatement.AnnualReport?.year}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>{saveSuccess}</Alert>}
      {validationResult && (
        <Alert severity={validationResult.valid ? "success" : "error"} sx={{ mb: 2 }}>
          {validationResult.valid ? "Izkaz gibanja kapitala je veljaven." : `Napaka pri validaciji: ${validationResult.errors.join(', ')}`}
          {!validationResult.valid && ` (Izračunano končno stanje: ${formatNumber(validationResult.calculatedEndingTotalEquity)} EUR, Deklarirano: ${formatNumber(validationResult.declaredEndingTotalEquity)} EUR)`}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          {/* Use Grid to create a table-like layout */}
          <Grid container spacing={1} sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 1 }}>
            <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold">Postavka kapitala</Typography></Grid>
            <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold">Začetno stanje</Typography></Grid>
            <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold">Spremembe med letom</Typography></Grid>
            <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold">Končno stanje</Typography></Grid>
          </Grid>

          {/* Called-up Capital */}
          <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={3}><Typography>Vpoklicani kapital</Typography></Grid>
            <Grid item xs={3}><TextField size="small" name="beginning_called_up_capital" value={formData.beginning_called_up_capital || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="changes_called_up_capital" value={formData.changes_called_up_capital || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="ending_called_up_capital" value={formData.ending_called_up_capital || ''} onChange={handleChange} fullWidth type="number" /></Grid>
          </Grid>

          {/* Capital Reserves */}
          <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={3}><Typography>Kapitalske rezerve</Typography></Grid>
            <Grid item xs={3}><TextField size="small" name="beginning_capital_reserves" value={formData.beginning_capital_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="changes_capital_reserves" value={formData.changes_capital_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="ending_capital_reserves" value={formData.ending_capital_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
          </Grid>

          {/* Reserves from Profit */}
          <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={3}><Typography>Rezerve iz dobička</Typography></Grid>
            <Grid item xs={3}><TextField size="small" name="beginning_reserves_from_profit" value={formData.beginning_reserves_from_profit || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="changes_reserves_from_profit" value={formData.changes_reserves_from_profit || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="ending_reserves_from_profit" value={formData.ending_reserves_from_profit || ''} onChange={handleChange} fullWidth type="number" /></Grid>
          </Grid>

          {/* Revaluation Reserves */}
          <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={3}><Typography>Prevrednotovalne rezerve</Typography></Grid>
            <Grid item xs={3}><TextField size="small" name="beginning_revaluation_reserves" value={formData.beginning_revaluation_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="changes_revaluation_reserves" value={formData.changes_revaluation_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="ending_revaluation_reserves" value={formData.ending_revaluation_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
          </Grid>

          {/* Fair Value Reserves */}
          <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={3}><Typography>Rezerve poštene vrednosti</Typography></Grid>
            <Grid item xs={3}><TextField size="small" name="beginning_fair_value_reserves" value={formData.beginning_fair_value_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="changes_fair_value_reserves" value={formData.changes_fair_value_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="ending_fair_value_reserves" value={formData.ending_fair_value_reserves || ''} onChange={handleChange} fullWidth type="number" /></Grid>
          </Grid>

          {/* Retained Earnings */}
          <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={3}><Typography>Preneseni čisti poslovni izid</Typography></Grid>
            <Grid item xs={3}><TextField size="small" name="beginning_retained_earnings" value={formData.beginning_retained_earnings || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="changes_retained_earnings" value={formData.changes_retained_earnings || ''} onChange={handleChange} fullWidth type="number" /></Grid>
            <Grid item xs={3}><TextField size="small" name="ending_retained_earnings" value={formData.ending_retained_earnings || ''} onChange={handleChange} fullWidth type="number" /></Grid>
          </Grid>

          {/* Net Profit for Period */}
          <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={3}><Typography>Čisti poslovni izid poslovnega leta</Typography></Grid>
            <Grid item xs={3}><TextField size="small" name="beginning_net_profit" value={formData.beginning_net_profit || '0'} onChange={handleChange} fullWidth type="number" disabled InputProps={{ readOnly: true }} /></Grid> {/* Typically 0 at beginning */}
            <Grid item xs={3}><TextField size="small" name="net_profit_for_period" value={formData.net_profit_for_period || ''} onChange={handleChange} fullWidth type="number" /></Grid> {/* This is the main change */}
            <Grid item xs={3}><TextField size="small" name="ending_net_profit" value={formData.ending_net_profit || ''} onChange={handleChange} fullWidth type="number" /></Grid> {/* Should match net_profit_for_period if not distributed */}
          </Grid>

          {/* Totals */}
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold">SKUPAJ KAPITAL</Typography></Grid>
            <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold">{formatNumber(beginningTotalEquity)} EUR</Typography></Grid>
            <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold">{formatNumber(changesTotalEquity)} EUR</Typography></Grid>
            <Grid item xs={3}><Typography variant="subtitle1" fontWeight="bold">{formatNumber(endingTotalEquity)} EUR</Typography></Grid>
          </Grid>
          <Grid container spacing={1} sx={{ mt: 1 }}>
             <Grid item xs={12}><Typography variant="subtitle1">Izračunano končno stanje skupaj: {formatNumber(calculatedEndingTotalEquity)} EUR</Typography></Grid>
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
        </Box>
      </Paper>
    </Container>
  );
};

export default EquityStatement;

