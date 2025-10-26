// ⚙️ Rubens Neto - Backend Developer
// Middleware de tratamento de erros

class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handler de erros do Prisma
 */
const handlePrismaError = (error) => {
  // Violação de constraint única
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'campo';
    return new AppError(`Este ${field} já está cadastrado`, 409);
  }

  // Registro não encontrado
  if (error.code === 'P2025') {
    return new AppError('Registro não encontrado', 404);
  }

  // Erro de foreign key
  if (error.code === 'P2003') {
    return new AppError('Erro de relacionamento - Verifique os dados vinculados', 400);
  }

  return new AppError('Erro no banco de dados', 500);
};

/**
 * Middleware principal de erro
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Converte erros do Prisma
  if (err.code?.startsWith('P')) {
    error = handlePrismaError(err);
  }

  // Log do erro em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode: error.statusCode,
    });
  }

  // Resposta ao cliente
  res.status(error.statusCode || 500).json({
    error: error.message || 'Erro interno do servidor',
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      code: error.code 
    })
  });
};

/**
 * Wrapper para funções async - Captura erros automaticamente
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  handlePrismaError
};