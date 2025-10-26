// ⚙️ Rubens Neto - Backend Developer
// Serviço de auditoria - Registra todas as ações importantes

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class AuditService {
  /**
   * Registra uma ação no log de auditoria
   * @param {string} userId - ID do usuário que executou a ação
   * @param {string} action - Ação executada (CREATE, UPDATE, DELETE, etc)
   * @param {string} entity - Entidade afetada
   * @param {string} entityId - ID da entidade
   * @param {object} details - Detalhes adicionais
   */
  async log(userId, action, entity, entityId = null, details = null) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          details: details || {}
        }
      });
    } catch (error) {
      // Não deve bloquear a operação principal se auditoria falhar
      console.error('❌ Erro ao criar log de auditoria:', error);
    }
  }

  /**
   * Busca histórico de auditoria
   * @param {object} filters - Filtros de busca
   * @returns {Promise<Array>} Logs de auditoria
   */
  async getHistory(filters = {}) {
    const { userId, entity, entityId, action, startDate, endDate, limit = 100 } = filters;

    const where = {};

    if (userId) where.userId = userId;
    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    return await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  /**
   * Limpa logs antigos (mais de 1 ano)
   */
  async cleanup() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const deleted = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: oneYearAgo
        }
      }
    });

    console.log(`🗑️ ${deleted.count} logs de auditoria antigos removidos`);
    return deleted.count;
  }
}

module.exports = new AuditService();