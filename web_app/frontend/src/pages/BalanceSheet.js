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

const BalanceSheet = () => {
  const { reportId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    const fetchBalanceSheet = async () => {
      if (!user || !reportId) return;
      setLoading(true);
      setError('');
      setValidationResult(null);
      try {
        // Adjust API endpoint as needed
        const response = await axios.get(`/api/balance-sheets/annual-report/${reportId}`);
        setBalanceSheet(response.data);
        setFormData(response.data || {}); // Initialize form data
      } catch (err) {
        console.error("Error fetching balance sheet:", err);
        setError(err.response?.data?.message || 'Napaka pri nalaganju bilance stanja.');
      }
      setLoading(false);
    };
    fetchBalanceSheet();
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
    if (!balanceSheet || !balanceSheet.id) return;
    setSaving(true);
    setError('');
    setSaveSuccess('');
    setValidationResult(null);
    try {
      // Adjust API endpoint as needed
      const response = await axios.put(`/api/balance-sheets/${balanceSheet.id}`, formData);
      setBalanceSheet(response.data.balanceSheet); // Update state with saved data
      setFormData(response.data.balanceSheet);
      setSaveSuccess('Bilanca stanja uspešno shranjena.');
    } catch (err) {
      console.error("Error saving balance sheet:", err);
      setError(err.response?.data?.message || 'Napaka pri shranjevanju bilance stanja.');
    }
    setSaving(false);
  };

  const handleValidate = async () => {
    if (!balanceSheet || !balanceSheet.id) return;
    setValidating(true);
    setError('');
    setValidationResult(null);
    try {
      // Adjust API endpoint as needed
      const response = await axios.post(`/api/balance-sheets/${balanceSheet.id}/validate`);
      setValidationResult(response.data);
    } catch (err) {
      console.error("Error validating balance sheet:", err);
      setError(err.response?.data?.message || 'Napaka pri validaciji bilance stanja.');
    }
    setValidating(false);
  };

  // Calculate totals for display (read-only)
  const totalAssets = 
    parseFloat(formData.intangible_assets || 0) +
    parseFloat(formData.tangible_assets || 0) +
    parseFloat(formData.investment_property || 0) +
    parseFloat(formData.long_term_financial_investments || 0) +
    parseFloat(formData.long_term_business_receivables || 0) +
    parseFloat(formData.deferred_tax_assets || 0) +
    parseFloat(formData.assets_for_sale || 0) +
    parseFloat(formData.inventory || 0) +
    parseFloat(formData.short_term_financial_investments || 0) +
    parseFloat(formData.short_term_business_receivables || 0) +
    parseFloat(formData.cash_and_cash_equivalents || 0) +
    parseFloat(formData.short_term_deferrals || 0);

  const totalLiabilities = 
    parseFloat(formData.called_up_capital || 0) +
    parseFloat(formData.capital_reserves || 0) +
    parseFloat(formData.reserves_from_profit || 0) +
    parseFloat(formData.revaluation_reserves || 0) +
    parseFloat(formData.fair_value_reserves || 0) +
    parseFloat(formData.retained_earnings || 0) +
    parseFloat(formData.net_profit_for_period || 0) +
    parseFloat(formData.provisions || 0) +
    parseFloat(formData.long_term_financial_liabilities || 0) +
    parseFloat(formData.long_term_business_liabilities || 0) +
    parseFloat(formData.deferred_tax_liabilities || 0) +
    parseFloat(formData.liabilities_for_sale || 0) +
    parseFloat(formData.short_term_financial_liabilities || 0) +
    parseFloat(formData.short_term_business_liabilities || 0) +
    parseFloat(formData.short_term_accruals || 0);

  const difference = totalAssets - totalLiabilities;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !balanceSheet) {
    // Show error only if loading failed completely
    return <Alert severity="error">{error}</Alert>;
  }

  if (!balanceSheet) {
    // Should not happen if loading is false and no error, but handle defensively
    return <Typography>Bilanca stanja ni na voljo.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Bilanca stanja - Leto {balanceSheet.AnnualReport?.year}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>{saveSuccess}</Alert>}
      {validationResult && (
        <Alert severity={validationResult.valid ? "success" : "error"} sx={{ mb: 2 }}>
          {validationResult.valid ? "Bilanca stanja je uravnotežena." : `Napaka pri validaciji: ${validationResult.errors.join(', ')}`}
          {!validationResult.valid && ` (Razlika: ${formatNumber(validationResult.difference)} EUR)`}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            {/* Assets Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Sredstva (Aktiva)</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1" gutterBottom>A. Dolgoročna sredstva</Typography>
              <TextField label="Neopredmetena sredstva" name="intangible_assets" value={formData.intangible_assets || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Opredmetena osnovna sredstva" name="tangible_assets" value={formData.tangible_assets || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Naložbene nepremičnine" name="investment_property" value={formData.investment_property || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Dolgoročne finančne naložbe" name="long_term_financial_investments" value={formData.long_term_financial_investments || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Dolgoročne poslovne terjatve" name="long_term_business_receivables" value={formData.long_term_business_receivables || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Odložene terjatve za davek" name="deferred_tax_assets" value={formData.deferred_tax_assets || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Sredstva za prodajo (dolgoročna)" name="assets_for_sale" value={formData.assets_for_sale || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>B. Kratkoročna sredstva</Typography>
              <TextField label="Zaloge" name="inventory" value={formData.inventory || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Kratkoročne finančne naložbe" name="short_term_financial_investments" value={formData.short_term_financial_investments || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Kratkoročne poslovne terjatve" name="short_term_business_receivables" value={formData.short_term_business_receivables || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Denarna sredstva" name="cash_and_cash_equivalents" value={formData.cash_and_cash_equivalents || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Kratkoročne aktivne časovne razmejitve" name="short_term_deferrals" value={formData.short_term_deferrals || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              
              <Typography variant="h6" sx={{ mt: 3 }}>VSOTA SREDSTEV (AKTIVA): {formatNumber(totalAssets)} EUR</Typography>
            </Grid>

            {/* Liabilities Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Obveznosti do virov sredstev (Pasiva)</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1" gutterBottom>A. Kapital</Typography>
              <TextField label="Vpoklicani kapital" name="called_up_capital" value={formData.called_up_capital || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Kapitalske rezerve" name="capital_reserves" value={formData.capital_reserves || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Rezerve iz dobička" name="reserves_from_profit" value={formData.reserves_from_profit || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Prevrednotovalne rezerve" name="revaluation_reserves" value={formData.revaluation_reserves || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Rezerve poštene vrednosti" name="fair_value_reserves" value={formData.fair_value_reserves || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Preneseni čisti poslovni izid" name="retained_earnings" value={formData.retained_earnings || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Čisti poslovni izid poslovnega leta" name="net_profit_for_period" value={formData.net_profit_for_period || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>B. Rezervacije in dolgoročne pasivne časovne razmejitve</Typography>
              <TextField label="Rezervacije" name="provisions" value={formData.provisions || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>C. Dolgoročne obveznosti</Typography>
              <TextField label="Dolgoročne finančne obveznosti" name="long_term_financial_liabilities" value={formData.long_term_financial_liabilities || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Dolgoročne poslovne obveznosti" name="long_term_business_liabilities" value={formData.long_term_business_liabilities || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Odložene obveznosti za davek" name="deferred_tax_liabilities" value={formData.deferred_tax_liabilities || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Obveznosti iz sredstev za prodajo" name="liabilities_for_sale" value={formData.liabilities_for_sale || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>D. Kratkoročne obveznosti</Typography>
              <TextField label="Kratkoročne finančne obveznosti" name="short_term_financial_liabilities" value={formData.short_term_financial_liabilities || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Kratkoročne poslovne obveznosti" name="short_term_business_liabilities" value={formData.short_term_business_liabilities || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Kratkoročne pasivne časovne razmejitve" name="short_term_accruals" value={formData.short_term_accruals || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              
              <Typography variant="h6" sx={{ mt: 3 }}>VSOTA OBVEZNOSTI DO VIROV SREDSTEV (PASIVA): {formatNumber(totalLiabilities)} EUR</Typography>
            </Grid>

            {/* Summary and Actions */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color={Math.abs(difference) > 0.01 ? 'error' : 'success'}>
                Razlika (Aktiva - Pasiva): {formatNumber(difference)} EUR
              </Typography>
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

export default BalanceSheet;

