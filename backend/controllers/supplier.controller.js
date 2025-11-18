// 🔧 Thaynara Ribeiro - Full Stack
// Controller de fornecedores

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SupplierController {
  async create(req, res) {
    try {
      const { cpfCnpj, name, tradeName, email, phone, address } = req.body;
      const companyId = req.companyId;

      // Verifica se fornecedor já existe
      const existing = await prisma.supplier.findFirst({
        where: { companyId, cpfCnpj }
      });

      if (existing) {
        return res.status(409).json({ error: 'CPF/CNPJ já cadastrado' });
      }

      const supplier = await prisma.supplier.create({
        data: {
          companyId,
          cpfCnpj,
          name,
          tradeName,
          email,
          phone,
          address,
          active: true
        }
      });

      res.status(201).json(supplier);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao criar fornecedor' });
    }
  }

  async list(req, res) {
    try {
      const companyId = req.companyId;
      const { page = 1, limit = 20, search, active } = req.query;

      const where = {
        companyId,
        ...(active !== undefined && { active: active === 'true' }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { cpfCnpj: { contains: search } },
            { tradeName: { contains: search, mode: 'insensitive' } }
          ]
        })
      };

      const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
          where,
          skip: (page - 1) * limit,
          take: parseInt(limit),
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { products: true }
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
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao listar fornecedores' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.companyId;

      const supplier = await prisma.supplier.findFirst({
        where: { id, companyId },
        include: {
          products: {
            select: {
              id: true,
              code: true,
              name: true,
              stock: true,
              active: true
            }
          }
        }
      });

      if (!supplier) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      res.json(supplier);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao buscar fornecedor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.companyId;
      const { cpfCnpj, name, tradeName, email, phone, address, active } = req.body;

      const supplier = await prisma.supplier.findFirst({
        where: { id, companyId }
      });

      if (!supplier) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      // Se mudou CPF/CNPJ, verifica duplicação
      if (cpfCnpj && cpfCnpj !== supplier.cpfCnpj) {
        const existing = await prisma.supplier.findFirst({
          where: {
            companyId,
            cpfCnpj,
            id: { not: id }
          }
        });

        if (existing) {
          return res.status(409).json({ error: 'CPF/CNPJ já cadastrado' });
        }
      }

      const updated = await prisma.supplier.update({
        where: { id },
        data: {
          ...(cpfCnpj && { cpfCnpj }),
          ...(name && { name }),
          ...(tradeName !== undefined && { tradeName }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
          ...(address !== undefined && { address }),
          ...(active !== undefined && { active })
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.companyId;

      const supplier = await prisma.supplier.findFirst({
        where: { id, companyId },
        include: {
          _count: {
            select: { products: true }
          }
        }
      });

      if (!supplier) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      if (supplier._count.products > 0) {
        return res.status(400).json({
          error: 'Não é possível excluir fornecedor com produtos vinculados'
        });
      }

      await prisma.supplier.delete({ where: { id } });

      res.json({ message: 'Fornecedor excluído com sucesso' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao excluir fornecedor' });
    }
  }
}

module.exports = new SupplierController();
