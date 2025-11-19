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
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  }

  /**
   * Busca categoria por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id }
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
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    });

    await auditService.log(req.userId, 'CREATE', 'Category', category.id, req.body);

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
    const { name, description } = req.body;

    const existing = await prisma.category.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new AppError('Categoria não encontrada', 404);
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description
      }
    });

    await auditService.log(req.userId, 'UPDATE', 'Category', id, req.body);

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

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    await prisma.category.delete({ where: { id } });

    await auditService.log(req.userId, 'DELETE', 'Category', id);

    res.json({ message: 'Categoria excluída com sucesso' });
  }
}

module.exports = new CategoryController();