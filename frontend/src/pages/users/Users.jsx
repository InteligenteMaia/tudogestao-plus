import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaUserShield, FaUserTie, FaUser, FaKey, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    active: true
  });

  useEffect(() => {
    loadUsers();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user);
    } catch (error) {
      console.error('Erro ao carregar usuário atual:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
      setUsers([]);
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        active: user.active
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de senha mínima (apenas na criação)
    if (!editingUser && formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      const dataToSend = { ...formData };

      // Remove senha do payload se estiver editando
      if (editingUser) {
        delete dataToSend.password;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, dataToSend);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        await api.post('/users', dataToSend);
        toast.success('Usuário criado com sucesso!');
      }
      handleCloseModal();
      loadUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error(error.response?.data?.error || 'Erro ao salvar usuário');
    }
  };

  const handleToggleStatus = async (user) => {
    // Não permitir desativar o próprio usuário
    if (currentUser && user.id === currentUser.id) {
      toast.error('Você não pode desativar seu próprio usuário');
      return;
    }

    try {
      await api.put(`/users/${user.id}/toggle-status`);
      toast.success(`Usuário ${user.active ? 'desativado' : 'ativado'} com sucesso!`);
      loadUsers();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error(error.response?.data?.error || 'Erro ao alterar status do usuário');
    }
  };

  const handleDelete = async (id) => {
    // Não permitir excluir o próprio usuário
    if (currentUser && id === currentUser.id) {
      toast.error('Você não pode excluir seu próprio usuário');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      toast.success('Usuário excluído com sucesso!');
      loadUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error(error.response?.data?.error || 'Erro ao excluir usuário');
    }
  };

  const handleResetPassword = async (user) => {
    if (!window.confirm(`Tem certeza que deseja resetar a senha de ${user.name}?`)) {
      return;
    }

    try {
      const response = await api.put(`/users/${user.id}/reset-password`);
      const tempPassword = response.data.tempPassword;

      if (tempPassword) {
        // Mostra a senha temporária em um alert para que o admin possa copiar
        alert(`Senha resetada com sucesso!\n\nNova senha temporária: ${tempPassword}\n\nCopie esta senha e envie para o usuário.`);
        toast.success('Senha resetada com sucesso!');
      } else {
        toast.success(response.data.message || 'Senha resetada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      toast.error(error.response?.data?.error || 'Erro ao resetar senha');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <FaUserShield style={{ marginRight: '6px' }} />;
      case 'MANAGER':
        return <FaUserTie style={{ marginRight: '6px' }} />;
      case 'USER':
        return <FaUser style={{ marginRight: '6px' }} />;
      default:
        return <FaUser style={{ marginRight: '6px' }} />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      ADMIN: { bg: '#dbeafe', color: '#1e40af', label: 'Administrador' },
      MANAGER: { bg: '#fef3c7', color: '#92400e', label: 'Gerente' },
      USER: { bg: '#e0e7ff', color: '#3730a3', label: 'Usuário' }
    };
    const badge = badges[role] || badges.USER;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 12px',
        borderRadius: '12px',
        background: badge.bg,
        color: badge.color,
        fontSize: '13px',
        fontWeight: '500'
      }}>
        {getRoleIcon(role)}
        {badge.label}
      </span>
    );
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === '' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    managers: users.filter(u => u.role === 'MANAGER').length,
    regularUsers: users.filter(u => u.role === 'USER').length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '24px', color: '#667eea' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          Usuários
        </h1>
        <button
          onClick={() => handleOpenModal()}
          style={{
            padding: '12px 24px',
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
          }}>
          <FaPlus /> Novo Usuário
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea20, #764ba240)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaUser style={{ fontSize: '28px', color: '#667eea' }} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total de Usuários</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
              {stats.total}
            </h3>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaUserShield style={{ fontSize: '28px', color: '#1e40af' }} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Administradores</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>
              {stats.admins}
            </h3>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaUserTie style={{ fontSize: '28px', color: '#92400e' }} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Gerentes</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#92400e' }}>
              {stats.managers}
            </h3>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaUser style={{ fontSize: '28px', color: '#3730a3' }} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Usuários</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#3730a3' }}>
              {stats.regularUsers}
            </h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <FaSearch style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999'
            }} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 45px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Todos os Perfis</option>
              <option value="ADMIN">Administrador</option>
              <option value="MANAGER">Gerente</option>
              <option value="USER">Usuário</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Nenhum usuário encontrado
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Nome</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Perfil</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Data de Cadastro</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333', fontWeight: '500' }}>
                    {user.name}
                    {currentUser && user.id === currentUser.id && (
                      <span style={{
                        marginLeft: '8px',
                        fontSize: '11px',
                        padding: '2px 8px',
                        background: '#f3f4f6',
                        borderRadius: '6px',
                        color: '#666'
                      }}>
                        Você
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    {getRoleBadge(user.role)}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      background: user.active ? '#dcfce7' : '#fee2e2',
                      color: user.active ? '#166534' : '#991b1b',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleOpenModal(user)}
                        title="Editar usuário"
                        style={{
                          padding: '8px',
                          background: '#eff6ff',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#2563eb',
                          cursor: 'pointer'
                        }}>
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title={user.active ? 'Desativar usuário' : 'Ativar usuário'}
                        disabled={currentUser && user.id === currentUser.id}
                        style={{
                          padding: '8px',
                          background: user.active ? '#fef3c7' : '#dcfce7',
                          border: 'none',
                          borderRadius: '6px',
                          color: user.active ? '#92400e' : '#166534',
                          cursor: currentUser && user.id === currentUser.id ? 'not-allowed' : 'pointer',
                          opacity: currentUser && user.id === currentUser.id ? 0.5 : 1
                        }}>
                        {user.active ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        title="Resetar senha"
                        style={{
                          padding: '8px',
                          background: '#f3e8ff',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#6b21a8',
                          cursor: 'pointer'
                        }}>
                        <FaKey />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        title="Excluir usuário"
                        disabled={currentUser && user.id === currentUser.id}
                        style={{
                          padding: '8px',
                          background: '#fef2f2',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#dc2626',
                          cursor: currentUser && user.id === currentUser.id ? 'not-allowed' : 'pointer',
                          opacity: currentUser && user.id === currentUser.id ? 0.5 : 1
                        }}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button onClick={handleCloseModal} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={editingUser}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    background: editingUser ? '#f9fafb' : 'white',
                    cursor: editingUser ? 'not-allowed' : 'text'
                  }}
                />
                {editingUser && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                    O email não pode ser alterado
                  </p>
                )}
              </div>

              {!editingUser && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    Senha *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                    Mínimo de 6 caracteres
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  Perfil *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="USER">Usuário</option>
                  <option value="MANAGER">Gerente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{
                      width: '18px',
                      height: '18px',
                      marginRight: '10px',
                      cursor: 'pointer'
                    }}
                  />
                  Usuário Ativo
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {editingUser ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
