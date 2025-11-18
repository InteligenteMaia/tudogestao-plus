// 💼 Larissa Oliveira - Product Manager
// ⚙️ Rubens Neto - Backend Developer
// Controller de relatórios

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const PDFService = require('../services/pdf.service');
const ExcelService = require('../services/excel.service');

const prisma = new PrismaClient();

class ReportController {
  /**
   * DRE - Demonstração do Resultado do Exercício
   */
  async getDRE(req, res) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Período obrigatório', 400);
    }

    const dateFilter = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };

    // Receitas
    const revenues = await prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'INCOME',
        date: dateFilter
      },
      _sum: { amount: true }
    });

    // Despesas
    const expenses = await prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'EXPENSE',
        date: dateFilter
      },
      _sum: { amount: true }
    });

    // Monta relatório
    const revenuesWithNames = revenues.map(r => ({
      category: r.category || 'Sem categoria',
      amount: r._sum.amount || 0
    }));

    const expensesWithNames = expenses.map(e => ({
      category: e.category || 'Sem categoria',
      amount: e._sum.amount || 0
    }));

    const totalRevenue = revenuesWithNames.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const totalExpense = expensesWithNames.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const netProfit = totalRevenue - totalExpense;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    res.json({
      period: { startDate, endDate },
      revenues: revenuesWithNames,
      totalRevenue,
      expenses: expensesWithNames,
      totalExpense,
      netProfit,
      profitMargin
    });
  }

  /**
   * Relatório de vendas
   */
  async getSalesReport(req, res) {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Período obrigatório', 400);
    }

    const sales = await prisma.sale.findMany({
      where: {
        companyId: req.companyId,
        status: { not: 'CANCELLED' },
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        customer: {
          select: { name: true }
        }
      }
    });

    // Agrupa vendas
    let groupedSales;
    if (groupBy === 'customer') {
      groupedSales = groupByCustomer(sales);
    } else {
      groupedSales = groupByDate(sales, groupBy);
    }

    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, s) => sum + parseFloat(s.netAmount), 0);
    const averageTicket = totalSales > 0 ? totalAmount / totalSales : 0;

    res.json({
      period: { startDate, endDate },
      totalSales,
      totalAmount,
      averageTicket,
      groupedSales,
      sales: sales.map(s => ({
        id: s.id,
        saleNumber: s.saleNumber,
        date: s.date,
        customer: s.customer.name,
        amount: s.netAmount,
        status: s.status
      }))
    });
  }

  /**
   * Relatório de estoque
   */
  async getStockReport(req, res) {
    const { categoryId, lowStock } = req.query;

    const where = {
      companyId: req.companyId,
      active: true,
      ...(categoryId && { categoryId }),
      ...(lowStock === 'true' && {
        stock: {
          lte: prisma.raw('COALESCE(min_stock, 0)')
        }
      })
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { name: true }
        },
        supplier: {
          select: { name: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, p) => 
      sum + (parseFloat(p.costPrice || 0) * p.stock), 0
    );
    const lowStockCount = products.filter(p => 
      p.stock <= (p.minStock || 0)
    ).length;

    res.json({
      totalProducts,
      totalStockValue,
      lowStockCount,
      products: products.map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        category: p.category?.name,
        supplier: p.supplier?.name,
        stock: p.stock,
        minStock: p.minStock,
        salePrice: p.salePrice,
        costPrice: p.costPrice,
        stockValue: parseFloat(p.costPrice || 0) * p.stock,
        status: p.stock <= (p.minStock || 0) ? 'LOW' : 'OK'
      }))
    });
  }

  /**
   * Relatório de clientes
   */
  async getCustomersReport(req, res) {
    const { startDate, endDate } = req.query;

    const dateFilter = startDate && endDate ? {
      gte: new Date(startDate),
      lte: new Date(endDate)
    } : undefined;

    const customers = await prisma.customer.findMany({
      where: {
        companyId: req.companyId,
        active: true
      },
      include: {
        _count: {
          select: {
            sales: {
              where: {
                status: { not: 'CANCELLED' },
                ...(dateFilter && { date: dateFilter })
              }
            }
          }
        },
        sales: {
          where: {
            status: { not: 'CANCELLED' },
            ...(dateFilter && { date: dateFilter })
          },
          select: {
            netAmount: true
          }
        }
      }
    });

    const customersWithStats = customers.map(c => {
      const totalPurchases = c.sales.reduce((sum, s) => 
        sum + parseFloat(s.netAmount), 0
      );
      
      return {
        id: c.id,
        name: c.name,
        cpfCnpj: c.cpfCnpj,
        email: c.email,
        phone: c.phone,
        totalPurchases,
        purchaseCount: c._count.sales,
        averageTicket: c._count.sales > 0 ? totalPurchases / c._count.sales : 0
      };
    }).sort((a, b) => b.totalPurchases - a.totalPurchases);

    res.json({
      period: startDate && endDate ? { startDate, endDate } : null,
      totalCustomers: customers.length,
      customersWithStats
    });
  }

  /**
   * Exporta relatório em PDF
   */
  async exportPDF(req, res) {
    const { reportType, ...params } = req.query;

    let reportData;
    let title;

    switch (reportType) {
      case 'dre':
        reportData = await this.getDREData(req.companyId, params);
        title = 'DRE - Demonstração do Resultado';
        break;
      case 'sales':
        reportData = await this.getSalesData(req.companyId, params);
        title = 'Relatório de Vendas';
        break;
      case 'stock':
        reportData = await this.getStockData(req.companyId, params);
        title = 'Relatório de Estoque';
        break;
      default:
        throw new AppError('Tipo de relatório inválido', 400);
    }

    const pdfBuffer = await PDFService.generateReport(title, reportData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${reportType}-${Date.now()}.pdf`);
    res.send(pdfBuffer);
  }

  /**
   * Exporta relatório em Excel
   */
  async exportExcel(req, res) {
    const { reportType, ...params } = req.query;

    let reportData;
    let filename;

    switch (reportType) {
      case 'sales':
        reportData = await this.getSalesData(req.companyId, params);
        filename = 'vendas';
        break;
      case 'stock':
        reportData = await this.getStockData(req.companyId, params);
        filename = 'estoque';
        break;
      case 'customers':
        reportData = await this.getCustomersData(req.companyId, params);
        filename = 'clientes';
        break;
      default:
        throw new AppError('Tipo de relatório inválido', 400);
    }

    const excelBuffer = await ExcelService.generateReport(reportData);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-${Date.now()}.xlsx`);
    res.send(excelBuffer);
  }

  // Métodos auxiliares para buscar dados
  async getDREData(companyId, params) {
    // Implementação similar ao getDRE
    return {};
  }

  async getSalesData(companyId, params) {
    // Implementação similar ao getSalesReport
    return {};
  }

  async getStockData(companyId, params) {
    // Implementação similar ao getStockReport
    return {};
  }

  async getCustomersData(companyId, params) {
    // Implementação similar ao getCustomersReport
    return {};
  }
}

// Funções auxiliares de agrupamento
function groupByCustomer(sales) {
  return sales.reduce((acc, sale) => {
    const customerId = sale.customerId;
    if (!acc[customerId]) {
      acc[customerId] = {
        customer: sale.customer.name,
        count: 0,
        total: 0
      };
    }
    acc[customerId].count++;
    acc[customerId].total += parseFloat(sale.netAmount);
    return acc;
  }, {});
}

function groupByDate(sales, groupBy) {
  return sales.reduce((acc, sale) => {
    let dateKey;
    if (groupBy === 'month') {
      dateKey = `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}`;
    } else {
      dateKey = sale.date.toISOString().split('T')[0];
    }

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        count: 0,
        total: 0
      };
    }
    acc[dateKey].count++;
    acc[dateKey].total += parseFloat(sale.netAmount);
    return acc;
  }, {});
}

module.exports = new ReportController();