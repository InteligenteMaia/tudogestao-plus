# Nível 1 — Diagrama de Contexto
Breve descrição
---------------
Este diagrama de contexto mostra o sistema TudoGestão+ (ERP para MPEs) e os principais atores/serviços externos com os quais interage: usuário final (administrador/operador), instituições financeiras (bancos), SEFAZ (emissão de NF-e), provedores de pagamento (gateway), serviços de e-mail/SMTP e serviços de autenticação externa (OAuth / provedores SSO). O objetivo é deixar explícito quem usa o sistema e quais dependências externas existem.

```mermaid
graph LR
  %% Ators externos
  U[Usuário / Operador] ---|Usa UI (Streamlit)| UI[TudoGestão+ - Interface]
  UI ---|Chama APIs| APIGW[TudoGestão+ API Gateway]
  APIGW ---|Proxy para| FIN[Financial Service (microservice)]
  APIGW ---|Proxy para| FISC[Fiscal Service (NF-e)]
  APIGW ---|Proxy para| AUTH[Auth Service (JWT / OAuth)]

  %% Integrações externas
  FISC ---|Emite NF-e / Consulta| SEFAZ[SEFAZ (Web Services)]
  FIN ---|Concilia/consulta| BANK[Instituição Financeira / Bank APIs]
  FIN ---|Integra| PAY[Gateway de Pagamento (ex: Stripe/Pagar.me)]
  APIGW ---|Eventos assíncronos| MQ[Message Broker (Redis/RabbitMQ)]
  MQ ---|Fila de processamento| CELERY[Workers (Celery)]

  %% Notificações
  CELERY ---|Envia e-mails| SMTP[Serviço de E-mail (SMTP)]
  UI ---|Usuário administra| ADMIN[Equipe de Suporte / Help Desk]

  %% Sistema principal
  subgraph TudoGestaoPlus [TudoGestão+]
    UI
    APIGW
    FIN
    FISC
    AUTH
    MQ
    CELERY
  end

  %% Observações visuais
  classDef extActor fill:#f9f,stroke:#333,stroke-width:1px;
  class U,SEFAZ,BANK,PAY,SMTP,ADMIN extActor;

