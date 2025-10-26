import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header style={{
      height: '70px',
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#667eea',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <FaBars />
        </button>
        
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>
            Bem-vindo de volta!
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notifications */}
        <button style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          color: '#666',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px'
        }}>
          <FaBell />
          <span style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '8px',
            height: '8px',
            background: '#ef4444',
            borderRadius: '50%'
          }} />
        </button>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <FaUserCircle style={{ fontSize: '32px', color: '#667eea' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>
                {user?.name || 'Usuário'}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {user?.role === 'ADMIN' ? 'Administrador' : 
                 user?.role === 'MANAGER' ? 'Gerente' : 'Vendedor'}
              </div>
            </div>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '10px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              minWidth: '200px',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <button
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#333',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FaCog /> Configurações
              </button>
              
              <div style={{ height: '1px', background: '#e5e5e5', margin: '5px 0' }} />
              
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#ef4444',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FaSignOutAlt /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}