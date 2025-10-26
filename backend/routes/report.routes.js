// 💼 Larissa Oliveira - Product Manager
// Rotas de relatórios

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { isManager } = require('../middleware/permission.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);
router.use(isManager);

router.get('/dre', asyncHandler(reportController.getDRE.bind(reportController)));
router.get('/sales', asyncHandler(reportController.getSalesReport.bind(reportController)));
router.get('/stock', asyncHandler(reportController.getStockReport.bind(reportController)));
router.get('/customers', asyncHandler(reportController.getCustomersReport.bind(reportController)));

router.get('/export/pdf', asyncHandler(reportController.exportPDF.bind(reportController)));
router.get('/export/excel', asyncHandler(reportController.exportExcel.bind(reportController)));

module.exports = router;