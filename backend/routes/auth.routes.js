// ⚙️ Rubens Neto - Backend Developer
// Rotas de autenticação

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuário
 * @access  Public
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha obrigatória'),
    validate
  ],
  asyncHandler(authController.login.bind(authController))
);

/**
 * @route   POST /api/auth/register
 * @desc    Registro de nova empresa e usuário admin
 * @access  Public
 */
router.post('/register',
  [
    body('companyName').notEmpty().withMessage('Nome da empresa obrigatório'),
    body('cnpj').isLength({ min: 14, max: 18 }).withMessage('CNPJ inválido'),
    body('userName').notEmpty().withMessage('Nome do usuário obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    validate
  ],
  asyncHandler(authController.register.bind(authController))
);

/**
 * @route   GET /api/auth/me
 * @desc    Retorna dados do usuário logado
 * @access  Private
 */
router.get('/me',
  authMiddleware,
  asyncHandler(authController.me.bind(authController))
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Altera senha do usuário
 * @access  Private
 */
router.put('/change-password',
  authMiddleware,
  [
    body('currentPassword').notEmpty().withMessage('Senha atual obrigatória'),
    body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres'),
    validate
  ],
  asyncHandler(authController.changePassword.bind(authController))
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (apenas log de auditoria)
 * @access  Private
 */
router.post('/logout',
  authMiddleware,
  asyncHandler(authController.logout.bind(authController))
);

module.exports = router;