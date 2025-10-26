// 💻 Felipe Gonzaga - Frontend Developer
// Componente raiz da aplicação

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Layout
import MainLayout from './components/UI/Layout/MainLayout';
import AuthLayout from './components/UI/Layout/AuthLayout';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CustomersPage from './pages/Customers/CustomersPage';
import SuppliersPage from './pages/Suppliers/SuppliersPage';
import ProductsPage from './pages/Products/ProductsPage';
import SalesPage from './pages/Sales/SalesPage';
import FinancialPage from './pages/Financial/FinancialPage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/Settings/SettingsPage';

// Services
import { loadUser } from './store/slices/authSlice';

// Components
import Loading from './components/UI/Common/Loading';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    // Carrega usuário ao iniciar
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  if (loading) {
    return <Loading fullscreen />;
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rotas privadas */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers/*" element={<CustomersPage />} />
        <Route path="/suppliers/*" element={<SuppliersPage />} />
        <Route path="/products/*" element={<ProductsPage />} />
        <Route path="/sales/*" element={<SalesPage />} />
        <Route path="/financial/*" element={<FinancialPage />} />
        <Route path="/reports/*" element={<ReportsPage />} />
        <Route path="/settings/*" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;