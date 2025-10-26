// 🔧 Thaynara Ribeiro - Full Stack
// Rotas de produtos

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);

router.get('/', asyncHandler(productController.list.bind(productController)));
router.get('/low-stock', asyncHandler(productController.lowStock.bind(productController)));
router.get('/:id', asyncHandler(productController.getById.bind(productController)));

router.post('/',
  [
    body('sku').notEmpty().withMessage('SKU obrigatório'),
    body('name').notEmpty().withMessage('Nome obrigatório'),
    body('unitPrice').isFloat({ min: 0 }).withMessage('Preço inválido'),
    validate
  ],
  asyncHandler(productController.create.bind(productController))
);

router.put('/:id', asyncHandler(productController.update.bind(productController)));
router.delete('/:id', asyncHandler(productController.delete.bind(productController)));

router.post('/:id/adjust-stock',
  [
    body('quantity').isInt().withMessage('Quantidade inválida'),
    body('type').isIn(['ENTRY', 'EXIT', 'ADJUSTMENT']).withMessage('Tipo inválido'),
    validate
  ],
  asyncHandler(productController.adjustStock.bind(productController))
);

module.exports = router;