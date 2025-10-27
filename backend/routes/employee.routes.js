// 🔧 Thaynara Ribeiro - Full Stack
// Rotas de funcionários

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);

router.post('/', asyncHandler(employeeController.create.bind(employeeController)));
router.get('/', asyncHandler(employeeController.list.bind(employeeController)));
router.get('/:id', asyncHandler(employeeController.getById.bind(employeeController)));
router.put('/:id', asyncHandler(employeeController.update.bind(employeeController)));
router.delete('/:id', asyncHandler(employeeController.delete.bind(employeeController)));

module.exports = router;