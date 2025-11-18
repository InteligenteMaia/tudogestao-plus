// ⚙️ Rubens Neto - Backend Developer
// Controller de usuários

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class UserController {
  /**
   * Lista usuários da empresa
   */
  async list(req, res) {
    const users = await prisma.user.findMany({
      where: {
        companyId: req.companyId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        phone: true,
        avatar: true,
        createdAt: true,
        lastLogin: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({ users });
  }

  /**
   * Busca usuário por ID
   */
  async getById(req, res) {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: { 
        id,
        companyId: req.companyId 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        phone: true,
        avatar: true,
        createdAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json(user);
  }

  /**
   * Cria usuário
   */
  async create(req, res) {
    const { name, email, password, role, phone } = req.body;

    // Verifica se email já existe
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      throw new AppError('Email já cadastrado', 409);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        companyId: req.companyId,
        active: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true
      }
    });

    await auditService.log(req.userId, 'CREATE', 'User', user.id);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user
    });
  }

  /**
   * Atualiza usuário
   */
  async update(req, res) {
    const { id } = req.params;
    const { name, email, role, phone, active } = req.body;

    const existing = await prisma.user.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verifica se email já existe em outro usuário
    if (email && email !== existing.email) {
      const duplicate = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id }
        }
      });

      if (duplicate) {
        throw new AppError('Email já cadastrado', 409);
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        phone,
        active
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        phone: true
      }
    });

    await auditService.log(req.userId, 'UPDATE', 'User', id);

    res.json({
      message: 'Usuário atualizado com sucesso',
      user
    });
  }

  /**
   * Alterna status do usuário (ativo/inativo)
   */
  async toggleStatus(req, res) {
    const { id } = req.params;

    // Não pode desativar a si mesmo
    if (id === req.userId) {
      throw new AppError('Você não pode alterar o status da sua própria conta', 400);
    }

    const user = await prisma.user.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { active: !user.active },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true
      }
    });

    await auditService.log(req.userId, 'TOGGLE_STATUS', 'User', id);

    res.json({
      message: `Usuário ${updatedUser.active ? 'ativado' : 'desativado'} com sucesso`,
      user: updatedUser
    });
  }

  /**
   * Deleta usuário
   */
  async delete(req, res) {
    const { id } = req.params;

    // Não pode deletar a si mesmo
    if (id === req.userId) {
      throw new AppError('Você não pode excluir sua própria conta', 400);
    }

    const user = await prisma.user.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    await prisma.user.delete({ where: { id } });

    await auditService.log(req.userId, 'DELETE', 'User', id);

    res.json({ message: 'Usuário excluído com sucesso' });
  }

  /**
   * Reseta senha do usuário (gera senha temporária)
   */
  async resetPassword(req, res) {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Gera senha temporária de 8 caracteres
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    await auditService.log(req.userId, 'RESET_PASSWORD', 'User', id);

    res.json({
      message: `Senha resetada com sucesso. Nova senha temporária: ${tempPassword}`,
      tempPassword
    });
  }
}

module.exports = new UserController();