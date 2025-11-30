Diagrama de Componentes

Este diagrama detalha a estrutura interna do Serviço Financeiro, apresentando seus componentes principais, como rotas da API, camada de serviços, repositórios, modelos de dados, schemas e integrações externas. Ele permite visualizar claramente como as responsabilidades estão organizadas dentro do microsserviço.

```mermaid
flowchart TB

  subgraph API
    R_TX[transactions_routes]
    R_ACC[accounts_routes]
    R_CAT[categories_routes]
  end

  subgraph SERVICE
    S_TX[TransactionService]
    S_ACC[AccountService]
    S_CAT[CategoryService]
    S_CF[CashFlowCalculator]
  end

  subgraph REPO
    REPO_TX[TransactionRepository]
    REPO_ACC[AccountRepository]
    REPO_CAT[CategoryRepository]
  end

  subgraph MODEL
    M_TX[TransactionModel]
    M_ACC[AccountModel]
    M_CAT[CategoryModel]
  end

  subgraph SCHEMA
    SC_TX[TransactionSchema]
    SC_ACC[AccountSchema]
    SC_CAT[CategorySchema]
  end

  subgraph EVENTS
    EV_PUB[EventPublisher]
    CELERY[CeleryQueue]
    BANK_API[BankAPI]
  end

  R_TX --> S_TX
  R_ACC --> S_ACC
  R_CAT --> S_CAT

  S_TX --> REPO_TX
  S_ACC --> REPO_ACC
  S_CAT --> REPO_CAT

  REPO_TX --> M_TX
  REPO_ACC --> M_ACC
  REPO_CAT --> M_CAT

  R_TX --> SC_TX
  R_ACC --> SC_ACC
  R_CAT --> SC_CAT

  S_TX --> S_CF
  S_TX --> EV_PUB
  EV_PUB --> CELERY
  S_TX --> BANK_API
