# 🚀 TudoGestão+ | Sistema ERP Profissional

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Status](https://img.shields.io/badge/status-active-success)

**Sistema completo de gestão de projetos com funcionalidades avançadas de colaboração, relatórios e integrações**

[Demo](#) • [Documentação](#documentação) • [Instalação](#instalação) • [Recursos](#recursos)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API](#api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Contato](#contato)

---

## 🎯 Sobre o Projeto

**TudoGestão+** é um sistema ERP profissional desenvolvido para gerenciar projetos, tarefas, equipes e documentos de forma integrada e eficiente. O sistema oferece uma interface moderna e intuitiva, com funcionalidades avançadas como:

- 📊 **Dashboard Analítico** - Visualização em tempo real do progresso dos projetos
- 📝 **Gestão de Tarefas** - Sistema Kanban completo com drag & drop
- 👥 **Gerenciamento de Equipe** - Controle completo de membros e cargos
- 📄 **Relatórios Profissionais** - Geração de relatórios em PDF/DOCX
- 📧 **Comunicação Integrada** - Envio por Email e WhatsApp
- 🔗 **Integração GitHub** - Sincronização automática de projetos
- 📚 **Formatação ABNT** - Geração automática de documentos acadêmicos
- ✅ **Sistema de Validações** - Aprovação e revisão de entregas

---

## ✨ Recursos

### 🎨 Interface Moderna
- Design responsivo e profissional
- Dashboard interativo com gráficos
- Tema customizável
- Animações suaves

### 📊 Gestão de Projetos
- Criação e acompanhamento de projetos
- Visualização de progresso em tempo real
- Estatísticas detalhadas
- Timeline de atividades

### ✅ Sistema de Tarefas
- Quadro Kanban (A Fazer, Em Progresso, Em Revisão, Concluído)
- Atribuição de tarefas
- Prioridades e prazos
- Comentários e anexos

### 👥 Gerenciamento de Equipe
- Cadastro completo de membros
- Descrição detalhada de cargos
- Métricas de performance
- Histórico de atividades

### 📄 Relatórios Avançados
- Geração automática de relatórios
- Múltiplos formatos (PDF, DOCX, ABNT)
- Personalização de conteúdo
- Envio automático por email/WhatsApp

### 📚 Documentos ABNT
- Formatação automática nas normas ABNT
- Templates para TCC, Artigo, Monografia
- Estrutura completa (Capa, Sumário, Referências)
- Geração em PDF

### 🔗 Integração GitHub
- Conexão com repositórios
- Commit automático de arquivos
- Sincronização de projetos
- Histórico de commits

### 📧 Comunicação
- Envio de orientações para membros
- Email profissional
- WhatsApp Business
- Notificações no sistema

### ✅ Validações
- Aprovação de entregas
- Feedback estruturado
- Histórico de validações
- Notificações automáticas

---

## 🛠 Tecnologias

### Frontend
- HTML5
- CSS3 (Design moderno e responsivo)
- JavaScript (ES6+)
- Chart.js (Gráficos)
- Font Awesome (Ícones)

### Backend
- Node.js
- Express.js
- Nodemailer (Email)
- PDFKit (Geração de PDF)
- Octokit (GitHub API)

### Integrações
- GitHub API
- WhatsApp Business API
- SMTP (Email)
- Twilio (opcional para WhatsApp)

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Conta Gmail (para envio de emails)
- Token GitHub (para integração)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/tudogestao-plus.git
cd tudogestao-plus
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
GITHUB_TOKEN=seu-token-github
```

### 4. Inicie o servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

O sistema estará disponível em: **http://localhost:3000**

---

## ⚙️ Configuração

### Configuração de Email (Gmail)

1. Acesse [Senha de App do Google](https://myaccount.google.com/apppasswords)
2. Gere uma senha de app
3. Configure no arquivo `.env`:

```env
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app-gerada
```

### Configuração GitHub

1. Acesse [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Gere um novo token com permissões `repo`
3. Configure no arquivo `.env`:

```env
GITHUB_TOKEN=ghp_seu_token_aqui
```

### Configuração WhatsApp (Opcional)

Para integração com WhatsApp, você pode usar:
- [Twilio](https://www.twilio.com/whatsapp)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

---

## 💻 Uso

### Dashboard

Acesse a página principal para visualizar:
- Estatísticas dos projetos
- Gráficos de progresso
- Atividades recentes
- Alertas e pendências

### Criar Projeto

1. Clique em "Novo Projeto"
2. Preencha os dados do projeto
3. Selecione gerente e equipe
4. Clique em "Criar Projeto"

### Gerenciar Tarefas

1. Acesse "Tarefas"
2. Use o quadro Kanban para visualizar
3. Arraste cards entre colunas
4. Clique em uma tarefa para editar

### Gerar Relatório

1. Acesse "Relatórios"
2. Selecione tipo e formato
3. Configure período e projeto
4. Clique em "Gerar Relatório"
5. Opção de enviar por email/WhatsApp

### Gerar Documento ABNT

1. Acesse "Normas ABNT"
2. Selecione o projeto
3. Escolha o tipo de documento
4. Preencha informações acadêmicas
5. Clique em "Gerar Documento ABNT"

### Integração GitHub

1. Acesse "GitHub"
2. Clique em "Conectar"
3. Insira seu token
4. Sincronize projetos automaticamente

---

## 🔌 API

### Endpoints Principais

#### Projetos

```http
GET    /api/projects           # Listar projetos
POST   /api/projects           # Criar projeto
GET    /api/projects/:id       # Obter projeto
PUT    /api/projects/:id       # Atualizar projeto
DELETE /api/projects/:id       # Deletar projeto
GET    /api/projects/:id/statistics  # Estatísticas
```

#### Tarefas

```http
GET    /api/tasks              # Listar tarefas
POST   /api/tasks              # Criar tarefa
PUT    /api/tasks/:id          # Atualizar tarefa
DELETE /api/tasks/:id          # Deletar tarefa
```

#### Relatórios

```http
POST   /api/reports/generate   # Gerar relatório
POST   /api/reports/send-email # Enviar por email
POST   /api/reports/send-whatsapp # Enviar por WhatsApp
GET    /api/reports/download/:filename # Download
```

#### ABNT

```http
POST   /api/abnt/generate      # Gerar documento ABNT
GET    /api/abnt/download/:filename # Download
```

#### GitHub

```http
POST   /api/github/connect     # Conectar GitHub
GET    /api/github/repositories # Listar repositórios
POST   /api/github/commit      # Fazer commit
POST   /api/github/auto-sync   # Sincronizar projeto
```

#### Comunicação

```http
POST   /api/communication/send # Enviar comunicação
POST   /api/communication/task-orientation # Enviar orientação
GET    /api/communication/history # Histórico
```

### Exemplo de Requisição

```javascript
// Criar novo projeto
fetch('http://localhost:3000/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Meu Projeto',
    description: 'Descrição do projeto',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    manager: 'João Silva',
    team: ['Maria Santos', 'Pedro Oliveira']
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 📁 Estrutura do Projeto

```
tudogestao-plus/
├── frontend/
│   ├── index.html          # Página principal
│   ├── styles.css          # Estilos CSS
│   └── app.js              # JavaScript frontend
├── backend/
│   ├── server.js           # Servidor Express
│   ├── routes/             # Rotas da API
│   │   ├── projects.js     # Rotas de projetos
│   │   ├── tasks.js        # Rotas de tarefas
│   │   ├── team.js         # Rotas de equipe
│   │   ├── reports.js      # Rotas de relatórios
│   │   ├── communication.js # Rotas de comunicação
│   │   ├── github.js       # Rotas GitHub
│   │   ├── abnt.js         # Rotas ABNT
│   │   ├── documents.js    # Rotas de documentos
│   │   └── validations.js  # Rotas de validações
│   ├── controllers/        # Controladores
│   ├── services/           # Serviços
│   └── config/             # Configurações
├── database/               # Banco de dados (futuro)
├── docs/                   # Documentação
├── temp/                   # Arquivos temporários
│   ├── reports/            # Relatórios gerados
│   └── abnt/               # Documentos ABNT
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências do projeto
└── README.md               # Este arquivo
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Roadmap

- [ ] Implementar autenticação JWT
- [ ] Adicionar banco de dados (MongoDB/PostgreSQL)
- [ ] Criar dashboard de analytics avançado
- [ ] Implementar notificações em tempo real (WebSocket)
- [ ] Adicionar suporte a múltiplos idiomas
- [ ] Criar aplicativo mobile
- [ ] Integração com mais ferramentas (Slack, Trello, Jira)
- [ ] Sistema de backup automático
- [ ] Modo offline (PWA)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

**TudoGestão+ Team**

- Website: [tudogestao.com](#)
- Email: contato@tudogestao.com
- GitHub: [@tudogestao](#)

---

## 🙏 Agradecimentos

- Font Awesome pelos ícones
- Chart.js pelos gráficos
- Comunidade Node.js
- Todos os contribuidores

---

<div align="center">

**Desenvolvido com ❤️ pela equipe TudoGestão+**

⭐ Deixe uma estrela se este projeto te ajudou!

</div>
