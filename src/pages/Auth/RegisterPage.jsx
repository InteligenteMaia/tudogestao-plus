// 💻 Felipe Gonzaga - Frontend Developer
// 🎨 Najla Cardeal - QA/Designer
// Página de registro

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/UI/Common/Button';
import Input from '../../components/UI/Common/Input';
import { useToast } from '../../hooks/useToast';
import { isValidCNPJ, formatCNPJ } from '../../utils/validators';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    userName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const { handleRegister, loading } = useAuth();
  const { error: showError } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!isValidCNPJ(formData.cnpj)) {
      showError('CNPJ inválido');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showError('As senhas não conferem');
      return;
    }
    
    if (formData.password.length < 6) {
      showError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    const result = await handleRegister(formData);
    
    if (!result.success) {
      showError(result.error || 'Erro ao fazer cadastro');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="card-apple p-8">
        <div className="mb-8">
          <h2 className="text-h1 text-gray-900 dark:text-gray-100 mb-2">
            Cadastre sua empresa
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-400">
            Comece a usar o TudoGestão+ gratuitamente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Empresa"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            icon={<Building2 className="w-5 h-5" />}
            placeholder="Minha Empresa Ltda"
            required
            fullWidth
          />

          <Input
            label="CNPJ"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
            required
            fullWidth
          />

          <Input
            label="Seu Nome"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            icon={<User className="w-5 h-5" />}
            placeholder="João Silva"
            required
            fullWidth
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail className="w-5 h-5" />}
            placeholder="seu@email.com"
            required
            fullWidth
          />

          <Input
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone className="w-5 h-5" />}
            placeholder="(11) 99999-9999"
            fullWidth
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon={<Lock className="w-5 h-5" />}
            placeholder="••••••••"
            required
            fullWidth
          />

          <Input
            label="Confirmar Senha"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={<Lock className="w-5 h-5" />}
            placeholder="••••••••"
            required
            fullWidth
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Criar Conta
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;