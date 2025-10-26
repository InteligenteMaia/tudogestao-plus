import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data.sales || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      toast.error('Erro ao carregar vendas');
      setSales([]);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PAID: { bg: '#dcfce7', text: '#166534' },
      PENDING: { bg: '#fef3c7', text: '#92400e' },
      CANCELLED: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusText = (status) => {
    const texts = {
      PAID: 'Pago',
      PENDING: 'Pendente',
      CANCELLED: 'Cancelado'
    };
    return texts[status] || status;
  };

  const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.netAmount || 0), 0);
  const paidSales = sales.filter(s => s.status === 'PAID').length;
  const pendingSales = sales.filter(s => s.status === 'PENDING').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          Vendas
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
          <FaPlus /> Nova Venda
        </button>
      </div>

      {/* Stats Cards */}
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total de Vendas</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
            R$ {totalSales.toFixed(2)}
          </h3>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Vendas Pagas</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            {paidSales}
          </h3>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Vendas Pendentes</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
            {pendingSales}
          </h3>
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
        ) : sales.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Nenhuma venda encontrada
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Número</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Cliente</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Data</th>
                <th style={{ padding: '15px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#666' }}>Total</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Pagamento</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => {
                const statusColor = getStatusColor(sale.status);
                return (
                  <tr key={sale.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#333', fontWeight: '600' }}>
                      {sale.saleNumber}
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#333' }}>
                      {sale.customer?.name || 'Cliente não informado'}
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                      {new Date(sale.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#333', textAlign: 'right', fontWeight: '600' }}>
                      R$ {parseFloat(sale.netAmount).toFixed(2)}
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
                      {sale.paymentMethod === 'CREDIT_CARD' ? 'Cartão Crédito' :
                       sale.paymentMethod === 'DEBIT_CARD' ? 'Cartão Débito' :
                       sale.paymentMethod === 'PIX' ? 'PIX' :
                       sale.paymentMethod === 'BANK_SLIP' ? 'Boleto' :
                       sale.paymentMethod === 'CASH' ? 'Dinheiro' : sale.paymentMethod}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        background: statusColor.bg,
                        color: statusColor.text,
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {getStatusText(sale.status)}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button style={{
                          padding: '8px',
                          background: '#f0f9ff',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#0284c7',
                          cursor: 'pointer'
                        }}>
                          <FaEye />
                        </button>
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}