// ⚙️ Rubens Neto - Backend Developer
// Controller de autenticação

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

class AuthController {
  /**
   * Login de usuário
   */
  async login(req, res) {
    const { email, password } = req.body;

    // Busca usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            cnpj: true,
            active: true,
          }
        }
      }
    });

    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    if (!user.active) {
      throw new AppError('Usuário inativo', 401);
    }

    if (!user.company.active) {
      throw new AppError('Empresa inativa', 401);
    }

    // Verifica senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    // Gera token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Atualiza último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Log de auditoria
    await auditService.log(user.id, 'LOGIN', 'User', user.id, {
      email: user.email,
      ip: req.ip
    });

    // Remove senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: userWithoutPassword
    });
  }

  /**
   * Registro de novo usuário (primeiro acesso da empresa)
   */
  async register(req, res) {
    const { 
      companyName, 
      cnpj, 
      userName, 
      email, 
      password 
    } = req.body;

    // Verifica se empresa já existe
    const existingCompany = await prisma.company.findUnique({
      where: { cnpj }
    });

    if (existingCompany) {
      throw new AppError('CNPJ já cadastrado', 409);
    }

    // Verifica se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('Email já cadastrado', 409);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria empresa e usuário admin em transação
    const result = await prisma.$transaction(async (tx) => {
      // Cria empresa
      const company = await tx.company.create({
        data: {
          name: companyName,
          cnpj,
          active: true,
        }
      });

      // Cria usuário admin
      const user = await tx.user.create({
        data: {
          name: userName,
          email,
          password: hashedPassword,
          role: 'ADMIN',
          companyId: company.id,
          active: true,
        }
      });

      // Cria categorias padrão
      await tx.category.createMany({
        data: [
          { companyId: company.id, name: 'Vendas', type: 'INCOME', color: '#34C759' },
          { companyId: company.id, name: 'Serviços', type: 'INCOME', color: '#0071E3' },
          { companyId: company.id, name: 'Fornecedores', type: 'EXPENSE', color: '#FF3B30' },
          { companyId: company.id, name: 'Salários', type: 'EXPENSE', color: '#FF9500' },
          { companyId: company.id, name: 'Impostos', type: 'EXPENSE', color: '#AF52DE' },
          { companyId: company.id, name: 'Eletrônicos', type: 'PRODUCT', color: '#0071E3' },
          { companyId: company.id, name: 'Alimentos', type: 'PRODUCT', color: '#34C759' },
        ]
      });

      return { company, user };
    });

    // Gera token
    const token = jwt.sign(
      { 
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        companyId: result.company.id
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove senha
    const { password: _, ...userWithoutPassword } = result.user;

    res.status(201).json({
      message: 'Conta criada com sucesso',
      token,
      user: userWithoutPassword,
      company: result.company
    });
  }

  /**
   * Retorna dados do usuário logado
   */
  async me(req, res) {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        avatar: true,
        phone: true,
        createdAt: true,
        lastLogin: true,
        company: {
          select: {
            id: true,
            name: true,
            cnpj: true,
            email: true,
            phone: true,
            logo: true,
          }
        }
      }
    });

    res.json(user);
  }

  /**
   * Altera senha do usuário
   */
  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    // Verifica senha atual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('Senha atual incorreta', 401);
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza senha
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword }
    });

    // Log de auditoria
    await auditService.log(req.userId, 'PASSWORD_CHANGE', 'User', req.userId);

    res.json({ message: 'Senha alterada com sucesso' });
  }

  /**
   * Logout (apenas para log de auditoria)
   */
  async logout(req, res) {
    await auditService.log(req.userId, 'LOGOUT', 'User', req.userId);
    res.json({ message: 'Logout realizado com sucesso' });
  }
}

module.exports = new AuthController();