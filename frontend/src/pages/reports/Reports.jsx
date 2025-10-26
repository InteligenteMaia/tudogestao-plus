import React from 'react';
import { FaFileDownload, FaChartLine, FaBoxOpen, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

export default function Reports() {
  const reports = [
    {
      id: 1,
      icon: FaChartLine,
      title: 'Relatório de Vendas',
      description: 'Análise completa das vendas por período',
      color: '#667eea'
    },
    {
      id: 2,
      icon: FaBoxOpen,
      title: 'Relatório de Estoque',
      description: 'Situação atual do estoque e movimentações',
      color: '#10b981'
    },
    {
      id: 3,
      icon: FaUsers,
      title: 'Relatório de Clientes',
      description: 'Análise de clientes e histórico de compras',
      color: '#f59e0b'
    },
    {
      id: 4,
      icon: FaMoneyBillWave,
      title: 'Relatório Financeiro',
      description: 'Fluxo de caixa, receitas e despesas',
      color: '#8b5cf6'
    },
    {
      id: 5,
      icon: FaChartLine,
      title: 'Produtos Mais Vendidos',
      description: 'Ranking dos produtos com maior saída',
      color: '#ef4444'
    },
    {
      id: 6,
      icon: FaUsers,
      title: 'Relatório de Fornecedores',
      description: 'Análise de fornecedores e compras',
      color: '#06b6d4'
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

              <button style={{
                width: '100%',
                padding: '12px',
                background: report.color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <FaFileDownload /> Gerar Relatório
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
          📊 Estatísticas Rápidas
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Vendas Hoje</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>R$ 12.450</h3>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Vendas Mês</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>R$ 45.890</h3>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Produtos Ativos</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>5</h3>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Clientes Ativos</p>
            <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>3</h3>
          </div>
        </div>
      </div>
    </div>
  );
}