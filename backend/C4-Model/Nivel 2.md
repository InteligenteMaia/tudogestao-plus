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
