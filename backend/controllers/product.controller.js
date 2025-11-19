// ⚙️ Rubens Neto - Backend Developer
// 🔧 Thaynara Ribeiro - Full Stack
// Controller de produtos


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductController {
  async create(req, res) {
    try {
      const { code, name, description, categoryId, supplierId, costPrice, salePrice, stock, minStock, barcode, unit } = req.body;

      const product = await prisma.product.create({
        data: {
          companyId: req.companyId,
          code,
          name,
          description,
          categoryId,
          supplierId,
          costPrice: parseFloat(costPrice),
          salePrice: parseFloat(salePrice),
          stock: parseInt(stock) || 0,
          minStock: parseInt(minStock) || 0,
          barcode,
          unit: unit || 'UN'
        },
        include: {
          category: true,
          supplier: true
        }
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  async list(req, res) {
    try {
      const { page = 1, limit = 50, search, categoryId } = req.query;

      const where = {
        companyId: req.companyId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(categoryId && { categoryId })
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: parseInt(limit),
          orderBy: { name: 'asc' },
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            },
            supplier: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }),
        prisma.product.count({ where })
      ]);

      res.json({
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao listar produtos' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const product = await prisma.product.findFirst({
        where: { id, companyId: req.companyId },
        include: {
          category: true,
          supplier: true
        }
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.json(product);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { code, name, description, categoryId, supplierId, costPrice, salePrice, stock, minStock, barcode, unit } = req.body;

      const product = await prisma.product.findFirst({
        where: { id, companyId: req.companyId }
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const updated = await prisma.product.update({
        where: { id },
        data: {
          code,
          name,
          description,
          categoryId,
          supplierId,
          costPrice: parseFloat(costPrice),
          salePrice: parseFloat(salePrice),
          stock: parseInt(stock),
          minStock: parseInt(minStock) || 0,
          barcode,
          unit
        },
        include: {
          category: true,
          supplier: true
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const product = await prisma.product.findFirst({
        where: { id, companyId: req.companyId }
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await prisma.product.delete({ where: { id } });

      res.json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  }

  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity, type } = req.body;

      const product = await prisma.product.findFirst({
        where: { id, companyId: req.companyId }
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const updated = await prisma.product.update({
        where: { id },
        data: {
          stock: type === 'add'
            ? { increment: parseInt(quantity) }
            : { decrement: parseInt(quantity) }
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao atualizar estoque' });
    }
  }

  async adjustStock(req, res) {
    try {
      const { id } = req.params;
      const { adjustment, reason } = req.body;

      const product = await prisma.product.findFirst({
        where: { id, companyId: req.companyId }
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const newStock = product.stock + parseInt(adjustment);

      if (newStock < 0) {
        return res.status(400).json({ error: 'Estoque não pode ficar negativo' });
      }

      const updated = await prisma.product.update({
        where: { id },
        data: {
          stock: newStock
        },
        include: {
          category: true,
          supplier: true
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao ajustar estoque' });
    }
  }

  async lowStock(req, res) {
    try {
      const products = await prisma.product.findMany({
        where: {
          companyId: req.companyId,
          stock: {
            lte: prisma.product.fields.minStock
          }
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          supplier: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          stock: 'asc'
        }
      });

      res.json(products);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao buscar produtos com estoque baixo' });
    }
  }
}

module.exports = new ProductController();