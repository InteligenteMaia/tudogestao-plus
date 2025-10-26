// ⚙️ Rubens Neto - Backend Developer
// Middleware de validação de dados

const { validationResult } = require('express-validator');

/**
 * Valida os dados da requisição usando express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

/**
 * Valida se o companyId do recurso pertence ao usuário
 */
const validateCompanyOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const resourceId = req.params.id;
      const userCompanyId = req.companyId;

      const resource = await prisma[model].findUnique({
        where: { id: resourceId },
        select: { companyId: true }
      });

      if (!resource) {
        return res.status(404).json({ error: 'Recurso não encontrado' });
      }

      if (resource.companyId !== userCompanyId) {
        return res.status(403).json({ 
          error: 'Acesso negado',
          message: 'Este recurso não pertence à sua empresa'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao validar propriedade' });
    }
  };
};

module.exports = {
  validate,
  validateCompanyOwnership
};