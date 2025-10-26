import React, { useState } from 'react';
import { FaBuilding, FaUser, FaLock, FaBell, FaPalette, FaSave } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', icon: FaBuilding, label: 'Empresa' },
    { id: 'profile', icon: FaUser, label: 'Perfil' },
    { id: 'security', icon: FaLock, label: 'Segurança' },
    { id: 'notifications', icon: FaBell, label: 'Notificações' },
    { id: 'appearance', icon: FaPalette, label: 'Aparência' }
  ];

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>
        Configurações
      </h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Sidebar Tabs */}
        <div style={{
          width: '250px',
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
                  background: isActive ? '#f0f7ff' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s',
                  color: isActive ? '#2563eb' : '#666'
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
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
                Informações da Empresa
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    defaultValue="Demo Store"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    CNPJ
                  </label>
                  <input
                    type="text"
                    defaultValue="12.345.678/0001-90"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                      Telefone
                    </label>
                    <input
                      type="text"
                      defaultValue="(11) 98765-4321"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="contato@demostore.com"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
                Meu Perfil
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold'
                  }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' }}>
                      {user?.name}
                    </h3>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>{user?.email}</p>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      padding: '4px 12px',
                      background: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {user?.role === 'ADMIN' ? 'Administrador' : 
                       user?.role === 'MANAGER' ? 'Gerente' : 'Vendedor'}
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
                Segurança
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
                Notificações
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { label: 'Novas vendas', description: 'Receber notificações de novas vendas' },
                  { label: 'Estoque baixo', description: 'Alerta quando produtos estiverem com estoque baixo' },
                  { label: 'Vencimentos', description: 'Lembrete de contas a pagar e receber' },
                  { label: 'Novos clientes', description: 'Notificação de novos cadastros de clientes' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '500', color: '#333' }}>{item.label}</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>{item.description}</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: '#10b981',
                        transition: '0.4s',
                        borderRadius: '24px'
                      }} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
                Aparência
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: '#333' }}>
                    Tema
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    {[
                      { id: 'light', label: 'Claro', color: '#fff' },
                      { id: 'dark', label: 'Escuro', color: '#1a202c' },
                      { id: 'auto', label: 'Automático', color: 'linear-gradient(135deg, #fff 0%, #1a202c 100%)' }
                    ].map((theme) => (
                      <button key={theme.id} style={{
                        padding: '20px',
                        background: theme.color,
                        border: '2px solid #e5e5e5',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          margin: '0 auto 10px',
                          background: theme.color,
                          borderRadius: '8px',
                          border: '2px solid #e5e5e5'
                        }} />
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#333' }}>
                          {theme.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e5e5',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={handleSave}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaSave /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
