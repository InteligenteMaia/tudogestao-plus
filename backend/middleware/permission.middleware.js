// ⚙️ Rubens Neto - Backend Developer
// Middleware de controle de permissões por role

/**
 * Verifica se o usuário tem permissão para acessar o recurso
 * @param {Array} allowedRoles - Roles permitidas
 */
const checkPermission = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // ADMIN tem acesso a tudo
    if (userRole === 'ADMIN') {
      return next();
    }

    // Verifica se a role do usuário está nas permitidas
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        message: 'Você não tem permissão para acessar este recurso'
      });
    }

    next();
  };
};

/**
 * Verifica se usuário é ADMIN
 */
const isAdmin = checkPermission(['ADMIN']);

/**
 * Verifica se usuário é ADMIN ou MANAGER
 */
const isManager = checkPermission(['ADMIN', 'MANAGER']);

/**
 * Verifica se usuário pode acessar recursos financeiros
 */
const canAccessFinancial = checkPermission(['ADMIN', 'MANAGER', 'FINANCIAL']);

/**
 * Verifica se usuário pode fazer vendas
 */
const canSell = checkPermission(['ADMIN', 'MANAGER', 'SALESPERSON']);

module.exports = {
  checkPermission,
  isAdmin,
  isManager,
  canAccessFinancial,
  canSell,
};