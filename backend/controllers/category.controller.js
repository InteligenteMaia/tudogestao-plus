// 🔧 Thaynara Ribeiro - Full Stack
// Controller de categorias

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class CategoryController {
  /**
   * Lista todas as categorias
   */
  async list(req, res) {
    const { type } = req.query;

    const where = {
      companyId: req.companyId,
      ...(type && { type }),
      active: true
    };

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        parent: {
          select: { id: true, name: true }
        },
        children: {
          select: { id: true, name: true, color: true }
        }
      }
    });

    res.json({ categories });
  }

  /**
   * Busca categoria por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { 
        id,
        companyId: req.companyId 
      },
      include: {
        parent: true,
        children: true
      }
    });

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    res.json(category);
  }

  /**
   * Cria categoria
   */
  async create(req, res) {
    const data = {
      ...req.body,
      companyId: req.companyId,
    };

    const category = await prisma.category.create({
      data,
      include: {
        parent: true
      }
    });

    await auditService.log(req.userId, 'CREATE', 'Category', category.id, data);

    res.status(201).json({
      message: 'Categoria criada com sucesso',
      category
    });
  }

  /**
   * Atualiza categoria
   */
  async update(req, res) {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.category.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Categoria não encontrada', 404);
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true
      }
    });

    await auditService.log(req.userId, 'UPDATE', 'Category', id, data);

    res.json({
      message: 'Categoria atualizada com sucesso',
      category
    });
  }

  /**
   * Deleta categoria
   */
  async delete(req, res) {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { id, companyId: req.companyId },
      include: {
        children: true
      }
    });

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    if (category.children.length > 0) {
      throw new AppError('Não é possível excluir categoria com subcategorias', 400);
    }

    await prisma.category.delete({ where: { id } });

    await auditService.log(req.userId, 'DELETE', 'Category', id);

    res.json({ message: 'Categoria excluída com sucesso' });
  }
}

module.exports = new CategoryController();