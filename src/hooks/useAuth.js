// 💻 Felipe Gonzaga - Frontend Developer
// Hook customizado para autenticação

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
      return { success: true };
    }
    return { success: false, error: result.payload };
  };

  const handleRegister = async (data) => {
    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
      return { success: true };
    }
    return { success: false, error: result.payload };
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole(['ADMIN']);
  const isManager = () => hasRole(['ADMIN', 'MANAGER']);
  const canAccessFinancial = () => hasRole(['ADMIN', 'MANAGER', 'FINANCIAL']);
  const canSell = () => hasRole(['ADMIN', 'MANAGER', 'SALESPERSON']);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    hasRole,
    isAdmin,
    isManager,
    canAccessFinancial,
    canSell,
  };
};