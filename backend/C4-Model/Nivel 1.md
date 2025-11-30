# C4 — Nível 1: Diagrama de Contexto

**Descrição curta**  
Este diagrama de contexto mostra as interações entre os atores externos e o sistema TudoGestão+ (ERP) na arquitetura de microsserviços. Indica usuários, frontend, API Gateway, microsserviços principais e integrações externas (SEFAZ-SP, bancos, e-mail).

> **Observação:** copie exatamente o bloco `mermaid` abaixo (incluindo ```mermaid) e cole em um arquivo `.md`. O GitHub renderiza automaticamente.

```mermaid
graph LR
    U[Usuário Final<br>Empresário] -->|Acessa via navegador| FE[Frontend Streamlit]
    FE -->|Autenticação (JWT)| AUTH[Serviço de Autenticação]
    FE -->|Requisições REST/GraphQL| GATEWAY[API Gateway]

    GATEWAY --> FIN[Serviço Financeiro<br>(FastAPI)]
    GATEWAY --> FISCAL[Serviço Fiscal / NF-e<br>(FastAPI)]
    GATEWAY --> REPORTS[Serviço de Relatórios]

    FIN --> DB[(PostgreSQL)]
    FISCAL --> DB

    FISCAL -->|Envio/Consulta NF-e| SEFAZ[SEFAZ-SP]
    FIN -->|Sincroniza extratos| BANK[Bancos / APIs Bancárias]
    REPORTS -->|Envio de relatórios| EMAIL[Serviço de E-mail]

    subgraph Infraestrutura
      CELERY[Celery Workers]
      REDIS[(Redis)]
    end

    FIN --> CELERY
    FISCAL --> CELERY
    REPORTS --> CELERY
    CELERY --> REDIS
