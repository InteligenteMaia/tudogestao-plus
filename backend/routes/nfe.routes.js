// 🚀 Eliseu Junior - Full Stack
// Rotas de Nota Fiscal Eletrônica

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const nfeController = require('../controllers/nfe.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { isManager } = require('../middleware/permission.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);

router.get('/', asyncHandler(nfeController.list.bind(nfeController)));
router.get('/:id', asyncHandler(nfeController.getById.bind(nfeController)));

router.post('/issue',
  isManager,
  [
    body('saleId').notEmpty().withMessage('Venda obrigatória'),
    validate
  ],
  asyncHandler(nfeController.issue.bind(nfeController))
);

router.post('/:id/cancel',
  isManager,
  [
    body('reason').notEmpty().withMessage('Motivo obrigatório'),
    validate
  ],
  asyncHandler(nfeController.cancel.bind(nfeController))
);

router.get('/:id/xml', asyncHandler(nfeController.downloadXML.bind(nfeController)));
router.get('/:id/pdf', asyncHandler(nfeController.downloadPDF.bind(nfeController)));

module.exports = router;