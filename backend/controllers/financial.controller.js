// 💼 Larissa Oliveira - Product Manager
// ⚙️ Rubens Neto - Backend Developer
// Controller financeiro - Contas a pagar/receber e transações

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class FinancialController {
  // ========== CONTAS A PAGAR ==========

  async listPayables(req, res) {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(startDate && endDate && {
        dueDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [payables, total] = await Promise.all([
      prisma.accountPayable.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { dueDate: 'asc' }
      }),
      prisma.accountPayable.count({ where })
    ]);

    res.json({
      payables,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  async createPayable(req, res) {
    const { supplierId, description, amount, dueDate, observations } = req.body;

    const payable = await prisma.accountPayable.create({
      data: {
        supplierId,
        description,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        observations,
        status: 'PENDING'
      }
    });

    await auditService.log(req.userId, 'CREATE', 'AccountPayable', payable.id, req.body);

    res.status(201).json({
      message: 'Conta a pagar criada com sucesso',
      payable
    });
  }

  async updatePayable(req, res) {
    const { id } = req.params;
    const { description, amount, dueDate, observations, status } = req.body;

    const existing = await prisma.accountPayable.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new AppError('Conta não encontrada', 404);
    }

    const payable = await prisma.accountPayable.update({
      where: { id },
      data: {
        ...(description && { description }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(observations !== undefined && { observations }),
        ...(status && { status })
      }
    });

    await auditService.log(req.userId, 'UPDATE', 'AccountPayable', id, req.body);

    res.json({
      message: 'Conta atualizada com sucesso',
      payable
    });
  }

  async payPayable(req, res) {
    const { id } = req.params;
    const { paymentDate } = req.body;

    const payable = await prisma.accountPayable.findUnique({
      where: { id }
    });

    if (!payable) {
      throw new AppError('Conta não encontrada', 404);
    }

    if (payable.status === 'PAID') {
      throw new AppError('Conta já foi paga', 400);
    }

    const updated = await prisma.accountPayable.update({
      where: { id },
      data: {
        status: 'PAID',
        paymentDate: new Date(paymentDate)
      }
    });

    await auditService.log(req.userId, 'PAY', 'AccountPayable', id, { paymentDate });

    res.json({
      message: 'Pagamento registrado com sucesso',
      payable: updated
    });
  }

  async deletePayable(req, res) {
    const { id } = req.params;

    const payable = await prisma.accountPayable.findUnique({
      where: { id }
    });

    if (!payable) {
      throw new AppError('Conta não encontrada', 404);
    }

    if (payable.status === 'PAID') {
      throw new AppError('Não é possível excluir conta já paga', 400);
    }

    await prisma.accountPayable.delete({ where: { id } });

    await auditService.log(req.userId, 'DELETE', 'AccountPayable', id);

    res.json({ message: 'Conta excluída com sucesso' });
  }

  // ========== CONTAS A RECEBER ==========

  async listReceivables(req, res) {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(startDate && endDate && {
        dueDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [receivables, total] = await Promise.all([
      prisma.accountReceivable.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { dueDate: 'asc' }
      }),
      prisma.accountReceivable.count({ where })
    ]);

    res.json({
      receivables,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  async createReceivable(req, res) {
    const { customerId, saleId, description, amount, dueDate, observations } = req.body;

    const receivable = await prisma.accountReceivable.create({
      data: {
        customerId,
        saleId,
        description,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        observations,
        status: 'PENDING'
      }
    });

    await auditService.log(req.userId, 'CREATE', 'AccountReceivable', receivable.id, req.body);

    res.status(201).json({
      message: 'Conta a receber criada com sucesso',
      receivable
    });
  }

  async updateReceivable(req, res) {
    const { id } = req.params;
    const { description, amount, dueDate, observations, status } = req.body;

    const existing = await prisma.accountReceivable.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new AppError('Conta não encontrada', 404);
    }

    const receivable = await prisma.accountReceivable.update({
      where: { id },
      data: {
        ...(description && { description }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(observations !== undefined && { observations }),
        ...(status && { status })
      }
    });

    await auditService.log(req.userId, 'UPDATE', 'AccountReceivable', id, req.body);

    res.json({
      message: 'Conta atualizada com sucesso',
      receivable
    });
  }

  async receiveReceivable(req, res) {
    const { id } = req.params;
    const { paymentDate } = req.body;

    const receivable = await prisma.accountReceivable.findUnique({
      where: { id }
    });

    if (!receivable) {
      throw new AppError('Conta não encontrada', 404);
    }

    if (receivable.status === 'PAID') {
      throw new AppError('Conta já foi recebida', 400);
    }

    const updated = await prisma.accountReceivable.update({
      where: { id },
      data: {
        status: 'PAID',
        paymentDate: new Date(paymentDate)
      }
    });

    // Atualiza venda se vinculada
    if (receivable.saleId) {
      const allReceivables = await prisma.accountReceivable.findMany({
        where: { saleId: receivable.saleId }
      });

      const allPaid = allReceivables.every(r =>
        r.id === id || r.status === 'PAID'
      );

      if (allPaid) {
        await prisma.sale.update({
          where: { id: receivable.saleId },
          data: { status: 'PAID' }
        });
      }
    }

    await auditService.log(req.userId, 'RECEIVE', 'AccountReceivable', id, { paymentDate });

    res.json({
      message: 'Recebimento registrado com sucesso',
      receivable: updated
    });
  }

  async deleteReceivable(req, res) {
    const { id } = req.params;

    const receivable = await prisma.accountReceivable.findUnique({
      where: { id }
    });

    if (!receivable) {
      throw new AppError('Conta não encontrada', 404);
    }

    if (receivable.status === 'PAID') {
      throw new AppError('Não é possível excluir conta já recebida', 400);
    }

    await prisma.accountReceivable.delete({ where: { id } });

    await auditService.log(req.userId, 'DELETE', 'AccountReceivable', id);

    res.json({ message: 'Conta excluída com sucesso' });
  }

  // ========== TRANSAÇÕES ==========

  async listTransactions(req, res) {
    const { page = 1, limit = 50, type, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(type && { type }),
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [transactions, total] = await Promise.all([
      prisma.financialTransaction.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'desc' }
      }),
      prisma.financialTransaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  async createTransaction(req, res) {
    const { type, category, description, amount, date, bankAccount, observations } = req.body;

    const transaction = await prisma.financialTransaction.create({
      data: {
        type,
        category,
        description,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        bankAccount,
        observations
      }
    });

    await auditService.log(req.userId, 'CREATE', 'FinancialTransaction', transaction.id, req.body);

    res.status(201).json({
      message: 'Transação criada com sucesso',
      transaction
    });
  }

  async dashboard(req, res) {
    const { startDate, endDate } = req.query;

    const dateFilter = startDate && endDate ? {
      gte: new Date(startDate),
      lte: new Date(endDate)
    } : undefined;

    const [
      totalIncome,
      totalExpense,
      pendingReceivables,
      pendingPayables,
      overdueReceivables,
      overduePayables
    ] = await Promise.all([
      // Total receitas
      prisma.financialTransaction.aggregate({
        where: {
          type: 'INCOME',
          ...(dateFilter && { date: dateFilter })
        },
        _sum: { amount: true }
      }),

      // Total despesas
      prisma.financialTransaction.aggregate({
        where: {
          type: 'EXPENSE',
          ...(dateFilter && { date: dateFilter })
        },
        _sum: { amount: true }
      }),

      // Contas a receber pendentes
      prisma.accountReceivable.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: true
      }),

      // Contas a pagar pendentes
      prisma.accountPayable.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: true
      }),

      // Contas a receber vencidas
      prisma.accountReceivable.aggregate({
        where: {
          status: 'PENDING',
          dueDate: { lt: new Date() }
        },
        _sum: { amount: true },
        _count: true
      }),

      // Contas a pagar vencidas
      prisma.accountPayable.aggregate({
        where: {
          status: 'PENDING',
          dueDate: { lt: new Date() }
        },
        _sum: { amount: true },
        _count: true
      })
    ]);

    res.json({
      income: totalIncome._sum.amount || 0,
      expense: totalExpense._sum.amount || 0,
      balance: (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0),
      receivables: {
        pending: {
          amount: pendingReceivables._sum.amount || 0,
          count: pendingReceivables._count
        },
        overdue: {
          amount: overdueReceivables._sum.amount || 0,
          count: overdueReceivables._count
        }
      },
      payables: {
        pending: {
          amount: pendingPayables._sum.amount || 0,
          count: pendingPayables._count
        },
        overdue: {
          amount: overduePayables._sum.amount || 0,
          count: overduePayables._count
        }
      }
    });
  }
}

module.exports = new FinancialController();
