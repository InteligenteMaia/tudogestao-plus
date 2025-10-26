// 💻 Felipe Gonzaga - Frontend Developer
// 🎨 Najla Cardeal - QA/Designer
// Sidebar da aplicação

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  FileText,
  Settings,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, canAccessFinancial, isManager } = useAuth();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      show: true,
    },
    {
      label: 'Clientes',
      icon: Users,
      path: '/customers',
      show: true,
    },
    {
      label: 'Fornecedores',
      icon: Briefcase,
      path: '/suppliers',
      show: true,
    },
    {
      label: 'Produtos',
      icon: Package,
      path: '/products',
      show: true,
    },
    {
      label: 'Vendas',
      icon: ShoppingCart,
      path: '/sales',
      show: true,
    },
    {
      label: 'Financeiro',
      icon: DollarSign,
      path: '/financial',
      show: canAccessFinancial(),
    },
    {
      label: 'Relatórios',
      icon: FileText,
      path: '/reports',
      show: isManager(),
    },
    {
      label: 'Configurações',
      icon: Settings,
      path: '/settings',
      show: true,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 sidebar-apple
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-h3 font-bold text-gray-900 dark:text-gray-100">
              TudoGestão+
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.filter(item => item.show).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            TudoGestão+ v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;