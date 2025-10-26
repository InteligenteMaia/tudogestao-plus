// 👨‍💻 Michael Santos - Tech Lead
// ⚙️ Rubens Neto - Backend Developer
// Servidor Express principal - Inicializa todas as rotas e middlewares

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
const PORT = process.env.PORT || 3001;

// ========== MIDDLEWARES ==========

// Segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173' 
    : false,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ========== ROTAS ==========

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'TudoGestão+ API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Importa rotas
const authRoutes = require('./routes/auth.routes');
const companyRoutes = require('./routes/company.routes');
const userRoutes = require('./routes/user.routes');
const customerRoutes = require('./routes/customer.routes');
const supplierRoutes = require('./routes/supplier.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const saleRoutes = require('./routes/sale.routes');
const financialRoutes = require('./routes/financial.routes');
const reportRoutes = require('./routes/report.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const employeeRoutes = require('./routes/employee.routes');
const nfeRoutes = require('./routes/nfe.routes');

// Registra rotas
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/nfe', nfeRoutes);

// ========== ERROR HANDLING ==========

// 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== INICIALIZAÇÃO ==========

const server = app.listen(PORT, () => {
  console.log('🚀 =======================================');
  console.log(`🏢 TudoGestão+ API Server`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString('pt-BR')}`);
  console.log('🚀 =======================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;