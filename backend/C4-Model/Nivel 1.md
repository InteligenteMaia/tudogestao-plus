graph LR
    U[Usuário Final<br>Empresário] -->|Acessa via navegador| FE[Frontend Streamlit]

    FE -->|Autenticação| AUTH[Serviço de Autenticação<br>(JWT)]
    FE -->|Solicita dados financeiros| API_GW[API Gateway]
    
    API_GW --> FIN[Serviço Financeiro<br>FastAPI]
    API_GW --> FISCAL[Serviço Fiscal / NF-e<br>FastAPI]
    API_GW --> REPORTS[Serviço de Relatórios]
    
    FIN --> DB[(PostgreSQL)]
    FISCAL --> DB

    FISCAL -->|Envio NF-e| SEFAZ[SEFAZ-SP]
    FIN -->|Sincronização bancária| BANK[Bancos / APIs Bancárias]

    REPORTS --> EMAIL[Serviço de E-mail]
    FISCAL --> EMAIL

