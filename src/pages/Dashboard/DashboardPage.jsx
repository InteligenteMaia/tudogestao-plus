// 💻 Felipe Gonzaga - Frontend Developer
// 💼 Larissa Oliveira - Product Manager
// 🎨 Najla Cardeal - QA/Designer
// Página do dashboard principal

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { fetchDashboardData, fetchSalesChart, fetchFinancialChart } from '../../store/slices/dashboardSlice';
import Card from '../../components/UI/Common/Card';
import Loading from '../../components/UI/Common/Loading';
import Badge from '../../components/UI/Common/Badge';
import { formatCurrency, formatPercent } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { data, salesChart, financialChart, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchSalesChart());
    dispatch(fetchFinancialChart());
  }, [dispatch]);

  if (loading || !data) {
    return <Loading fullscreen text="Carregando dashboard..." />;
  }

  const StatCard = ({ title, value, trend, icon: Icon, color = 'blue' }) => {
    const isPositive = trend > 0;
    
    return (
      <Card hoverable>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-caption text-gray-500 dark:text-gray-400 mb-2">
              {title}
            </p>
            <h3 className="text-h2 text-gray-900 dark:text-gray-100 mb-2">
              {value}
            </h3>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{formatPercent(Math.abs(trend))}</span>
                <span className="text-gray-500">vs. mês anterior</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 text-gray-900 dark:text-gray-100 mb-2">
          Dashboard
        </h1>
        <p className="text-body text-gray-600 dark:text-gray-400">
          Visão geral do seu negócio
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Vendas do Mês"
          value={formatCurrency(data.sales.thisMonth)}
          trend={data.sales.trend}
          icon={ShoppingCart}
          color="blue"
        />
        
        <StatCard
          title="Receitas"
          value={formatCurrency(data.financial.income)}
          trend={data.financial.incomeTrend}
          icon={TrendingUp}
          color="green"
        />
        
        <StatCard
          title="Despesas"
          value={formatCurrency(data.financial.expense)}
          trend={data.financial.expenseTrend}
          icon={TrendingDown}
          color="red"
        />
        
        <StatCard
          title="Saldo"
          value={formatCurrency(data.totalBalance)}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card title="Vendas dos Últimos 12 Meses">
          <div className="h-80">
            {salesChart && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesChart.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#0071E3"
                    strokeWidth={2}
                    dot={{ fill: '#0071E3', r: 4 }}
                    name="Vendas"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Financial Chart */}
        <Card title="Receitas vs Despesas">
          <div className="h-80">
            {financialChart && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialChart.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#34C759" name="Receitas" />
                  <Bar dataKey="expense" fill="#FF3B30" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <Card title="Vendas Recentes" className="lg:col-span-2">
          <div className="space-y-3">
            {data.recentSales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {sale.customer.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {sale.saleNumber} • {formatDate(sale.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(sale.netAmount)}
                  </p>
                  <Badge variant={sale.status === 'PAID' ? 'success' : 'warning'} size="sm">
                    {sale.status === 'PAID' ? 'Pago' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Products */}
        <Card
          title="Estoque Baixo"
          subtitle={`${data.lowStockProducts.length} produtos`}
        >
          <div className="space-y-3">
            {data.lowStockProducts.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Estoque: {product.stock} / Mín: {product.minStock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accounts Receivable */}
        <Card title="Contas a Receber">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Pendente</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(data.receivables.pending.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {data.receivables.pending.count} contas
              </span>
            </div>
            
            {data.receivables.overdue.length > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-red-600 mb-2">
                  Vencidas ({data.receivables.overdue.length})
                </p>
                <div className="space-y-2">
                  {data.receivables.overdue.slice(0, 3).map((item) => (
                    <div key={item.id} className="text-xs text-gray-600 dark:text-gray-400">
                      {item.customer.name} - {formatCurrency(item.amount)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Accounts Payable */}
        <Card title="Contas a Pagar">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Pendente</span>
              <span className="text-lg font-semibold text-red-600">
                {formatCurrency(data.payables.pending.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {data.payables.pending.count} contas
              </span>
            </div>
            
            {data.payables.overdue.length > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-red-600 mb-2">
                  Vencidas ({data.payables.overdue.length})
                </p>
                <div className="space-y-2">
                  {data.payables.overdue.slice(0, 3).map((item) => (
                    <div key={item.id} className="text-xs text-gray-600 dark:text-gray-400">
                      {item.supplier?.name || item.description} - {formatCurrency(item.amount)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Top Customers */}
      <Card title="Top 5 Clientes do Mês">
        <div className="space-y-3">
          {data.topCustomers.map((item, index) => (
            <div key={item.customerId} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.customer.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item._count} compras
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(item._sum.netAmount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;