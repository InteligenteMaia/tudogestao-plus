# 👨‍💻 Michael Santos - Tech Lead & Arquiteto

## 📋 Informações Profissionais

- **Cargo:** Tech Lead & Arquiteto de Software
- **Salário:** R$ 18.000/mês
- **Regime:** Home Office
- **Horário:** Seg-Sex • 09h-18h

## 🎯 Responsabilidades no Projeto

Como Tech Lead, você é responsável por:

1. **Arquitetura do Sistema**
   - Definir padrões de código e arquitetura
   - Garantir escalabilidade e performance
   - Revisar decisões técnicas críticas

2. **Coordenação da Equipe**
   - Distribuir tarefas entre desenvolvedores
   - Code review de pull requests
   - Mentoria técnica dos membros

3. **Infraestrutura e DevOps**
   - Configuração de ambientes
   - Pipeline CI/CD
   - Monitoramento e logs

## 📂 Arquivos Principais de Responsabilidade

### Estrutura Geral do Projeto
```
├── 📁 .github/workflows/        # CI/CD pipelines
├── 📁 docker/                   # Containerização
├── 📄 docker-compose.yml        # Orquestração de containers
└── 📄 README.md                 # Documentação principal
```

### Configurações Críticas

#### Backend
```
backend/
├── 📄 server.js                 # Entry point do servidor
├── 📁 config/
│   ├── database.js              # Conexão com PostgreSQL
│   ├── redis.js                 # Cache config
│   └── security.js              # Configurações de segurança
├── 📁 middleware/
│   ├── auth.middleware.js       # Autenticação JWT
│   ├── error.middleware.js      # Tratamento de erros
│   └── rateLimit.middleware.js  # Proteção contra DDoS
└── 📄 package.json              # Dependências
```

#### Frontend
```
frontend/
├── 📄 vite.config.js            # Build configuration
├── 📁 src/
│   ├── App.jsx                  # Componente raiz
│   ├── main.jsx                 # Entry point
│   └── 📁 services/
│       ├── api.js               # Cliente HTTP (Axios)
│       └── auth.js              # Serviço de autenticação
└── 📄 package.json              # Dependências
```

## 🔧 Estudo de Engenharia Reversa

### 1. Arquitetura Geral

O sistema segue uma **arquitetura MVC + REST API**:

```
[Frontend React] <--HTTP/JSON--> [Backend Express] <--SQL--> [PostgreSQL]
```

**Fluxo de uma Requisição:**
```
1. Usuário clica em "Salvar Cliente"
2. Frontend (Customers.jsx) chama api.post('/customers', data)
3. Backend (customer.routes.js) recebe a requisição
4. Middleware (auth.middleware.js) valida o token JWT
5. Controller (customer.controller.js) processa a lógica
6. Prisma ORM executa INSERT no PostgreSQL
7. Response retorna ao Frontend com sucesso/erro
8. Frontend atualiza UI e mostra toast notification
```

### 2. Sistema de Autenticação

**Arquivo:** `backend/middleware/auth.middleware.js`

```javascript
// Quando o usuário faz login:
1. POST /auth/login com email + senha
2. Backend verifica senha com bcrypt
3. Gera token JWT com dados do usuário
4. Token é enviado ao frontend
5. Frontend guarda no localStorage
6. Toda requisição subsequente inclui:
   Authorization: Bearer <token>
```

**Segurança implementada:**
- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT com expiração
- ✅ Middleware de validação em todas rotas protegidas
- ✅ CORS configurado
- ✅ Rate limiting contra ataques

### 3. Gestão de Estado Frontend

**Redux Toolkit** usado para estado global:

```javascript
// Store centralizada em: frontend/src/store/
store/
├── store.js           // Configuração Redux
└── slices/
    ├── authSlice.js   // Estado de autenticação
    ├── cartSlice.js   // Carrinho de vendas
    └── uiSlice.js     // UI (modals, loading, etc)
```

**Exemplo de fluxo Redux:**
```javascript
// 1. Usuário clica em "Adicionar produto"
dispatch(addToCart(produto))

// 2. Redux atualiza o estado
state.cart.items = [...state.cart.items, produto]

// 3. Componente re-renderiza automaticamente
// porque está "conectado" ao Redux via useSelector
```

### 4. Banco de Dados com Prisma ORM

**Schema:** `backend/prisma/schema.prisma`

```prisma
// Define estrutura das tabelas
model Customer {
  id        String   @id @default(uuid())
  name      String
  cpfCnpj   String   @unique
  email     String?
  // ... outros campos
}
```

**Migrações:**
```bash
# Cria uma nova migração quando schema muda
npx prisma migrate dev --name add_customer_table

# Prisma gera SQL automaticamente e aplica no banco
```

### 5. Tratamento de Erros

**Padrão usado:**
```javascript
// Classe customizada de erro
class AppError extends Error {
  constructor(message, statusCode) {
    this.statusCode = statusCode
  }
}

// No controller
if (!customer) {
  throw new AppError('Cliente não encontrado', 404)
}

// Middleware captura e formata resposta
app.use(errorMiddleware)
```

## 📚 Recursos para Estudo

### Conceitos Fundamentais
1. **REST API Design**
   - HTTP Methods (GET, POST, PUT, DELETE)
   - Status Codes (200, 201, 400, 401, 404, 500)
   - JSON como formato de troca

2. **JWT (JSON Web Tokens)**
   - Como funciona autenticação stateless
   - Estrutura: header.payload.signature
   - Onde guardar tokens (localStorage vs cookies)

3. **ORM (Prisma)**
   - Abstração sobre SQL
   - Migrations e schema
   - Type-safety com TypeScript

4. **Design Patterns**
   - MVC (Model-View-Controller)
   - Repository Pattern
   - Middleware Pattern

### Links Úteis
- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)

## 🎯 Tarefas de Manutenção

Como Tech Lead, você deve:

### Diárias
- [ ] Revisar pull requests
- [ ] Responder dúvidas técnicas da equipe
- [ ] Monitorar logs de erro

### Semanais
- [ ] Reunião de planejamento técnico
- [ ] Atualizar documentação
- [ ] Revisar performance do sistema

### Mensais
- [ ] Atualizar dependências (npm update)
- [ ] Análise de segurança
- [ ] Refatoração de código legado

## 💡 Dicas para Liderança Técnica

1. **Code Review Efetivo**
   - Seja construtivo, não crítico
   - Explique o "porquê" das sugestões
   - Reconheça bom código

2. **Mentoria**
   - Pair programming com juniors
   - Compartilhe conhecimento em docs
   - Incentive perguntas

3. **Decisões Técnicas**
   - Documente decisões importantes
   - Considere trade-offs
   - Pense a longo prazo

---

**Próximos Passos:**
1. Ler toda documentação em `/docs`
2. Executar o sistema localmente
3. Explorar código de cada módulo
4. Fazer perguntas à equipe
