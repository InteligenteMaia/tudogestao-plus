import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaBuilding } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.cpfCnpj?.includes(search)
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          Clientes
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
          <FaPlus /> Novo Cliente
        </button>
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
            placeholder="Buscar clientes por nome ou CPF/CNPJ..."
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

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <FaUser style={{ fontSize: '32px', color: '#667eea' }} />
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Pessoa Física</p>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {customers.filter(c => c.type === 'INDIVIDUAL').length}
            </h3>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <FaBuilding style={{ fontSize: '32px', color: '#10b981' }} />
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Pessoa Jurídica</p>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {customers.filter(c => c.type === 'COMPANY').length}
            </h3>
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
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Carregando...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Nenhum cliente encontrado
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Tipo</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Nome</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>CPF/CNPJ</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Telefone</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    {customer.type === 'INDIVIDUAL' ? 
                      <FaUser style={{ color: '#667eea' }} /> : 
                      <FaBuilding style={{ color: '#10b981' }} />
                    }
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333', fontWeight: '500' }}>
                    {customer.name}
                    {customer.tradeName && (
                      <div style={{ fontSize: '12px', color: '#666' }}>{customer.tradeName}</div>
                    )}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {customer.cpfCnpj}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {customer.email || '-'}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {customer.phone || '-'}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      background: customer.active ? '#dcfce7' : '#fee2e2',
                      color: customer.active ? '#166534' : '#991b1b',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {customer.active ? 'Ativo' : 'Inativo'}
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