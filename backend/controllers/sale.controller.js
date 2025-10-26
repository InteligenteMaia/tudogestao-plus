// ⚙️ Rubens Neto - Backend Developer
// 🔧 Thaynara Ribeiro - Full Stack
// Controller de vendas

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class SaleController {
  /**
   * Lista todas as vendas
   */
  async list(req, res) {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      customerId, 
      startDate, 
      endDate 
    } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: req.companyId,
      ...(status && { status }),
      ...(customerId && { customerId }),
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              cpfCnpj: true
            }
          },
          user: {
            select: {
              id: true,
              name: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true
                }
              }
            }
          }
        }
      }),
      prisma.sale.count({ where })
    ]);

    res.json({
      sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  /**
   * Busca venda por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const sale = await prisma.sale.findFirst({
      where: { 
        id,
        companyId: req.companyId 
      },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        nfe: true,
        receivables: true
      }
    });

    if (!sale) {
      throw new AppError('Venda não encontrada', 404);
    }

    res.json(sale);
  }

  /**
   * Cria nova venda
   */
  async create(req, res) {
    const { customerId, items, discount, shipping, paymentMethod, paymentTerms, notes } = req.body;

    // Valida cliente
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId: req.companyId }
    });

    if (!customer) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // Valida produtos e estoque
    for (const item of items) {
      const product = await prisma.product.findFirst({
        where: { id: item.productId, companyId: req.companyId }
      });

      if (!product) {
        throw new AppError(`Produto ${item.productId} não encontrado`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`,
          400
        );
      }
    }

    // Calcula valores
    let totalAmount = 0;
    const processedItems = items.map(item => {
      const itemTotal = item.quantity * item.unitPrice;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        total: itemTotal - (item.discount || 0)
      };
    });

    const discountAmount = discount || 0;
    const shippingAmount = shipping || 0;
    const netAmount = totalAmount - discountAmount + shippingAmount;

    // Gera número da venda
    const lastSale = await prisma.sale.findFirst({
      where: { companyId: req.companyId },
      orderBy: { createdAt: 'desc' }
    });

    const saleNumber = lastSale 
      ? `VD${String(parseInt(lastSale.saleNumber.substring(2)) + 1).padStart(6, '0')}`
      : 'VD000001';

    // Cria venda em transação
    const sale = await prisma.$transaction(async (tx) => {
      // Cria venda
      const newSale = await tx.sale.create({
        data: {
          companyId: req.companyId,
          customerId,
          userId: req.userId,
          saleNumber,
          totalAmount,
          discount: discountAmount,
          shipping: shippingAmount,
          netAmount,
          paymentMethod,
          paymentTerms,
          notes,
          status: 'PENDING',
          items: {
            create: processedItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          customer: true
        }
      });

      // Baixa estoque
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        // Registra movimentação
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'EXIT',
            quantity: item.quantity,
            reason: `Venda ${saleNumber}`,
            document: saleNumber
          }
        });
      }

      return newSale;
    });

    // Log de auditoria
    await auditService.log(req.userId, 'CREATE', 'Sale', sale.id, {
      saleNumber,
      netAmount,
      itemsCount: items.length
    });

    res.status(201).json({
      message: 'Venda criada com sucesso',
      sale
    });
  }

  /**
   * Atualiza status da venda
   */
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const sale = await prisma.sale.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!sale) {
      throw new AppError('Venda não encontrada', 404);
    }

    // Se cancelar, devolve estoque
    if (status === 'CANCELLED' && sale.status !== 'CANCELLED') {
      const items = await prisma.saleItem.findMany({
        where: { saleId: id }
      });

      await prisma.$transaction(async (tx) => {
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              type: 'ENTRY',
              quantity: item.quantity,
              reason: `Cancelamento venda ${sale.saleNumber}`,
              document: sale.saleNumber
            }
          });
        }
      });
    }

    const updatedSale = await prisma.sale.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Log de auditoria
    await auditService.log(req.userId, 'UPDATE_STATUS', 'Sale', id, {
      oldStatus: sale.status,
      newStatus: status
    });

    res.json({
      message: 'Status atualizado com sucesso',
      sale: updatedSale
    });
  }

  /**
   * Cancela venda
   */
  async cancel(req, res) {
    return this.updateStatus(req, res);
  }

  /**
   * Estatísticas de vendas
   */
  async stats(req, res) {
    const { startDate, endDate } = req.query;

    const where = {
      companyId: req.companyId,
      status: { not: 'CANCELLED' },
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [
      totalSales,
      totalAmount,
      salesByStatus,
      topProducts,
      topCustomers
    ] = await Promise.all([
      // Total de vendas
      prisma.sale.count({ where }),
      
      // Valor total
      prisma.sale.aggregate({
        where,
        _sum: { netAmount: true }
      }),

      // Vendas por status
      prisma.sale.groupBy({
        by: ['status'],
        where: {
          companyId: req.companyId,
          ...(startDate && endDate && {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        },
        _count: true,
        _sum: { netAmount: true }
      }),

      // Top 5 produtos mais vendidos
      prisma.saleItem.groupBy({
        by: ['productId'],
        where: {
          sale: where
        },
        _sum: {
          quantity: true,
          total: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      }),

      // Top 5 clientes
      prisma.sale.groupBy({
        by: ['customerId'],
        where,
        _count: true,
        _sum: { netAmount: true },
        orderBy: {
          _sum: {
            netAmount: 'desc'
          }
        },
        take: 5
      })
    ]);

    // Busca nomes dos produtos
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    });

    const topProductsWithNames = topProducts.map(tp => ({
      ...tp,
      product: products.find(p => p.id === tp.productId)
    }));

    // Busca nomes dos clientes
    const customerIds = topCustomers.map(c => c.customerId);
    const customers = await prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: { id: true, name: true }
    });

    const topCustomersWithNames = topCustomers.map(tc => ({
      ...tc,
      customer: customers.find(c => c.id === tc.customerId)
    }));

    res.json({
      totalSales,
      totalAmount: totalAmount._sum.netAmount || 0,
      salesByStatus,
      topProducts: topProductsWithNames,
      topCustomers: topCustomersWithNames
    });
  }
}

module.exports = new SaleController();