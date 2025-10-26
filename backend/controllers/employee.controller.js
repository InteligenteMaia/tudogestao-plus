// 🔧 Thaynara Ribeiro - Full Stack
// Controller de funcionários

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class EmployeeController {
  /**
   * Lista funcionários
   */
  async list(req, res) {
    const { page = 1, limit = 20, search, active } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      companyId: req.companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { cpf: { contains: search } },
        ]
      }),
      ...(active !== undefined && { active: active === 'true' }),
    };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' }
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  /**
   * Busca funcionário por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const employee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: req.companyId 
      },
      include: {
        payrolls: {
          orderBy: { referenceMonth: 'desc' },
          take: 6
        }
      }
    });

    if (!employee) {
      throw new AppError('Funcionário não encontrado', 404);
    }

    res.json(employee);
  }

  /**
   * Cria funcionário
   */
  async create(req, res) {
    const data = {
      ...req.body,
      companyId: req.companyId,
    };

    // Verifica se CPF já existe
    const existing = await prisma.employee.findFirst({
      where: { cpf: data.cpf }
    });

    if (existing) {
      throw new AppError('CPF já cadastrado', 409);
    }

    const employee = await prisma.employee.create({
      data
    });

    await auditService.log(req.userId, 'CREATE', 'Employee', employee.id, data);

    res.status(201).json({
      message: 'Funcionário criado com sucesso',
      employee
    });
  }

  /**
   * Atualiza funcionário
   */
  async update(req, res) {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.employee.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Funcionário não encontrado', 404);
    }

    const employee = await prisma.employee.update({
      where: { id },
      data
    });

    await auditService.log(req.userId, 'UPDATE', 'Employee', id, data);

    res.json({
      message: 'Funcionário atualizado com sucesso',
      employee
    });
  }

  /**
   * Deleta funcionário
   */
  async delete(req, res) {
    const { id } = req.params;

    const employee = await prisma.employee.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!employee) {
      throw new AppError('Funcionário não encontrado', 404);
    }

    await prisma.employee.delete({ where: { id } });

    await auditService.log(req.userId, 'DELETE', 'Employee', id);

    res.json({ message: 'Funcionário excluído com sucesso' });
  }

  /**
   * Gera folha de pagamento
   */
  async generatePayroll(req, res) {
    const { employeeId, referenceMonth, benefits, deductions } = req.body;

    const employee = await prisma.employee.findFirst({
      where: { 
        id: employeeId,
        companyId: req.companyId 
      }
    });

    if (!employee) {
      throw new AppError('Funcionário não encontrado', 404);
    }

    // Calcula descontos (INSS, IRRF, FGTS)
    const grossSalary = parseFloat(employee.salary);
    const inss = calculateINSS(grossSalary);
    const irrf = calculateIRRF(grossSalary - inss);
    const fgts = grossSalary * 0.08; // 8%

    const netSalary = grossSalary 
      - inss 
      - irrf 
      + (benefits || 0) 
      - (deductions || 0);

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        referenceMonth: new Date(referenceMonth),
        grossSalary,
        inss,
        irrf,
        fgts,
        benefits,
        deductions,
        netSalary,
        status: 'PENDING'
      }
    });

    await auditService.log(req.userId, 'GENERATE_PAYROLL', 'Payroll', payroll.id);

    res.status(201).json({
      message: 'Folha de pagamento gerada com sucesso',
      payroll
    });
  }

  /**
   * Pagar folha
   */
  async payPayroll(req, res) {
    const { id } = req.params;
    const { paymentDate } = req.body;

    const payroll = await prisma.payroll.findUnique({
      where: { id }
    });

    if (!payroll) {
      throw new AppError('Folha não encontrada', 404);
    }

    if (payroll.status === 'PAID') {
      throw new AppError('Folha já foi paga', 400);
    }

    await prisma.payroll.update({
      where: { id },
      data: {
        status: 'PAID',
        paymentDate: new Date(paymentDate)
      }
    });

    await auditService.log(req.userId, 'PAY_PAYROLL', 'Payroll', id);

    res.json({ message: 'Pagamento registrado com sucesso' });
  }
}

// Funções de cálculo (simplificadas - usar tabelas oficiais em produção)
function calculateINSS(salary) {
  if (salary <= 1320) return salary * 0.075;
  if (salary <= 2571.29) return salary * 0.09;
  if (salary <= 3856.94) return salary * 0.12;
  if (salary <= 7507.49) return salary * 0.14;
  return 7507.49 * 0.14; // Teto
}

function calculateIRRF(baseCalculo) {
  if (baseCalculo <= 2112) return 0;
  if (baseCalculo <= 2826.65) return baseCalculo * 0.075 - 158.40;
  if (baseCalculo <= 3751.05) return baseCalculo * 0.15 - 370.40;
  if (baseCalculo <= 4664.68) return baseCalculo * 0.225 - 651.73;
  return baseCalculo * 0.275 - 884.96;
}

module.exports = new EmployeeController();