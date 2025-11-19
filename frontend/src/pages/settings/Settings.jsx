import React, { useState, useEffect } from 'react';
import { FaBuilding, FaUser, FaLock, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Company Data
  const [companyData, setCompanyData] = useState({
    name: '',
    tradeName: '',
    cnpj: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  // User Profile Data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    createdAt: ''
  });

  // Password Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const tabs = [
    { id: 'company', icon: FaBuilding, label: 'Dados da Empresa' },
    { id: 'profile', icon: FaUser, label: 'Meu Perfil' },
    { id: 'password', icon: FaLock, label: 'Alterar Senha' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Buscar dados do usuário logado
      const userResponse = await api.get('/auth/me');
      const user = userResponse.data.user;

      setUserData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        createdAt: user.createdAt || ''
      });

      // Buscar dados da empresa
      if (user.companyId) {
        try {
          const companyResponse = await api.get(`/companies/${user.companyId}`);
          const company = companyResponse.data;

          setCompanyData({
            name: company.name || '',
            tradeName: company.tradeName || '',
            cnpj: company.cnpj || '',
            email: company.email || '',
            phone: company.phone || '',
            address: {
              street: company.address?.street || '',
              number: company.address?.number || '',
              complement: company.address?.complement || '',
              neighborhood: company.address?.neighborhood || '',
              city: company.address?.city || '',
              state: company.address?.state || '',
              zipCode: company.address?.zipCode || ''
            }
          });
        } catch (error) {
          console.error('Erro ao carregar empresa:', error);
          toast.error('Erro ao carregar dados da empresa');
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
      setLoading(false);
    }
  };

  const handleCompanyChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setCompanyData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setCompanyData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveCompany = async () => {
    try {
      setSaving(true);

      if (!authUser?.companyId) {
        toast.error('Empresa não identificada');
        return;
      }

      await api.put(`/companies/${authUser.companyId}`, companyData);
      toast.success('Dados da empresa atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar dados da empresa');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      if (!authUser?.id) {
        toast.error('Usuário não identificado');
        return;
      }

      await api.put(`/users/${authUser.id}`, {
        name: userData.name
      });

      toast.success('Perfil atualizado com sucesso!');

      // Atualizar localStorage
      const updatedUser = { ...authUser, name: userData.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validações
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error('Preencha todos os campos de senha');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('A nova senha e a confirmação não coincidem');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error('A nova senha deve ter no mínimo 6 caracteres');
        return;
      }

      setSaving(true);

      if (!authUser?.id) {
        toast.error('Usuário não identificado');
        return;
      }

      await api.put(`/users/${authUser.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Senha alterada com sucesso!');

      // Limpar campos
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleLabel = (role) => {
    const roles = {
      ADMIN: 'Administrador',
      MANAGER: 'Gerente',
      USER: 'Usuário'
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Carregando...
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>
        Configurações
      </h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Sidebar Tabs */}
        <div style={{
          width: '280px',
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s',
                  color: isActive ? 'white' : '#666'
                }}
              >
                <Icon style={{ fontSize: '18px' }} />
                <span style={{ fontWeight: isActive ? '600' : '400', fontSize: '14px' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Company Tab */}
          {activeTab === 'company' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#333' }}>
                Dados da Empresa
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Razão Social e Nome Fantasia */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      Razão Social *
                    </label>
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => handleCompanyChange('name', e.target.value)}
                      placeholder="Nome legal da empresa"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      value={companyData.tradeName}
                      onChange={(e) => handleCompanyChange('tradeName', e.target.value)}
                      placeholder="Nome comercial"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* CNPJ */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    value={companyData.cnpj}
                    onChange={(e) => handleCompanyChange('cnpj', e.target.value)}
                    placeholder="00.000.000/0000-00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Email e Telefone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => handleCompanyChange('email', e.target.value)}
                      placeholder="contato@empresa.com"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={companyData.phone}
                      onChange={(e) => handleCompanyChange('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div style={{
                  borderTop: '1px solid #e5e5e5',
                  marginTop: '10px',
                  marginBottom: '10px'
                }} />

                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                  Endereço
                </h3>

                {/* CEP e Rua */}
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      CEP
                    </label>
                    <input
                      type="text"
                      value={companyData.address.zipCode}
                      onChange={(e) => handleCompanyChange('address.zipCode', e.target.value)}
                      placeholder="00000-000"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      Rua
                    </label>
                    <input
                      type="text"
                      value={companyData.address.street}
                      onChange={(e) => handleCompanyChange('address.street', e.target.value)}
                      placeholder="Nome da rua"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Número e Complemento */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      Número
                    </label>
                    <input
                      type="text"
                      value={companyData.address.number}
                      onChange={(e) => handleCompanyChange('address.number', e.target.value)}
                      placeholder="Nº"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={companyData.address.complement}
                      onChange={(e) => handleCompanyChange('address.complement', e.target.value)}
                      placeholder="Apto, Sala, etc."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Bairro */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={companyData.address.neighborhood}
                    onChange={(e) => handleCompanyChange('address.neighborhood', e.target.value)}
                    placeholder="Bairro"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Cidade e Estado */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={companyData.address.city}
                      onChange={(e) => handleCompanyChange('address.city', e.target.value)}
                      placeholder="Cidade"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                      UF
                    </label>
                    <input
                      type="text"
                      value={companyData.address.state}
                      onChange={(e) => handleCompanyChange('address.state', e.target.value.toUpperCase())}
                      placeholder="SP"
                      maxLength="2"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e5e5',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={handleSaveCompany}
                    disabled={saving}
                    style={{
                      padding: '12px 32px',
                      background: saving ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaSave /> {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#333' }}>
                Meu Perfil
              </h2>

              {/* User Info Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                marginBottom: '30px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#667eea',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}>
                  {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '600', color: 'white' }}>
                    {userData.name}
                  </h3>
                  <p style={{ margin: '5px 0', color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                    {userData.email}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getRoleLabel(userData.role)}
                    </span>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Cadastro: {formatDate(userData.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Nome */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Email (não editável) */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                    Email (não editável)
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: '#f9fafb',
                      color: '#666',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Info adicional */}
                <div style={{
                  padding: '16px',
                  background: '#f0f7ff',
                  borderRadius: '8px',
                  borderLeft: '4px solid #2563eb'
                }}>
                  <p style={{ margin: 0, color: '#1e40af', fontSize: '14px' }}>
                    <strong>Perfil:</strong> {getRoleLabel(userData.role)}
                  </p>
                  <p style={{ margin: '8px 0 0 0', color: '#1e40af', fontSize: '14px' }}>
                    <strong>Membro desde:</strong> {formatDate(userData.createdAt)}
                  </p>
                </div>

                {/* Save Button */}
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e5e5',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      padding: '12px 32px',
                      background: saving ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaSave /> {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#333' }}>
                Alterar Senha
              </h2>

              <div style={{
                padding: '16px',
                background: '#fff7ed',
                borderRadius: '8px',
                borderLeft: '4px solid #f59e0b',
                marginBottom: '24px'
              }}>
                <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
                  <strong>Dica de Segurança:</strong> Use uma senha forte com no mínimo 6 caracteres,
                  combinando letras maiúsculas, minúsculas e números.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                {/* Senha Atual */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                    Senha Atual *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Digite sua senha atual"
                      style={{
                        width: '100%',
                        padding: '12px',
                        paddingRight: '45px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '16px'
                      }}
                    >
                      {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Nova Senha */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                    Nova Senha *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Digite sua nova senha"
                      style={{
                        width: '100%',
                        padding: '12px',
                        paddingRight: '45px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '16px'
                      }}
                    >
                      {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Nova Senha */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                    Confirmar Nova Senha *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirme sua nova senha"
                      style={{
                        width: '100%',
                        padding: '12px',
                        paddingRight: '45px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '16px'
                      }}
                    >
                      {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Password Match Indicator */}
                {passwordData.newPassword && passwordData.confirmPassword && (
                  <div style={{
                    padding: '12px',
                    background: passwordData.newPassword === passwordData.confirmPassword ? '#dcfce7' : '#fee2e2',
                    color: passwordData.newPassword === passwordData.confirmPassword ? '#166534' : '#991b1b',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    {passwordData.newPassword === passwordData.confirmPassword ?
                      '✓ As senhas coincidem' :
                      '✗ As senhas não coincidem'}
                  </div>
                )}

                {/* Save Button */}
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e5e5',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    style={{
                      padding: '12px 32px',
                      background: saving ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaSave /> {saving ? 'Salvando...' : 'Salvar Nova Senha'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
