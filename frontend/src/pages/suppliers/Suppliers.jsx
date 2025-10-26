import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
        <button style={{
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
                      <button style={{
                        padding: '8px',
                        background: '#eff6ff',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#2563eb',
                        cursor: 'pointer'
                      }}>
                        <FaEdit />
                      </button>
                      <button style={{
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
    </div>
  );
}