// 💼 Larissa Oliveira - Product Manager
// ⚙️ Rubens Neto - Backend Developer
// Controller do dashboard principal

const { PrismaClient } = require('@prisma/client');
const { startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } = require('date-fns');

const prisma = new PrismaClient();

class DashboardController {
  /**
   * Dados do dashboard principal
   */
  async getMainDashboard(req, res) {
    try {
      const now = new Date();
      const startMonth = startOfMonth(now);
      const endMonth = endOfMonth(now);
      const lastMonth = subMonths(now, 1);
      const startLastMonth = startOfMonth(lastMonth);
      const endLastMonth = endOfMonth(lastMonth);

      const companyId = req.companyId;

      // Executa todas as queries em paralelo
      const [
        // Vendas do mês atual
        salesThisMonth,
        salesLastMonth,
        
        // Financeiro do mês
        incomeThisMonth,
        expenseThisMonth,
        incomeLastMonth,
        expenseLastMonth,
        
        // Contas pendentes
        pendingReceivables,
        pendingPayables,
        
        // Contas vencidas
        overdueReceivables,
        overduePayables,
        
        // Estoque baixo
        lowStockProducts,
        
        // Vendas recentes
        recentSales,
        
        // Top clientes
        topCustomers
      ] = await Promise.all([
        // Vendas mês atual
        prisma.sale.aggregate({
          where: {
            companyId,
            status: { not: 'CANCELLED' },
            date: { gte: startMonth, lte: endMonth }
          },
          _sum: { netAmount: true },
          _count: true
        }),

        // Vendas mês passado
        prisma.sale.aggregate({
          where: {
            companyId,
            status: { not: 'CANCELLED' },
            date: { gte: startLastMonth, lte: endLastMonth }
          },
          _sum: { netAmount: true },
          _count: true
        }),

        // Receitas mês atual
        prisma.financialTransaction.aggregate({
          where: {
            type: 'INCOME',
            date: { gte: startMonth, lte: endMonth }
          },
          _sum: { amount: true }
        }),

        // Despesas mês atual
        prisma.financialTransaction.aggregate({
          where: {
            type: 'EXPENSE',
            date: { gte: startMonth, lte: endMonth }
          },
          _sum: { amount: true }
        }),

        // Receitas mês passado
        prisma.financialTransaction.aggregate({
          where: {
            type: 'INCOME',
            date: { gte: startLastMonth, lte: endLastMonth }
          },
          _sum: { amount: true }
        }),

        // Despesas mês passado
        prisma.financialTransaction.aggregate({
          where: {
            type: 'EXPENSE',
            date: { gte: startLastMonth, lte: endLastMonth }
          },
          _sum: { amount: true }
        }),

        // Contas a receber pendentes
        prisma.accountReceivable.aggregate({
          where: {
            status: 'PENDING'
          },
          _sum: { amount: true },
          _count: true
        }),

        // Contas a pagar pendentes
        prisma.accountPayable.aggregate({
          where: {
            status: 'PENDING'
          },
          _sum: { amount: true },
          _count: true
        }),

        // Contas a receber vencidas
        prisma.accountReceivable.findMany({
          where: {
            status: 'PENDING',
            dueDate: { lt: startOfDay(now) }
          },
          take: 5,
          orderBy: { dueDate: 'asc' }
        }),

        // Contas a pagar vencidas
        prisma.accountPayable.findMany({
          where: {
            status: 'PENDING',
            dueDate: { lt: startOfDay(now) }
          },
          take: 5,
          orderBy: { dueDate: 'asc' }
        }),

        // Produtos com estoque baixo
        prisma.product.findMany({
          where: {
            companyId,
            active: true,
            stock: {
              lte: prisma.product.fields.minStock
            }
          },
          take: 10,
          orderBy: { stock: 'asc' },
          select: {
            id: true,
            name: true,
            code: true,
            stock: true,
            minStock: true
          }
        }),

        // Últimas 5 vendas
        prisma.sale.findMany({
          where: { companyId },
          take: 5,
          orderBy: { date: 'desc' },
          include: {
            customer: {
              select: { name: true }
            }
          }
        }),

        // Top 5 clientes do mês
        prisma.sale.groupBy({
          by: ['customerId'],
          where: {
            companyId,
            status: { not: 'CANCELLED' },
            date: { gte: startMonth, lte: endMonth }
          },
          _sum: { netAmount: true },
          _count: true,
          orderBy: {
            _sum: {
              netAmount: 'desc'
            }
          },
          take: 5
        })
      ]);

      // Busca nomes dos clientes top
      const customerIds = topCustomers.map(c => c.customerId);
      const customers = await prisma.customer.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true, cpfCnpj: true }
      });

      const topCustomersWithNames = topCustomers.map(tc => ({
        ...tc,
        customer: customers.find(c => c.id === tc.customerId)
      }));

      // Calcula tendências (comparação com mês anterior)
      const salesTrend = calculateTrend(
        salesThisMonth._sum.netAmount,
        salesLastMonth._sum.netAmount
      );

      const incomeTrend = calculateTrend(
        incomeThisMonth._sum.amount,
        incomeLastMonth._sum.amount
      );

      const expenseTrend = calculateTrend(
        expenseThisMonth._sum.amount,
        expenseLastMonth._sum.amount
      );

      res.json({
        sales: {
          thisMonth: salesThisMonth._sum.netAmount || 0,
          count: salesThisMonth._count,
          trend: salesTrend
        },
        financial: {
          income: incomeThisMonth._sum.amount || 0,
          expense: expenseThisMonth._sum.amount || 0,
          balance: (incomeThisMonth._sum.amount || 0) - (expenseThisMonth._sum.amount || 0),
          incomeTrend,
          expenseTrend
        },
        receivables: {
          pending: {
            amount: pendingReceivables._sum.amount || 0,
            count: pendingReceivables._count
          },
          overdue: overdueReceivables
        },
        payables: {
          pending: {
            amount: pendingPayables._sum.amount || 0,
            count: pendingPayables._count
          },
          overdue: overduePayables
        },
        lowStockProducts,
        recentSales,
        topCustomers: topCustomersWithNames
      });
    } catch (error) {
      console.error('Erro no dashboard:', error);
      res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
  }

  /**
   * Gráfico de vendas (últimos 12 meses)
   */
  async getSalesChart(req, res) {
    try {
      const now = new Date();
      const twelveMonthsAgo = subMonths(now, 12);

      const sales = await prisma.sale.findMany({
        where: {
          companyId: req.companyId,
          status: { not: 'CANCELLED' },
          date: { gte: twelveMonthsAgo }
        },
        select: {
          date: true,
          netAmount: true
        }
      });

      // Agrupa por mês
      const salesByMonth = sales.reduce((acc, sale) => {
        const monthKey = `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthKey,
            total: 0,
            count: 0
          };
        }

        acc[monthKey].total += parseFloat(sale.netAmount);
        acc[monthKey].count += 1;

        return acc;
      }, {});

      const chartData = Object.values(salesByMonth).sort((a, b) => 
        a.month.localeCompare(b.month)
      );

      res.json({ chartData });
    } catch (error) {
      console.error('Erro no gráfico de vendas:', error);
      res.status(500).json({ error: 'Erro ao carregar gráfico' });
    }
  }

  /**
   * Gráfico financeiro (receitas vs despesas)
   */
  async getFinancialChart(req, res) {
    try {
      const now = new Date();
      const startMonth = startOfMonth(subMonths(now, 11));

      const transactions = await prisma.financialTransaction.findMany({
        where: {
          date: { gte: startMonth }
        },
        select: {
          date: true,
          type: true,
          amount: true
        }
      });

      // Agrupa por mês
      const financialByMonth = transactions.reduce((acc, trans) => {
        const monthKey = `${trans.date.getFullYear()}-${String(trans.date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthKey,
            income: 0,
            expense: 0,
            balance: 0
          };
        }

        if (trans.type === 'INCOME') {
          acc[monthKey].income += parseFloat(trans.amount);
        } else if (trans.type === 'EXPENSE') {
          acc[monthKey].expense += parseFloat(trans.amount);
        }

        return acc;
      }, {});

      // Calcula saldo
      const chartData = Object.values(financialByMonth)
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(item => ({
          ...item,
          balance: item.income - item.expense
        }));

      res.json({ chartData });
    } catch (error) {
      console.error('Erro no gráfico financeiro:', error);
      res.status(500).json({ error: 'Erro ao carregar gráfico' });
    }
  }

  /**
   * Produtos mais vendidos
   */
  async getTopProducts(req, res) {
    try {
      const { period = '30' } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));

      const topProducts = await prisma.saleItem.groupBy({
        by: ['productId'],
        where: {
          sale: {
            companyId: req.companyId,
            status: { not: 'CANCELLED' },
            date: { gte: daysAgo }
          }
        },
        _sum: {
          quantity: true,
          total: true
        },
        orderBy: {
          _sum: {
            total: 'desc'
          }
        },
        take: 10
      });

      // Busca nomes dos produtos
      const productIds = topProducts.map(p => p.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, code: true }
      });

      const topProductsWithNames = topProducts.map(tp => ({
        ...tp,
        product: products.find(p => p.id === tp.productId)
      }));

      res.json({ topProducts: topProductsWithNames });
    } catch (error) {
      console.error('Erro ao buscar produtos mais vendidos:', error);
      res.status(500).json({ error: 'Erro ao carregar produtos' });
    }
  }

  /**
   * Estatísticas rápidas
   */
  async getQuickStats(req, res) {
    try {
      const today = new Date();
      const startToday = startOfDay(today);
      const endToday = endOfDay(today);

      const [
        salesToday,
        transactionsToday,
        newCustomersToday,
        totalCustomers,
        totalProducts,
        activeUsers
      ] = await Promise.all([
        // Vendas hoje
        prisma.sale.aggregate({
          where: {
            companyId: req.companyId,
            date: { gte: startToday, lte: endToday }
          },
          _sum: { netAmount: true },
          _count: true
        }),

        // Transações hoje
        prisma.financialTransaction.aggregate({
          where: {
            date: { gte: startToday, lte: endToday }
          },
          _count: true
        }),

        // Novos clientes hoje
        prisma.customer.count({
          where: {
            companyId: req.companyId,
            createdAt: { gte: startToday, lte: endToday }
          }
        }),

        // Total de clientes
        prisma.customer.count({
          where: {
            companyId: req.companyId,
            active: true
          }
        }),

        // Total de produtos
        prisma.product.count({
          where: {
            companyId: req.companyId,
            active: true
          }
        }),

        // Usuários ativos
        prisma.user.count({
          where: {
            companyId: req.companyId,
            active: true
          }
        })
      ]);

      res.json({
        salesToday: {
          amount: salesToday._sum.netAmount || 0,
          count: salesToday._count
        },
        transactionsToday: transactionsToday._count,
        newCustomersToday,
        totalCustomers,
        totalProducts,
        activeUsers
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro ao carregar estatísticas' });
    }
  }

  /**
   * Vendas recentes
   */
  async getRecentSales(req, res) {
    try {
      const { limit = 10 } = req.query;

      const recentSales = await prisma.sale.findMany({
        where: {
          companyId: req.companyId
        },
        take: parseInt(limit),
        orderBy: { date: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
              cpfCnpj: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      res.json({ recentSales });
    } catch (error) {
      console.error('Erro ao buscar vendas recentes:', error);
      res.status(500).json({ error: 'Erro ao carregar vendas' });
    }
  }
}

/**
 * Calcula tendência percentual entre dois valores
 */
function calculateTrend(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

module.exports = new DashboardController();