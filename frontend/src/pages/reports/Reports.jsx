import React, { useState } from 'react';
import { FaFileDownload, FaChartLine, FaBoxOpen, FaUsers, FaMoneyBillWave, FaCalendar } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (reportType) => {
    try {
      setLoading(true);
      let response;

      switch (reportType) {
        case 'sales':
          response = await api.get('/reports/sales', {
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate
            }
          });
          break;
        case 'stock':
          response = await api.get('/reports/stock');
          break;
        case 'customers':
          response = await api.get('/reports/customers', {
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate
            }
          });
          break;
        case 'dre':
          response = await api.get('/reports/dre', {
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate
            }
          });
          break;
        default:
          toast.error('Relatório não disponível');
          return;
      }

      // Exibir resultado em nova janela ou fazer download
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(`
        <html>
          <head>
            <title>Relatório - ${reportType}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h1>Relatório - ${reportType}</h1>
            <p>Período: ${new Date(dateRange.startDate).toLocaleDateString('pt-BR')} a ${new Date(dateRange.endDate).toLocaleDateString('pt-BR')}</p>
            <pre>${JSON.stringify(response.data, null, 2)}</pre>
          </body>
        </html>
      `);
      reportWindow.document.close();

      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    {
      id: 'dre',
      icon: FaMoneyBillWave,
      title: 'DRE - Demonstração do Resultado',
      description: 'Receitas, despesas e resultado do período',
      color: '#667eea'
    },
    {
      id: 'sales',
      icon: FaChartLine,
      title: 'Relatório de Vendas',
      description: 'Análise completa das vendas por período',
      color: '#10b981'
    },
    {
      id: 'stock',
      icon: FaBoxOpen,
      title: 'Relatório de Estoque',
      description: 'Situação atual do estoque e produtos em falta',
      color: '#f59e0b'
    },
    {
      id: 'customers',
      icon: FaUsers,
      title: 'Relatório de Clientes',
      description: 'Análise de clientes e histórico de compras',
      color: '#8b5cf6'
    }
  ];

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
        Relatórios
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Gere relatórios detalhados do seu negócio
      </p>

      {/* Date Range Filter */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <FaCalendar style={{ color: '#667eea', fontSize: '20px' }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>
            Período do Relatório
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
              Data Inicial
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
              Data Final
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
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
      </div>

      {/* Report Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = report.color;
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${report.color}20, ${report.color}40)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Icon style={{ fontSize: '28px', color: report.color }} />
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '10px'
              }}>
                {report.title}
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                {report.description}
              </p>

              <button
                onClick={() => handleGenerateReport(report.id)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading ? '#ccc' : report.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                <FaFileDownload /> {loading ? 'Gerando...' : 'Gerar Relatório'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div style={{
        background: '#f0f9ff',
        borderLeft: '4px solid #0ea5e9',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', color: '#0369a1' }}>
          💡 Dica
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#075985', lineHeight: '1.6' }}>
          Selecione o período desejado acima e clique em "Gerar Relatório" para visualizar os dados.
          Os relatórios serão abertos em uma nova janela com as informações detalhadas.
        </p>
      </div>
    </div>
  );
}
