# 🚀 Guia de Início Rápido - TudoGestão+

## Instalação em 3 Passos

### 1️⃣ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/tudogestao-plus.git
cd tudogestao-plus

# Instale as dependências
npm install
```

### 2️⃣ Configuração

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais
nano .env  # ou use seu editor favorito
```

**Configurações mínimas necessárias:**

```env
PORT=3000
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
GITHUB_TOKEN=seu-token-github
```

### 3️⃣ Execução

```bash
# Inicie o servidor
npm start

# Ou em modo desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📖 Primeiros Passos

### 1. Explore o Dashboard

Ao abrir o sistema, você verá:
- **Estatísticas gerais** dos projetos
- **Gráficos de progresso**
- **Atividades recentes**
- **Alertas e notificações**

### 2. Crie seu Primeiro Projeto

1. Clique no botão **"+ Novo Projeto"** no canto superior direito
2. Preencha as informações:
   - Nome do projeto
   - Descrição
   - Datas de início e término
   - Gerente do projeto
   - Membros da equipe
3. Clique em **"Criar Projeto"**

### 3. Adicione Tarefas

1. Vá para a seção **"Tarefas"** no menu lateral
2. No quadro Kanban, clique no botão **"+"** em qualquer coluna
3. Preencha:
   - Título da tarefa
   - Descrição
   - Prioridade (Alta/Média/Baixa)
   - Responsável
4. Arraste as tarefas entre as colunas conforme o progresso

### 4. Gerencie sua Equipe

1. Acesse **"Equipe"** no menu
2. Visualize todos os membros
3. Clique em um membro para ver:
   - Tarefas atribuídas
   - Performance
   - Histórico

### 5. Gere seu Primeiro Relatório

1. Vá para **"Relatórios"**
2. Selecione:
   - Tipo de relatório
   - Projeto
   - Período
   - Formato (PDF/DOCX/ABNT)
3. Clique em **"Gerar Relatório"**
4. Opcionalmente, envie por email ou WhatsApp

---

## 🎯 Funcionalidades Essenciais

### Dashboard
- Visão geral de todos os projetos
- Métricas em tempo real
- Gráficos interativos

### Projetos
- Criação e gerenciamento
- Acompanhamento de progresso
- Estatísticas detalhadas

### Tarefas
- Sistema Kanban
- Priorização
- Atribuição de responsáveis

### Equipe
- Cadastro completo
- Descrição de cargos
- Métricas de performance

### Relatórios
- Geração automática
- Múltiplos formatos
- Envio por email/WhatsApp

### Comunicação
- Orientações para equipe
- Notificações automáticas
- Histórico completo

### GitHub
- Integração automática
- Sincronização de código
- Controle de versão

### ABNT
- Formatação automática
- Templates prontos
- Geração em PDF

---

## 💡 Dicas Rápidas

### ✅ Configure o Email primeiro
O envio de relatórios e orientações depende da configuração correta do email.

### ✅ Use descrições detalhadas
Quanto mais informações você fornecer, mais úteis serão os relatórios gerados.

### ✅ Mantenha as tarefas atualizadas
Mova os cards no Kanban conforme o progresso real.

### ✅ Aproveite as validações
Use o sistema de validações para garantir a qualidade das entregas.

### ✅ Sincronize com GitHub
Mantenha seu código versionado e sincronizado automaticamente.

---

## 🆘 Problemas Comuns

### ❌ "Erro ao enviar email"

**Solução:** 
1. Verifique suas credenciais SMTP no `.env`
2. Se usar Gmail, gere uma [Senha de App](https://myaccount.google.com/apppasswords)
3. Ative "Acesso a app menos seguro" se necessário

### ❌ "Não consegue conectar ao GitHub"

**Solução:**
1. Gere um token em [GitHub Settings](https://github.com/settings/tokens)
2. Dê permissões de `repo`
3. Copie o token para o `.env`

### ❌ "Porta 3000 já está em uso"

**Solução:**
```bash
# Altere a porta no .env
PORT=3001
```

---

## 📞 Suporte

Se precisar de ajuda:

- 📧 Email: suporte@tudogestao.com
- 💬 GitHub Issues: [github.com/seu-usuario/tudogestao-plus/issues](#)
- 📚 Documentação completa: [docs.tudogestao.com](#)

---

## 🎓 Próximos Passos

Agora que você já sabe o básico:

1. ✅ Explore todas as funcionalidades
2. ✅ Configure as integrações (GitHub, WhatsApp)
3. ✅ Personalize o sistema para sua equipe
4. ✅ Gere seus primeiros relatórios
5. ✅ Experimente a formatação ABNT

**Boa gestão! 🚀**
