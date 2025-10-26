# 💰 TudoGestão+ Financeiro | ERP para Micro e Pequenas Empresas

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-compose-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**ERP Completo para Gestão Financeira com Emissão de NF-e, Open Banking e Conciliação Bancária**

[Documentação](#) • [API](#api) • [Instalação](#instalação) • [Equipe](#equipe)

</div>

---

## 📋 Sumário Executivo

TudoGestão+ Financeiro é um ERP leve para micro e pequenas empresas construído em **Python** com:
- **Backend:** FastAPI + PostgreSQL + Redis/Celery
- **Frontend:** Streamlit (interface simples e moderna)
- **Funcionalidades:** Gestão financeira, emissão de NF-e, conciliação bancária automática, relatórios DRE/Fluxo de Caixa
- **Diferenciais:** Multi-empresa, Open Banking, UX simples, preço acessível

**Objetivo:** Democratizar gestão financeira profissional para pequenos negócios.

---

## 🎯 Escopo Funcional - MVP

### ✅ Fase I (MVP - Entrega Obrigatória)

1. **Autenticação & Multi-tenant**
   - Login JWT + Refresh Token
   - Multi-empresa (owner/admin/user roles)
   - Gestão de usuários e permissões

2. **Gestão Financeira**
   - CRUD completo de transações (receitas/despesas)
   - Categorias personalizáveis
   - Contas bancárias
   - Clientes e fornecedores

3. **Dashboard Analítico**
   - KPIs em tempo real (saldo, receitas, despesas)
   - Gráficos interativos
   - Transações recentes

4. **Emissão de NF-e**
   - Integração SEFAZ-SP (microserviço isolado)
   - Geração e assinatura XML
   - Acompanhamento de status

5. **Conciliação Bancária**
   - Importação de extratos (mock Open Banking)
   - Conciliação automática básica
   - Matching de transações

6. **Relatórios**
   - DRE (Demonstração do Resultado do Exercício)
   - Fluxo de Caixa
   - Export PDF/Excel

### 🚀 Fase II (Avançado)

- Integrações reais Open Banking
- WebSockets para atualizações em tempo real
- Machine Learning para previsão de fluxo de caixa
- PWA mobile
- Rate limiting e load testing

---

## 🏗️ Arquitetura

### C4 - Nível 2 (Containers)

```
┌─────────────────────────────────────────────────────────────┐
│                         TudoGestão+                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │───▶│     API      │───▶│  PostgreSQL  │  │
│  │  Streamlit   │    │   FastAPI    │    │      15      │  │
│  │  (port 8501) │    │  (port 8000) │    │  (port 5432) │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                             │                                │
│                             ▼                                │
│                      ┌──────────────┐                        │
│                      │    Redis     │                        │
│                      │ Cache + Queue│                        │
│                      │  (port 6379) │                        │
│                      └──────────────┘                        │
│                             │                                │
│                             ▼                                │
│                      ┌──────────────┐                        │
│                      │    Celery    │                        │
│                      │   Workers    │                        │
│                      │  (async)     │                        │
│                      └──────────────┘                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            SEFAZ Service (Microserviço)               │   │
│  │         NF-e SOAP Handler (port 8001)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### Backend
- **FastAPI** 0.104+ - Framework web moderno
- **PostgreSQL** 15 - Banco de dados relacional
- **Redis** 7+ - Cache e message broker
- **Celery** - Processamento assíncrono
- **Alembic** - Migrations
- **SQLAlchemy** - ORM
- **Pydantic** - Validação de dados

### Frontend
- **Streamlit** - Interface web interativa
- **Plotly** - Gráficos interativos
- **Pandas** - Manipulação de dados

### DevOps
- **Docker** + Docker Compose
- **Kubernetes** (EKS para produção)
- **GitHub Actions** - CI/CD
- **Terraform** - Infrastructure as Code
- **AWS** - Cloud hosting

### Segurança
- JWT + Refresh Tokens
- Criptografia AES-256
- TLS/HTTPS
- OWASP best practices

---

## 📊 Requisitos Não Funcionais

| Métrica | Target MVP | Target Produção |
|---------|------------|-----------------|
| Response Time (p95) | < 200ms | < 50ms |
| Uptime | 99.9% | 99.99% |
| Test Coverage | >= 85% | >= 90% |
| Concurrent Users | 100 | 2000+ |
| Bugs Críticos | 0 | 0 |

---

## 📁 Estrutura do Projeto

```
tudogestao-financeiro/
├── backend/
│   ├── app/
│   │   ├── api/              # Endpoints FastAPI
│   │   ├── core/             # Configurações core
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Lógica de negócio
│   │   └── db/               # Database utilities
│   ├── tests/                # Testes unitários/integração
│   ├── alembic/              # Migrations
│   └── requirements.txt
│
├── frontend/
│   ├── app.py                # Streamlit main
│   ├── pages/                # Páginas do app
│   ├── components/           # Componentes reutilizáveis
│   └── requirements.txt
│
├── sefaz-service/
│   ├── app/                  # Microserviço NF-e
│   ├── xml_templates/        # Templates XML
│   └── requirements.txt
│
├── database/
│   ├── migrations/           # Alembic migrations
│   └── seeds/                # Dados de teste
│
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml
│   ├── k8s/                  # Kubernetes manifests
│   └── terraform/            # IaC AWS
│
├── docs/
│   ├── api/                  # OpenAPI specs
│   ├── architecture/         # Diagramas C4
│   └── guides/               # Guias de uso
│
└── .github/
    └── workflows/            # CI/CD pipelines
```

---

## 🚀 Instalação

### Pré-requisitos

- Docker & Docker Compose
- Python 3.11+
- Git

### Setup Rápido

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/tudogestao-financeiro.git
cd tudogestao-financeiro

# 2. Configure variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Inicie os containers
docker-compose up -d

# 4. Execute migrations
docker-compose exec api alembic upgrade head

# 5. Seed database (dados de teste)
docker-compose exec api python -m app.db.seeds

# 6. Acesse a aplicação
# Frontend: http://localhost:8501
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Instalação Local (Desenvolvimento)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (outro terminal)
cd frontend
pip install -r requirements.txt
streamlit run app.py
```

---

## 👥 Equipe & Responsabilidades

| Nome | Cargo | GitHub | Email | Responsabilidade |
|------|-------|--------|-------|------------------|
| **Michael Santos** | Tech Lead | @michael-santos | michaelsantos@uni9.edu.br | Arquitetura, Code Review, DevOps |
| **Larissa Oliveira** | Product Manager | @larissa-oliveira | l.fernanda.oliveira@uni9.edu.br | Product, UX, Business Logic |
| **Felipe Gonzaga** | Frontend Developer | @felipe-gonzaga | fg593376@uni9.edu.br | Streamlit, UI/UX, Gráficos |
| **Rubens Neto** | Backend Developer | @rubens-neto | rubenscbn@uni9.edu.br | FastAPI, Database, APIs |
| **Najla Cardeal** | QA/Designer | @najla-cardeal | najla.vianac@uni9.edu.br | Testes, UI Design, QA |
| **Thaynara Ribeiro** | Full Stack | @thaynara-ribeiro | thaynara.ribeiro@uni9.edu.br | Backend + Frontend |
| **Eliseu Junior** | Full Stack | @eliseu-junior | eliseugama@uni9.edu.br | Backend + Frontend |

### 📚 Áreas de Estudo por Membro

#### Michael Santos (Tech Lead)
- **Arquitetura:** Padrões de design, microserviços, escalabilidade
- **DevOps:** Docker, Kubernetes, CI/CD, Terraform
- **Segurança:** JWT, OWASP, criptografia
- **Performance:** Otimização de queries, caching

#### Larissa Oliveira (Product Manager)
- **Business Logic:** Regras de negócio financeiro, fluxos
- **UX/Product:** Wireframes, user stories, priorização
- **APIs:** Entendimento de contratos de API
- **Integrações:** Open Banking, SEFAZ

#### Felipe Gonzaga (Frontend)
- **Streamlit:** Components, layouts, state management
- **Visualização:** Plotly, gráficos, dashboards
- **UX:** Interface intuitiva, responsividade
- **API Integration:** Consumo de APIs REST

#### Rubens Neto (Backend)
- **FastAPI:** Rotas, dependency injection, middlewares
- **SQLAlchemy:** Models, queries, relationships
- **PostgreSQL:** Queries avançadas, índices, performance
- **Celery:** Tasks assíncronas, queues

#### Najla Cardeal (QA/Designer)
- **Testes:** Pytest, coverage, integration tests
- **Design:** UI/UX patterns, Figma
- **QA:** Test plans, bug tracking
- **Acessibilidade:** WCAG, usabilidade

#### Thaynara Ribeiro (Full Stack)
- **Backend:** FastAPI + SQLAlchemy
- **Frontend:** Streamlit + visualização
- **Integração:** API consumo e criação
- **Database:** Migrations e queries

#### Eliseu Junior (Full Stack)
- **Backend:** FastAPI + Celery
- **Frontend:** Streamlit + components
- **SEFAZ:** Microserviço NF-e
- **Testes:** Unit e integration tests

---

## 🔑 API Endpoints (Resumo)

### Autenticação
```
POST   /api/v1/auth/login      # Login
POST   /api/v1/auth/refresh    # Refresh token
POST   /api/v1/auth/logout     # Logout
```

### Empresas
```
GET    /api/v1/companies       # Listar empresas
POST   /api/v1/companies       # Criar empresa
GET    /api/v1/companies/{id}  # Obter empresa
PUT    /api/v1/companies/{id}  # Atualizar empresa
```

### Transações
```
GET    /api/v1/transactions    # Listar transações
POST   /api/v1/transactions    # Criar transação
GET    /api/v1/transactions/{id}  # Obter transação
PUT    /api/v1/transactions/{id}  # Atualizar transação
DELETE /api/v1/transactions/{id}  # Deletar transação
```

### NF-e
```
POST   /api/v1/invoices        # Emitir NF-e
GET    /api/v1/invoices/{id}   # Status NF-e
GET    /api/v1/invoices        # Listar NF-es
```

### Relatórios
```
GET    /api/v1/reports/dre         # DRE
GET    /api/v1/reports/cashflow    # Fluxo de Caixa
GET    /api/v1/reports/export      # Export PDF/Excel
```

**Documentação completa:** http://localhost:8000/docs

---

## 🧪 Testes

```bash
# Rodar todos os testes
pytest

# Com coverage
pytest --cov=app --cov-report=html

# Testes específicos
pytest tests/test_auth.py
pytest tests/test_transactions.py

# Load testing
locust -f tests/load/locustfile.py
```

**Target:** Coverage >= 85%

---

## 📦 Deploy

### Docker Compose (Development)
```bash
docker-compose up -d
```

### Kubernetes (Production)
```bash
kubectl apply -f infra/k8s/
```

### CI/CD Pipeline
- **Push to main:** → Build → Test → Deploy Staging
- **Tag release:** → Build → Test → Deploy Production

---

## 🔐 Segurança

- ✅ JWT Authentication + Refresh Tokens
- ✅ Password hashing (bcrypt)
- ✅ SQL Injection protection (SQLAlchemy ORM)
- ✅ XSS protection
- ✅ CORS configured
- ✅ Rate limiting
- ✅ HTTPS/TLS
- ✅ Secrets management (env vars)

---

## 📈 Performance

- **Caching:** Redis para queries frequentes
- **Database:** Índices otimizados, query optimization
- **Async:** Celery para tarefas pesadas (NF-e, relatórios)
- **CDN:** Assets estáticos
- **Load Balancer:** Nginx/ALB

---

## 📝 Licença

MIT License - veja [LICENSE](LICENSE)

---

## 🆘 Suporte

- 📧 Email: suporte@tudogestao.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/tudogestao-financeiro/issues)
- 📚 Docs: [docs/](docs/)

---

## 🎓 Projeto Integrador

Este projeto é parte do **Projeto Integrador - Gestão** e contempla:

✅ Modelagem de Dados (DER/MER)  
✅ Arquitetura C4  
✅ Wireframes  
✅ Frontend completo  
✅ APIs REST  
✅ Integrações  
✅ Testes  
✅ Deploy  

---

<div align="center">

**Desenvolvido com ❤️ pela equipe TudoGestão+**

⭐ Deixe uma estrela se este projeto te ajudou!

</div>