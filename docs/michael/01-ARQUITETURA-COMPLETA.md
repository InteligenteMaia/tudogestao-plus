# 🏗️ Arquitetura Completa - TudoGestão+

**Documentação Técnica Detalhada**
**Tech Lead:** Michael Santos
**Versão:** 1.0

---

## 📐 Visão Geral da Arquitetura

O TudoGestão+ segue uma arquitetura **Cliente-Servidor** com separação clara entre Frontend e Backend, comunicando-se via **REST API**.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTE                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React SPA (Single Page Application)         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Pages     │  │ Components  │  │   Hooks     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  Services   │  │   Context   │  │   Utils     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            │ HTTP/HTTPS                      │
│                            │ (Axios)                         │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVIDOR                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Node.js + Express API                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Routes    │→ │ Middleware  │→ │ Controllers │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │         │                                  │           │  │
│  │         ▼                                  ▼           │  │
│  │  ┌─────────────┐                   ┌─────────────┐   │  │
│  │  │  Services   │                   │   Prisma    │   │  │
│  │  └─────────────┘                   └─────────────┘   │  │
│  └───────────────────────────────────────┼───────────────┘  │
│                                          │                   │
│                                          │ ORM               │
│                                          ▼                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL                         │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │  │
│  │  │ Tables  │  │ Indexes │  │ Foreign │  │ Triggers│  │  │
│  │  │         │  │         │  │  Keys   │  │         │  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Padrão Arquitetural: MVC + Services

### Model-View-Controller Adaptado

```
REQUEST FLOW:
┌──────┐    ┌───────┐    ┌────────────┐    ┌────────────┐    ┌─────────┐
│Client│───→│Routes │───→│ Middleware │───→│ Controller │───→│ Prisma  │
└──────┘    └───────┘    └────────────┘    └────────────┘    │ (Model) │
                                                   │           └─────────┘
                                                   ▼                 │
                              ┌─────────────────────────┐            │
                              │      Services           │            │
                              │  (PDF, Excel, Audit)    │            │
                              └─────────────────────────┘            │
                                                   │                 │
                                                   ◀─────────────────┘
RESPONSE FLOW:
┌──────┐    ┌───────────┐
│Client│◀───│ JSON/File │
└──────┘    └───────────┘
```

### Responsabilidades

**1. Routes (Roteamento)**
- Definir endpoints da API
- Mapear HTTP verbs (GET, POST, PUT, DELETE) para controllers
- Aplicar middlewares específicos

```javascript
// backend/routes/customer.routes.js
router.get('/', authMiddleware, asyncHandler(customerController.index));
router.post('/', authMiddleware, validate, asyncHandler(customerController.create));
router.put('/:id', authMiddleware, validate, asyncHandler(customerController.update));
router.delete('/:id', authMiddleware, asyncHandler(customerController.delete));
```

**2. Middleware (Intermediários)**
- Autenticação (verificar JWT)
- Autorização (verificar roles)
- Validação de dados
- Tratamento de erros
- Logging

```javascript
// backend/middleware/auth.middleware.js
const authMiddleware = (req, res, next) => {
  // 1. Extrai token do header Authorization
  const token = req.headers.authorization?.replace('Bearer ', '');

  // 2. Verifica se token existe
  if (!token) throw new AppError('Token não fornecido', 401);

  // 3. Valida token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4. Injeta dados no request
  req.userId = decoded.userId;
  req.companyId = decoded.companyId;

  // 5. Continua para o próximo middleware/controller
  next();
};
```

**3. Controllers (Lógica de Negócio)**
- Receber requisições
- Validar regras de negócio
- Chamar services quando necessário
- Interagir com banco de dados via Prisma
- Retornar respostas formatadas

```javascript
// backend/controllers/customer.controller.js
class CustomerController {
  async create(req, res) {
    // 1. Extrai dados do request
    const { cpfCnpj, name, email } = req.body;

    // 2. Validação de negócio (CPF duplicado)
    const existing = await prisma.customer.findFirst({
      where: { companyId: req.companyId, cpfCnpj }
    });
    if (existing) throw new AppError('CPF já cadastrado', 409);

    // 3. Cria no banco de dados
    const customer = await prisma.customer.create({
      data: { cpfCnpj, name, email, companyId: req.companyId }
    });

    // 4. Registra auditoria (service)
    await auditService.log(req.userId, 'CREATE', 'Customer', customer.id);

    // 5. Retorna resposta
    res.status(201).json({ message: 'Cliente criado', customer });
  }
}
```

**4. Services (Serviços Especializados)**
- Tarefas específicas e reutilizáveis
- Geração de PDFs
- Exportação para Excel
- Envio de emails
- Auditoria de ações

```javascript
// backend/services/pdf.service.js
class PDFService {
  async generateInvoice(saleId) {
    // Lógica complexa de geração de PDF
    // Pode ser chamada de múltiplos controllers
  }
}
```

**5. Prisma (ORM - Model)**
- Abstração do banco de dados
- Type-safe queries
- Migrations automáticas
- Schema como fonte de verdade

```javascript
// Prisma abstrai SQL
const customers = await prisma.customer.findMany({
  where: { active: true },
  include: { sales: true }
});

// Equivalente SQL:
// SELECT c.*, s.* FROM customers c
// LEFT JOIN sales s ON s.customer_id = c.id
// WHERE c.active = true
```

---

## 🔐 Fluxo de Autenticação

### 1. Login

```
┌──────────┐                                   ┌──────────┐
│ Frontend │                                   │ Backend  │
└────┬─────┘                                   └────┬─────┘
     │                                              │
     │  POST /api/auth/login                        │
     │  { email, password }                         │
     ├─────────────────────────────────────────────→│
     │                                              │
     │                         1. Busca usuário     │
     │                         WHERE email = ?      │
     │                                              │
     │                         2. Compara senha     │
     │                         bcrypt.compare()     │
     │                                              │
     │                         3. Gera JWT          │
     │                         jwt.sign()           │
     │                                              │
     │  { user, token }                             │
     │◀─────────────────────────────────────────────┤
     │                                              │
     │  4. Salva no localStorage                    │
     │  localStorage.setItem('token')               │
     │                                              │
```

### 2. Requisições Autenticadas

```
┌──────────┐                                   ┌──────────┐
│ Frontend │                                   │ Backend  │
└────┬─────┘                                   └────┬─────┘
     │                                              │
     │  GET /api/customers                          │
     │  Authorization: Bearer eyJhbGc...            │
     ├─────────────────────────────────────────────→│
     │                                              │
     │                         1. authMiddleware    │
     │                         Extrai token         │
     │                                              │
     │                         2. jwt.verify()      │
     │                         Valida token         │
     │                                              │
     │                         3. Decodifica        │
     │                         { userId, companyId }│
     │                                              │
     │                         4. Injeta no req     │
     │                         req.userId = ...     │
     │                                              │
     │                         5. Controller        │
     │                         Executa lógica       │
     │                                              │
     │  { customers: [...] }                        │
     │◀─────────────────────────────────────────────┤
     │                                              │
```

### 3. Código de Implementação

**Backend - Login**
```javascript
// backend/controllers/auth.controller.js
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

  // 2. Valida senha (compara hash)
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  // 3. Gera token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      companyId: user.companyId,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 4. Remove senha da resposta
  delete user.password;

  // 5. Retorna usuário e token
  return res.json({
    user,
    token
  });
}
```

**Frontend - Login**
```javascript
// frontend/src/pages/login/Login.jsx
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // 1. Faz requisição para API
    const response = await api.post('/auth/login', {
      email,
      password
    });

    // 2. Extrai user e token
    const { user, token } = response.data;

    // 3. Salva no localStorage
    localStorage.setItem('@TudoGestao:token', token);
    localStorage.setItem('@TudoGestao:user', JSON.stringify(user));

    // 4. Atualiza context
    setUser(user);

    // 5. Redireciona para dashboard
    navigate('/dashboard');

    toast.success('Login realizado com sucesso!');
  } catch (error) {
    toast.error(error.response?.data?.error || 'Erro ao fazer login');
  }
};
```

**Frontend - Axios Interceptor**
```javascript
// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api'
});

// Interceptor: Adiciona token automaticamente em TODAS as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('@TudoGestao:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor: Trata erros globalmente
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token inválido/expirado
      localStorage.removeItem('@TudoGestao:token');
      localStorage.removeItem('@TudoGestao:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🗄️ Arquitetura do Banco de Dados

### Diagrama ER (Entidade-Relacionamento)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Company   │         │    User     │         │  Customer   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │←───────┤ companyId   │         │ id (PK)     │
│ name        │         │ id (PK)     │         │ companyId   │
│ cnpj        │         │ name        │         │ type        │
│ email       │         │ email       │         │ cpfCnpj     │
│ ...         │         │ password    │         │ name        │
└─────────────┘         │ role        │         │ ...         │
                        └─────────────┘         └──────┬──────┘
                                                       │
                        ┌─────────────┐                │
                        │   Product   │                │
                        ├─────────────┤                │
                        │ id (PK)     │                │
                        │ companyId   │                │
                        │ name        │                │
                        │ price       │                │
                        │ stock       │                │
                        └──────┬──────┘                │
                               │                       │
                               │                       │
        ┌──────────────────────┴───────────────────────┴──────────┐
        │                        Sale                              │
        ├──────────────────────────────────────────────────────────┤
        │ id (PK)                                                  │
        │ companyId                                                │
        │ customerId (FK) ────────────────────────────────────────→│
        │ saleNumber                                               │
        │ total                                                    │
        │ status                                                   │
        │ paymentMethod                                            │
        └───────────────┬──────────────────────────────────────────┘
                        │
                        │
        ┌───────────────▼──────────┐
        │       SaleItem           │
        ├──────────────────────────┤
        │ id (PK)                  │
        │ saleId (FK)              │
        │ productId (FK) ──────────┼─────→ Product
        │ quantity                 │
        │ unitPrice                │
        │ total                    │
        └──────────────────────────┘
```

### Princípios de Design do Schema

**1. Normalização (3NF)**
- Eliminar redundância de dados
- Cada tabela tem responsabilidade única
- Relacionamentos via Foreign Keys

**2. Multi-Tenancy (Multi-Empresa)**
- Todas as tabelas principais têm `companyId`
- Isolamento de dados por empresa
- Uma instalação serve múltiplas empresas

**3. Soft Delete**
- Campo `active: boolean` ao invés de DELETE
- Histórico preservado
- Possível restaurar dados

**4. Auditoria**
- Tabela `AuditLog` registra todas as operações
- Campos `createdAt` e `updatedAt` em todas as tabelas

**5. Indexes Estratégicos**
```sql
-- Queries frequentes otimizadas
CREATE INDEX idx_customer_company ON customers(company_id);
CREATE INDEX idx_customer_cpfcnpj ON customers(cpf_cnpj);
CREATE INDEX idx_sale_company_date ON sales(company_id, created_at);
CREATE INDEX idx_product_company ON products(company_id);
```

---

## 🔄 Fluxo Completo: Realizar uma Venda

### Diagrama de Sequência

```
Frontend          API Route         Middleware        Controller        Service           Prisma             DB
   │                 │                  │                 │                 │                 │                │
   │  POST /sales    │                  │                 │                 │                 │                │
   ├────────────────→│                  │                 │                 │                 │                │
   │                 │  authMiddleware  │                 │                 │                 │                │
   │                 ├─────────────────→│                 │                 │                 │                │
   │                 │                  │ verify JWT      │                 │                 │                │
   │                 │                  │ inject userId   │                 │                 │                │
   │                 │                  ├────────────────→│                 │                 │                │
   │                 │                  │                 │ validateStock   │                 │                │
   │                 │                  │                 ├────────────────→│                 │                │
   │                 │                  │                 │                 │ findMany        │                │
   │                 │                  │                 │                 ├────────────────→│                │
   │                 │                  │                 │                 │                 │ SELECT         │
   │                 │                  │                 │                 │                 ├───────────────→│
   │                 │                  │                 │                 │                 │ products       │
   │                 │                  │                 │                 │◀────────────────┤◀───────────────┤
   │                 │                  │                 │◀────────────────┤                 │                │
   │                 │                  │                 │ $transaction    │                 │                │
   │                 │                  │                 ├─────────────────────────────────→│                │
   │                 │                  │                 │                 │                 │ BEGIN          │
   │                 │                  │                 │                 │                 ├───────────────→│
   │                 │                  │                 │                 │                 │ INSERT sale    │
   │                 │                  │                 │                 │                 ├───────────────→│
   │                 │                  │                 │                 │                 │ INSERT items   │
   │                 │                  │                 │                 │                 ├───────────────→│
   │                 │                  │                 │                 │                 │ UPDATE stock   │
   │                 │                  │                 │                 │                 ├───────────────→│
   │                 │                  │                 │                 │                 │ COMMIT         │
   │                 │                  │                 │                 │                 ├───────────────→│
   │                 │                  │                 │◀─────────────────────────────────┤                │
   │                 │                  │                 │ auditService    │                 │                │
   │                 │                  │                 ├────────────────→│                 │                │
   │                 │                  │                 │                 │ create log      │                │
   │                 │                  │                 │                 ├────────────────→│                │
   │                 │                  │                 │◀────────────────┤                 │                │
   │                 │                  │◀────────────────┤                 │                 │                │
   │                 │◀─────────────────┤                 │                 │                 │                │
   │◀────────────────┤                 │                 │                 │                 │                │
   │  201 Created    │                 │                 │                 │                 │                │
   │  { sale }       │                 │                 │                 │                 │                │
   │                 │                 │                 │                 │                 │                │
```

### Código Implementação

```javascript
// backend/controllers/sale.controller.js
async create(req, res) {
  const { customerId, items, paymentMethod, discount } = req.body;

  // 1. Valida estoque ANTES de iniciar transação
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    });

    if (product.stock < item.quantity) {
      throw new AppError(
        `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`,
        400
      );
    }
  }

  // 2. Calcula total
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - (discount || 0);

  // 3. Transação Atômica (tudo ou nada)
  const sale = await prisma.$transaction(async (tx) => {
    // 3.1. Cria venda
    const newSale = await tx.sale.create({
      data: {
        saleNumber: await generateSaleNumber(),
        companyId: req.companyId,
        customerId,
        total,
        discount,
        paymentMethod,
        status: 'COMPLETED'
      }
    });

    // 3.2. Cria itens da venda
    for (const item of items) {
      await tx.saleItem.create({
        data: {
          saleId: newSale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.quantity * item.price
        }
      });

      // 3.3. Baixa estoque (ATOMIC DECREMENT)
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }

    return newSale;
  });

  // 4. Registra auditoria (FORA da transação)
  await auditService.log(req.userId, 'CREATE', 'Sale', sale.id, req.body);

  // 5. Retorna resposta
  res.status(201).json({
    message: 'Venda realizada com sucesso',
    sale
  });
}
```

**Por que usar Transaction?**

Se não usar transação e houver erro no meio do processo:
- ❌ Venda criada mas itens não
- ❌ Estoque baixado mas venda não criada
- ❌ Dados inconsistentes

Com transação:
- ✅ TUDO acontece ou NADA acontece
- ✅ Consistência garantida
- ✅ Rollback automático em caso de erro

---

## 🚀 Deployment Architecture

### Ambiente de Desenvolvimento

```
┌─────────────────────────────────────────┐
│         Developer Machine               │
│                                         │
│  ┌─────────────┐    ┌─────────────┐    │
│  │  Frontend   │    │   Backend   │    │
│  │  (Vite)     │    │  (Nodemon)  │    │
│  │  :5173      │    │   :3333     │    │
│  └─────────────┘    └─────────────┘    │
│         │                  │            │
│         │                  ▼            │
│         │           ┌─────────────┐    │
│         │           │ PostgreSQL  │    │
│         │           │   :5432     │    │
│         │           └─────────────┘    │
│         │                               │
└─────────┴───────────────────────────────┘
          │
          │ git push
          ▼
    ┌──────────┐
    │  GitHub  │
    └──────────┘
```

### Ambiente de Produção (Recomendado)

```
                            ┌──────────────────┐
                            │   CloudFlare     │
                            │   (CDN + SSL)    │
                            └────────┬─────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
           ┌────────▼────────┐               ┌────────▼────────┐
           │     Vercel      │               │   Railway/      │
           │   (Frontend)    │               │   Render        │
           │   React Build   │               │   (Backend)     │
           └────────┬────────┘               └────────┬────────┘
                    │                                 │
                    │                                 │
                    │                        ┌────────▼────────┐
                    │                        │   PostgreSQL    │
                    │                        │   (Managed)     │
                    │                        │   Supabase/     │
                    │                        │   Railway       │
                    │                        └─────────────────┘
                    │
                    │
           ┌────────▼────────┐
           │   AWS S3/       │
           │   Cloudinary    │
           │   (Files)       │
           └─────────────────┘
```

### Docker Deployment (Alternativo)

```yaml
# docker-compose.yml
version: '3.8'

services:
  database:
    image: postgres:14
    environment:
      POSTGRES_DB: tudogestao
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    depends_on:
      - database
    environment:
      DATABASE_URL: postgresql://postgres:postgres@database:5432/tudogestao
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3333:3333"
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    depends_on:
      - backend
    ports:
      - "80:80"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html

volumes:
  postgres_data:
```

---

## 📊 Métricas e Monitoramento

### Métricas Importantes

**Performance**
- Response Time médio: < 200ms
- P95 (95% das requisições): < 500ms
- P99 (99% das requisições): < 1s

**Disponibilidade**
- Uptime: > 99.9%
- Error Rate: < 0.1%

**Negócio**
- Vendas por dia
- Ticket médio
- Produtos mais vendidos
- Taxa de conversão

### Ferramentas Recomendadas

**Logs**
```javascript
// Winston para logs estruturados
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Uso
logger.info('Venda criada', { saleId: sale.id, total: sale.total });
logger.error('Erro ao processar venda', { error: error.message });
```

**Error Tracking**
- Sentry: Rastreamento de erros em produção
- Notificações em tempo real
- Stack traces completos

**APM (Application Performance Monitoring)**
- New Relic ou DataDog
- Monitoramento de queries lentas
- Detecção de bottlenecks

---

## 🔒 Segurança

### Checklist de Segurança

**Autenticação**
- ✅ JWT com expiração (7 dias)
- ✅ Senhas hasheadas com bcrypt (10 salt rounds)
- ✅ Tokens refresháveis (implementar)

**Autorização**
- ✅ Role-based access control (ADMIN/MANAGER/USER)
- ✅ Verificação de companyId em todas as queries
- ✅ Middleware de autorização

**Input Validation**
- ✅ Express-validator em todas as rotas
- ✅ Sanitização de dados
- ✅ Type checking com Prisma

**SQL Injection**
- ✅ Prisma ORM (queries parametrizadas)
- ✅ Nunca concatenar strings SQL

**XSS (Cross-Site Scripting)**
- ✅ React escapa automaticamente
- ✅ Sanitizar HTML quando necessário
- ✅ Content Security Policy headers

**CORS**
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**Rate Limiting**
```javascript
// Implementar com express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Máximo 100 requisições por IP
});

app.use('/api/', limiter);
```

**HTTPS**
- ✅ SSL/TLS em produção
- ✅ Redirect HTTP → HTTPS
- ✅ HSTS headers

---

## 📈 Escalabilidade

### Estratégias de Escala

**Horizontal Scaling (Múltiplas Instâncias)**
```
         Load Balancer
              │
    ┌─────────┼─────────┐
    │         │         │
Backend 1  Backend 2  Backend 3
    │         │         │
    └─────────┼─────────┘
              │
         Database
       (Read Replicas)
```

**Caching**
```javascript
// Redis para cache
const redis = require('redis');
const client = redis.createClient();

// Cache de queries frequentes
async function getCustomers(companyId) {
  const cacheKey = `customers:${companyId}`;

  // Tenta buscar do cache
  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Se não existe, busca do banco
  const customers = await prisma.customer.findMany({
    where: { companyId }
  });

  // Salva no cache (expira em 5 minutos)
  await client.setex(cacheKey, 300, JSON.stringify(customers));

  return customers;
}
```

**Database Optimization**
- Indexes em colunas frequentemente consultadas
- Connection pooling
- Query optimization
- Read replicas para relatórios

**CDN para Assets**
- Cloudflare ou CloudFront
- Cache de imagens, CSS, JS
- Reduz latência global

---

## 🎯 Decisões Arquiteturais Importantes

### Por que REST ao invés de GraphQL?

**Vantagens REST:**
- ✅ Simples de entender e implementar
- ✅ Cache HTTP nativo
- ✅ Melhor para CRUD tradicional
- ✅ Ferramentas maduras (Postman, Swagger)

**Quando considerar GraphQL:**
- Múltiplos clientes com necessidades diferentes
- Over-fetching/Under-fetching é problema
- Relações complexas

### Por que Prisma ao invés de SQL puro?

**Vantagens Prisma:**
- ✅ Type-safety (TypeScript)
- ✅ Migrations automáticas
- ✅ Query builder intuitivo
- ✅ Previne SQL Injection
- ✅ Performance otimizada

### Por que PostgreSQL ao invés de MongoDB?

**Vantagens PostgreSQL:**
- ✅ ACID compliance (transações)
- ✅ Relacionamentos complexos
- ✅ Integridade referencial
- ✅ Queries complexas eficientes
- ✅ Maduro e confiável

**Quando considerar MongoDB:**
- Schema flexível necessário
- Escala horizontal massiva
- Documentos sem relacionamentos

---

## 📚 Recursos e Referências

**Documentação Oficial:**
- Node.js: https://nodejs.org/docs
- Express: https://expressjs.com
- React: https://react.dev
- Prisma: https://prisma.io/docs
- PostgreSQL: https://postgresql.org/docs

**Livros Recomendados:**
- "Clean Code" - Robert C. Martin
- "Designing Data-Intensive Applications" - Martin Kleppmann
- "Node.js Design Patterns" - Mario Casciaro

**Cursos:**
- Node.js: The Complete Guide (Udemy)
- React: The Complete Guide (Udemy)
- Database Design (Coursera)

---

**Última Atualização:** 19/11/2025
**Versão:** 1.0
**Autor:** Michael Santos - Tech Lead
