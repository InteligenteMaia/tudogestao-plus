# 🛠️ Stack Tecnológica Detalhada - TudoGestão+

**Análise Completa de Todas as Tecnologias Utilizadas**
**Tech Lead:** Michael Santos

---

## 📦 Backend Stack

### Node.js 18+

**O que é:**
- Runtime JavaScript no servidor
- Baseado no V8 engine do Chrome
- Event-driven, non-blocking I/O

**Por que escolhemos:**
- ✅ Performance excelente para I/O intensivo
- ✅ Mesma linguagem frontend/backend (JavaScript)
- ✅ npm com milhões de pacotes
- ✅ Comunidade gigantesca
- ✅ Perfeito para APIs REST

**Código Exemplo:**
```javascript
// server.js - Entry point
const express = require('express');
const app = express();

// Non-blocking I/O em ação
app.get('/customers', async (req, res) => {
  // Enquanto busca do banco, Node.js processa outras requisições
  const customers = await prisma.customer.findMany();
  res.json(customers);
});

app.listen(3333, () => {
  console.log('🚀 Server running on port 3333');
});
```

**Configurações Importantes:**
```json
// package.json
{
  "engines": {
    "node": ">=18.0.0"  // Garante compatibilidade
  },
  "scripts": {
    "dev": "nodemon src/server.js",  // Hot reload em desenvolvimento
    "start": "node src/server.js",    // Produção
    "test": "jest"
  }
}
```

---

### Express.js 4.x

**O que é:**
- Framework web minimalista para Node.js
- Gerenciamento de rotas e middleware

**Por que escolhemos:**
- ✅ Simples e flexível
- ✅ Middleware poderoso
- ✅ Grande ecossistema
- ✅ Performance comprovada

**Estrutura de Middleware:**
```javascript
// backend/server.js
const express = require('express');
const app = express();

// 1. Middleware de parsing (ordem importa!)
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded

// 2. Middleware de segurança
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// 3. Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 4. Rotas
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

// 5. Middleware de erro (sempre por último!)
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    error: error.message
  });
});

// 6. 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
```

**Padrões de Roteamento:**
```javascript
// backend/routes/customer.routes.js
const express = require('express');
const router = express.Router();

// GET /api/customers
router.get('/', asyncHandler(customerController.index));

// GET /api/customers/:id
router.get('/:id', asyncHandler(customerController.show));

// POST /api/customers
router.post('/',
  authMiddleware,  // Middleware de autenticação
  [
    body('name').notEmpty(),  // Validação
    body('cpfCnpj').notEmpty(),
    validate
  ],
  asyncHandler(customerController.create)
);

// PUT /api/customers/:id
router.put('/:id', authMiddleware, asyncHandler(customerController.update));

// DELETE /api/customers/:id
router.delete('/:id', authMiddleware, asyncHandler(customerController.delete));

module.exports = router;
```

---

### Prisma ORM 5.x

**O que é:**
- ORM (Object-Relational Mapping) moderna
- Type-safe database access
- Schema como fonte de verdade

**Por que escolhemos:**
- ✅ Type-safety com TypeScript/JSDoc
- ✅ Migrations automáticas
- ✅ Queries intuitivas
- ✅ Performance otimizada
- ✅ Prisma Studio (GUI para banco)

**Schema Exemplo:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Customer {
  id        String   @id @default(uuid())
  companyId String
  type      String   // INDIVIDUAL ou COMPANY
  cpfCnpj   String
  name      String
  email     String?
  phone     String?
  address   Json?
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos
  company   Company  @relation(fields: [companyId], references: [id])
  sales     Sale[]

  // Índices para performance
  @@index([companyId])
  @@index([cpfCnpj])
  @@unique([companyId, cpfCnpj])
}
```

**Queries Prisma vs SQL:**

```javascript
// FIND ALL
// Prisma
const customers = await prisma.customer.findMany({
  where: { companyId: '123' },
  orderBy: { name: 'asc' }
});

// SQL Equivalente
// SELECT * FROM customers WHERE company_id = '123' ORDER BY name ASC

// ================================

// FIND WITH RELATIONS
// Prisma
const customer = await prisma.customer.findUnique({
  where: { id: '456' },
  include: {
    sales: {
      orderBy: { createdAt: 'desc' },
      take: 10  // Últimas 10 vendas
    }
  }
});

// SQL Equivalente
// SELECT c.*, s.* FROM customers c
// LEFT JOIN sales s ON s.customer_id = c.id
// WHERE c.id = '456'
// ORDER BY s.created_at DESC
// LIMIT 10

// ================================

// CREATE
// Prisma
const newCustomer = await prisma.customer.create({
  data: {
    companyId: '123',
    type: 'INDIVIDUAL',
    cpfCnpj: '123.456.789-00',
    name: 'João Silva',
    email: 'joao@email.com'
  }
});

// SQL Equivalente
// INSERT INTO customers (company_id, type, cpf_cnpj, name, email)
// VALUES ('123', 'INDIVIDUAL', '123.456.789-00', 'João Silva', 'joao@email.com')
// RETURNING *

// ================================

// UPDATE
// Prisma
await prisma.customer.update({
  where: { id: '456' },
  data: {
    email: 'novo@email.com',
    updatedAt: new Date()
  }
});

// SQL Equivalente
// UPDATE customers
// SET email = 'novo@email.com', updated_at = NOW()
// WHERE id = '456'

// ================================

// DELETE (Soft Delete)
// Prisma
await prisma.customer.update({
  where: { id: '456' },
  data: { active: false }
});

// SQL Equivalente
// UPDATE customers SET active = false WHERE id = '456'

// ================================

// TRANSACTION
// Prisma
await prisma.$transaction(async (tx) => {
  const sale = await tx.sale.create({ data: {...} });
  await tx.saleItem.createMany({ data: [...] });
  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } }
  });
});

// SQL Equivalente
// BEGIN;
// INSERT INTO sales ...;
// INSERT INTO sale_items ...;
// UPDATE products SET stock = stock - quantity ...;
// COMMIT;
```

**Migrations:**
```bash
# Criar migration
npx prisma migrate dev --name add_customer_table

# Aplicar migrations em produção
npx prisma migrate deploy

# Gerar Prisma Client (sempre após alterar schema)
npx prisma generate

# Abrir Prisma Studio (GUI)
npx prisma studio
```

---

### PostgreSQL 14+

**O que é:**
- Banco de dados relacional open-source
- ACID compliant
- Extremamente confiável

**Por que escolhemos:**
- ✅ Relacionamentos complexos
- ✅ Transações ACID
- ✅ JSON support nativo
- ✅ Performance comprovada
- ✅ Ferramentas maduras

**Tipos de Dados Utilizados:**
```sql
-- String
name VARCHAR(255)
email VARCHAR(255)

-- Numérico
price DECIMAL(10,2)  -- Para valores monetários
stock INTEGER
quantity INTEGER

-- Booleano
active BOOLEAN DEFAULT true

-- Data/Hora
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

-- UUID
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- JSON (flexibilidade)
address JSONB  -- Binary JSON, mais rápido
metadata JSONB

-- Enum
role VARCHAR(20) CHECK (role IN ('ADMIN', 'MANAGER', 'USER'))
payment_method VARCHAR(20) CHECK (payment_method IN ('CASH', 'CARD', 'PIX'))
```

**Índices para Performance:**
```sql
-- Índice simples
CREATE INDEX idx_customer_company ON customers(company_id);

-- Índice composto
CREATE INDEX idx_sale_company_date ON sales(company_id, created_at);

-- Índice único
CREATE UNIQUE INDEX idx_customer_cpf ON customers(company_id, cpf_cnpj);

-- Índice parcial (só registros ativos)
CREATE INDEX idx_active_products ON products(company_id) WHERE active = true;

-- Índice em JSONB
CREATE INDEX idx_address_city ON customers USING GIN ((address->>'city'));
```

**Queries Otimizadas:**
```sql
-- EXPLAIN ANALYZE mostra plano de execução
EXPLAIN ANALYZE
SELECT c.*, COUNT(s.id) as total_sales
FROM customers c
LEFT JOIN sales s ON s.customer_id = c.id
WHERE c.company_id = '123' AND c.active = true
GROUP BY c.id
ORDER BY total_sales DESC
LIMIT 10;

-- Resultado mostra:
-- - Index Scan (rápido) vs Seq Scan (lento)
-- - Tempo de execução
-- - Número de rows processados
```

---

### JWT (JSON Web Tokens)

**O que é:**
- Padrão de autenticação stateless
- Token auto-contido com claims
- Assinado digitalmente

**Estrutura de um JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJjb21wYW55SWQiOiI0NTYiLCJpYXQiOjE2MzA0NzUyMDB9.4Hb-x5U9K_r8c3vZ1zJ9L0aB2yC8nW5eD4fA6mN7qT0

┌─────────────┬─────────────────────┬───────────────┐
│   Header    │      Payload        │   Signature   │
│   (base64)  │      (base64)       │   (crypto)    │
└─────────────┴─────────────────────┴───────────────┘

Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (Claims):
{
  "userId": "123",
  "companyId": "456",
  "role": "ADMIN",
  "iat": 1630475200,  // Issued At
  "exp": 1631080000   // Expiration
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

**Implementação:**
```javascript
// backend/controllers/auth.controller.js
const jwt = require('jsonwebtoken');

// Gerar token
const token = jwt.sign(
  {
    userId: user.id,
    companyId: user.companyId,
    role: user.role
  },
  process.env.JWT_SECRET,  // Chave secreta
  {
    expiresIn: '7d'  // Expira em 7 dias
  }
);

// Validar token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  // { userId: '123', companyId: '456', role: 'ADMIN', iat: ..., exp: ... }
} catch (error) {
  // Token inválido ou expirado
  throw new AppError('Token inválido', 401);
}
```

**Segurança:**
```javascript
// .env
JWT_SECRET=super_secret_key_minimum_32_characters_long_random_string

// NUNCA:
// ❌ JWT_SECRET=123
// ❌ JWT_SECRET=mysecret
// ❌ Commitar o .env no Git

// SEMPRE:
// ✅ Usar string aleatória longa (32+ caracteres)
// ✅ Diferente em dev/staging/prod
// ✅ Guardar em variáveis de ambiente
// ✅ Rotacionar periodicamente
```

---

### Bcrypt

**O que é:**
- Algoritmo de hashing de senhas
- Resistant a ataques de força bruta
- Salt automático

**Como funciona:**
```javascript
const bcrypt = require('bcrypt');

// HASH (Cadastro de usuário)
const password = '123456';  // Senha em texto plano
const saltRounds = 10;  // Quanto maior, mais seguro (mas mais lento)

const hash = await bcrypt.hash(password, saltRounds);
// $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
//  ││ │└────────────────────┴───────────────────────────────────┘
//  ││ │                     Hash (60 caracteres)
//  ││ └─ Salt (22 caracteres)
//  │└─── Cost factor (10)
//  └──── Algoritmo (2b = bcrypt)

// Salva no banco
await prisma.user.create({
  data: {
    email: 'user@email.com',
    password: hash  // NUNCA salvar senha em texto plano!
  }
});

// COMPARE (Login)
const inputPassword = '123456';  // Senha digitada pelo usuário
const storedHash = user.password;  // Hash do banco

const isValid = await bcrypt.compare(inputPassword, storedHash);

if (isValid) {
  // Senha correta, gera JWT
  const token = jwt.sign({...});
} else {
  // Senha incorreta
  throw new AppError('Senha inválida', 401);
}
```

**Por que bcrypt e não MD5/SHA1?**

```javascript
// ❌ MD5 (INSEGURO!)
const md5 = require('md5');
const hash = md5('123456');  // e10adc3949ba59abbe56e057f20f883e
// Problema: Sempre gera o mesmo hash
// Vulnerável a rainbow tables
// Rápido demais = fácil de quebrar

// ❌ SHA256 (INSEGURO para senhas!)
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('123456').digest('hex');
// Problema: Sem salt automático
// Rápido demais

// ✅ Bcrypt (SEGURO!)
const hash = await bcrypt.hash('123456', 10);
// $2b$10$abcd1234...
// Cada hash é único (salt aleatório)
// Lento de propósito (força bruta é inviável)
// Resistente a GPU/ASIC attacks
```

---

### Express Validator

**O que é:**
- Biblioteca de validação e sanitização
- Baseada no validator.js
- Integração perfeita com Express

**Implementação:**
```javascript
// backend/routes/customer.routes.js
const { body, param, query, validationResult } = require('express-validator');

// Middleware de validação
const validateCustomer = [
  body('name')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres')
    .trim(),  // Remove espaços em branco

  body('cpfCnpj')
    .notEmpty().withMessage('CPF/CNPJ é obrigatório')
    .custom(value => {
      // Validação customizada
      const onlyNumbers = value.replace(/\D/g, '');
      if (onlyNumbers.length !== 11 && onlyNumbers.length !== 14) {
        throw new Error('CPF/CNPJ inválido');
      }
      return true;
    }),

  body('email')
    .optional()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),  // Sanitiza email

  body('type')
    .isIn(['INDIVIDUAL', 'COMPANY']).withMessage('Tipo inválido'),
];

// Middleware que processa erros
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array()
    });
  }

  next();
};

// Uso na rota
router.post('/',
  authMiddleware,
  validateCustomer,  // Validações
  validate,          // Processa erros
  asyncHandler(customerController.create)
);
```

**Validações Comuns:**
```javascript
// Strings
body('name').notEmpty().isLength({ min: 3, max: 100 })
body('email').isEmail().normalizeEmail()
body('url').isURL()

// Números
body('age').isInt({ min: 0, max: 150 })
body('price').isFloat({ min: 0 })

// Booleanos
body('active').isBoolean()

// Datas
body('birthdate').isISO8601().toDate()

// Enums
body('role').isIn(['ADMIN', 'MANAGER', 'USER'])

// Customizadas
body('cpf').custom(value => validarCPF(value))

// Sanitização
body('name').trim().escape()  // Remove HTML tags
body('email').normalizeEmail()
body('phone').customSanitizer(value => value.replace(/\D/g, ''))
```

---

## 🎨 Frontend Stack

### React 18.2

**O que é:**
- Biblioteca JavaScript para UIs
- Component-based
- Virtual DOM para performance

**Conceitos Fundamentais:**

**1. Components**
```jsx
// Componente Funcional
function CustomerCard({ customer }) {
  return (
    <div className="card">
      <h3>{customer.name}</h3>
      <p>{customer.email}</p>
    </div>
  );
}

// Uso
<CustomerCard customer={{ name: 'João', email: 'joao@email.com' }} />
```

**2. Props (Propriedades)**
```jsx
// Passar dados do pai para filho
function ParentComponent() {
  const customer = { name: 'João', email: 'joao@email.com' };

  return (
    <CustomerCard
      customer={customer}
      onEdit={() => console.log('Editar')}
      isActive={true}
    />
  );
}

function CustomerCard({ customer, onEdit, isActive }) {
  // Recebe props como parâmetro
  return (
    <div className={isActive ? 'active' : ''}>
      <h3>{customer.name}</h3>
      <button onClick={onEdit}>Editar</button>
    </div>
  );
}
```

**3. State (Estado)**
```jsx
import { useState } from 'react';

function Counter() {
  // Declarar estado
  const [count, setCount] = useState(0);
  //      ↑        ↑          ↑
  //   Valor   Setter   Valor Inicial

  return (
    <div>
      <p>Você clicou {count} vezes</p>
      <button onClick={() => setCount(count + 1)}>
        Clique aqui
      </button>
    </div>
  );
}
```

**4. Effects (Efeitos)**
```jsx
import { useEffect } from 'react';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Executado após o componente montar
  useEffect(() => {
    async function fetchCustomers() {
      const response = await api.get('/customers');
      setCustomers(response.data.customers);
      setLoading(false);
    }

    fetchCustomers();
  }, []);  // [] = executa apenas uma vez

  if (loading) return <p>Carregando...</p>;

  return (
    <ul>
      {customers.map(customer => (
        <li key={customer.id}>{customer.name}</li>
      ))}
    </ul>
  );
}
```

**5. Conditional Rendering**
```jsx
function UserGreeting({ user }) {
  // If/else
  if (!user) {
    return <p>Por favor, faça login</p>;
  }

  // Ternário
  return (
    <div>
      <h1>Olá, {user.name}</h1>
      {user.isAdmin ? (
        <button>Painel Admin</button>
      ) : (
        <p>Você não é admin</p>
      )}
    </div>
  );
}
```

**6. Lists & Keys**
```jsx
function ProductList({ products }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {/*    ↑ key é obrigatória para listas */}
          {product.name} - R$ {product.price}
        </li>
      ))}
    </ul>
  );
}
```

---

### React Router 6.x

**O que é:**
- Roteamento para React SPAs
- Navegação entre páginas

**Configuração:**
```jsx
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas privadas */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
        </Route>

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Componente de rota privada
function PrivateRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;  // Renderiza rotas filhas
}
```

**Navegação Programática:**
```jsx
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();  // Pega parâmetro da URL
  const location = useLocation();  // Informações da URL atual

  const handleDelete = async () => {
    await api.delete(`/customers/${id}`);
    navigate('/customers');  // Navega para lista
  };

  const handleEdit = () => {
    navigate(`/customers/${id}/edit`, {
      state: { from: location.pathname }  // Passa estado
    });
  };

  return (
    <div>
      <h1>Cliente #{id}</h1>
      <button onClick={handleEdit}>Editar</button>
      <button onClick={handleDelete}>Excluir</button>
    </div>
  );
}
```

---

### Axios

**O que é:**
- Cliente HTTP baseado em Promises
- Funciona no browser e Node.js

**Configuração:**
```javascript
// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
  timeout: 10000  // 10 segundos
});

// Interceptor de requisição
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('@TudoGestao:token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Interceptor de resposta
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado/inválido
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
```

**Uso:**
```jsx
import api from '../services/api';

// GET
const customers = await api.get('/customers');
const customer = await api.get(`/customers/${id}`);
const filtered = await api.get('/customers', {
  params: { active: true, page: 1 }
});
// Gera: /customers?active=true&page=1

// POST
const newCustomer = await api.post('/customers', {
  name: 'João Silva',
  email: 'joao@email.com'
});

// PUT
await api.put(`/customers/${id}`, {
  email: 'novo@email.com'
});

// DELETE
await api.delete(`/customers/${id}`);

// Com tratamento de erro
try {
  const response = await api.post('/customers', data);
  toast.success('Cliente criado!');
} catch (error) {
  const message = error.response?.data?.error || 'Erro ao criar cliente';
  toast.error(message);
}
```

---

### React Hot Toast

**O que é:**
- Biblioteca de notificações toast
- Customizável e leve

**Configuração:**
```jsx
// frontend/src/App.jsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#48bb78',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f56565',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Resto da app */}
    </>
  );
}
```

**Uso:**
```jsx
import toast from 'react-hot-toast';

// Sucesso
toast.success('Cliente criado com sucesso!');

// Erro
toast.error('Erro ao criar cliente');

// Info
toast('Processando...', { icon: 'ℹ️' });

// Loading
const loadingToast = toast.loading('Salvando...');
// ... após salvar
toast.dismiss(loadingToast);
toast.success('Salvo!');

// Customizado
toast.custom((t) => (
  <div className={`custom-toast ${t.visible ? 'show' : 'hide'}`}>
    <h4>Confirmação</h4>
    <p>Tem certeza?</p>
    <button onClick={() => toast.dismiss(t.id)}>Sim</button>
  </div>
));

// Promise
toast.promise(
  api.post('/customers', data),
  {
    loading: 'Salvando...',
    success: 'Cliente criado!',
    error: 'Erro ao criar'
  }
);
```

---

### Vite

**O que é:**
- Build tool moderna
- Extremamente rápido
- Hot Module Replacement (HMR)

**Configuração:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,  // Abre browser automaticamente
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          axios: ['axios']
        }
      }
    }
  }
});
```

**Variáveis de Ambiente:**
```bash
# .env
VITE_API_URL=http://localhost:3333/api
VITE_APP_NAME=TudoGestão+

# .env.production
VITE_API_URL=https://api.tudogestao.com
```

```jsx
// Uso
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## 📚 Dependências Completas

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",           // Framework web
    "prisma": "^5.0.0",              // ORM
    "@prisma/client": "^5.0.0",      // Prisma Client
    "bcrypt": "^5.1.0",              // Hash de senhas
    "jsonwebtoken": "^9.0.0",        // JWT
    "cors": "^2.8.5",                // CORS
    "dotenv": "^16.0.3",             // Variáveis ambiente
    "express-validator": "^7.0.1",   // Validação
    "pdfkit": "^0.13.0",             // Geração PDF
    "exceljs": "^4.3.0",             // Exportação Excel
    "multer": "^1.4.5-lts.1"         // Upload arquivos
  },
  "devDependencies": {
    "nodemon": "^2.0.22",            // Hot reload
    "jest": "^29.5.0",               // Testes
    "supertest": "^6.3.3"            // Testes HTTP
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",              // React
    "react-dom": "^18.2.0",          // React DOM
    "react-router-dom": "^6.11.0",   // Roteamento
    "axios": "^1.4.0",               // HTTP client
    "react-hot-toast": "^2.4.1",     // Toasts
    "react-icons": "^4.8.0"          // Ícones
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0", // Vite React plugin
    "vite": "^4.3.9",                 // Build tool
    "@types/react": "^18.2.0"         // TypeScript types
  }
}
```

---

**Última Atualização:** 19/11/2025
**Versão:** 1.0
**Autor:** Michael Santos - Tech Lead
