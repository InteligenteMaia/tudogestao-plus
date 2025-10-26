// 🔧 Thaynara Ribeiro - Full Stack
// Rotas de funcionários

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { isManager } = require('../middleware/permission.middleware');
const { validate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);
router.use(isManager);

router.get('/', asyncHandler(employeeController.list.bind(employeeController)));
router.get('/:id', asyncHandler(employeeController.getById.bind(employeeController)));

router.post('/',
  [
    body('name').notEmpty().withMessage('Nome obrigatório'),
    body('cpf').notEmpty().withMessage('CPF obrigatório'),
    body('admissionDate').isISO8601().withMessage('Data de admissão inválida'),
    validate
  ],
  asyncHandler(employeeController.create.bind(employeeController))
);

router.put('/:id', asyncHandler(employeeController.update.bind(employeeController)));
router.delete('/:id', asyncHandler(employeeController.delete.bind(employeeController)));

router.post('/payroll',
  [
    body('employeeId').notEmpty().withMessage('Funcionário obrigatório'),
    body('referenceMonth').isISO8601().withMessage('Mês de referência inválido'),
    validate
  ],
  asyncHandler(employeeController.generatePayroll.bind(employeeController))
);

router.post('/payroll/:id/pay',
  [
    body('paymentDate').isISO8601().withMessage('Data de pagamento inválida'),
    validate
  ],
  asyncHandler(employeeController.payPayroll.bind(employeeController))
);

module.exports = router;