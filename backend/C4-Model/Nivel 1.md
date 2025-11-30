# C4 — Nível 1: Diagrama de Contexto

**Descrição curta**  
Este diagrama de contexto mostra as interações entre os atores externos e o sistema TudoGestão+ (ERP) na arquitetura de microsserviços. Indica usuários, frontend, API Gateway, microsserviços principais e integrações externas (SEFAZ-SP, bancos, e-mail).

> **Observação:** copie exatamente o bloco `mermaid` abaixo (incluindo ```mermaid) e cole em um arquivo `.md`. O GitHub renderiza automaticamente.
```mermaid
graph LR
    U[Usuario Final] -->|Acessa via navegador| FE[Frontend Streamlit]
    FE -->|Autenticacao JWT| AUTH[Servico de Autenticacao]
    FE -->|Requisicoes REST| GATEWAY[API Gateway]

    GATEWAY --> FIN[Servico Financeiro]
    GATEWAY --> FISCAL[Servico Fiscal NFe]
    GATEWAY --> REPORTS[Servico de Relatorios]

    FIN --> DB[(PostgreSQL)]
    FISCAL --> DB

    FISCAL -->|Envio NFe| SEFAZ[SEFAZ SP]
    FIN -->|Extratos bancarios| BANK[Bancos API]
    REPORTS -->|Envio de emails| EMAIL[Servico de Email]

    subgraph Infraestrutura
      CELERY[Celery Workers]
      REDIS[Redis]
    end

    FIN --> CELERY
    FISCAL --> CELERY
    REPORTS --> CELERY
    CELERY --> REDIS

