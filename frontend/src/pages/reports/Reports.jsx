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

  const formatReportHTML = (reportType, data) => {
    const styles = `
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 40px;
        background: #f5f5f5;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      h1 {
        color: #333;
        border-bottom: 3px solid #667eea;
        padding-bottom: 15px;
        margin-bottom: 10px;
      }
      .period {
        color: #666;
        margin-bottom: 30px;
        font-size: 14px;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      .stat-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 10px;
      }
      .stat-label {
        font-size: 13px;
        opacity: 0.9;
        margin-bottom: 5px;
      }
      .stat-value {
        font-size: 24px;
        font-weight: bold;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th {
        background: #667eea;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
      }
      td {
        padding: 12px;
        border-bottom: 1px solid #e5e5e5;
      }
      tr:hover {
        background: #f9fafb;
      }
      .text-right {
        text-align: right;
      }
      .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
      .badge-ok { background: #dcfce7; color: #166534; }
      .badge-low { background: #fee2e2; color: #991b1b; }
      .badge-paid { background: #dcfce7; color: #166534; }
      .badge-pending { background: #fef3c7; color: #92400e; }
      @media print {
        body { background: white; padding: 0; }
        .container { box-shadow: none; }
      }
    `;

    let content = '';

    switch (reportType) {
      case 'dre':
        content = `
          <h1>DRE - Demonstração do Resultado do Exercício</h1>
          <div class="period">Período: ${new Date(data.period.startDate).toLocaleDateString('pt-BR')} a ${new Date(data.period.endDate).toLocaleDateString('pt-BR')}</div>

          <div class="stats">
            <div class="stat-card">
              <div class="stat-label">Receita Total</div>
              <div class="stat-value">R$ ${data.totalRevenue.toFixed(2)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Despesa Total</div>
              <div class="stat-value">R$ ${data.totalExpense.toFixed(2)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Lucro Líquido</div>
              <div class="stat-value">R$ ${data.netProfit.toFixed(2)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Margem de Lucro</div>
              <div class="stat-value">${data.profitMargin.toFixed(2)}%</div>
            </div>
          </div>

          <h2>Receitas por Categoria</h2>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th class="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${data.revenues.map(r => `
                <tr>
                  <td>${r.category}</td>
                  <td class="text-right">R$ ${parseFloat(r.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Despesas por Categoria</h2>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th class="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${data.expenses.map(e => `
                <tr>
                  <td>${e.category}</td>
                  <td class="text-right">R$ ${parseFloat(e.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;

      case 'sales':
        content = `
          <h1>Relatório de Vendas</h1>
          <div class="period">Período: ${new Date(data.period.startDate).toLocaleDateString('pt-BR')} a ${new Date(data.period.endDate).toLocaleDateString('pt-BR')}</div>

          <div class="stats">
            <div class="stat-card">
              <div class="stat-label">Total de Vendas</div>
              <div class="stat-value">${data.totalSales}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Valor Total</div>
              <div class="stat-value">R$ ${data.totalAmount.toFixed(2)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Ticket Médio</div>
              <div class="stat-value">R$ ${data.averageTicket.toFixed(2)}</div>
            </div>
          </div>

          <h2>Detalhamento de Vendas</h2>
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Data</th>
                <th>Cliente</th>
                <th class="text-right">Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.sales.map(s => `
                <tr>
                  <td>${s.saleNumber}</td>
                  <td>${new Date(s.date).toLocaleDateString('pt-BR')}</td>
                  <td>${s.customer}</td>
                  <td class="text-right">R$ ${parseFloat(s.amount).toFixed(2)}</td>
                  <td><span class="badge badge-${s.status === 'PAID' ? 'paid' : 'pending'}">${s.status === 'PAID' ? 'Pago' : 'Pendente'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;

      case 'stock':
        content = `
          <h1>Relatório de Estoque</h1>
          <div class="period">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</div>

          <div class="stats">
            <div class="stat-card">
              <div class="stat-label">Total de Produtos</div>
              <div class="stat-value">${data.totalProducts}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Valor do Estoque</div>
              <div class="stat-value">R$ ${data.totalStockValue.toFixed(2)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Produtos em Falta</div>
              <div class="stat-value">${data.lowStockCount}</div>
            </div>
          </div>

          <h2>Lista de Produtos</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th class="text-right">Estoque</th>
                <th class="text-right">Mínimo</th>
                <th class="text-right">Valor Unit.</th>
                <th class="text-right">Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.products.map(p => `
                <tr>
                  <td>${p.code}</td>
                  <td>${p.name}</td>
                  <td>${p.category || '-'}</td>
                  <td class="text-right">${p.stock}</td>
                  <td class="text-right">${p.minStock || 0}</td>
                  <td class="text-right">R$ ${parseFloat(p.costPrice || 0).toFixed(2)}</td>
                  <td class="text-right">R$ ${p.stockValue.toFixed(2)}</td>
                  <td><span class="badge badge-${p.status === 'OK' ? 'ok' : 'low'}">${p.status === 'OK' ? 'OK' : 'Baixo'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;

      case 'customers':
        content = `
          <h1>Relatório de Clientes</h1>
          <div class="period">Período: ${new Date(dateRange.startDate).toLocaleDateString('pt-BR')} a ${new Date(dateRange.endDate).toLocaleDateString('pt-BR')}</div>

          <div class="stats">
            <div class="stat-card">
              <div class="stat-label">Total de Clientes</div>
              <div class="stat-value">${data.customers?.length || 0}</div>
            </div>
          </div>

          <h2>Lista de Clientes</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(data.customers || []).map(c => `
                <tr>
                  <td>${c.name || '-'}</td>
                  <td>${c.cpfCnpj || '-'}</td>
                  <td>${c.email || '-'}</td>
                  <td>${c.phone || '-'}</td>
                  <td><span class="badge badge-ok">${c.active ? 'Ativo' : 'Inativo'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório - ${reportType}</title>
          <meta charset="UTF-8">
          <style>${styles}</style>
        </head>
        <body>
          <div class="container">
            ${content}
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #666; font-size: 12px;">
              Gerado em ${new Date().toLocaleString('pt-BR')} | TudoGestão+
            </div>
          </div>
          <script>
            window.onload = function() {
              // Auto print on load (optional)
              // window.print();
            }
          </script>
        </body>
      </html>
    `;
  };

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

      // Exibir resultado formatado em nova janela
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(formatReportHTML(reportType, response.data));
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
