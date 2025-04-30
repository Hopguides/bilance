import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnnualReports from './pages/AnnualReports';
import BalanceSheet from './pages/BalanceSheet';
import IncomeStatement from './pages/IncomeStatement';
import CashFlowStatement from './pages/CashFlowStatement';
import EquityStatement from './pages/EquityStatement';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="annual-reports" element={<AnnualReports />} />
        <Route path="annual-reports/:reportId/balance-sheet" element={<BalanceSheet />} />
        <Route path="annual-reports/:reportId/income-statement" element={<IncomeStatement />} />
        <Route path="annual-reports/:reportId/cash-flow-statement" element={<CashFlowStatement />} />
        <Route path="annual-reports/:reportId/equity-statement" element={<EquityStatement />} />
        {/* Add other routes here as needed */}
      </Route>

      {/* Redirect any unknown paths to dashboard if logged in, otherwise to login */}
      <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

