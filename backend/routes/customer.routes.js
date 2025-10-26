// 🔧 Thaynara Ribeiro - Full Stack
// Rotas de clientes

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @route   GET /api/customers
 * @desc    Lista clientes
 * @access  Private
 */
router.get('/',
  asyncHandler(customerController.list.bind(customerController))
);

/**
 * @route   GET /api/customers/:id
 * @desc    Busca cliente por ID
 * @access  Private
 */
router.get('/:id',
  asyncHandler(customerController.getById.bind(customerController))
);

/**
 * @route   POST /api/customers
 * @desc    Cria cliente
 * @access  Private
 */
router.post('/',
  [
    body('type').isIn(['INDIVIDUAL', 'COMPANY']).withMessage('Tipo inválido'),
    body('cpfCnpj').notEmpty().withMessage('CPF/CNPJ obrigatório'),
    body('name').notEmpty().withMessage('Nome obrigatório'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    validate
  ],
  asyncHandler(customerController.create.bind(customerController))
);

/**
 * @route   PUT /api/customers/:id
 * @desc    Atualiza cliente
 * @access  Private
 */
router.put('/:id',
  asyncHandler(customerController.update.bind(customerController))
);

/**
 * @route   DELETE /api/customers/:id
 * @desc    Deleta cliente
 * @access  Private
 */
router.delete('/:id',
  asyncHandler(customerController.delete.bind(customerController))
);

/**
 * @route   GET /api/customers/:id/history
 * @desc    Histórico do cliente
 * @access  Private
 */
router.get('/:id/history',
  asyncHandler(customerController.history.bind(customerController))
);

module.exports = router;