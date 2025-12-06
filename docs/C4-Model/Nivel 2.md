# C4 — Nível 2: Diagrama de Contêiners

**Descrição curta**  

Este diagrama apresenta os contêineres principais que compõem a arquitetura de microsserviços do sistema TudoGestão+. Ele mostra como o frontend, o API Gateway, os microsserviços (Financeiro, Fiscal, Autenticação e Relatórios), o banco de dados e os componentes assíncronos (Celery e Redis) se comunicam entre si para entregar as funcionalidades do ERP.

```mermaid
flowchart LR

  U[Usuario Final] --> FE[Frontend Streamlit]

  FE --> AUTH[Servico de Autenticacao]
  FE --> GATEWAY[API Gateway]

  subgraph Microservices
    FIN[Servico Financeiro]
    FISCAL[Servico Fiscal NFe]
    REPORTS[Servico de Relatorios]
    AUTH_SERVICE[Servico de Autenticacao API]
  end

  GATEWAY --> FIN
  GATEWAY --> FISCAL
  GATEWAY --> REPORTS
  GATEWAY --> AUTH_SERVICE

  FIN --> DB[(PostgreSQL)]
  FISCAL --> DB
  REPORTS --> DB

  subgraph Async
    CELERY[Celery Workers]
    REDIS[Redis]
  end

  FIN --> CELERY
  FISCAL --> CELERY
  REPORTS --> CELERY
  CELERY --> REDIS

  FISCAL --> SEFAZ[SEFAZ SP]
  FIN --> BANK[APIs Bancarias]
  REPORTS --> EMAIL[Servico Email]

