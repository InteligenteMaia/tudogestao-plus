// 💼 Larissa Oliveira - Product Manager
// Rotas do dashboard

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

router.use(authMiddleware);

router.get('/', asyncHandler(dashboardController.getMainDashboard.bind(dashboardController)));
router.get('/sales-chart', asyncHandler(dashboardController.getSalesChart.bind(dashboardController)));
router.get('/financial-chart', asyncHandler(dashboardController.getFinancialChart.bind(dashboardController)));
router.get('/top-products', asyncHandler(dashboardController.getTopProducts.bind(dashboardController)));
router.get('/quick-stats', asyncHandler(dashboardController.getQuickStats.bind(dashboardController)));

module.exports = router;