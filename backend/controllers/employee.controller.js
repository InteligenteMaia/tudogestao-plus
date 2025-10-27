// 🔧 Thaynara Ribeiro - Full Stack
// Controller de funcionários

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

class EmployeeController {
  async create(req, res) {
    try {
      const { name, email, password, cpf, phone, role, salary, address } = req.body;
      const { companyId } = req.user;

      // Verificar se email já existe
      const existingEmployee = await prisma.employee.findFirst({
        where: { email, companyId }
      });

      if (existingEmployee) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      const employee = await prisma.employee.create({
        data: {
          companyId,
          name,
          email,
          password: hashedPassword,
          cpf,
          phone,
          role,
          salary: parseFloat(salary),
          address,
          active: true
        }
      });

      // Remover senha da resposta
      const { password: _, ...employeeWithoutPassword } = employee;

      res.status(201).json(employeeWithoutPassword);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao criar funcionário' });
    }
  }

  async list(req, res) {
    try {
      const { companyId } = req.user;
      const { page = 1, limit = 20, search, role } = req.query;

      const where = {
        companyId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { cpf: { contains: search } }
          ]
        }),
        ...(role && { role })
      };

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          where,
          skip: (page - 1) * limit,
          take: parseInt(limit),
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            email: true,
            cpf: true,
            phone: true,
            role: true,
            salary: true,
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
      const { companyId } = req.user;

      const employee = await prisma.employee.findFirst({
        where: { id, companyId },
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true,
          role: true,
          salary: true,
          address: true,
          active: true,
          createdAt: true
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
      const { companyId } = req.user;
      const updateData = req.body;

      const employee = await prisma.employee.findFirst({
        where: { id, companyId }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      // Se está atualizando senha, fazer hash
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      // Se está atualizando salário, converter para float
      if (updateData.salary) {
        updateData.salary = parseFloat(updateData.salary);
      }

      const updated = await prisma.employee.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true,
          role: true,
          salary: true,
          address: true,
          active: true,
          createdAt: true
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
      const { companyId } = req.user;

      const employee = await prisma.employee.findFirst({
        where: { id, companyId }
      });

      if (!employee) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      await prisma.employee.delete({ where: { id } });

      res.json({ message: 'Funcionário excluído com sucesso' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao excluir funcionário' });
    }
  }
}

module.exports = new EmployeeController();