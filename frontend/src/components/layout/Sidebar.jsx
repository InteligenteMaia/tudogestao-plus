import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaBox, FaUsers, FaTruck, FaMoneyBillWave, FaUserTie, FaChartBar, FaCog, FaFileInvoiceDollar } from 'react-icons/fa';

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/sales', icon: FaShoppingCart, label: 'Vendas' },
    { path: '/products', icon: FaBox, label: 'Produtos' },
    { path: '/customers', icon: FaUsers, label: 'Clientes' },
    { path: '/suppliers', icon: FaTruck, label: 'Fornecedores' },
    { path: '/financial', icon: FaMoneyBillWave, label: 'Financeiro' },
    { path: '/employees', icon: FaUserTie, label: 'Funcionários' },
    { path: '/nfe', icon: FaFileInvoiceDollar, label: 'NFe' },
    { path: '/reports', icon: FaChartBar, label: 'Relatórios' },
    { path: '/settings', icon: FaCog, label: 'Configurações' },
  ];

  if (!isOpen) return null;

  return (
    <aside style={{
      width: '260px',
      background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* Logo */}
      <div style={{
        padding: '30px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '40px',
          marginBottom: '10px'
        }}>🚀</div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: 0
        }}>TudoGestão+</h1>
        <p style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          margin: '5px 0 0 0'
        }}>Sistema ERP Completo</p>
      </div>

      {/* Menu */}
      <nav style={{
        flex: 1,
        padding: '20px 0',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 25px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                background: isActive ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                borderLeft: isActive ? '4px solid #667eea' : '4px solid transparent',
                transition: 'all 0.3s',
                marginBottom: '5px'
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
            >
              <Icon style={{ marginRight: '15px', fontSize: '20px' }} />
              <span style={{ fontSize: '15px', fontWeight: '500' }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>© 2025 TudoGestão+</p>
        <p style={{ margin: '5px 0 0 0' }}>v1.0.0</p>
      </div>
    </aside>
  );
}