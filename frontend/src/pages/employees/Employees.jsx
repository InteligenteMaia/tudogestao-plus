import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    cpf: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    admissionDate: '',
    address: {}
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.employees || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar funcionários');
      setEmployees([]);
      setLoading(false);
    }
  };

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        cpf: employee.cpf,
        name: employee.name,
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position,
        department: employee.department || '',
        salary: employee.salary.toString(),
        admissionDate: employee.admissionDate.split('T')[0],
        address: employee.address || {}
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        cpf: '',
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        salary: '',
        admissionDate: new Date().toISOString().split('T')[0],
        address: {}
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, formData);
        toast.success('Funcionário atualizado com sucesso!');
      } else {
        await api.post('/employees', formData);
        toast.success('Funcionário criado com sucesso!');
      }
      handleCloseModal();
      loadEmployees();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      toast.error(error.response?.data?.error || 'Erro ao salvar funcionário');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      return;
    }
    try {
      await api.delete(`/employees/${id}`);
      toast.success('Funcionário excluído com sucesso!');
      loadEmployees();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      toast.error(error.response?.data?.error || 'Erro ao excluir funcionário');
    }
  };

  const filteredEmployees = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.cpf?.includes(search) ||
    e.position?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSalary = employees
    .filter(e => e.active)
    .reduce((sum, e) => sum + parseFloat(e.salary || 0), 0);

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
          Funcionários
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
          <FaPlus /> Novo Funcionário
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
            <FaUserTie style={{ fontSize: '28px', color: '#667eea' }} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total de Funcionários</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
              {employees.filter(e => e.active).length}
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
            background: 'linear-gradient(135deg, #10b98120, #10b98140)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '28px' }}>💰</span>
          </div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Folha de Pagamento</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
              R$ {totalSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
            background: 'linear-gradient(135deg, #f59e0b20, #f59e0b40)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '28px' }}>📊</span>
          </div>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Salário Médio</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
              R$ {employees.filter(e => e.active).length > 0 ? (totalSalary / employees.filter(e => e.active).length).toFixed(2) : '0.00'}
            </h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999'
          }} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou cargo..."
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
      </div>

      {/* Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {filteredEmployees.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Nenhum funcionário encontrado
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Nome</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>CPF</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Cargo</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Departamento</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Admissão</th>
                <th style={{ padding: '15px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#666' }}>Salário</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333', fontWeight: '500' }}>
                    {employee.name}
                    {employee.email && (
                      <div style={{ fontSize: '12px', color: '#666' }}>{employee.email}</div>
                    )}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {employee.cpf}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333' }}>
                    {employee.position}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {employee.department || '-'}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {new Date(employee.admissionDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333', textAlign: 'right', fontWeight: '600' }}>
                    R$ {parseFloat(employee.salary).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      background: employee.active ? '#dcfce7' : '#fee2e2',
                      color: employee.active ? '#166534' : '#991b1b',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {employee.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleOpenModal(employee)}
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
                        onClick={() => handleDelete(employee.id)}
                        style={{
                          padding: '8px',
                          background: '#fef2f2',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#dc2626',
                          cursor: 'pointer'
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h2>
              <button onClick={handleCloseModal} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
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

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    Cargo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    Salário *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    Data de Admissão *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
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

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
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
                  {editingEmployee ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
