import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tradeName: '',
    cpfCnpj: '',
    email: '',
    phone: '',
    address: {}
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data.suppliers || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      toast.error('Erro ao carregar fornecedores');
      setSuppliers([]);
      setLoading(false);
    }
  };

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        tradeName: supplier.tradeName || '',
        cpfCnpj: supplier.cpfCnpj,
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || {}
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        tradeName: '',
        cpfCnpj: '',
        email: '',
        phone: '',
        address: {}
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, formData);
        toast.success('Fornecedor atualizado com sucesso!');
      } else {
        await api.post('/suppliers', formData);
        toast.success('Fornecedor criado com sucesso!');
      }
      handleCloseModal();
      loadSuppliers();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      toast.error(error.response?.data?.error || 'Erro ao salvar fornecedor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      return;
    }
    try {
      await api.delete(`/suppliers/${id}`);
      toast.success('Fornecedor excluído com sucesso!');
      loadSuppliers();
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      toast.error(error.response?.data?.error || 'Erro ao excluir fornecedor');
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.cpfCnpj?.includes(search) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          Fornecedores
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
          <FaPlus /> Novo Fornecedor
        </button>
      </div>

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
            placeholder="Buscar por nome, CNPJ ou email..."
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

      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Carregando...
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Nenhum fornecedor encontrado
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Nome</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Nome Fantasia</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>CNPJ</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Telefone</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333', fontWeight: '500' }}>
                    {supplier.name}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {supplier.tradeName || '-'}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {supplier.cpfCnpj}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {supplier.email || '-'}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {supplier.phone || '-'}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      background: supplier.active ? '#dcfce7' : '#fee2e2',
                      color: supplier.active ? '#166534' : '#991b1b',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {supplier.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleOpenModal(supplier)}
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
                        onClick={() => handleDelete(supplier.id)}
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
                {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h2>
              <button onClick={handleCloseModal} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  Nome *
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
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
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
                  CNPJ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
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

              <div style={{ marginBottom: '24px' }}>
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
                  {editingSupplier ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
