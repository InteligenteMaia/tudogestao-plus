# 📡 Documentação da API - TudoGestão+

## Base URL

```
http://localhost:3000/api
```

---

## 🔐 Autenticação

Atualmente o sistema não requer autenticação. Em versões futuras, será implementado JWT.

---

## 📊 Endpoints

### 1. Projetos

#### Listar todos os projetos

```http
GET /api/projects
```

**Query Parameters:**
- `status` (opcional): Filtrar por status (progress, completed, delayed)
- `search` (opcional): Buscar por nome ou descrição

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ERP Financeiro",
      "description": "Desenvolvimento do módulo financeiro completo para o ERP",
      "startDate": "2025-01-15",
      "endDate": "2025-12-15",
      "status": "progress",
      "progress": 65,
      "manager": "João Silva",
      "team": ["Maria Santos", "Pedro Oliveira"],
      "tasks": 15,
      "completed": 10
    }
  ],
  "total": 1
}
```

#### Criar novo projeto

```http
POST /api/projects
```

**Body:**

```json
{
  "name": "Meu Projeto",
  "description": "Descrição do projeto",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "manager": "João Silva",
  "team": ["Maria Santos", "Pedro Oliveira"]
}
```

**Resposta de Sucesso (201):**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Meu Projeto",
    ...
  },
  "message": "Projeto criado com sucesso"
}
```

#### Obter projeto específico

```http
GET /api/projects/:id
```

**Parâmetros:**
- `id`: ID do projeto

#### Atualizar projeto

```http
PUT /api/projects/:id
```

**Body:** (campos opcionais)

```json
{
  "name": "Novo Nome",
  "description": "Nova descrição",
  "progress": 75
}
```

#### Deletar projeto

```http
DELETE /api/projects/:id
```

#### Obter estatísticas do projeto

```http
GET /api/projects/:id/statistics
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "projectId": 1,
    "totalTasks": 15,
    "completedTasks": 10,
    "progress": 65,
    "teamSize": 3,
    "daysRemaining": 45,
    "status": "progress"
  }
}
```

---

### 2. Tarefas

#### Listar tarefas

```http
GET /api/tasks
```

**Query Parameters:**
- `status`: todo, inprogress, review, done
- `projectId`: ID do projeto

#### Criar tarefa

```http
POST /api/tasks
```

**Body:**

```json
{
  "title": "Implementar autenticação",
  "description": "Desenvolver sistema de login",
  "status": "todo",
  "priority": "high",
  "assignee": "João Silva",
  "projectId": 1
}
```

#### Atualizar tarefa

```http
PUT /api/tasks/:id
```

#### Deletar tarefa

```http
DELETE /api/tasks/:id
```

---

### 3. Equipe

#### Listar membros

```http
GET /api/team
```

#### Obter membro específico

```http
GET /api/team/:id
```

#### Adicionar membro

```http
POST /api/team
```

**Body:**

```json
{
  "name": "João Silva",
  "role": "Desenvolvedor Full Stack",
  "email": "joao@example.com",
  "phone": "+5511999999999",
  "description": "Especialista em desenvolvimento web"
}
```

#### Atualizar membro

```http
PUT /api/team/:id
```

#### Remover membro

```http
DELETE /api/team/:id
```

---

### 4. Relatórios

#### Gerar relatório

```http
POST /api/reports/generate
```

**Body:**

```json
{
  "type": "projeto",
  "projectId": 1,
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "format": "pdf"
}
```

**Tipos disponíveis:**
- `projeto`: Relatório completo do projeto
- `progresso`: Relatório de progresso
- `atividades`: Atividades realizadas
- `equipe`: Performance da equipe

**Formatos disponíveis:**
- `pdf`: PDF padrão
- `docx`: Documento Word
- `abnt`: PDF formatado em ABNT

**Resposta:**

```json
{
  "success": true,
  "data": {
    "reportType": "projeto",
    "projectId": 1,
    "format": "pdf",
    "filePath": "/path/to/report.pdf",
    "downloadUrl": "/api/reports/download/report_12345.pdf",
    "createdAt": "2025-10-26T10:00:00Z"
  },
  "message": "Relatório gerado com sucesso"
}
```

#### Enviar relatório por email

```http
POST /api/reports/send-email
```

**Body:**

```json
{
  "reportPath": "/path/to/report.pdf",
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Relatório do Projeto",
  "message": "Segue em anexo o relatório solicitado"
}
```

#### Enviar relatório por WhatsApp

```http
POST /api/reports/send-whatsapp
```

**Body:**

```json
{
  "reportPath": "/path/to/report.pdf",
  "phoneNumbers": ["+5511999999999", "+5511988888888"],
  "message": "Relatório do projeto em anexo"
}
```

#### Download de relatório

```http
GET /api/reports/download/:filename
```

---

### 5. Documentos ABNT

#### Gerar documento ABNT

```http
POST /api/abnt/generate
```

**Body:**

```json
{
  "projectId": 1,
  "docType": "tcc",
  "author": "João Silva",
  "title": "Sistema ERP Financeiro",
  "subtitle": "Análise e Desenvolvimento",
  "institution": "Universidade Federal",
  "course": "Ciência da Computação",
  "advisor": "Prof. Dr. Maria Santos",
  "year": 2025
}
```

**Tipos de documento:**
- `tcc`: Trabalho de Conclusão de Curso
- `artigo`: Artigo Científico
- `relatorio`: Relatório Técnico
- `monografia`: Monografia

**Resposta:**

```json
{
  "success": true,
  "message": "Documento ABNT gerado com sucesso",
  "data": {
    "filePath": "/path/to/document.pdf",
    "downloadUrl": "/api/abnt/download/abnt_tcc_12345.pdf",
    "docType": "tcc",
    "createdAt": "2025-10-26T10:00:00Z"
  }
}
```

#### Download de documento ABNT

```http
GET /api/abnt/download/:filename
```

---

### 6. Integração GitHub

#### Conectar ao GitHub

```http
POST /api/github/connect
```

**Body:**

```json
{
  "token": "ghp_seu_token_aqui"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Conectado ao GitHub com sucesso",
  "user": {
    "login": "seu-usuario",
    "name": "Seu Nome",
    "email": "seu@email.com",
    "avatar": "https://avatars.githubusercontent.com/..."
  }
}
```

#### Criar repositório

```http
POST /api/github/create-repository
```

**Body:**

```json
{
  "name": "meu-repositorio",
  "description": "Descrição do repositório",
  "private": false
}
```

#### Listar repositórios

```http
GET /api/github/repositories
```

#### Fazer commit

```http
POST /api/github/commit
```

**Body:**

```json
{
  "owner": "seu-usuario",
  "repo": "nome-do-repo",
  "path": "src/index.js",
  "content": "console.log('Hello World');",
  "message": "Add index.js",
  "branch": "main"
}
```

#### Sincronizar projeto automaticamente

```http
POST /api/github/auto-sync
```

**Body:**

```json
{
  "projectId": 1,
  "repositoryName": "meu-projeto"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Sincronização automática concluída",
  "results": [
    {
      "file": "README.md",
      "success": true,
      "sha": "abc123"
    }
  ],
  "totalFiles": 3,
  "successCount": 3
}
```

#### Listar commits

```http
GET /api/github/commits/:owner/:repo
```

**Query Parameters:**
- `branch` (opcional): Nome da branch (padrão: main)
- `perPage` (opcional): Número de commits (padrão: 20)

---

### 7. Comunicação

#### Enviar comunicação

```http
POST /api/communication/send
```

**Body:**

```json
{
  "recipients": [1, 2, 3],
  "type": "orientacao",
  "message": "Lembre-se de seguir as melhores práticas",
  "sendVia": ["email", "whatsapp", "sistema"]
}
```

**Tipos:**
- `orientacao`: Orientação de tarefa
- `feedback`: Feedback
- `alerta`: Alerta
- `atualizacao`: Atualização

#### Enviar orientação de tarefa

```http
POST /api/communication/task-orientation
```

**Body:**

```json
{
  "taskId": 1,
  "userId": 2,
  "orientation": "Por favor, siga o padrão de código estabelecido",
  "sendVia": ["email", "whatsapp"]
}
```

#### Obter histórico de comunicações

```http
GET /api/communication/history
```

**Query Parameters:**
- `userId`: ID do usuário
- `type`: Tipo de comunicação
- `startDate`: Data inicial
- `endDate`: Data final

---

### 8. Validações

#### Listar validações

```http
GET /api/validations
```

**Query Parameters:**
- `status`: pending, approved, rejected

#### Aprovar validação

```http
POST /api/validations/:id/approve
```

**Body:**

```json
{
  "approvedBy": "Admin",
  "comments": "Aprovado com sucesso"
}
```

#### Rejeitar validação

```http
POST /api/validations/:id/reject
```

**Body:**

```json
{
  "rejectedBy": "Admin",
  "feedback": "Necessário revisar os seguintes pontos..."
}
```

#### Criar nova validação

```http
POST /api/validations
```

**Body:**

```json
{
  "title": "Relatório Final",
  "author": "João Silva",
  "type": "report",
  "projectId": 1
}
```

---

### 9. Documentos

#### Listar documentos

```http
GET /api/documents
```

**Query Parameters:**
- `parentId`: ID da pasta pai

#### Criar documento/pasta

```http
POST /api/documents
```

**Body:**

```json
{
  "name": "Meu Documento",
  "type": "file",
  "parentId": 1,
  "size": "2.5 MB"
}
```

#### Deletar documento

```http
DELETE /api/documents/:id
```

---

### 10. Health Check

#### Verificar status da API

```http
GET /api/health
```

**Resposta:**

```json
{
  "status": "OK",
  "timestamp": "2025-10-26T10:00:00Z",
  "uptime": 12345,
  "environment": "development"
}
```

---

## 📝 Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Não autenticado
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro do servidor

---

## 🔄 Exemplos de Uso

### JavaScript (Fetch)

```javascript
// Criar projeto
fetch('http://localhost:3000/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Meu Projeto',
    description: 'Descrição',
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL

```bash
# Listar projetos
curl http://localhost:3000/api/projects

# Criar projeto
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Projeto",
    "description": "Descrição",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  }'
```

### Python (Requests)

```python
import requests

# Criar projeto
response = requests.post(
    'http://localhost:3000/api/projects',
    json={
        'name': 'Meu Projeto',
        'description': 'Descrição',
        'startDate': '2025-01-01',
        'endDate': '2025-12-31'
    }
)

print(response.json())
```

---

## 🔗 Links Úteis

- [Documentação Completa](../README.md)
- [Guia de Início Rápido](QUICK-START.md)
- [GitHub Issues](https://github.com/seu-usuario/tudogestao-plus/issues)

---

**Última atualização:** 26 de outubro de 2025
