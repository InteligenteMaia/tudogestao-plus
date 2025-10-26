import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaShoppingCart, FaUsers, FaBox, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    salesTotal: 0,
    salesCount: 0,
    customersCount: 0,
    productsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Dados mockados - substitua por chamadas reais da API
      setStats({
        salesTotal: 12450.00,
        salesCount: 3,
        customersCount: 3,
        productsCount: 5
      });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const salesData = [
    { month: 'Jan', value: 4000 },
    { month: 'Fev', value: 3000 },
    { month: 'Mar', value: 5000 },
    { month: 'Abr', value: 4500 },
    { month: 'Mai', value: 6000 },
    { month: 'Jun', value: 5500 },
  ];

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '8px' }}>{title}</p>
        <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>{value}</h3>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
            {trend > 0 ? <FaArrowUp color="#10b981" /> : <FaArrowDown color="#ef4444" />}
            <span style={{ fontSize: '14px', color: trend > 0 ? '#10b981' : '#ef4444' }}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon style={{ fontSize: '28px', color }} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '24px', color: '#667eea' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard
          icon={FaMoneyBillWave}
          title="Vendas Hoje"
          value={`R$ ${stats.salesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend={12.5}
          color="#667eea"
        />
        <StatCard
          icon={FaShoppingCart}
          title="Pedidos"
          value={stats.salesCount}
          trend={8.2}
          color="#10b981"
        />
        <StatCard
          icon={FaUsers}
          title="Clientes"
          value={stats.customersCount}
          trend={-3.1}
          color="#f59e0b"
        />
        <StatCard
          icon={FaBox}
          title="Produtos"
          value={stats.productsCount}
          color="#8b5cf6"
        />
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* Sales Chart */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Vendas Mensais</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Produtos Mais Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}