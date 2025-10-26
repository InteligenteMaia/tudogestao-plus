// ⚙️ Rubens Neto - Backend Developer
// 🔧 Thaynara Ribeiro - Full Stack
// Controller de produtos

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class ProductController {
  /**
   * Lista todos os produtos
   */
  async list(req, res) {
    const { page = 1, limit = 50, search, categoryId, active, lowStock } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: req.companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search } },
          { barcode: { contains: search } },
        ]
      }),
      ...(categoryId && { categoryId }),
      ...(active !== undefined && { active: active === 'true' }),
      ...(lowStock === 'true' && {
        stock: { lte: prisma.raw('min_stock') }
      })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        include: {
          category: {
            select: { id: true, name: true, color: true }
          },
          supplier: {
            select: { id: true, name: true }
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
  }

  /**
   * Busca produto por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { 
        id,
        companyId: req.companyId 
      },
      include: {
        category: true,
        supplier: true,
        stockMovements: {
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    res.json(product);
  }

  /**
   * Cria novo produto
   */
  async create(req, res) {
    const data = {
      ...req.body,
      companyId: req.companyId,
    };

    // Verifica se SKU já existe
    const existing = await prisma.product.findFirst({
      where: {
        companyId: req.companyId,
        sku: data.sku
      }
    });

    if (existing) {
      throw new AppError('SKU já cadastrado', 409);
    }

    const product = await prisma.product.create({
      data,
      include: {
        category: true,
        supplier: true
      }
    });

    // Log de auditoria
    await auditService.log(req.userId, 'CREATE', 'Product', product.id, data);

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product
    });
  }

  /**
   * Atualiza produto
   */
  async update(req, res) {
    const { id } = req.params;
    const data = req.body;

    // Verifica se existe
    const existing = await prisma.product.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Produto não encontrado', 404);
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        supplier: true
      }
    });

    // Log de auditoria
    await auditService.log(req.userId, 'UPDATE', 'Product', id, data);

    res.json({
      message: 'Produto atualizado com sucesso',
      product
    });
  }

  /**
   * Deleta produto
   */
  async delete(req, res) {
    const { id } = req.params;

    // Verifica se tem vendas
    const sales = await prisma.saleItem.count({
      where: { productId: id }
    });

    if (sales > 0) {
      throw new AppError(
        'Não é possível excluir produto com vendas registradas',
        400
      );
    }

    await prisma.product.delete({
      where: { id }
    });

    // Log de auditoria
    await auditService.log(req.userId, 'DELETE', 'Product', id);

    res.json({ message: 'Produto excluído com sucesso' });
  }

  /**
   * Ajusta estoque
   */
  async adjustStock(req, res) {
    const { id } = req.params;
    const { quantity, type, reason } = req.body;

    const product = await prisma.product.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    // Calcula novo estoque
    let newStock = product.stock;
    if (type === 'ENTRY' || type === 'ADJUSTMENT') {
      newStock += quantity;
    } else if (type === 'EXIT') {
      newStock -= quantity;
      if (newStock < 0) {
        throw new AppError('Estoque insuficiente', 400);
      }
    }

    // Atualiza em transação
    const result = await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data: { stock: newStock }
      }),
      prisma.stockMovement.create({
        data: {
          productId: id,
          type,
          quantity,
          reason,
        }
      })
    ]);

    // Log de auditoria
    await auditService.log(req.userId, 'STOCK_ADJUST', 'Product', id, {
      type,
      quantity,
      oldStock: product.stock,
      newStock
    });

    res.json({
      message: 'Estoque ajustado com sucesso',
      product: result[0],
      movement: result[1]
    });
  }

  /**
   * Produtos com estoque baixo
   */
  async lowStock(req, res) {
    const products = await prisma.product.findMany({
      where: {
        companyId: req.companyId,
        active: true,
        stock: {
          lte: prisma.raw('min_stock')
        }
      },
      include: {
        category: {
          select: { name: true, color: true }
        }
      },
      orderBy: { stock: 'asc' }
    });

    res.json({ products });
  }
}

module.exports = new ProductController();