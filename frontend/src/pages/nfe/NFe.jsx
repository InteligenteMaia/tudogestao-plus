import React from 'react';
import { FaFileInvoiceDollar, FaPlus, FaDownload, FaEye } from 'react-icons/fa';

export default function NFe() {
  const invoices = [
    { id: 1, number: '000001', customer: 'João Silva', date: '2024-10-20', value: 1500.00, status: 'Emitida' },
    { id: 2, number: '000002', customer: 'Maria Santos', date: '2024-10-21', value: 2300.00, status: 'Emitida' },
    { id: 3, number: '000003', customer: 'Tech Corp', date: '2024-10-22', value: 4500.00, status: 'Pendente' }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: 0 }}>
            Notas Fiscais Eletrônicas
          </h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Gerencie suas NFe de forma simples e rápida</p>
        </div>
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
          <FaPlus /> Emitir NFe
        </button>
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>NFe Emitidas</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            {invoices.filter(i => i.status === 'Emitida').length}
          </h3>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>NFe Pendentes</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
            {invoices.filter(i => i.status === 'Pendente').length}
          </h3>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Faturado</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
            R$ {invoices.reduce((sum, i) => sum + i.value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Instructions Card */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea20, #764ba240)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
        border: '2px solid #667eea'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <FaFileInvoiceDollar style={{ fontSize: '32px', color: '#667eea' }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>
            Como Configurar a Emissão de NFe
          </h3>
        </div>
        <p style={{ margin: '0 0 10px 0', color: '#666', lineHeight: '1.6' }}>
          Para começar a emitir notas fiscais eletrônicas, você precisa:
        </p>
        <ol style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.8' }}>
          <li>Configurar o certificado digital da empresa</li>
          <li>Cadastrar as informações fiscais (Inscrição Estadual, CNAE, etc)</li>
          <li>Configurar a série da NFe</li>
          <li>Integrar com a SEFAZ do seu estado</li>
        </ol>
      </div>

      {/* Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Número</th>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Cliente</th>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Data</th>
              <th style={{ padding: '15px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#666' }}>Valor</th>
              <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '15px', fontSize: '14px', color: '#333', fontWeight: '600' }}>
                  {invoice.number}
                </td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#333' }}>
                  {invoice.customer}
                </td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                  {new Date(invoice.date).toLocaleDateString('pt-BR')}
                </td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#333', textAlign: 'right', fontWeight: '600' }}>
                  R$ {invoice.value.toFixed(2)}
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    background: invoice.status === 'Emitida' ? '#dcfce7' : '#fef3c7',
                    color: invoice.status === 'Emitida' ? '#166534' : '#92400e',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {invoice.status}
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
                      background: '#dcfce7',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#166534',
                      cursor: 'pointer'
                    }}>
                      <FaDownload />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}