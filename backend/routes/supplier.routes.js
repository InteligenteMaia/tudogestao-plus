// 🔧 Thaynara Ribeiro - Full Stack
// Rotas de fornecedores

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);

router.get('/', asyncHandler(supplierController.list.bind(supplierController)));
router.get('/:id', asyncHandler(supplierController.getById.bind(supplierController)));

router.post('/',
  [
    body('cnpj').notEmpty().withMessage('CNPJ obrigatório'),
    body('name').notEmpty().withMessage('Nome obrigatório'),
    validate
  ],
  asyncHandler(supplierController.create.bind(supplierController))
);

router.put('/:id', asyncHandler(supplierController.update.bind(supplierController)));
router.delete('/:id', asyncHandler(supplierController.delete.bind(supplierController)));

module.exports = router;