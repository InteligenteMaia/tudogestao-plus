// 💼 Larissa Oliveira - Product Manager
// ⚙️ Rubens Neto - Backend Developer
// Rotas financeiras

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const financialController = require('../controllers/financial.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { canAccessFinancial } = require('../middleware/permission.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);
router.use(canAccessFinancial);

// ========== CONTAS A PAGAR ==========
router.get('/payables', asyncHandler(financialController.listPayables.bind(financialController)));

router.post('/payables',
  [
    body('description').notEmpty().withMessage('Descrição obrigatória'),
    body('amount').isFloat({ min: 0 }).withMessage('Valor inválido'),
    body('dueDate').isISO8601().withMessage('Data de vencimento inválida'),
    validate
  ],
  asyncHandler(financialController.createPayable.bind(financialController))
);

router.put('/payables/:id', asyncHandler(financialController.updatePayable.bind(financialController)));
router.delete('/payables/:id', asyncHandler(financialController.deletePayable.bind(financialController)));

router.post('/payables/:id/pay',
  [
    body('paymentDate').isISO8601().withMessage('Data de pagamento inválida'),
    body('paymentMethod').notEmpty().withMessage('Forma de pagamento obrigatória'),
    validate
  ],
  asyncHandler(financialController.payPayable.bind(financialController))
);

// ========== CONTAS A RECEBER ==========
router.get('/receivables', asyncHandler(financialController.listReceivables.bind(financialController)));

router.post('/receivables',
  [
    body('description').notEmpty().withMessage('Descrição obrigatória'),
    body('amount').isFloat({ min: 0 }).withMessage('Valor inválido'),
    body('dueDate').isISO8601().withMessage('Data de vencimento inválida'),
    validate
  ],
  asyncHandler(financialController.createReceivable.bind(financialController))
);

router.put('/receivables/:id', asyncHandler(financialController.updateReceivable.bind(financialController)));
router.delete('/receivables/:id', asyncHandler(financialController.deleteReceivable.bind(financialController)));

router.post('/receivables/:id/receive',
  [
    body('paymentDate').isISO8601().withMessage('Data de recebimento inválida'),
    body('paymentMethod').notEmpty().withMessage('Forma de pagamento obrigatória'),
    validate
  ],
  asyncHandler(financialController.receiveReceivable.bind(financialController))
);

// ========== TRANSAÇÕES ==========
router.get('/transactions', asyncHandler(financialController.listTransactions.bind(financialController)));

router.post('/transactions',
  [
    body('type').isIn(['INCOME', 'EXPENSE']).withMessage('Tipo inválido'),
    body('amount').isFloat({ min: 0 }).withMessage('Valor inválido'),
    body('description').notEmpty().withMessage('Descrição obrigatória'),
    validate
  ],
  asyncHandler(financialController.createTransaction.bind(financialController))
);

// ========== FLUXO DE CAIXA ==========
router.get('/cash-flow', asyncHandler(financialController.cashFlow.bind(financialController)));

// ========== DASHBOARD FINANCEIRO ==========
router.get('/dashboard', asyncHandler(financialController.dashboard.bind(financialController)));

module.exports = router;