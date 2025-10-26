// 🔧 Thaynara Ribeiro - Full Stack
// Rotas de categorias

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);

router.get('/', asyncHandler(categoryController.list.bind(categoryController)));
router.get('/:id', asyncHandler(categoryController.getById.bind(categoryController)));

router.post('/',
  [
    body('name').notEmpty().withMessage('Nome obrigatório'),
    body('type').isIn(['INCOME', 'EXPENSE', 'PRODUCT']).withMessage('Tipo inválido'),
    validate
  ],
  asyncHandler(categoryController.create.bind(categoryController))
);

router.put('/:id', asyncHandler(categoryController.update.bind(categoryController)));
router.delete('/:id', asyncHandler(categoryController.delete.bind(categoryController)));

module.exports = router;