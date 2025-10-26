import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaMoneyBillWave, FaClock } from 'react-icons/fa';

export default function Financial() {
  const [loading, setLoading] = useState(false);

  // Dados mockados até ter as rotas corretas
  const receivables = [
    { id: 1, description: 'Venda #001 - João Silva', amount: 1500.00, dueDate: '2024-11-01', status: 'PENDING' },
    { id: 2, description: 'Venda #002 - Maria Santos', amount: 2300.00, dueDate: '2024-11-05', status: 'PENDING' }
  ];

  const payables = [
    { id: 1, description: 'Fornecedor XYZ', amount: 800.00, dueDate: '2024-10-28', status: 'PENDING' },
    { id: 2, description: 'Aluguel', amount: 2000.00, dueDate: '2024-11-01', status: 'PENDING' }
  ];

  const totalReceivables = receivables
    .filter(r => r.status === 'PENDING')
    .reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

  const totalPayables = payables
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const balance = totalReceivables - totalPayables;

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>
        Financeiro
      </h1>

      {/* Summary Cards */}
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaArrowUp style={{ color: '#10b981', fontSize: '24px' }} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>A Receber</p>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                R$ {totalReceivables.toFixed(2)}
              </h3>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
            {receivables.filter(r => r.status === 'PENDING').length} pendente(s)
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaArrowDown style={{ color: '#ef4444', fontSize: '24px' }} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>A Pagar</p>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                R$ {totalPayables.toFixed(2)}
              </h3>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
            {payables.filter(p => p.status === 'PENDING').length} pendente(s)
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: balance >= 0 ? '#dbeafe' : '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaMoneyBillWave style={{ color: balance >= 0 ? '#2563eb' : '#f59e0b', fontSize: '24px' }} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Saldo</p>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: balance >= 0 ? '#2563eb' : '#f59e0b' }}>
                R$ {balance.toFixed(2)}
              </h3>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
            Diferença entre recebimentos e pagamentos
          </p>
        </div>
      </div>

      {/* Contas a Receber */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '25px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          Contas a Receber
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {receivables.filter(r => r.status === 'PENDING').map(item => (
            <div key={item.id} style={{
              padding: '15px',
              background: '#f9fafb',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: '500', color: '#333' }}>{item.description}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                  <FaClock style={{ marginRight: '5px' }} />
                  Vencimento: {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                  R$ {parseFloat(item.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contas a Pagar */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '25px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          Contas a Pagar
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payables.filter(p => p.status === 'PENDING').map(item => (
            <div key={item.id} style={{
              padding: '15px',
              background: '#f9fafb',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: '500', color: '#333' }}>{item.description}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                  <FaClock style={{ marginRight: '5px' }} />
                  Vencimento: {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>
                  R$ {parseFloat(item.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}