# 🚀 Eliseu Junior - Full Stack Developer

## 📋 Informações Profissionais

- **Cargo:** Full Stack Developer
- **Salário:** R$ 10.000/mês
- **Regime:** Presencial
- **Horário:** Seg-Sex • 09h-18h

## 🎯 Responsabilidades

1. **Módulo de Vendas/PDV**
   - Sistema de vendas completo
   - Carrinho de compras
   - Integração com estoque

2. **Módulo Financeiro**
   - Contas a pagar/receber
   - Fluxo de caixa
   - Reconciliação bancária

3. **Autenticação e Segurança**
   - Sistema de login/logout
   - Controle de permissões
   - JWT e sessões

## 📂 Seus Arquivos Principais

### Backend - Auth e Financeiro

```
backend/
├── 📁 controllers/
│   ├── 📄 auth.controller.js            ✅ Login/Logout/Register
│   ├── 📄 sale.controller.js            ✅ Sistema de vendas
│   ├── 📄 financial.controller.js       ✅ Financeiro
│   └── 📄 user.controller.js            ✅ Gestão de usuários
├── 📁 middleware/
│   ├── 📄 auth.middleware.js            ✅ Verificação de JWT
│   └── 📄 permission.middleware.js      ✅ Controle de acesso
└── 📁 routes/
    ├── 📄 auth.routes.js                ✅ Rotas de autenticação
    ├── 📄 sale.routes.js                ✅ Rotas de vendas
    └── 📄 financial.routes.js           ✅ Rotas financeiras
```

### Frontend - Vendas e Financeiro

```
frontend/src/
├── 📁 pages/
│   ├── 📁 auth/
│   │   └── 📄 Login.jsx                 ✅ Tela de login
│   ├── 📁 sales/
│   │   └── 📄 Sales.jsx                 ✅ PDV completo
│   └── 📁 financial/
│       └── 📄 Financial.jsx             ✅ Gestão financeira
└── 📁 contexts/
    └── 📄 AuthContext.jsx               ✅ Contexto de autenticação
```

## 🔧 Engenharia Reversa

### 1. Sistema de Autenticação

**Arquivo:** `backend/controllers/auth.controller.js`

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuthController {
  // LOGIN
  async login(req, res) {
    const { email, password } = req.body;

    // 1. Busca usuário por email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    // 2. Verifica se usuário está ativo
    if (!user.active) {
      throw new AppError('Usuário inativo', 401);
    }

    // 3. Compara senha com hash
    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    // 4. Gera token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        companyId: user.companyId,
        role: user.role
      },
      process.env.JWT_SECRET,  // Segredo do .env
      { expiresIn: '24h' }      // Token expira em 24h
    );

    // 5. Atualiza último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // 6. Remove senha antes de enviar resposta
    delete user.password;

    // 7. Retorna token e dados do usuário
    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        company: user.company
      }
    });
  }

  // REGISTER (criar novo usuário)
  async register(req, res) {
    const { name, email, password, role } = req.body;
    const companyId = req.companyId;

    // 1. Verifica se email já existe
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      throw new AppError('Email já cadastrado', 409);
    }

    // 2. Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);
    // 10 = salt rounds (nível de criptografia)

    // 3. Cria usuário
    const user = await prisma.user.create({
      data: {
        companyId,
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
        active: true
      }
    });

    // Remove senha da resposta
    delete user.password;

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user
    });
  }

  // ME (retorna dados do usuário logado)
  async me(req, res) {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { company: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        companyId: true,
        company: true
      }
    });

    res.json({ user });
  }
}
```

**Middleware de Autenticação:**

```javascript
// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Pega token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token não fornecido'
      });
    }

    // 2. Remove "Bearer " do token
    const token = authHeader.replace('Bearer ', '');

    // 3. Verifica e decodifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Adiciona dados do usuário ao request
    req.userId = decoded.userId;
    req.companyId = decoded.companyId;
    req.userRole = decoded.role;

    // 5. Continua para próximo middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }
};
```

### 2. Sistema de Vendas

**Arquivo:** `backend/controllers/sale.controller.js`

```javascript
class SaleController {
  async create(req, res) {
    const { customerId, items, discount, paymentMethod } = req.body;

    // VALIDAÇÕES
    if (!items || items.length === 0) {
      throw new AppError('Adicione produtos à venda', 400);
    }

    // CALCULA TOTAL
    let totalAmount = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new AppError(`Produto não encontrado`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Estoque insuficiente para ${product.name}`,
          400
        );
      }

      totalAmount += parseFloat(product.salePrice) * item.quantity;
    }

    const discountAmount = discount || 0;
    const netAmount = totalAmount - discountAmount;

    // GERA NÚMERO DA VENDA
    const lastSale = await prisma.sale.findFirst({
      where: { companyId: req.companyId },
      orderBy: { saleNumber: 'desc' }
    });

    const nextNumber = lastSale
      ? parseInt(lastSale.saleNumber.split('-')[1]) + 1
      : 1;
    const saleNumber = `VND-${String(nextNumber).padStart(6, '0')}`;

    // CRIA VENDA + ITEMS + ATUALIZA ESTOQUE (em transação)
    const sale = await prisma.$transaction(async (tx) => {
      // Cria venda
      const newSale = await tx.sale.create({
        data: {
          companyId: req.companyId,
          customerId,
          saleNumber,
          date: new Date(),
          totalAmount,
          discount: discountAmount,
          netAmount,
          paymentMethod,
          status: 'PAID',
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
              discount: item.discount || 0
            }))
          }
        },
        include: {
          customer: true,
          items: { include: { product: true } }
        }
      });

      // Atualiza estoque de cada produto
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      return newSale;
    });

    res.status(201).json(sale);
  }
}
```

### 3. Controle Financeiro

**Arquivo:** `backend/controllers/financial.controller.js`

```javascript
class FinancialController {
  // Criar transação financeira
  async createTransaction(req, res) {
    const {
      type,        // INCOME ou EXPENSE
      category,
      amount,
      description,
      date,
      bankAccountId
    } = req.body;

    const transaction = await prisma.financialTransaction.create({
      data: {
        companyId: req.companyId,
        type,
        category,
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        bankAccountId,
        status: 'COMPLETED'
      }
    });

    // Atualiza saldo da conta bancária
    await prisma.bankAccount.update({
      where: { id: bankAccountId },
      data: {
        balance: type === 'INCOME'
          ? { increment: parseFloat(amount) }
          : { decrement: parseFloat(amount) }
      }
    });

    res.status(201).json(transaction);
  }

  // Fluxo de caixa
  async cashFlow(req, res) {
    const { startDate, endDate } = req.query;

    const transactions = await prisma.financialTransaction.findMany({
      where: {
        companyId: req.companyId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      orderBy: { date: 'asc' }
    });

    // Agrupa por data
    const cashFlowByDate = transactions.reduce((acc, t) => {
      const dateKey = t.date.toISOString().split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0,
          balance: 0
        };
      }

      if (t.type === 'INCOME') {
        acc[dateKey].income += Number(t.amount);
      } else {
        acc[dateKey].expense += Number(t.amount);
      }

      acc[dateKey].balance =
        acc[dateKey].income - acc[dateKey].expense;

      return acc;
    }, {});

    res.json({
      cashFlow: Object.values(cashFlowByDate)
    });
  }

  // Dashboard financeiro
  async dashboard(req, res) {
    const { startDate, endDate } = req.query;

    const [income, expense, pending] = await Promise.all([
      // Total de receitas
      prisma.financialTransaction.aggregate({
        where: {
          companyId: req.companyId,
          type: 'INCOME',
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        _sum: { amount: true }
      }),

      // Total de despesas
      prisma.financialTransaction.aggregate({
        where: {
          companyId: req.companyId,
          type: 'EXPENSE',
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        _sum: { amount: true }
      }),

      // Contas pendentes
      prisma.financialTransaction.count({
        where: {
          companyId: req.companyId,
          status: 'PENDING'
        }
      })
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
      pending
    });
  }
}
```

## 📚 Conceitos de Segurança

### 1. Bcrypt - Criptografia de Senhas

```javascript
const bcrypt = require('bcrypt');

// HASH (Criptografar)
const password = '123456';
const hash = await bcrypt.hash(password, 10);
// Resultado: $2b$10$Xvz8...complexo...ABC

// COMPARE (Verificar)
const isValid = await bcrypt.compare('123456', hash);
// true ou false
```

**Por que não salvar senha em texto puro?**
- Se banco for hackeado, senhas ficam expostas
- Com bcrypt, nem mesmo admin consegue ver senha original

### 2. JWT - JSON Web Tokens

**Estrutura de um JWT:**
```
header.payload.signature

// Exemplo real:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.    // Header
eyJ1c2VySWQiOiIxMjMiLCJjb21wYW55SWQiOiI0NTYifQ.  // Payload (dados)
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   // Signature
```

**Ciclo de vida:**
1. Usuário faz login → Backend gera token
2. Frontend guarda token (localStorage)
3. Toda requisição envia: `Authorization: Bearer <token>`
4. Backend valida token e permite acesso

### 3. Middleware de Permissões

```javascript
// Verifica se usuário é ADMIN
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

// Uso em rotas
router.delete('/users/:id',
  authMiddleware,     // 1º: Verifica se está logado
  isAdmin,            // 2º: Verifica se é admin
  userController.delete  // 3º: Executa ação
);
```

## 🎯 Checklist de Segurança

- [ ] Todas senhas são hasheadas (nunca texto puro)
- [ ] Tokens JWT têm expiração
- [ ] Rotas protegidas têm authMiddleware
- [ ] Validação de inputs (evitar SQL injection)
- [ ] CORS configurado corretamente
- [ ] HTTPS em produção
- [ ] Rate limiting (evitar ataques DDoS)
- [ ] Logs de auditoria em ações críticas

---

**Próximos Passos:**
1. Entender fluxo completo de autenticação
2. Estudar como funcionam transações
3. Praticar segurança em APIs
