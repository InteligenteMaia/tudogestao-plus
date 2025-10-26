// 💼 Larissa Oliveira - Product Manager
// ⚙️ Rubens Neto - Backend Developer
// Controller financeiro - Contas a pagar/receber e transações

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class FinancialController {
  // ========== CONTAS A PAGAR ==========

  /**
   * Lista contas a pagar
   */
  async listPayables(req, res) {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: req.companyId,
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
        orderBy: { dueDate: 'asc' },
        include: {
          supplier: {
            select: { id: true, name: true }
          },
          category: {
            select: { id: true, name: true, color: true }
          }
        }
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

  /**
   * Cria conta a pagar
   */
  async createPayable(req, res) {
    const data = {
      ...req.body,
      companyId: req.companyId,
    };

    const payable = await prisma.accountPayable.create({
      data,
      include: {
        supplier: true,
        category: true
      }
    });

    await auditService.log(req.userId, 'CREATE', 'AccountPayable', payable.id, data);

    res.status(201).json({
      message: 'Conta a pagar criada com sucesso',
      payable
    });
  }

  /**
   * Atualiza conta a pagar
   */
  async updatePayable(req, res) {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.accountPayable.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Conta não encontrada', 404);
    }

    const payable = await prisma.accountPayable.update({
      where: { id },
      data,
      include: {
        supplier: true,
        category: true
      }
    });

    await auditService.log(req.userId, 'UPDATE', 'AccountPayable', id, data);

    res.json({
      message: 'Conta atualizada com sucesso',
      payable
    });
  }

  /**
   * Registra pagamento
   */
  async payPayable(req, res) {
    const { id } = req.params;
    const { paymentDate, paymentMethod, fine, interest, bankAccountId } = req.body;

    const payable = await prisma.accountPayable.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!payable) {
      throw new AppError('Conta não encontrada', 404);
    }

    if (payable.status === 'PAID') {
      throw new AppError('Conta já foi paga', 400);
    }

    const totalAmount = parseFloat(payable.amount) + (fine || 0) + (interest || 0);

    // Atualiza em transação
    await prisma.$transaction(async (tx) => {
      // Atualiza conta
      await tx.accountPayable.update({
        where: { id },
        data: {
          status: 'PAID',
          paymentDate: new Date(paymentDate),
          paymentMethod,
          fine,
          interest
        }
      });

      // Registra transação
      await tx.transaction.create({
        data: {
          companyId: req.companyId,
          bankAccountId,
          categoryId: payable.categoryId,
          type: 'EXPENSE',
          description: payable.description,
          amount: totalAmount,
          date: new Date(paymentDate),
          paymentMethod,
          document: payable.document
        }
      });

      // Atualiza saldo da conta bancária
      if (bankAccountId) {
        await tx.bankAccount.update({
          where: { id: bankAccountId },
          data: {
            currentBalance: {
              decrement: totalAmount
            }
          }
        });
      }
    });

    await auditService.log(req.userId, 'PAY', 'AccountPayable', id, { 
      totalAmount, 
      paymentDate 
    });

    res.json({ message: 'Pagamento registrado com sucesso' });
  }

  /**
   * Deleta conta a pagar
   */
  async deletePayable(req, res) {
    const { id } = req.params;

    const payable = await prisma.accountPayable.findFirst({
      where: { id, companyId: req.companyId }
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

  /**
   * Lista contas a receber
   */
  async listReceivables(req, res) {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: req.companyId,
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
        orderBy: { dueDate: 'asc' },
        include: {
          customer: {
            select: { id: true, name: true }
          },
          sale: {
            select: { id: true, saleNumber: true }
          },
          category: {
            select: { id: true, name: true, color: true }
          }
        }
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

  /**
   * Cria conta a receber
   */
  async createReceivable(req, res) {
    const data = {
      ...req.body,
      companyId: req.companyId,
    };

    const receivable = await prisma.accountReceivable.create({
      data,
      include: {
        customer: true,
        category: true
      }
    });

    await auditService.log(req.userId, 'CREATE', 'AccountReceivable', receivable.id, data);

    res.status(201).json({
      message: 'Conta a receber criada com sucesso',
      receivable
    });
  }

  /**
   * Atualiza conta a receber
   */
  async updateReceivable(req, res) {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.accountReceivable.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Conta não encontrada', 404);
    }

    const receivable = await prisma.accountReceivable.update({
      where: { id },
      data,
      include: {
        customer: true,
        category: true
      }
    });

    await auditService.log(req.userId, 'UPDATE', 'AccountReceivable', id, data);

    res.json({
      message: 'Conta atualizada com sucesso',
      receivable
    });
  }

  /**
   * Registra recebimento
   */
  async receiveReceivable(req, res) {
    const { id } = req.params;
    const { paymentDate, paymentMethod, discount, fine, interest, bankAccountId } = req.body;

    const receivable = await prisma.accountReceivable.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!receivable) {
      throw new AppError('Conta não encontrada', 404);
    }

    if (receivable.status === 'PAID') {
      throw new AppError('Conta já foi recebida', 400);
    }

    const totalAmount = parseFloat(receivable.amount) 
      - (discount || 0) 
      + (fine || 0) 
      + (interest || 0);

    // Atualiza em transação
    await prisma.$transaction(async (tx) => {
      // Atualiza conta
      await tx.accountReceivable.update({
        where: { id },
        data: {
          status: 'PAID',
          paymentDate: new Date(paymentDate),
          paymentMethod,
          discount,
          fine,
          interest
        }
      });

      // Registra transação
      await tx.transaction.create({
        data: {
          companyId: req.companyId,
          bankAccountId,
          categoryId: receivable.categoryId,
          type: 'INCOME',
          description: receivable.description,
          amount: totalAmount,
          date: new Date(paymentDate),
          paymentMethod,
          document: receivable.document
        }
      });

      // Atualiza saldo da conta bancária
      if (bankAccountId) {
        await tx.bankAccount.update({
          where: { id: bankAccountId },
          data: {
            currentBalance: {
              increment: totalAmount
            }
          }
        });
      }

      // Atualiza venda se vinculada
      if (receivable.saleId) {
        const sale = await tx.sale.findUnique({
          where: { id: receivable.saleId },
          include: { receivables: true }
        });

        const allPaid = sale.receivables.every(r => 
          r.id === id || r.status === 'PAID'
        );

        if (allPaid) {
          await tx.sale.update({
            where: { id: receivable.saleId },
            data: { status: 'PAID' }
          });
        }
      }
    });

    await auditService.log(req.userId, 'RECEIVE', 'AccountReceivable', id, { 
      totalAmount, 
      paymentDate 
    });

    res.json({ message: 'Recebimento registrado com sucesso' });
  }

  /**
   * Deleta conta a receber
   */
  async deleteReceivable(req, res) {
    const { id } = req.params;

    const receivable = await prisma.accountReceivable.findFirst({
      where: { id, companyId: req.companyId }
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

  /**
   * Lista transações
   */
  async listTransactions(req, res) {
    const { page = 1, limit = 50, type, startDate, endDate, bankAccountId } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: req.companyId,
      ...(type && { type }),
      ...(bankAccountId && { bankAccountId }),
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'desc' },
        include: {
          category: {
            select: { id: true, name: true, color: true }
          },
          bankAccount: {
            select: { id: true, bankName: true, account: true }
          }
        }
      }),
      prisma.transaction.count({ where })
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

  /**
   * Cria transação manual
   */
  async createTransaction(req, res) {
    const data = {
      ...req.body,
      companyId: req.companyId,
    };

    const transaction = await prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data,
        include: {
          category: true,
          bankAccount: true
        }
      });

      // Atualiza saldo da conta bancária
      if (data.bankAccountId) {
        await tx.bankAccount.update({
          where: { id: data.bankAccountId },
          data: {
            currentBalance: {
              [data.type === 'INCOME' ? 'increment' : 'decrement']: data.amount
            }
          }
        });
      }

      return newTransaction;
    });

    await auditService.log(req.userId, 'CREATE', 'Transaction', transaction.id, data);

    res.status(201).json({
      message: 'Transação criada com sucesso',
      transaction
    });
  }

  /**
   * Fluxo de caixa
   */
  async cashFlow(req, res) {
    const { startDate, endDate } = req.query;

    const where = {
      companyId: req.companyId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'asc' },
      select: {
        date: true,
        type: true,
        amount: true,
        description: true,
        category: {
          select: { name: true, color: true }
        }
      }
    });

    // Agrupa por dia
    const cashFlow = transactions.reduce((acc, trans) => {
      const date = trans.date.toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          income: 0,
          expense: 0,
          balance: 0,
          transactions: []
        };
      }

      if (trans.type === 'INCOME') {
        acc[date].income += parseFloat(trans.amount);
      } else {
        acc[date].expense += parseFloat(trans.amount);
      }

      acc[date].transactions.push(trans);

      return acc;
    }, {});

    // Calcula saldo acumulado
    let accumulatedBalance = 0;
    const cashFlowArray = Object.values(cashFlow).map(day => {
      day.balance = day.income - day.expense;
      accumulatedBalance += day.balance;
      day.accumulatedBalance = accumulatedBalance;
      return day;
    });

    res.json({ cashFlow: cashFlowArray });
  }

  /**
   * Dashboard financeiro
   */
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
      overduePayables,
      bankAccounts
    ] = await Promise.all([
      // Total receitas
      prisma.transaction.aggregate({
        where: {
          companyId: req.companyId,
          type: 'INCOME',
          ...(dateFilter && { date: dateFilter })
        },
        _sum: { amount: true }
      }),

      // Total despesas
      prisma.transaction.aggregate({
        where: {
          companyId: req.companyId,
          type: 'EXPENSE',
          ...(dateFilter && { date: dateFilter })
        },
        _sum: { amount: true }
      }),

      // Contas a receber pendentes
      prisma.accountReceivable.aggregate({
        where: {
          companyId: req.companyId,
          status: 'PENDING'
        },
        _sum: { amount: true },
        _count: true
      }),

      // Contas a pagar pendentes
      prisma.accountPayable.aggregate({
        where: {
          companyId: req.companyId,
          status: 'PENDING'
        },
        _sum: { amount: true },
        _count: true
      }),

      // Contas a receber vencidas
      prisma.accountReceivable.aggregate({
        where: {
          companyId: req.companyId,
          status: 'PENDING',
          dueDate: { lt: new Date() }
        },
        _sum: { amount: true },
        _count: true
      }),

      // Contas a pagar vencidas
      prisma.accountPayable.aggregate({
        where: {
          companyId: req.companyId,
          status: 'PENDING',
          dueDate: { lt: new Date() }
        },
        _sum: { amount: true },
        _count: true
      }),

      // Saldos das contas bancárias
      prisma.bankAccount.findMany({
        where: {
          companyId: req.companyId,
          active: true
        },
        select: {
          id: true,
          bankName: true,
          account: true,
          currentBalance: true
        }
      })
    ]);

    const totalBalance = bankAccounts.reduce(
      (sum, acc) => sum + parseFloat(acc.currentBalance),
      0
    );

    res.json({
      income: totalIncome._sum.amount || 0,
      expense: totalExpense._sum.amount || 0,
      balance: (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0),
      totalBalance,
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
      },
      bankAccounts
    });
  }
}

module.exports = new FinancialController();