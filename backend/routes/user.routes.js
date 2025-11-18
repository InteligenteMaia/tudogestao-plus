// ⚙️ Rubens Neto - Backend Developer
// Rotas de usuários

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/permission.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);
router.use(isAdmin);

router.get('/', asyncHandler(userController.list.bind(userController)));
router.get('/:id', asyncHandler(userController.getById.bind(userController)));

router.post('/',
  [
    body('name').notEmpty().withMessage('Nome obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('role').isIn(['ADMIN', 'MANAGER', 'SALESPERSON', 'FINANCIAL', 'USER', 'VIEWER']).withMessage('Role inválida'),
    validate
  ],
  asyncHandler(userController.create.bind(userController))
);

router.put('/:id', asyncHandler(userController.update.bind(userController)));
router.put('/:id/toggle-status', asyncHandler(userController.toggleStatus.bind(userController)));
router.delete('/:id', asyncHandler(userController.delete.bind(userController)));

router.put('/:id/reset-password', asyncHandler(userController.resetPassword.bind(userController)));

module.exports = router;