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

const IncomeStatement = () => {
  const { reportId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [incomeStatement, setIncomeStatement] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    const fetchIncomeStatement = async () => {
      if (!user || !reportId) return;
      setLoading(true);
      setError('');
      setValidationResult(null);
      try {
        // Adjust API endpoint as needed
        const response = await axios.get(`/api/income-statements/annual-report/${reportId}`);
        setIncomeStatement(response.data);
        setFormData(response.data || {}); // Initialize form data
      } catch (err) {
        console.error("Error fetching income statement:", err);
        setError(err.response?.data?.message || 'Napaka pri nalaganju izkaza poslovnega izida.');
      }
      setLoading(false);
    };
    fetchIncomeStatement();
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
    if (!incomeStatement || !incomeStatement.id) return;
    setSaving(true);
    setError('');
    setSaveSuccess('');
    setValidationResult(null);
    try {
      // Adjust API endpoint as needed
      const response = await axios.put(`/api/income-statements/${incomeStatement.id}`, formData);
      setIncomeStatement(response.data.incomeStatement); // Update state with saved data
      setFormData(response.data.incomeStatement);
      setSaveSuccess('Izkaz poslovnega izida uspešno shranjen.');
    } catch (err) {
      console.error("Error saving income statement:", err);
      setError(err.response?.data?.message || 'Napaka pri shranjevanju izkaza poslovnega izida.');
    }
    setSaving(false);
  };

  const handleValidate = async () => {
    if (!incomeStatement || !incomeStatement.id) return;
    setValidating(true);
    setError('');
    setValidationResult(null);
    try {
      // Adjust API endpoint as needed
      const response = await axios.post(`/api/income-statements/${incomeStatement.id}/validate`);
      setValidationResult(response.data);
    } catch (err) {
      console.error("Error validating income statement:", err);
      setError(err.response?.data?.message || 'Napaka pri validaciji izkaza poslovnega izida.');
    }
    setValidating(false);
  };

  // Calculate totals for display (read-only)
  const totalRevenue = 
    parseFloat(formData.net_sales_revenue || 0) +
    parseFloat(formData.change_in_inventory_value || 0) +
    parseFloat(formData.capitalized_own_products || 0) +
    parseFloat(formData.other_operating_revenue || 0) +
    parseFloat(formData.financial_revenue_from_shares || 0) +
    parseFloat(formData.financial_revenue_from_loans || 0) +
    parseFloat(formData.financial_revenue_from_receivables || 0) +
    parseFloat(formData.other_revenue || 0);

  const totalExpenses = 
    parseFloat(formData.costs_of_goods_materials_services || 0) +
    parseFloat(formData.labor_costs || 0) +
    parseFloat(formData.write_offs || 0) +
    parseFloat(formData.other_operating_expenses || 0) +
    parseFloat(formData.financial_expenses_from_impairment || 0) +
    parseFloat(formData.financial_expenses_from_liabilities || 0) +
    parseFloat(formData.financial_expenses_from_payables || 0) +
    parseFloat(formData.other_expenses || 0) +
    parseFloat(formData.income_tax || 0) +
    parseFloat(formData.deferred_tax || 0);

  const calculatedNetProfit = totalRevenue - totalExpenses;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !incomeStatement) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!incomeStatement) {
    return <Typography>Izkaz poslovnega izida ni na voljo.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Izkaz poslovnega izida - Leto {incomeStatement.AnnualReport?.year}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>{saveSuccess}</Alert>}
      {validationResult && (
        <Alert severity={validationResult.valid ? "success" : "error"} sx={{ mb: 2 }}>
          {validationResult.valid ? "Izkaz poslovnega izida je veljaven." : `Napaka pri validaciji: ${validationResult.errors.join(', ')}`}
          {!validationResult.valid && ` (Izračunan čisti dobiček: ${formatNumber(validationResult.calculatedNetProfit)} EUR, Deklariran: ${formatNumber(validationResult.declaredNetProfit)} EUR)`}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            {/* Revenue Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Prihodki</Typography>
              <Divider sx={{ mb: 2 }} />
              <TextField label="Čisti prihodki od prodaje" name="net_sales_revenue" value={formData.net_sales_revenue || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Sprememba vrednosti zalog proizvodov in nedokončane proizvodnje" name="change_in_inventory_value" value={formData.change_in_inventory_value || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Usredstveni lastni proizvodi in storitve" name="capitalized_own_products" value={formData.capitalized_own_products || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Drugi poslovni prihodki" name="other_operating_revenue" value={formData.other_operating_revenue || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Finančni prihodki iz deležev" name="financial_revenue_from_shares" value={formData.financial_revenue_from_shares || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Finančni prihodki iz posojil" name="financial_revenue_from_loans" value={formData.financial_revenue_from_loans || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Finančni prihodki iz poslovnih terjatev" name="financial_revenue_from_receivables" value={formData.financial_revenue_from_receivables || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Drugi finančni prihodki" name="other_revenue" value={formData.other_revenue || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>VSOTA PRIHODKOV: {formatNumber(totalRevenue)} EUR</Typography>
            </Grid>

            {/* Expenses Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Odhodki</Typography>
              <Divider sx={{ mb: 2 }} />
              <TextField label="Stroški blaga, materiala in storitev" name="costs_of_goods_materials_services" value={formData.costs_of_goods_materials_services || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Stroški dela" name="labor_costs" value={formData.labor_costs || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Amortizacija in drugi odpisi" name="write_offs" value={formData.write_offs || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Drugi poslovni odhodki" name="other_operating_expenses" value={formData.other_operating_expenses || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Finančni odhodki iz oslabitev" name="financial_expenses_from_impairment" value={formData.financial_expenses_from_impairment || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Finančni odhodki iz obveznosti" name="financial_expenses_from_liabilities" value={formData.financial_expenses_from_liabilities || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Finančni odhodki iz poslovnih obveznosti" name="financial_expenses_from_payables" value={formData.financial_expenses_from_payables || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Drugi finančni odhodki" name="other_expenses" value={formData.other_expenses || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Davek iz dobička" name="income_tax" value={formData.income_tax || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <TextField label="Odloženi davki" name="deferred_tax" value={formData.deferred_tax || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>VSOTA ODHODKOV: {formatNumber(totalExpenses)} EUR</Typography>
            </Grid>

            {/* Net Profit Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Čisti poslovni izid</Typography>
              <Divider sx={{ mb: 2 }} />
              <TextField label="Čisti poslovni izid poslovnega leta" name="net_profit" value={formData.net_profit || ''} onChange={handleChange} fullWidth margin="dense" type="number" />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>Izračunan čisti poslovni izid: {formatNumber(calculatedNetProfit)} EUR</Typography>
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

export default IncomeStatement;

