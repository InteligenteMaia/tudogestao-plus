const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SaleController {
  async create(req, res) {
    try {
      const { customerId, items, discount, paymentMethod, installments, notes } = req.body;
      const { companyId } = req.user;

      let subtotal = 0;
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        if (!product) {
          return res.status(404).json({ error: `Produto ${item.productId} não encontrado` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Estoque insuficiente para ${product.name}` });
        }
        subtotal += parseFloat(product.salePrice) * item.quantity;
      }

      const discountAmount = discount ? parseFloat(discount) : 0;
      const netAmount = subtotal - discountAmount;

      const lastSale = await prisma.sale.findFirst({
        where: { companyId },
        orderBy: { saleNumber: 'desc' }
      });

      const nextNumber = lastSale ? parseInt(lastSale.saleNumber.split('-')[1]) + 1 : 1;
      const saleNumber = `VND-${String(nextNumber).padStart(6, '0')}`;

      const sale = await prisma.sale.create({
        data: {
          companyId,
          customerId,
          saleNumber,
          date: new Date(),
          subtotal,
          discount: discountAmount,
          netAmount,
          paymentMethod,
          installments: installments || 1,
          status: 'PENDING',
          notes,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
              discount: item.discount || 0
            }))
          }
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      res.status(201).json(sale);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao criar venda' });
    }
  }

  async list(req, res) {
    try {
      const { companyId } = req.user;
      const { page = 1, limit = 20, status, customerId, startDate, endDate } = req.query;

      const where = {
        companyId,
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
          skip: (page - 1) * limit,
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
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    code: true
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
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao listar vendas' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { companyId } = req.user;

      const sale = await prisma.sale.findFirst({
        where: { id, companyId },
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      res.json(sale);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao buscar venda' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { companyId } = req.user;
      const { status, paymentMethod, notes } = req.body;

      const sale = await prisma.sale.findFirst({
        where: { id, companyId }
      });

      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      const updated = await prisma.sale.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(paymentMethod && { paymentMethod }),
          ...(notes !== undefined && { notes })
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao atualizar venda' });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { companyId } = req.user;

      const sale = await prisma.sale.findFirst({
        where: { id, companyId }
      });

      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      const updated = await prisma.sale.update({
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

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao atualizar status da venda' });
    }
  }

  async cancel(req, res) {
    try {
      const { id } = req.params;
      const { companyId } = req.user;

      const sale = await prisma.sale.findFirst({
        where: { id, companyId },
        include: { items: true }
      });

      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      if (sale.status === 'CANCELLED') {
        return res.status(400).json({ error: 'Venda já está cancelada' });
      }

      for (const item of sale.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }

      const updated = await prisma.sale.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao cancelar venda' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { companyId } = req.user;

      const sale = await prisma.sale.findFirst({
        where: { id, companyId },
        include: { items: true }
      });

      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      if (sale.status === 'PAID') {
        return res.status(400).json({ error: 'Não é possível excluir uma venda paga' });
      }

      for (const item of sale.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }

      await prisma.sale.delete({ where: { id } });

      res.json({ message: 'Venda excluída com sucesso' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao excluir venda' });
    }
  }

  async stats(req, res) {
    try {
      const { companyId } = req.user;
      const { startDate, endDate } = req.query;

      const where = {
        companyId,
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
      };

      const [totalSales, paidSales, pendingSales, totalRevenue] = await Promise.all([
        prisma.sale.count({ where }),
        prisma.sale.count({ where: { ...where, status: 'PAID' } }),
        prisma.sale.count({ where: { ...where, status: 'PENDING' } }),
        prisma.sale.aggregate({
          where: { ...where, status: 'PAID' },
          _sum: { netAmount: true }
        })
      ]);

      res.json({
        totalSales,
        paidSales,
        pendingSales,
        totalRevenue: totalRevenue._sum.netAmount || 0
      });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }
}

module.exports = new SaleController();