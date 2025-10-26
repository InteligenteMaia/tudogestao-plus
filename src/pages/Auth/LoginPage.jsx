// 💻 Felipe Gonzaga - Frontend Developer
// 🎨 Najla Cardeal - QA/Designer
// Página de login

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/UI/Common/Button';
import Input from '../../components/UI/Common/Input';
import { useToast } from '../../hooks/useToast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, loading, error } = useAuth();
  const { error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await handleLogin({ email, password });
    
    if (!result.success) {
      showError(result.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Logo Mobile */}
      <div className="lg:hidden flex items-center justify-center mb-8">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          TudoGestão+
        </div>
      </div>

      <div className="card-apple p-8">
        <div className="mb-8">
          <h2 className="text-h1 text-gray-900 dark:text-gray-100 mb-2">
            Bem-vindo de volta
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-400">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
            placeholder="seu@email.com"
            required
            fullWidth
          />

          <div>
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              placeholder="••••••••"
              required
              fullWidth
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Lembrar-me
              </span>
            </label>
            
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;