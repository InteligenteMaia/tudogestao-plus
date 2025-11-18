// 🔧 Thaynara Ribeiro - Full Stack
// Controller de funcionários

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EmployeeController {
  async create(req, res) {
    try {
      const {
        cpf,
        name,
        email,
        phone,
        position,
        department,
        salary,
        admissionDate,
        address
      } = req.body;
      const companyId = req.companyId;

      // Verificar se CPF já existe
      const existingEmployee = await prisma.employee.findUnique({
        where: { cpf }
      });

      if (existingEmployee) {
        return res.status(409).json({ error: 'CPF já cadastrado' });
      }

      const employee = await prisma.employee.create({
        data: {
          companyId,
          cpf,
          name,
          email,
          phone,
          position,
          department,
          salary: parseFloat(salary),
          admissionDate: new Date(admissionDate),
          address,
          active: true
        }
      });

      res.status(201).json(employee);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao criar funcionário' });
    }
  }

  async list(req, res) {
    try {
      const companyId = req.companyId;
      const { page = 1, limit = 20, search, position, active } = req.query;

      const where = {
        companyId,
        ...(active !== undefined && { active: active === 'true' }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { cpf: { contains: search } },
            { position: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(position && { position })
      };

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          where,
          skip: (page - 1) * limit,
          take: parseInt(limit),
          orderBy: { name: 'asc' },
          select: {
            id: true,
            cpf: true,
            name: true,
            email: true,
            phone: true,
            position: true,
            department: true,
            salary: true,
            admissionDate: true,
            active: true,
            createdAt: true
          }
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
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao listar funcionários' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.companyId;

      const employee = await prisma.employee.findFirst({
        where: { id, companyId },
        include: {
          payrolls: {
            orderBy: { referenceMonth: 'desc' },
            take: 6
          }
        }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      res.json(employee);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.companyId;
      const {
        cpf,
        name,
        email,
        phone,
        position,
        department,
        salary,
        admissionDate,
        dismissalDate,
        address,
        active
      } = req.body;

      const employee = await prisma.employee.findFirst({
        where: { id, companyId }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      // Se mudou CPF, verifica duplicação
      if (cpf && cpf !== employee.cpf) {
        const existing = await prisma.employee.findUnique({
          where: { cpf }
        });

        if (existing) {
          return res.status(409).json({ error: 'CPF já cadastrado' });
        }
      }

      const updated = await prisma.employee.update({
        where: { id },
        data: {
          ...(cpf && { cpf }),
          ...(name && { name }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
          ...(position && { position }),
          ...(department !== undefined && { department }),
          ...(salary && { salary: parseFloat(salary) }),
          ...(admissionDate && { admissionDate: new Date(admissionDate) }),
          ...(dismissalDate !== undefined && {
            dismissalDate: dismissalDate ? new Date(dismissalDate) : null
          }),
          ...(address !== undefined && { address }),
          ...(active !== undefined && { active })
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.companyId;

      const employee = await prisma.employee.findFirst({
        where: { id, companyId },
        include: {
          _count: {
            select: { payrolls: true }
          }
        }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      if (employee._count.payrolls > 0) {
        return res.status(400).json({
          error: 'Não é possível excluir funcionário com folhas de pagamento vinculadas'
        });
      }

      await prisma.employee.delete({ where: { id } });

      res.json({ message: 'Funcionário excluído com sucesso' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao excluir funcionário' });
    }
  }

  async dismiss(req, res) {
    try {
      const { id } = req.params;
      const { dismissalDate } = req.body;
      const companyId = req.companyId;

      const employee = await prisma.employee.findFirst({
        where: { id, companyId }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      if (employee.dismissalDate) {
        return res.status(400).json({ error: 'Funcionário já foi demitido' });
      }

      const updated = await prisma.employee.update({
        where: { id },
        data: {
          dismissalDate: new Date(dismissalDate),
          active: false
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao demitir funcionário' });
    }
  }
}

module.exports = new EmployeeController();
