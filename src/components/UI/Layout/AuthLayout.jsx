// 💻 Felipe Gonzaga - Frontend Developer
// 🎨 Najla Cardeal - QA/Designer
// Layout de autenticação

import React from 'react';
import { Outlet } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">TudoGestão+</span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">
            Gerencie seu negócio com inteligência
          </h1>
          <p className="text-xl text-blue-100">
            Sistema completo de gestão empresarial. Controle vendas, estoque, 
            financeiro e muito mais em um só lugar.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-white mb-1">5000+</div>
              <div className="text-blue-100">Empresas usando</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-blue-100">Satisfação</div>
            </div>
          </div>
        </div>

        <div className="text-blue-100 text-sm">
          © 2025 TudoGestão+. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;