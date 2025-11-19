# 🚀 Guia de Instalação e Configuração - TudoGestão+

## ⚠️ IMPORTANTE: Siga TODOS os passos na ordem

### Pré-requisitos

Certifique-se de ter instalado:
- ✅ Node.js 18+ ([Baixar](https://nodejs.org/))
- ✅ PostgreSQL 14+ ([Baixar](https://www.postgresql.org/download/))
- ✅ Git ([Baixar](https://git-scm.com/))

---

## 📋 Passo a Passo

### 1️⃣ Configurar o Banco de Dados PostgreSQL

Abra o **pgAdmin** ou terminal do PostgreSQL e execute:

```sql
-- Criar banco de dados
CREATE DATABASE tudogestao;

-- Criar usuário (caso não exista)
CREATE USER postgres WITH PASSWORD 'postgres';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE tudogestao TO postgres;
```

**OU** use seu usuário PostgreSQL existente e atualize o arquivo `.env` com suas credenciais.

---

### 2️⃣ Instalar Dependências do Backend

Abra o terminal na pasta do projeto:

```bash
cd backend
npm install
```

---

### 3️⃣ Configurar Variáveis de Ambiente

O arquivo `.env` já existe em `backend/.env`. Verifique se está assim:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tudogestao?schema=public"
PORT=3333
NODE_ENV=development
JWT_SECRET=tudogestao_secret_key_dev_2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ENCRYPTION_KEY=tudogestao_encryption_key_32chars_min
```

⚠️ **IMPORTANTE**: Se suas credenciais do PostgreSQL forem diferentes, atualize a linha `DATABASE_URL`:
- Usuário diferente de `postgres`? Troque o primeiro `postgres`
- Senha diferente de `postgres`? Troque o segundo `postgres`
- Porta diferente de `5432`? Troque `5432`
- A porta padrão do backend é `3333` (não 3001)

---

### 4️⃣ Executar Migrations do Prisma

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

Isso vai criar todas as tabelas no banco de dados.

---

### 5️⃣ Popular o Banco com Dados de Teste

```bash
cd backend
npm run seed
```

Você verá uma mensagem: "✅ Dados de demonstração criados com sucesso!"

**Credenciais criadas:**
- Email: `admin@demostore.com`
- Senha: `123456`

---

### 6️⃣ Instalar Dependências do Frontend

```bash
cd ../frontend
npm install
```

---

### 7️⃣ Iniciar o Sistema

Você precisa de **2 terminais abertos**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Você deve ver: `🚀 Server running on port 3333`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Você deve ver: `➜ Local: http://localhost:5173/`

---

### 8️⃣ Acessar o Sistema

1. Abra o navegador em: **http://localhost:5173**
2. Faça login com:
   - **Email:** `admin@demostore.com`
   - **Senha:** `123456`

---

## ✅ Verificar se Tudo Funcionou

Após fazer login, você deve conseguir:

- ✅ Ver o **Dashboard** com estatísticas
- ✅ Acessar **Produtos** e ver produtos cadastrados
- ✅ Acessar **Vendas** e criar uma nova venda
- ✅ Acessar **Clientes**, **Fornecedores**, **Funcionários**
- ✅ Acessar **Usuários** e gerenciar usuários do sistema
- ✅ Acessar **Configurações** e editar dados da empresa
- ✅ Acessar **Relatórios** e gerar relatórios formatados profissionalmente
- ✅ Acessar **NFe** e emitir notas fiscais com DANFE imprimível
- ✅ Ver o **logo SVG** na sidebar (não mais o emoji 🚀)

---

## 🆕 Funcionalidades Recentemente Implementadas

### 📄 Sistema de NFe (Nota Fiscal Eletrônica)
- Emissão de NFe demonstrativa integrada com vendas
- DANFE (Documento Auxiliar da Nota Fiscal) imprimível
- Layout profissional conforme padrões fiscais
- Histórico de notas emitidas
- **Página:** NFe (acessível pelo menu lateral)

### 📊 Relatórios Profissionais
- Relatórios formatados em HTML (não mais JSON bruto)
- DRE (Demonstração do Resultado do Exercício) completo
- Relatório de vendas com filtros de período
- Relatório de estoque com alertas de produtos baixos
- Relatório de clientes com estatísticas
- Exportação pronta para impressão
- **Página:** Relatórios (acessível pelo menu lateral)

### 👥 CRUD Completo de Clientes
- Modal interativo para criar/editar clientes
- Suporte para Pessoa Física (CPF) e Jurídica (CNPJ)
- Validação de CPF/CNPJ duplicado
- Campos completos de endereço
- Histórico de compras por cliente
- Toast notifications para todas as ações
- **Página:** Clientes (acessível pelo menu lateral)

### 🔧 Melhorias no Backend
- Correção do Financial Controller (método cashFlow)
- Atualização do Product Controller (uso correto de req.companyId)
- Correção do Customer Controller (campos duplicados resolvidos)
- Validações aprimoradas em todos os controllers
- Audit logging funcional

### 🎨 Melhorias no Frontend
- React Hot Toast configurado e funcionando
- Formatação profissional de todos os relatórios
- Interface responsiva e moderna
- Loading states em todas as requisições
- Tratamento de erros consistente

---

## 🐛 Problemas Comuns

### ❌ Erro: "Cannot connect to database"
**Solução:** Verifique se o PostgreSQL está rodando e se as credenciais no `.env` estão corretas.

### ❌ Erro: "Port 3333 already in use"
**Solução:** Mate o processo que está usando a porta 3333:
```bash
# Windows
netstat -ano | findstr :3333
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3333
kill -9 <PID>
```

### ❌ Erro: "Prisma schema not found"
**Solução:** Execute novamente:
```bash
cd backend
npx prisma generate
```

### ❌ Página em branco ou erro 404
**Solução:**
1. Certifique-se de que o backend está rodando na porta 3333
2. Verifique se o frontend está acessando `http://localhost:5173`
3. Abra o console do navegador (F12) e veja os erros
4. Verifique se o arquivo `frontend/src/services/api.js` aponta para `http://localhost:3333/api`

### ❌ Erro ao fazer login
**Solução:** Execute o seed novamente:
```bash
cd backend
npm run seed
```

---

## 📚 Dados de Demonstração Criados

O script `npm run seed` cria:

- 🏢 1 empresa (Demo Store)
- 👥 3 usuários (ADMIN, MANAGER, USER)
- 📦 5 categorias
- 🚚 3 fornecedores
- 📦 10 produtos
- 👤 5 clientes
- 👔 3 funcionários
- 💰 5 vendas
- 💳 10 transações financeiras

---

## 🔧 Comandos Úteis

```bash
# Reiniciar o banco de dados (CUIDADO: apaga tudo!)
cd backend
npx prisma migrate reset

# Visualizar banco de dados
cd backend
npx prisma studio
# Abre em http://localhost:5555

# Ver logs do backend
cd backend
npm run dev

# Gerar novos dados de teste
cd backend
npm run seed
```

---

## 📚 Documentação da Equipe

Cada membro da equipe tem uma documentação detalhada explicando sua parte no projeto. Ideal para estudar e entender como cada módulo foi desenvolvido!

**Documentação disponível em `/docs`:**

- 📄 `01-MICHAEL-TECH-LEAD.md` - Arquitetura, liderança técnica, visão geral do sistema
- 📄 `02-RUBENS-BACKEND.md` - Controllers principais, Prisma ORM, validações
- 📄 `03-FELIPE-FRONTEND.md` - React, componentes, integração com API
- 📄 `04-THAYNARA-FULLSTACK.md` - Services (PDF, Excel, Audit), padrões full stack
- 📄 `05-ELISEU-FULLSTACK.md` - Autenticação JWT, vendas, financeiro
- 📄 `06-LARISSA-PRODUCT-MANAGER.md` - Roadmap, user stories, priorização RICE
- 📄 `07-NAJLA-QA-DESIGNER.md` - Design system, QA, testes de usabilidade
- 📄 `PODCAST-PRESENTATION-SCRIPT.md` - Apresentação estilo podcast do projeto

**Recomendamos:**
1. Cada membro da equipe deve ler sua própria documentação
2. Fazer engenharia reversa no código para aprender
3. Estudar os conceitos explicados em cada arquivo
4. Experimentar modificar o código para entender melhor

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique se TODOS os passos foram seguidos na ordem
2. Verifique se PostgreSQL está rodando
3. Verifique se as portas 3001 e 5173 estão livres
4. Limpe o cache do navegador (Ctrl + Shift + Delete)
5. Reinicie o backend e frontend

---

**Bom uso! 🚀**
