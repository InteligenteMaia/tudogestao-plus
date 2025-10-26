// ⚙️ Rubens Neto - Backend Developer
// Rotas de vendas

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { canSell } = require('../middleware/permission.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);

router.get('/', asyncHandler(saleController.list.bind(saleController)));
router.get('/stats', asyncHandler(saleController.stats.bind(saleController)));
router.get('/:id', asyncHandler(saleController.getById.bind(saleController)));

router.post('/',
  canSell,
  [
    body('customerId').notEmpty().withMessage('Cliente obrigatório'),
    body('items').isArray({ min: 1 }).withMessage('Adicione pelo menos um item'),
    body('items.*.productId').notEmpty().withMessage('Produto obrigatório'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade inválida'),
    body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Preço inválido'),
    validate
  ],
  asyncHandler(saleController.create.bind(saleController))
);

router.put('/:id/status',
  [
    body('status').isIn(['PENDING', 'PAID', 'PARTIAL', 'CANCELLED']).withMessage('Status inválido'),
    validate
  ],
  asyncHandler(saleController.updateStatus.bind(saleController))
);

router.post('/:id/cancel', asyncHandler(saleController.cancel.bind(saleController)));

module.exports = router;