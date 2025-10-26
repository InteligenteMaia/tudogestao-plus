// ⚙️ Rubens Neto - Backend Developer
// 🔧 Thaynara Ribeiro - Full Stack
// Controller de clientes

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class CustomerController {
  /**
   * Lista todos os clientes da empresa
   */
  async list(req, res) {
    const { page = 1, limit = 20, search, type, active } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: req.companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { cpfCnpj: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      }),
      ...(type && { type }),
      ...(active !== undefined && { active: active === 'true' }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        select: {
          id: true,
          type: true,
          cpfCnpj: true,
          name: true,
          email: true,
          phone: true,
          active: true,
          createdAt: true,
          _count: {
            select: {
              sales: true,
              receivables: true,
            }
          }
        }
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  /**
   * Busca um cliente por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: { 
        id,
        companyId: req.companyId 
      },
      include: {
        _count: {
          select: {
            sales: true,
            receivables: { where: { status: 'PENDING' } }
          }
        }
      }
    });

    if (!customer) {
      throw new AppError('Cliente não encontrado', 404);
    }

    res.json(customer);
  }

  /**
   * Cria um novo cliente
   */
  async create(req, res) {
    const data = {
      ...req.body,
      companyId: req.companyId,
    };

    // Verifica se CPF/CNPJ já existe
    const existing = await prisma.customer.findFirst({
      where: {
        companyId: req.companyId,
        cpfCnpj: data.cpfCnpj
      }
    });

    if (existing) {
      throw new AppError('CPF/CNPJ já cadastrado', 409);
    }

    const customer = await prisma.customer.create({
      data
    });

    // Log de auditoria
    await auditService.log(req.userId, 'CREATE', 'Customer', customer.id, data);

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      customer
    });
  }

  /**
   * Atualiza um cliente
   */
  async update(req, res) {
    const { id } = req.params;
    const data = req.body;

    // Verifica se existe
    const existing = await prisma.customer.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // Verifica se CPF/CNPJ já existe em outro cliente
    if (data.cpfCnpj && data.cpfCnpj !== existing.cpfCnpj) {
      const duplicate = await prisma.customer.findFirst({
        where: {
          companyId: req.companyId,
          cpfCnpj: data.cpfCnpj,
          id: { not: id }
        }
      });

      if (duplicate) {
        throw new AppError('CPF/CNPJ já cadastrado', 409);
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data
    });

    // Log de auditoria
    await auditService.log(req.userId, 'UPDATE', 'Customer', id, data);

    res.json({
      message: 'Cliente atualizado com sucesso',
      customer
    });
  }

  /**
   * Deleta um cliente (soft delete)
   */
  async delete(req, res) {
    const { id } = req.params;

    // Verifica se existe
    const customer = await prisma.customer.findFirst({
      where: { id, companyId: req.companyId },
      include: {
        _count: {
          select: {
            sales: true,
            receivables: { where: { status: 'PENDING' } }
          }
        }
      }
    });

    if (!customer) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // Verifica se tem vendas ou contas pendentes
    if (customer._count.sales > 0 || customer._count.receivables > 0) {
      throw new AppError(
        'Não é possível excluir cliente com vendas ou contas pendentes. Desative-o.',
        400
      );
    }

    await prisma.customer.delete({
      where: { id }
    });

    // Log de auditoria
    await auditService.log(req.userId, 'DELETE', 'Customer', id);

    res.json({ message: 'Cliente excluído com sucesso' });
  }

  /**
   * Histórico de transações do cliente
   */
  async history(req, res) {
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!customer) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const [sales, receivables] = await Promise.all([
      prisma.sale.findMany({
        where: { customerId: id },
        orderBy: { date: 'desc' },
        take: 10,
        select: {
          id: true,
          saleNumber: true,
          date: true,
          netAmount: true,
          status: true,
        }
      }),
      prisma.accountReceivable.findMany({
        where: { customerId: id },
        orderBy: { dueDate: 'desc' },
        take: 10,
        select: {
          id: true,
          description: true,
          amount: true,
          dueDate: true,
          status: true,
        }
      })
    ]);

    res.json({
      sales,
      receivables
    });
  }
}

module.exports = new CustomerController();