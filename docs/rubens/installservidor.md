````markdown
# 🛠️ Guia de Configuração e Correção de Ambiente - TudoGestão+

Este guia contém o passo a passo definitivo para configurar o ambiente de desenvolvimento, incluindo correções para problemas comuns de banco de dados e conexão.

---

## 📋 1. Configuração do Banco de Dados (PostgreSQL)

Para evitar erros de autenticação (`Authentication failed`), vamos padronizar a senha do usuário `postgres` para ser igual à configuração do projeto.

1. Abra o **SQL Shell (psql)** ou pgAdmin.
2. Execute os comandos abaixo para criar o banco e definir a senha padrão:

```sql
-- 1. Cria o banco de dados (se não existir)
CREATE DATABASE tudogestao;

-- 2. Define a senha do usuário postgres para 'postgres'
-- ISSO É IMPORTANTE: O arquivo .env espera essa senha.
ALTER USER postgres WITH PASSWORD 'postgres';
````

-----

## ⚙️ 2. Configurando o Backend (Resolvendo Erros de .env)

Muitos erros ocorrem por arquivos `.env` com codificação errada ou duplicados. Siga exatamente estes passos no **PowerShell** dentro da pasta `backend`:

### Passo A: Limpar arquivos conflitantes

O Prisma às vezes lê um arquivo `.env` dentro da pasta `prisma/`, o que causa conflito. Vamos garantir que ele não exista.

```powershell
cd backend
# Remove arquivo .env duplicado na pasta prisma, se houver
if (Test-Path prisma\.env) { Remove-Item prisma\.env -Force }
```

### Passo B: Criar o .env com a codificação correta (UTF-8)

Para evitar o erro `Environment variable not found`, crie o arquivo usando este script:

```powershell
# Remove .env antigo se existir
if (Test-Path .env) { Remove-Item .env -Force }

# Conteúdo correto
$conteudo = @'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tudogestao?schema=public"
PORT=3333
NODE_ENV=development
JWT_SECRET=tudogestao_secret_key_dev_2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ENCRYPTION_KEY=tudogestao_encryption_key_32chars_min
'@

# Salva forçando UTF8
Set-Content -Path ".env" -Value $conteudo -Encoding UTF8
```

-----

## 📦 3. Instalação e Migrações

Ainda no terminal, dentro da pasta `backend`:

1.  Instale as dependências:

    ```bash
    npm install
    ```

2.  Crie as tabelas no banco:

    ```bash
    npx prisma migrate dev --name init
    ```

3.  **Importante:** Popule o banco com dados de teste (cria o usuário admin):

    ```bash
    npm run seed
    ```

    *Se aparecer "✅ Dados de demonstração criados", deu certo\!*

-----

## 🖥️ 4. Configurando o Frontend (Correção de Porta)

O Backend roda na porta **3333**, mas o Frontend pode estar configurado para a 3001. Isso causa o erro `ERR_CONNECTION_REFUSED`.

1.  Abra o arquivo: `frontend/src/services/api.js`
2.  Verifique a linha `baseURL`. Ela deve estar exatamente assim:

<!-- end list -->

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3333/api', // CORRETO: Porta 3333
  // baseURL: 'http://localhost:3001/api', // ERRADO: Porta 3001
  headers: {
    'Content-Type': 'application/json'
  }
});
```

3.  Instale as dependências do frontend:
    ```bash
    cd ../frontend
    npm install
    ```

-----

## 🚀 5. Rodando o Projeto

Abra dois terminais:

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

*Deve aparecer: `Server running on port 3333`*

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

*Acesse `http://localhost:5173`*

-----

## 🆘 Solução de Problemas Comuns

### ❌ Erro: "Authentication failed against database server"

**Causa:** A senha do seu PostgreSQL local não é `postgres`.
**Solução:** Refaça o passo 1 (Configuração do Banco) e execute o comando `ALTER USER...`.

### ❌ Erro: "Environment variable not found: DATABASE\_URL"

**Causa:** O arquivo `.env` foi salvo com codificação errada (UTF-16) ou está na pasta errada.
**Solução:** Apague o `.env` e recrie usando o script do Passo 2B.

### ❌ Erro: "ERR\_CONNECTION\_REFUSED" ao fazer login

**Causa:** O Frontend está tentando conectar na porta 3001, mas o servidor está na 3333.
**Solução:** Edite o arquivo `frontend/src/services/api.js` conforme o Passo 4.

### ❌ Erro: Login inválido mesmo com senha certa

**Causa:** O banco pode estar vazio ou os dados criptografados mudaram.
**Solução:** Rode `npm run seed` na pasta backend para resetar os usuários.

-----

**Dados de Acesso Padrão:**

  - **Email:** `admin@demostore.com`
  - **Senha:** `123456`

<!-- end list -->

```

***

### O que você pode fazer agora:
1.  Crie um novo arquivo chamado `CONFIGURACAO_SERVIDOR.md` na pasta principal do seu projeto.
2.  Cole o conteúdo acima.
3.  Faça o **commit** e **push** para o GitHub.

Assim, quando seus colegas baixarem (`git clone`), eles já terão esse guia para resolver os problemas que você acabou de enfrentar! Quer que eu te ajude com os comandos do Git para subir isso?
```