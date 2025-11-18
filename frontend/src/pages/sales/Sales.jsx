import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaTimes, FaBan } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    paymentMethod: '',
    discount: '0',
    observations: '',
    items: []
  });

  useEffect(() => {
    loadSales();
    loadCustomers();
    loadProducts();
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

  const loadCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar clientes');
      setCustomers([]);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
      setProducts([]);
    }
  };

  const handleOpenModal = (sale = null, isViewMode = false) => {
    setViewMode(isViewMode);
    if (sale) {
      setEditingSale(sale);
      setFormData({
        customerId: sale.customerId.toString(),
        paymentMethod: sale.paymentMethod,
        discount: sale.discount?.toString() || '0',
        observations: sale.observations || '',
        items: sale.items?.map(item => ({
          productId: item.productId.toString(),
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
          discount: item.discount?.toString() || '0'
        })) || []
      });
    } else {
      setEditingSale(null);
      setFormData({
        customerId: '',
        paymentMethod: '',
        discount: '0',
        observations: '',
        items: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSale(null);
    setViewMode(false);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: '1', unitPrice: '0', discount: '0' }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Auto-fill unit price when product is selected
    if (field === 'productId' && value) {
      const product = products.find(p => p.id.toString() === value);
      if (product) {
        newItems[index].unitPrice = product.salePrice.toString();
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const calculateItemSubtotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const discount = parseFloat(item.discount) || 0;
    return (quantity * unitPrice) - discount;
  };

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
    const discount = parseFloat(formData.discount) || 0;
    return { itemsTotal, discount, netAmount: itemsTotal - discount };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.items.length === 0) {
      toast.error('Adicione pelo menos um produto à venda');
      return;
    }

    try {
      const payload = {
        customerId: parseInt(formData.customerId),
        paymentMethod: formData.paymentMethod,
        discount: parseFloat(formData.discount) || 0,
        observations: formData.observations,
        items: formData.items.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          discount: parseFloat(item.discount) || 0
        }))
      };

      if (editingSale) {
        await api.put(`/sales/${editingSale.id}`, payload);
        toast.success('Venda atualizada com sucesso!');
      } else {
        await api.post('/sales', payload);
        toast.success('Venda criada com sucesso!');
      }
      handleCloseModal();
      loadSales();
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      toast.error(error.response?.data?.error || 'Erro ao salvar venda');
    }
  };

  const handleCancelSale = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta venda?')) {
      return;
    }
    try {
      await api.put(`/sales/${id}/cancel`);
      toast.success('Venda cancelada com sucesso!');
      loadSales();
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      toast.error(error.response?.data?.error || 'Erro ao cancelar venda');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta venda?')) {
      return;
    }
    try {
      await api.delete(`/sales/${id}`);
      toast.success('Venda excluída com sucesso!');
      loadSales();
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      toast.error(error.response?.data?.error || 'Erro ao excluir venda');
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

  const getPaymentMethodText = (method) => {
    const methods = {
      CREDIT_CARD: 'Cartão Crédito',
      DEBIT_CARD: 'Cartão Débito',
      PIX: 'PIX',
      BANK_SLIP: 'Boleto',
      CASH: 'Dinheiro'
    };
    return methods[method] || method;
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
                      {getPaymentMethodText(sale.paymentMethod)}
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
                        <button
                          onClick={() => handleOpenModal(sale, true)}
                          title="Ver detalhes"
                          style={{
                            padding: '8px',
                            background: '#f0f9ff',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#0284c7',
                            cursor: 'pointer'
                          }}>
                          <FaEye />
                        </button>
                        {sale.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleOpenModal(sale, false)}
                              title="Editar"
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
                              onClick={() => handleCancelSale(sale.id)}
                              title="Cancelar venda"
                              style={{
                                padding: '8px',
                                background: '#fef3c7',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#92400e',
                                cursor: 'pointer'
                              }}>
                              <FaBan />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(sale.id)}
                          title="Excluir"
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
                );
              })}
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
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {viewMode ? 'Detalhes da Venda' : editingSale ? 'Editar Venda' : 'Nova Venda'}
              </h2>
              <button onClick={handleCloseModal} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
                  Informações Básicas
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                      Cliente *
                    </label>
                    <select
                      required
                      disabled={viewMode}
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: viewMode ? '#f9fafb' : 'white',
                        cursor: viewMode ? 'default' : 'pointer'
                      }}
                    >
                      <option value="">Selecione um cliente</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                      Método de Pagamento *
                    </label>
                    <select
                      required
                      disabled={viewMode}
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: viewMode ? '#f9fafb' : 'white',
                        cursor: viewMode ? 'default' : 'pointer'
                      }}
                    >
                      <option value="">Selecione um método</option>
                      <option value="PIX">PIX</option>
                      <option value="CREDIT_CARD">Cartão de Crédito</option>
                      <option value="DEBIT_CARD">Cartão de Débito</option>
                      <option value="CASH">Dinheiro</option>
                      <option value="BANK_SLIP">Boleto</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                      Desconto (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={viewMode}
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: viewMode ? '#f9fafb' : 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                      Observações
                    </label>
                    <input
                      type="text"
                      disabled={viewMode}
                      value={formData.observations}
                      onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: viewMode ? '#f9fafb' : 'white'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', margin: 0 }}>
                    Produtos *
                  </h3>
                  {!viewMode && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <FaPlus size={12} /> Adicionar Produto
                    </button>
                  )}
                </div>

                {formData.items.length === 0 ? (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#666',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '2px dashed #e5e5e5'
                  }}>
                    {viewMode ? 'Nenhum produto nesta venda' : 'Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.'}
                  </div>
                ) : (
                  <div style={{
                    border: '2px solid #e5e5e5',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                            Produto
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666', width: '100px' }}>
                            Qtd
                          </th>
                          <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666', width: '120px' }}>
                            Preço Unit.
                          </th>
                          <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666', width: '100px' }}>
                            Desconto
                          </th>
                          <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666', width: '120px' }}>
                            Subtotal
                          </th>
                          {!viewMode && (
                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666', width: '60px' }}>
                              Ação
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #e5e5e5' }}>
                            <td style={{ padding: '12px' }}>
                              <select
                                required
                                disabled={viewMode}
                                value={item.productId}
                                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  border: '1px solid #e5e5e5',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  outline: 'none',
                                  background: viewMode ? '#f9fafb' : 'white',
                                  cursor: viewMode ? 'default' : 'pointer'
                                }}
                              >
                                <option value="">Selecione um produto</option>
                                {products.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="number"
                                required
                                min="1"
                                disabled={viewMode}
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  border: '1px solid #e5e5e5',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  outline: 'none',
                                  textAlign: 'center',
                                  background: viewMode ? '#f9fafb' : 'white'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="number"
                                required
                                step="0.01"
                                min="0"
                                disabled={viewMode}
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  border: '1px solid #e5e5e5',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  outline: 'none',
                                  textAlign: 'right',
                                  background: viewMode ? '#f9fafb' : 'white'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                disabled={viewMode}
                                value={item.discount}
                                onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  border: '1px solid #e5e5e5',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  outline: 'none',
                                  textAlign: 'right',
                                  background: viewMode ? '#f9fafb' : 'white'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#333', fontSize: '13px' }}>
                              R$ {calculateItemSubtotal(item).toFixed(2)}
                            </td>
                            {!viewMode && (
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  style={{
                                    padding: '6px',
                                    background: '#fef2f2',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
                  Resumo
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#666' }}>Subtotal dos Produtos:</span>
                    <span style={{ fontWeight: '600', color: '#333' }}>
                      R$ {calculateTotal().itemsTotal.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#666' }}>Desconto:</span>
                    <span style={{ fontWeight: '600', color: '#dc2626' }}>
                      - R$ {calculateTotal().discount.toFixed(2)}
                    </span>
                  </div>
                  <div style={{
                    borderTop: '2px solid #e5e5e5',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px'
                  }}>
                    <span style={{ fontWeight: '600', color: '#333' }}>Total:</span>
                    <span style={{ fontWeight: 'bold', color: '#667eea', fontSize: '20px' }}>
                      R$ {calculateTotal().netAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  {viewMode ? 'Fechar' : 'Cancelar'}
                </button>
                {!viewMode && (
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
                    {editingSale ? 'Salvar Alterações' : 'Criar Venda'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}