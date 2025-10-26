// 🔧 Thaynara Ribeiro - Full Stack
// Controller de fornecedores

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class SupplierController {
  /**
   * Lista todos os fornecedores
   */
  async list(req, res) {
    const { page = 1, limit = 20, search, active } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: req.companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { cnpj: { contains: search } },
          { tradeName: { contains: search, mode: 'insensitive' } },
        ]
      }),
      ...(active !== undefined && { active: active === 'true' }),
    };

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        select: {
          id: true,
          cnpj: true,
          name: true,
          tradeName: true,
          email: true,
          phone: true,
          active: true,
          createdAt: true,
          _count: {
            select: {
              payables: true,
              products: true
            }
          }
        }
      }),
      prisma.supplier.count({ where })
    ]);

    res.json({
      suppliers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  /**
   * Busca fornecedor por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const supplier = await prisma.supplier.findFirst({
      where: { 
        id,
        companyId: req.companyId 
      },
      include: {
        _count: {
          select: {
            payables: { where: { status: 'PENDING' } },
            products: true
          }
        }
      }
    });

    if (!supplier) {
      throw new AppError('Fornecedor não encontrado', 404);
    }

    res.json(supplier);
  }

  /**
   * Cria fornecedor
   */
  async create(req, res) {
    const data = {
      ...req.body,
      companyId: req.companyId,
    };

    // Verifica se CNPJ já existe
    const existing = await prisma.supplier.findFirst({
      where: {
        companyId: req.companyId,
        cnpj: data.cnpj
      }
    });

    if (existing) {
      throw new AppError('CNPJ já cadastrado', 409);
    }

    const supplier = await prisma.supplier.create({
      data
    });

    await auditService.log(req.userId, 'CREATE', 'Supplier', supplier.id, data);

    res.status(201).json({
      message: 'Fornecedor criado com sucesso',
      supplier
    });
  }

  /**
   * Atualiza fornecedor
   */
  async update(req, res) {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.supplier.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Fornecedor não encontrado', 404);
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data
    });

    await auditService.log(req.userId, 'UPDATE', 'Supplier', id, data);

    res.json({
      message: 'Fornecedor atualizado com sucesso',
      supplier
    });
  }

  /**
   * Deleta fornecedor
   */
  async delete(req, res) {
    const { id } = req.params;

    const supplier = await prisma.supplier.findFirst({
      where: { id, companyId: req.companyId },
      include: {
        _count: {
          select: {
            payables: { where: { status: 'PENDING' } },
            products: true
          }
        }
      }
    });

    if (!supplier) {
      throw new AppError('Fornecedor não encontrado', 404);
    }

    if (supplier._count.payables > 0 || supplier._count.products > 0) {
      throw new AppError(
        'Não é possível excluir fornecedor com contas pendentes ou produtos vinculados',
        400
      );
    }

    await prisma.supplier.delete({ where: { id } });

    await auditService.log(req.userId, 'DELETE', 'Supplier', id);

    res.json({ message: 'Fornecedor excluído com sucesso' });
  }
}

module.exports = new SupplierController();