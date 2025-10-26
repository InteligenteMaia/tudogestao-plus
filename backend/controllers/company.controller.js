// ⚙️ Rubens Neto - Backend Developer
// Controller de empresa

const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error.middleware');
const auditService = require('../services/audit.service');

const prisma = new PrismaClient();

class CompanyController {
  /**
   * Retorna dados da empresa
   */
  async get(req, res) {
    const company = await prisma.company.findUnique({
      where: { id: req.companyId }
    });

    if (!company) {
      throw new AppError('Empresa não encontrada', 404);
    }

    res.json(company);
  }

  /**
   * Atualiza dados da empresa
   */
  async update(req, res) {
    const data = req.body;

    const company = await prisma.company.update({
      where: { id: req.companyId },
      data
    });

    await auditService.log(req.userId, 'UPDATE', 'Company', req.companyId, data);

    res.json({
      message: 'Empresa atualizada com sucesso',
      company
    });
  }

  /**
   * Upload de logo
   */
  async uploadLogo(req, res) {
    if (!req.file) {
      throw new AppError('Nenhum arquivo enviado', 400);
    }

    const logoPath = `/uploads/${req.file.filename}`;

    const company = await prisma.company.update({
      where: { id: req.companyId },
      data: { logo: logoPath }
    });

    res.json({
      message: 'Logo atualizada com sucesso',
      logo: logoPath
    });
  }
}

module.exports = new CompanyController();