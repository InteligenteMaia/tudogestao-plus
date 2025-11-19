// ⚙️ Rubens Neto - Backend Developer
// Rotas de empresa

const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/permission.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);

router.get('/', asyncHandler(companyController.get.bind(companyController)));
router.get('/:id', asyncHandler(companyController.get.bind(companyController)));

router.put('/:id',
  isAdmin,
  asyncHandler(companyController.update.bind(companyController))
);

router.post('/logo',
  isAdmin,
  asyncHandler(companyController.uploadLogo.bind(companyController))
);

module.exports = router;