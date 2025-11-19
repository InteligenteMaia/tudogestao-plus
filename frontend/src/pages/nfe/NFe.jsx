import React, { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaPlus, FaDownload, FaEye, FaTimes, FaPrint } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function NFe() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const response = await api.get('/sales');
      // Only show PAID sales that don't have NFe
      const paidSales = (response.data.sales || []).filter(s => s.status === 'PAID');
      setSales(paidSales);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      toast.error('Erro ao carregar vendas');
      setSales([]);
      setLoading(false);
    }
  };

  const handleEmitNFe = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const handleConfirmEmission = () => {
    toast.success('NFe emitida com sucesso! (Modo demonstração)');
    setShowModal(false);
    setSelectedSale(null);
    // In a real system, this would call an API to generate the NFe
  };

  const handleDownloadDANFE = (sale) => {
    generateInvoiceHTML(sale);
    toast.success('DANFE gerado com sucesso!');
  };

  const generateInvoiceHTML = (sale) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Nota Fiscal - ${sale.saleNumber}</title>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Courier New', monospace;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 20px;
            border: 1px solid #000;
            padding: 15px;
          }
          .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #f0f0f0;
            font-weight: bold;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-top: 20px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NOTA FISCAL SIMPLIFICADA</h1>
          <p>Nº ${sale.saleNumber}</p>
          <p>Data: ${new Date(sale.date).toLocaleDateString('pt-BR')}</p>
        </div>

        <div class="section">
          <div class="section-title">Dados do Cliente</div>
          <div class="row">
            <span>Nome:</span>
            <span>${sale.customer?.name || 'N/A'}</span>
          </div>
          <div class="row">
            <span>CPF/CNPJ:</span>
            <span>${sale.customer?.cpfCnpj || 'N/A'}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Produtos/Serviços</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantidade</th>
                <th>Valor Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${(sale.items || []).map((item, idx) => `
                <tr>
                  <td>${item.product?.name || `Item ${idx + 1}`}</td>
                  <td>${item.quantity}</td>
                  <td>R$ ${parseFloat(item.unitPrice).toFixed(2)}</td>
                  <td>R$ ${parseFloat(item.total).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Valores</div>
          <div class="row">
            <span>Subtotal:</span>
            <span>R$ ${parseFloat(sale.totalAmount).toFixed(2)}</span>
          </div>
          ${sale.discount > 0 ? `
          <div class="row">
            <span>Desconto:</span>
            <span>R$ ${parseFloat(sale.discount).toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total">
            <div class="row">
              <span>TOTAL:</span>
              <span>R$ ${parseFloat(sale.netAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Informações Adicionais</div>
          <p>${sale.observations || 'Nenhuma observação'}</p>
          <p style="margin-top: 20px; font-size: 12px; text-align: center;">
            Este documento não tem validade fiscal.<br>
            Documento gerado em ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const emittedCount = sales.filter(s => s.nfeNumber).length;
  const pendingCount = sales.filter(s => !s.nfeNumber).length;
  const totalValue = sales.reduce((sum, s) => sum + parseFloat(s.netAmount || 0), 0);

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
          <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total de Vendas Pagas</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            {sales.length}
          </h3>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>Disponíveis para NFe</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
            {pendingCount}
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
            R$ {totalValue.toFixed(2)}
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
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Carregando...
          </div>
        ) : sales.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Nenhuma venda paga disponível para emissão de NFe
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Número Venda</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Cliente</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#666' }}>Data</th>
                <th style={{ padding: '15px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#666' }}>Valor</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333', fontWeight: '600' }}>
                    {sale.saleNumber}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333' }}>
                    {sale.customer?.name || 'N/A'}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                    {new Date(sale.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333', textAlign: 'right', fontWeight: '600' }}>
                    R$ {parseFloat(sale.netAmount).toFixed(2)}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEmitNFe(sale)}
                        style={{
                          padding: '8px 16px',
                          background: '#667eea',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaPlus /> Emitir NFe
                      </button>
                      <button
                        onClick={() => handleDownloadDANFE(sale)}
                        style={{
                          padding: '8px',
                          background: '#dcfce7',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#166534',
                          cursor: 'pointer'
                        }}
                      >
                        <FaPrint />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Emission Modal */}
      {showModal && selectedSale && (
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
                Emitir NFe
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                Detalhes da Venda
              </h3>
              <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Número da Venda:</span>
                  <span style={{ fontWeight: '600' }}>{selectedSale.saleNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Cliente:</span>
                  <span style={{ fontWeight: '600' }}>{selectedSale.customer?.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Valor Total:</span>
                  <span style={{ fontWeight: '600' }}>R$ {parseFloat(selectedSale.netAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{
              background: '#fff7ed',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
                <strong>Aviso:</strong> Esta é uma versão demonstrativa. Para emitir NFe real, é necessário integração com a SEFAZ e certificado digital válido.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
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
                onClick={handleConfirmEmission}
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
                }}
              >
                <FaFileInvoiceDollar /> Confirmar Emissão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}