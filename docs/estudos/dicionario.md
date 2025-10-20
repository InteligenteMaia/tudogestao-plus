# 📖 Dicionário Completo de Git & GitHub
### Todos os termos explicados de forma detalhada para iniciantes

---

## 📋 Índice Alfabético

[A](#a) | [B](#b) | [C](#c) | [D](#d) | [E](#e) | [F](#f) | [G](#g) | [H](#h) | [I](#i) | [J](#j) | [K](#k) | [L](#l) | [M](#m) | [N](#n) | [O](#o) | [P](#p) | [Q](#q) | [R](#r) | [S](#s) | [T](#t) | [U](#u) | [V](#v) | [W](#w) | [X](#x) | [Y](#y) | [Z](#z)

---

## A

### Add
**O que é:** Comando que prepara arquivos para serem incluídos no próximo commit.

**Analogia:** É como separar as roupas que você VAI lavar antes de colocar na máquina. Você não lava tudo de uma vez, só o que selecionou.

**Como funciona:**
```bash
# Adicionar arquivo específico
git add arquivo.py

# Adicionar vários arquivos
git add arquivo1.py arquivo2.py

# Adicionar tudo
git add .

# Adicionar todos os arquivos .py
git add *.py
```

**Na prática:**
```bash
# Você alterou 3 arquivos mas quer commitar apenas 2

git status
# modified: login.py
# modified: register.py  
# modified: database.py

git add login.py register.py
# Agora apenas login.py e register.py serão commitados

git commit -m "feat: atualiza login e registro"
# database.py não foi incluído no commit
```

**Termos relacionados:** Stage, Staging Area, Unstage

---

### Amend
**O que é:** Modificar o último commit, seja a mensagem ou os arquivos incluídos.

**Analogia:** É como consertar a última frase que você escreveu no WhatsApp antes de apertar enviar de novo.

**Quando usar:**
- Esqueceu de adicionar um arquivo no commit
- Quer mudar a mensagem do commit
- Pequena correção no código recém-commitado

**Como usar:**
```bash
# Mudar apenas a mensagem do último commit
git commit --amend -m "Nova mensagem correta"

# Adicionar arquivo esquecido ao último commit
git add arquivo_esquecido.py
git commit --amend --no-edit  # Mantém mensagem original
```

**Exemplo prático:**
```bash
# Você commitou:
git commit -m "feat: adiciona validação de email"

# Mas esqueceu de adicionar os testes!
git add tests/test_email.py
git commit --amend --no-edit

# Agora o commit inclui os testes também
```

**⚠️ Atenção:** Só use `amend` se ainda NÃO deu push! Se já enviou, use um novo commit.

---

### Ahead/Behind
**O que é:** Indicadores de quantos commits sua branch está à frente ou atrás de outra branch.

**Analogia:** É como saber se você está na frente ou atrás em uma corrida.

**Como ver:**
```bash
git status
# On branch feat/login
# Your branch is ahead of 'origin/feat/login' by 3 commits.
#   (use "git push" to publish your local commits)

# Ou:
# Your branch is behind 'origin/dev' by 5 commits.
#   (use "git pull" to update your local branch)
```

**O que significa:**
- **Ahead by 3:** Você tem 3 commits que o GitHub ainda não tem
- **Behind by 5:** O GitHub tem 5 commits que você não tem localmente

**Como resolver:**
```bash
# Se está ahead (à frente):
git push  # Enviar seus commits

# Se está behind (atrás):
git pull  # Baixar commits do GitHub
```

---

## B

### Blame
**O que é:** Comando que mostra quem modificou cada linha de um arquivo e quando.

**Analogia:** É como o histórico de edições de um documento do Google Docs, mostrando quem escreveu cada parte.

**Como usar:**
```bash
git blame arquivo.py
```

**Saída:**
```bash
a1b2c3d4 (João Silva   2025-10-01 14:30:00 -0300  1) def calcular_imposto(valor):
a1b2c3d4 (João Silva   2025-10-01 14:30:00 -0300  2)     """Calcula imposto sobre valor"""
e5f6g7h8 (Maria Santos 2025-10-10 09:15:00 -0300  3)     if valor < 0:
e5f6g7h8 (Maria Santos 2025-10-10 09:15:00 -0300  4)         raise ValueError("Valor não pode ser negativo")
a1b2c3d4 (João Silva   2025-10-01 14:30:00 -0300  5)     return valor * 0.15
```

**Para que serve:**
- Descobrir quem escreveu código específico
- Entender quando uma mudança foi feita
- Saber a quem perguntar sobre código que você não entende

**Dica:** Use no VS Code com extensão GitLens para visualização mais bonita!

---

### Branch
**O que é:** Uma linha independente de desenvolvimento. É como criar uma cópia do projeto para trabalhar sem mexer no original.

**Analogia:** É como fazer uma cópia de um documento do Google Drive para testar ideias novas sem mexer no documento original. Se der certo, você copia de volta; se der errado, você simplesmente deleta a cópia.

**Tipos de branches:**
- **main/master:** Branch principal (produção)
- **dev/develop:** Branch de desenvolvimento
- **feature/feat:** Branch de nova funcionalidade
- **fix/bugfix:** Branch de correção de bug
- **hotfix:** Branch de correção urgente em produção
- **release:** Branch de preparação de nova versão

**Comandos principais:**
```bash
# Ver branches
git branch              # Locais
git branch -a           # Locais + remotas
git branch -r           # Apenas remotas

# Criar branch
git branch nome-da-branch

# Criar e mudar para branch
git checkout -b nome-da-branch

# Mudar de branch
git checkout nome-da-branch

# Deletar branch local
git branch -d nome-da-branch     # Seguro (verifica se foi mergeada)
git branch -D nome-da-branch     # Força (deleta mesmo sem merge)

# Deletar branch remota
git push origin --delete nome-da-branch

# Renomear branch
git branch -m novo-nome
```

**Estrutura visual:**
```
main     ●──────●──────●──────●───── (produção)
              ╲             ╱
dev            ●──●──●──●──────────── (desenvolvimento)
                 ╲    ╱
feat/login        ●──● (sua feature)
```

**Exemplo prático:**
```bash
# Criar branch para nova funcionalidade
git checkout dev
git pull origin dev
git checkout -b feat/cadastro-clientes

# Trabalhar...
git add .
git commit -m "feat: implementa cadastro de clientes"

# Enviar
git push -u origin feat/cadastro-clientes

# Após merge, deletar
git branch -d feat/cadastro-clientes
```

**Boas práticas:**
- Uma branch por funcionalidade/correção
- Nome descritivo: `feat/tela-login` não `branch123`
- Deletar após merge
- Manter atualizada com dev

---

## C

### Checkout
**O que é:** Comando para mudar de branch ou restaurar arquivos.

**Analogia:** É como mudar de canal na TV ou voltar para um canal anterior.

**Usos principais:**

**1. Mudar de branch:**
```bash
# Mudar para branch existente
git checkout dev
git checkout feat/login

# Criar e mudar
git checkout -b nova-branch
```

**2. Restaurar arquivo:**
```bash
# Desfazer mudanças em arquivo (volta para último commit)
git checkout -- arquivo.py

# Restaurar arquivo de outro commit
git checkout a1b2c3d -- arquivo.py

# Restaurar arquivo de outra branch
git checkout dev -- arquivo.py
```

**3. Ver commit específico:**
```bash
git checkout a1b2c3d
# Você entra em "detached HEAD" - modo só visualização
```

**Exemplo prático:**
```bash
# Você está em feat/login e quer voltar para dev
git checkout dev

# Você bagunçou arquivo.py e quer restaurar
git checkout -- arquivo.py

# Você quer ver como arquivo.py estava em outro commit
git checkout a1b2c3d -- arquivo.py
```

**Git mais novo (2.23+):**
```bash
# Comando split em dois:
git switch dev          # Mudar de branch
git restore arquivo.py  # Restaurar arquivo
```

---

### Cherry-pick
**O que é:** Aplicar um commit específico de uma branch em outra branch.

**Analogia:** É como copiar apenas uma receita específica de um caderno para outro, sem copiar o caderno inteiro.

**Quando usar:**
- Precisa de uma correção que está em outra branch
- Quer aplicar apenas um commit específico
- Commit foi feito na branch errada

**Como usar:**
```bash
# Ver commits disponíveis
git log feat/outra-branch --oneline

# Cherry-pick de commit específico
git cherry-pick a1b2c3d
```

**Exemplo prático:**
```bash
# Situação: Você corrigiu bug em feat/nova-funcionalidade
# mas precisa dessa correção também na dev

# 1. Ver o hash do commit
git log feat/nova-funcionalidade --oneline
# a1b2c3d fix: corrige validação de CPF

# 2. Ir para dev
git checkout dev

# 3. Cherry-pick do commit
git cherry-pick a1b2c3d

# 4. Agora dev também tem a correção!
```

**Com conflitos:**
```bash
git cherry-pick a1b2c3d
# CONFLICT (content): Merge conflict in arquivo.py

# Resolver conflito
git add arquivo.py
git cherry-pick --continue

# Ou cancelar
git cherry-pick --abort
```

---

### Clone
**O que é:** Criar cópia local de um repositório remoto.

**Analogia:** É como baixar um projeto completo do Google Drive para seu computador, incluindo todo o histórico.

**Como usar:**
```bash
# Clone básico
git clone https://github.com/usuario/projeto.git

# Clone com nome diferente
git clone https://github.com/usuario/projeto.git novo-nome

# Clone apenas branch específica
git clone -b dev https://github.com/usuario/projeto.git

# Clone raso (sem histórico completo - mais rápido)
git clone --depth 1 https://github.com/usuario/projeto.git
```

**Exemplo prático:**
```bash
# Primeiro dia no projeto
cd ~/Projetos
git clone https://github.com/InteligenteMaia/tudogestao-plus.git
cd tudogestao-plus

# Pronto! Você tem todo o projeto
ls
# README.md  backend/  frontend/  tests/
```

**O que o clone faz:**
1. Cria pasta do projeto
2. Baixa todos os arquivos
3. Baixa todo o histórico de commits
4. Configura `origin` apontando para repositório original
5. Faz checkout da branch padrão (geralmente main ou dev)

**Diferença entre clone e download ZIP:**
- **Clone:** Tem histórico Git, pode commitar, push, pull
- **ZIP:** Só arquivos, sem Git, não pode trabalhar com repositório

---

### Commit
**O que é:** Um "ponto de salvamento" no histórico do projeto. Como tirar uma foto do estado atual do código.

**Analogia:** É como salvar um jogo antes de enfrentar um chefe difícil. Se morrer, pode voltar. No Git, se o código quebrar, você pode voltar para qualquer commit anterior.

**Estrutura de um commit:**
```
Commit: a1b2c3d4e5f6g7h8i9j0  ← Hash único (ID do commit)
Author: João Silva <joao@email.com>
Date: Wed Oct 15 14:30:00 2025 -0300
Mensagem: feat: adiciona validação de email

Arquivos alterados:
  backend/validators/email.py   | 25 +++++++++++++++++
  tests/test_email_validator.py | 15 ++++++++++
  2 files changed, 40 insertions(+)
```

**Como fazer commit:**
```bash
# Commit básico
git add .
git commit -m "feat: adiciona tela de login"

# Commit com descrição longa
git commit -m "feat: adiciona tela de login

- Implementa formulário com validação
- Adiciona integração com API de autenticação
- Inclui testes unitários"

# Commit direto (pula o add) - apenas arquivos já rastreados
git commit -am "fix: corrige bug no cálculo"
```

**Convenções de mensagem (Conventional Commits):**
```bash
feat:      # Nova funcionalidade
fix:       # Correção de bug
docs:      # Documentação
style:     # Formatação (não afeta lógica)
refactor:  # Refatoração
test:      # Testes
chore:     # Manutenção
perf:      # Performance
ci:        # CI/CD
build:     # Build system
revert:    # Reverter commit anterior
```

**Exemplos de boas mensagens:**
```bash
✅ git commit -m "feat: adiciona filtro de busca na tela de clientes"
✅ git commit -m "fix: corrige erro de divisão por zero no cálculo de IOF"
✅ git commit -m "docs: atualiza README com instruções de instalação"
✅ git commit -m "refactor: extrai lógica de validação para classe separada"
```

**Exemplos de mensagens ruins:**
```bash
❌ git commit -m "mudanças"
❌ git commit -m "update"
❌ git commit -m "corrige bug"
❌ git commit -m "wip"
❌ git commit -m "faz coisas"
```

**Anatomia de um commit perfeito:**
```bash
git commit -m "tipo(escopo): descrição curta (máx 50 caracteres)

Descrição mais detalhada explicando:
- O que foi mudado
- Por que foi mudado
- Como foi implementado

Fixes #123
Closes #456"
```

**Comandos relacionados:**
```bash
# Ver histórico de commits
git log
git log --oneline

# Ver commit específico
git show a1b2c3d

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Modificar último commit
git commit --amend
```

---

### Conflict (Conflito)
**O que é:** Quando duas pessoas modificaram a mesma parte do código e o Git não consegue decidir qual mudança manter.

**Analogia:** É como dois cozinheiros mudando a mesma receita ao mesmo tempo. Um diz "adicione sal", outro diz "adicione açúcar". Alguém precisa decidir qual usar (ou combinar ambos).

**Como acontece:**
```bash
# Você está em sua branch
git merge dev

# Git tenta juntar automaticamente, mas...
Auto-merging backend/services/payment.py
CONFLICT (content): Merge conflict in backend/services/payment.py
Automatic merge failed; fix conflicts and then commit the result.
```

**Como o Git marca conflitos no arquivo:**
```python
def calcular_imposto(valor):
<<<<<<< HEAD  # Código atual (sua branch)
    # Sua mudança
    aliquota = 0.15
    return valor * aliquota
=======  # Separador
    # Mudança da outra branch
    taxa = get_taxa_atual()
    return valor * taxa * 1.05
>>>>>>> dev  # Branch sendo mergeada
```

**Como resolver:**

**Passo 1: Identificar conflitos**
```bash
git status
# Unmerged paths:
#   both modified:   backend/services/payment.py
```

**Passo 2: Abrir arquivo e decidir**
```python
# Opção 1: Manter apenas sua versão
def calcular_imposto(valor):
    aliquota = 0.15
    return valor * aliquota

# Opção 2: Manter apenas versão da outra branch
def calcular_imposto(valor):
    taxa = get_taxa_atual()
    return valor * taxa * 1.05

# Opção 3: Combinar ambas (mais comum)
def calcular_imposto(valor):
    taxa = get_taxa_atual()  # Da outra branch
    aliquota = 0.15          # Sua versão
    return valor * taxa * aliquota * 1.05
```

**Passo 3: Marcar como resolvido**
```bash
# Remover marcadores <<<<<<, =======, >>>>>> do arquivo
# Salvar arquivo

git add backend/services/payment.py
```

**Passo 4: Finalizar merge**
```bash
git commit -m "merge: resolve conflito em payment.py"
```

**Prevenir conflitos:**
- Atualizar branch frequentemente: `git pull`
- Commits pequenos e frequentes
- Comunicar com time sobre arquivos sendo modificados
- Usar branches separadas para funcionalidades diferentes

**Ferramentas para resolver conflitos:**
- VS Code (interface visual)
- GitKraken
- Meld
- KDiff3

---

## D

### Detached HEAD
**O que é:** Estado onde você não está em nenhuma branch, mas em um commit específico.

**Analogia:** É como estar flutuando no tempo, olhando o passado, mas sem estar em nenhuma linha do tempo específica.

**Como acontece:**
```bash
# Fazer checkout de commit específico
git checkout a1b2c3d

# Git avisa:
# You are in 'detached HEAD' state. You can look around, make experimental
# changes and commit them, and you can discard any commits you make in this
# state without impacting any branches.
```

**O que você pode fazer:**
- **Ver:** Explorar código antigo
- **Testar:** Rodar versão antiga
- **Experimentar:** Fazer mudanças temporárias

**O que NÃO deve fazer:**
- Fazer commits importantes (serão perdidos)

**Como sair:**
```bash
# Voltar para branch
git checkout dev

# Ou criar branch a partir deste ponto
git checkout -b nova-branch-deste-ponto
```

**Exemplo prático:**
```bash
# Quero ver como o código estava há 3 meses
git log --since="3 months ago" --oneline
# a1b2c3d feat: versão antiga

git checkout a1b2c3d
# Agora você está em detached HEAD

# Explorar...
ls
cat arquivo.py

# Voltar
git checkout dev
```

---

### Diff
**O que é:** Comando que mostra diferenças entre versões de arquivos.

**Analogia:** É como o "controlar alterações" do Word, mostrando o que foi adicionado, removido ou modificado.

**Usos principais:**
```bash
# Ver mudanças não commitadas
git diff

# Ver mudanças preparadas (staged)
git diff --staged

# Ver diferença entre branches
git diff dev..feat/login

# Ver diferença entre commits
git diff a1b2c3d..e5f6g7h

# Ver mudanças em arquivo específico
git diff arquivo.py

# Ver só nomes de arquivos alterados
git diff --name-only

# Ver estatísticas
git diff --stat
```

**Como ler a saída:**
```diff
diff --git a/backend/services/payment.py b/backend/services/payment.py
index a1b2c3d..e5f6g7h 100644
--- a/backend/services/payment.py  ← Versão antiga
+++ b/backend/services/payment.py  ← Versão nova
@@ -10,7 +10,8 @@ def calcular_pagamento(valor):  ← Linha onde mudança ocorre
     """Calcula valor do pagamento"""
-    taxa = 0.05  ← Linha removida (vermelho)
+    taxa = 0.08  ← Linha adicionada (verde)
+    # Taxa atualizada conforme nova política
     return valor * (1 + taxa)
```

**Símbolos:**
- `+` (verde) = Linha adicionada
- `-` (vermelho) = Linha removida
- Sem símbolo = Linha não mudou (contexto)

**Exemplo prático:**
```bash
# Você alterou arquivo.py e quer ver o que mudou
git diff arquivo.py

# Saída:
# - antiga_funcao()
# + nova_funcao_melhorada()

# Ver diferença entre sua branch e dev
git diff dev..feat/sua-branch
```

---

## F

### Fast-forward
**O que é:** Tipo de merge onde a branch simplesmente "avança" sem criar commit de merge.

**Analogia:** É como colocar um livro em cima do outro, sem misturar páginas.

**Quando acontece:**
- Branch de destino não tem commits novos
- Branch sendo mergeada está "à frente" da destino

**Visual:**
```
ANTES:
main    ●──────●
              ╲
feat           ●──●──● (à frente de main)

DEPOIS (fast-forward):
main    ●──────●──●──● (simplesmente avançou)
```

**Exemplo:**
```bash
git checkout main
git merge feat/nova-funcionalidade

# Se fast-forward possível:
# Updating a1b2c3d..e5f6g7h
# Fast-forward
#  arquivo.py | 10 ++++++++++
#  1 file changed, 10 insertions(+)
```

**Forçar commit de merge (não fast-forward):**
```bash
git merge --no-ff feat/nova-funcionalidade

# Sempre cria commit de merge, mesmo se fast-forward for possível
```

**Visual com --no-ff:**
```
main    ●──────●──────●  ← Commit de merge
              ╲      ╱
feat           ●──●──●
```

---

### Fetch
**O que é:** Baixar informações do repositório remoto sem mesclar com seu trabalho local.

**Analogia:** É como ver o cardápio de um restaurante sem fazer pedido ainda. Você vê o que tem disponível, mas não come nada ainda.

**Diferença entre fetch e pull:**
- **fetch:** Só baixa informações, não modifica seu código
- **pull:** Baixa E mescla com seu código (fetch + merge)

**Como usar:**
```bash
# Fetch de todas as branches
git fetch

# Fetch de branch específica
git fetch origin dev

# Fetch com prune (remove referências de branches deletadas)
git fetch --prune
```

**O que o fetch faz:**
```bash
git fetch origin

# Baixa informações:
# remote: Counting objects: 10, done.
# remote: Compressing objects: 100% (8/8), done.
# remote: Total 10 (delta 2), reused 0 (delta 0)
# Unpacking objects: 100% (10/10), done.
# From https://github.com/usuario/projeto
#    a1b2c3d..e5f6g7h  dev        -> origin/dev
#    f8g9h0i..j1k2l3m  feat/login -> origin/feat/login
```

**Depois de fetch:**
```bash
# Ver o que mudou
git log origin/dev

# Ver diferenças
git diff dev..origin/dev

# Se quiser mesclar:
git merge origin/dev

# Ou simplesmente:
git pull  # Faz fetch + merge
```

**Quando usar fetch:**
- Quer ver mudanças antes de aplicar
- Verificar se há atualizações
- Comparar branches remotas com locais

---

### Fork
**O que é:** Criar cópia pessoal de repositório de outra pessoa no GitHub.

**Analogia:** É como fotocopiar um livro da biblioteca para fazer anotações suas, sem mexer no livro original.

**Diferença entre fork e clone:**
- **Fork:** Cria cópia no GITHUB (seu próprio repositório online)
- **Clone:** Cria cópia no SEU COMPUTADOR

**Quando usar fork:**
- Contribuir para projeto de código aberto
- Experimentar com projeto sem permissão de escrita
- Criar sua própria versão de um projeto

**Como fazer fork:**
1. Ir para repositório no GitHub
2. Clicar em "Fork" (canto superior direito)
3. Clonar SEU fork:
```bash
git clone https://github.com/SEU-USUARIO/projeto.git
```

**Workflow com fork:**
```bash
# 1. Fork no GitHub (via interface)

# 2. Clonar seu fork
git clone https://github.com/seu-usuario/tudogestao-plus.git
cd tudogestao-plus

# 3. Adicionar repositório original como upstream
git remote add upstream https://github.com/InteligenteMaia/tudogestao-plus.git

# 4. Trabalhar normalmente
git checkout -b feat/minha-contribuicao
# ... trabalhar ...
git commit -m "feat: adiciona funcionalidade"
git push origin feat/minha-contribuicao

# 5. Abrir Pull Request no GitHub
#    Do seu fork para o repositório original

# 6. Manter fork atualizado
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## G

### Git
**O que é:** Sistema de controle de versão distribuído criado por Linus Torvalds em 2005.

**Analogia:** É como uma máquina do tempo para código. Você pode:
- Voltar no tempo (commits anteriores)
- Criar realidades paralelas (branches)
- Juntar linhas do tempo (merge)
- Ver histórico de tudo que aconteceu

**Características principais:**
- **Distribuído:** Cada pessoa tem cópia completa
- **Rápido:** Operações locais são instantâneas
- **Seguro:** Usa SHA-1 para integridade
- **Flexível:** Suporta muitos workflows

**Por que Git é importante:**
1. **Backup:** Código salvo em múltiplos lugares
2. **Colaboração:** Time trabalha junto sem conflitos
3. **Histórico:** Sabe quem mudou o quê e quando
4. **Experimentação:** Pode testar ideias sem medo
5. **Reversão:** Pode desfazer qualquer mudança

**Conceitos fundamentais:**
```
Repositório (pasta)
    ↓
Commits (pontos no tempo)
    ↓
Branches (linhas de desenvolvimento)
    ↓
Remote (cópia no servidor)
```

---

### GitHub
**O que é:** Plataforma de hospedagem de código usando Git, criada em 2008.

**Analogia:** Se Git é o Word (software local), GitHub é o Google Docs (serviço na nuvem).

**O que GitHub oferece:**
- Hospedagem de repositórios
- Interface web para Git
- Pull Requests (revisão de código)
- Issues (gerenciamento de tarefas)
- Actions (CI/CD)
- Wiki (documentação)
- Projects (gerenciamento de projeto)
- Discussions (fóruns)
- Security (alertas de segurança)

**Alternativas ao GitHub:**
- GitLab
- Bitbucket
- Gitea
- SourceForge

**GitHub vs Git:**
```
Git:
- Software local
- Funciona offline
- Grátis e open source

GitHub:
- Serviço online
- Precisa internet
- Grátis para público, pago para privado (avançado)
```

---

### Gitignore (.gitignore)
**O que é:** Arquivo que diz ao Git quais arquivos/pastas ignorar (não rastrear).

**Analogia:** É como fazer uma lista de "não fotografar" antes de tirar fotos de família. Tem coisas que você não quer na foto.

**Quando usar:**
- Arquivos temporários
- Logs
- Dependências (node_modules)
- Arquivos de configuração local
- Senhas e credenciais
- Arquivos compilados
- Cache

**Exemplo de .gitignore:**
```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.env

# IDEs
.vscode/
.idea/
*.swp

# Sistema
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Banco de dados local
*.db
*.sqlite

# Arquivos sensíveis
config/credentials.py
secrets.json
*.key
*.pem

# Build
dist/
build/
*.egg-info/

# Testes
.coverage
htmlcov/
.pytest_cache/
```

**Criar .gitignore:**
```bash
# Criar arquivo
touch .gitignore

# Editar
nano .gitignore
# ou
code .gitignore

# Commitar
git add .gitignore
git commit -m "chore: adiciona .gitignore"
```

**Padrões úteis:**
```gitignore
# Ignorar arquivo específico
arquivo.txt

# Ignorar todos .log
*.log

# Ignorar pasta
node_modules/

# Ignorar arquivos em qualquer pasta
**/*.log

# EXCETO (não ignorar)
!importante.log

# Ignorar apenas na raiz
/arquivo.txt

# Comentários
# Isto é um comentário
```

**Se já commitou arquivo que deveria ser ignorado:**
```bash
# Remover do Git mas manter no disco
git rm --cached arquivo_sensivel.py

# Adicionar ao .gitignore
echo "arquivo_sensivel.py" >> .gitignore

# Commitar
git add .gitignore
git commit -m "chore: remove arquivo sensível do Git"
```

**Templates prontos:**
- Python: https://github.com/github/gitignore/blob/main/Python.gitignore
- Node: https://github.com/github/gitignore/blob/main/Node.gitignore
- Geral: https://www.gitignore.io

---

## H

### Hash
**O que é:** Identificador único de cada commit. Uma string de 40 caracteres hexadecimais gerada por SHA-1.

**Analogia:** É como o RG de uma pessoa. Cada commit tem um número único que nunca se repete.

**Exemplo:**
```bash
# Hash completo (40 caracteres)
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

# Hash curto (7 primeiros caracteres - geralmente suficiente)
a1b2c3d
```

**Como ver hashes:**
```bash
# Histórico com hashes
git log
# commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
# Author: João Silva
# Date: Wed Oct 15 14:30:00 2025

# Histórico resumido
git log --oneline
# a1b2c3d feat: adiciona login
# e5f6g7h fix: corrige validação
```

**Usar hash em comandos:**
```bash
# Ver commit específico
git show a1b2c3d

# Voltar para commit específico
git checkout a1b2c3d

# Reverter commit
git revert a1b2c3d

# Cherry-pick
git cherry-pick a1b2c3d

# Reset para commit
git reset a1b2c3d
```

**Por que hash é importante:**
- Identificação única e confiável
- Integridade: Se hash muda, conteúdo mudou
- Referência: Pode citar commits específicos
- Distribuído: Mesmo commit tem mesmo hash em qualquer computador

---

### HEAD
**O que é:** Ponteiro que indica onde você está no repositório (commit atual).

**Analogia:** É como o marcador de página em um livro. Mostra onde você parou de ler.

**Visualização:**
```bash
git log --oneline
# a1b2c3d (HEAD -> feat/login, origin/feat/login) feat: adiciona botão
# e5f6g7h feat: cria formulário
# i9j0k1l docs: atualiza README
```

**O que HEAD representa:**
- Normalmente: Ponta da branch atual
- Em detached HEAD: Commit específico (não branch)

**Referências relativas a HEAD:**
```bash
HEAD       # Commit atual
HEAD~1     # 1 commit antes do atual (pai)
HEAD~2     # 2 commits antes
HEAD~5     # 5 commits antes

HEAD^      # Primeiro pai do commit atual
HEAD^^     # Avô do commit atual

HEAD@{1}   # Onde HEAD estava 1 movimento atrás (reflog)
```

**Usar HEAD em comandos:**
```bash
# Ver commit atual
git show HEAD

# Comparar com commit anterior
git diff HEAD~1

# Resetar para 3 commits atrás
git reset HEAD~3

# Voltar arquivo para versão anterior
git checkout HEAD~2 -- arquivo.py
```

**Mover HEAD:**
```bash
# Mudar de branch (move HEAD)
git checkout dev

# Fazer commit (move HEAD para frente)
git commit -m "mensagem"

# Reset (move HEAD para trás)
git reset HEAD~1
```

---

### Hotfix
**O que é:** Branch para correção urgente em produção.

**Analogia:** É como um médico sendo chamado para emergência. Precisa agir rápido em algo crítico.

**Quando usar:**
- Bug crítico em produção
- Segurança comprometida
- Sistema parado
- Perda de dados iminente

**Workflow:**
```bash
# 1. Partir da main (produção)
git checkout main
git pull origin main

# 2. Criar branch de hotfix
git checkout -b hotfix/erro-critico-pagamento

# 3. Fazer correção MÍNIMA
# Editar apenas o necessário...

# 4. Testar MUITO BEM
python -m pytest
python -m pytest tests/test_payment.py -v

# 5. Commitar
git add .
git commit -m "hotfix: corrige divisão por zero em pagamentos

Bug crítico causava crash quando valor era zero.
Adiciona validação de valor mínimo e tratamento de erro."

# 6. Enviar
git push -u origin hotfix/erro-critico-pagamento

# 7. Pull Request URGENTE para main
# Marcar como CRITICAL
# Pedir review rápido

# 8. Após merge na main, também mergear na dev!
git checkout dev
git pull origin dev
git merge main
git push origin dev

# 9. Deletar branch
git branch -d hotfix/erro-critico-pagamento
```

**Boas práticas de hotfix:**
- ✅ Correção mínima (não adicionar features)
- ✅ Testar exaustivamente
- ✅ Documentar bem
- ✅ Review rápido mas cuidadoso
- ✅ Mergear em main E dev
- ✅ Comunicar time
- ✅ Monitorar após deploy
- ✅ Post-mortem depois

**Nomenclatura:**
```bash
hotfix/nome-descritivo-do-bug
hotfix/divisao-zero-payment
hotfix/sql-injection-users
hotfix/memory-leak-reports
```

---

## I

### Init
**O que é:** Comando que inicia um novo repositório Git em uma pasta.

**Analogia:** É como começar um novo caderno. A pasta vazia vira um projeto que o Git vai acompanhar.

**Como usar:**
```bash
# Criar pasta e iniciar Git
mkdir meu-projeto
cd meu-projeto
git init

# Ou criar e iniciar de uma vez
git init meu-projeto
cd meu-projeto
```

**O que acontece:**
```bash
git init
# Initialized empty Git repository in /home/user/meu-projeto/.git/

ls -la
# .git/  ← Pasta criada (não mexer!)
```

**Estrutura criada:**
```
meu-projeto/
└── .git/
    ├── config          # Configurações do repositório
    ├── HEAD           # Referência atual
    ├── branches/      # Branches
    ├── objects/       # Commits, árvores, blobs
    └── refs/          # Referências
```

**Após init:**
```bash
# 1. Criar arquivos
echo "# Meu Projeto" > README.md

# 2. Adicionar ao Git
git add README.md

# 3. Primeiro commit
git commit -m "init: projeto inicial"

# 4. Conectar a repositório remoto (GitHub)
git remote add origin https://github.com/usuario/repo.git

# 5. Enviar
git push -u origin main
```

**Init vs Clone:**
- **init:** Começar repositório DO ZERO (novo)
- **clone:** Copiar repositório EXISTENTE

---

### Issue
**O que é:** Sistema de tickets/tarefas no GitHub para rastrear bugs, features, perguntas.

**Analogia:** É como um sistema de chamados em empresa de TI. Cada problema/solicitação vira um ticket numerado.

**Para que serve:**
- Reportar bugs
- Solicitar features
- Fazer perguntas
- Planejar tarefas
- Documentar decisões

**Criar issue:**
1. GitHub → Aba "Issues"
2. "New Issue"
3. Preencher template

**Template de issue:**
```markdown
## 🐛 Descrição do Bug
Descrição clara do problema.

## 📋 Passos para Reproduzir
1. Ir para '...'
2. Clicar em '....'
3. Ver erro

## ✅ Comportamento Esperado
O que deveria acontecer

## 🐞 Comportamento Atual
O que acontece de errado

## 📸 Screenshots
Se aplicável

## 🖥️ Ambiente
- OS: Windows 10
- Browser: Chrome 118
- Versão: v1.2.3

## ℹ️ Informações Adicionais
Contexto adicional
```

**Labels (etiquetas):**
```
bug          # 🐛 Algo não funciona
enhancement  # ✨ Nova funcionalidade
documentation # 📚 Melhoria na documentação
help wanted  # 🙋 Precisa de ajuda
good first issue # 🌱 Bom para iniciantes
duplicate    # 👥 Issue duplicada
invalid      # ❌ Issue inválida
wontfix      # 🚫 Não será corrigida
```

**Referenciar issues:**
```bash
# No commit
git commit -m "fix: corrige bug no login

Fixes #42"  # ← Fecha issue automaticamente quando PR for mergeado

# No PR
Closes #123
Resolves #456
Fixes #789
```

**Mencionar pessoas:**
```markdown
@usuario o que você acha?
/cc @time-backend
```

---

## L

### Log
**O que é:** Comando para ver histórico de commits.

**Analogia:** É como o histórico do navegador. Mostra tudo que aconteceu no projeto.

**Uso básico:**
```bash
# Log completo
git log

# Log resumido (mais usado)
git log --oneline

# Últimos 5 commits
git log -5

# Com gráfico de branches
git log --graph --oneline --all
```

**Saída padrão:**
```bash
commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
Author: João Silva <joao@email.com>
Date:   Wed Oct 15 14:30:00 2025 -0300

    feat: adiciona validação de email
    
    - Implementa regex para validação
    - Adiciona testes unitários
    - Atualiza documentação
```

**Saída resumida:**
```bash
git log --oneline
# a1b2c3d feat: adiciona validação
# e5f6g7h fix: corrige bug no login
# i9j0k1l docs: atualiza README
```

**Filtros úteis:**
```bash
# Por autor
git log --author="João Silva"

# Por data
git log --since="2 weeks ago"
git log --after="2025-10-01"
git log --before="2025-10-15"

# Por mensagem
git log --grep="login"

# Por arquivo
git log -- arquivo.py

# Apenas merges
git log --merges

# Sem merges
git log --no-merges

# Com estatísticas
git log --stat

# Com patch (mudanças)
git log -p
```

**Formatação customizada:**
```bash
# Formato personalizado
git log --pretty=format:"%h - %an, %ar : %s"
# a1b2c3d - João Silva, 2 days ago : feat: adiciona login

# Com cores
git log --pretty=format:"%Cred%h%Creset - %Cgreen%an%Creset, %ar : %s"
```

**Ver histórico de arquivo específico:**
```bash
# Histórico completo
git log arquivo.py

# Com mudanças
git log -p arquivo.py

# Incluir arquivos deletados
git log --all --full-history -- arquivo.py
```

**Ver histórico gráfico:**
```bash
git log --graph --oneline --all --decorate

# Saída:
# * a1b2c3d (HEAD -> dev) feat: adiciona login
# *   e5f6g7h Merge branch 'feat/users'
# |\  
# | * i9j0k1l feat: implementa users
# | * m3n4o5p feat: cria banco de dados
# |/  
# * q6r7s8t docs: inicial
```

**Aliases úteis:**
```bash
# Configurar alias para log bonito
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Usar:
git lg
```

---

## M

### Main/Master
**O que é:** Branch principal do repositório, geralmente representa código em produção.

**Analogia:** É o documento oficial, a versão "publicada" do projeto.

**Histórico:**
- **Antigamente:** `master` (termo padrão)
- **Atualmente:** `main` (novo padrão desde 2020)

**Características:**
- Código estável e testado
- Versão em produção
- Protegida (não pode commitar direto)
- Apenas merges via PR

**Workflow típico:**
```
main (produção)
  ↑
dev (desenvolvimento)
  ↑
feat/sua-funcionalidade (trabalho individual)
```

**Proteger branch main:**
```
GitHub → Settings → Branches → Add rule

✅ Require pull request before merging
✅ Require approvals (pelo menos 1)
✅ Require status checks to pass
✅ Include administrators
```

**Trabalhar com main:**
```bash
# NUNCA faça:
git checkout main
git add .
git commit -m "mudança"  # ❌ Erro!

# SEMPRE faça:
git checkout dev
git checkout -b feat/nova-funcionalidade
# ... trabalhar ...
git push
# Abrir PR para dev
# PR aprovado → merge dev
# Quando dev estiver estável → PR para main
```

---

### Merge
**O que é:** Juntar duas branches, combinando suas mudanças.

**Analogia:** É como juntar dois documentos do Google Docs em um só, mantendo contribuições de ambos.

**Tipos de merge:**

**1. Fast-forward** (mais simples):
```
ANTES:
main  ●──────●
            ╲
feat         ●──●

DEPOIS:
main  ●──────●──●  (apenas avançou)
```

**2. Three-way merge** (cria commit de merge):
```
ANTES:
main  ●──────●──────●
            ╲      
feat         ●──●──●

DEPOIS:
main  ●──────●──────●────●  (commit de merge)
            ╲            ╱
feat         ●──────●──●
```

**3. Squash merge** (achata commits):
```
ANTES:
main  ●──────●
            ╲
feat         ●──●──●  (3 commits)

DEPOIS:
main  ●──────●────●  (1 commit único)
```

**Como fazer merge:**
```bash
# 1. Ir para branch de destino
git checkout dev

# 2. Atualizar
git pull origin dev

# 3. Fazer merge
git merge feat/sua-funcionalidade

# 4. Se houver conflitos, resolver
# (ver seção Conflict)

# 5. Enviar
git push origin dev
```

**Merge com opções:**
```bash
# Sem fast-forward (sempre cria commit de merge)
git merge --no-ff feat/login

# Squash (achata todos commits em um)
git merge --squash feat/login
git commit -m "feat: adiciona sistema de login completo"

# Abort (cancelar merge com conflitos)
git merge --abort
```

**Merge strategies:**
```bash
# Recursiva (padrão)
git merge -s recursive feat/login

# Ours (em caso de conflito, fica com nossa versão)
git merge -s ours feat/experimental

# Theirs (em caso de conflito, fica com versão deles)
git merge -X theirs feat/login
```

**Ver se branch foi mergeada:**
```bash
# Branches já mergeadas
git branch --merged

# Branches não mergeadas
git branch --no-merged
```

---

### Merge Conflict
**Veja:** [Conflict](#conflict-conflito)

---

## O

### Origin
**O que é:** Nome padrão do repositório remoto principal.

**Analogia:** É como um apelido. Ao invés de escrever a URL completa do GitHub toda vez, você usa "origin".

**Como funciona:**
```bash
# Quando você clona:
git clone https://github.com/usuario/projeto.git

# Git automaticamente cria:
origin = https://github.com/usuario/projeto.git
```

**Ver repositórios remotos:**
```bash
git remote -v
# origin  https://github.com/usuario/projeto.git (fetch)
# origin  https://github.com/usuario/projeto.git (push)
```

**Usar origin em comandos:**
```bash
# Push para origin
git push origin main

# Pull de origin
git pull origin dev

# Fetch de origin
git fetch origin
```

**Múltiplos remotos:**
```bash
# Adicionar outro remoto
git remote add upstream https://github.com/original/projeto.git

git remote -v
# origin    https://github.com/seu-usuario/projeto.git (fetch)
# origin    https://github.com/seu-usuario/projeto.git (push)
# upstream  https://github.com/original/projeto.git (fetch)
# upstream  https://github.com/original/projeto.git (push)

# Usar cada um:
git pull upstream main    # Puxar do original
git push origin main      # Enviar para seu fork
```

**Renomear origin:**
```bash
git remote rename origin novo-nome
```

**Remover remote:**
```bash
git remote remove origin
```

**Mudar URL:**
```bash
# De HTTPS para SSH
git remote set-url origin git@github.com:usuario/projeto.git

# Ver nova URL
git remote -v
```

---

## P

### Pull
**O que é:** Baixar e mesclar mudanças do repositório remoto para o local.

**Analogia:** É como sincronizar seu Dropbox. Baixa arquivos novos e combina com o que você tem.

**O que pull faz:**
```bash
git pull = git fetch + git merge
```

**Uso básico:**
```bash
# Pull da branch atual
git pull

# Pull de branch específica
git pull origin dev

# Pull com rebase (ao invés de merge)
git pull --rebase origin dev
```

**Exemplo prático:**
```bash
# Você está em feat/login
# Quer atualizar com mudanças da dev

git pull origin dev

# Git baixa commits novos e tenta mesclar
# Se sucesso:
# Updating a1b2c3d..e5f6g7h
# Fast-forward
#  arquivo.py | 10 ++++++++
#  1 file changed, 10 insertions(+)
```

**Com conflitos:**
```bash
git pull origin dev

# Auto-merging arquivo.py
# CONFLICT (content): Merge conflict in arquivo.py
# Automatic merge failed; fix conflicts and then commit the result.

# Resolver conflitos, então:
git add arquivo.py
git commit -m "merge: resolve conflito com dev"
```

**Pull com rebase:**
```bash
# Ao invés de criar commit de merge,
# "move" seus commits para depois dos novos

git pull --rebase origin dev

# Histórico fica mais limpo, linear
```

**Configurar pull padrão:**
```bash
# Sempre fazer rebase ao invés de merge
git config pull.rebase true

# Apenas na branch atual
git config branch.feat/login.rebase true
```

**Boas práticas:**
- ✅ Pull antes de começar a trabalhar
- ✅ Pull antes de abrir PR
- ✅ Pull várias vezes ao dia
- ❌ Não pull no meio de trabalho sem commitar antes

---

### Pull Request (PR)
**O que é:** Solicitação para revisar e mesclar seu código ao projeto.

**Analogia:** É como submeter uma redação para o professor corrigir antes de valer nota. Você mostra seu trabalho, recebe feedback, e se estiver OK, entra para o projeto oficial.

**Fluxo completo:**

**1. Trabalhar na branch:**
```bash
git checkout -b feat/nova-funcionalidade
# ... desenvolver ...
git add .
git commit -m "feat: implementa nova funcionalidade"
git push -u origin feat/nova-funcionalidade
```

**2. Abrir PR no GitHub:**
- Ir para repositório no GitHub
- Clicar em "Compare & Pull Request"
- Preencher informações:

```markdown
## 📋 Descrição
Implementa sistema de login com autenticação JWT

## ✨ Funcionalidades
- Formulário de login
- Validação de credenciais
- Geração de token JWT
- Middleware de autenticação

## 🧪 Como testar
1. Rodar backend: `python main.py`
2. Acessar: http://localhost:8000/login
3. Testar com usuário: teste@email.com / senha123

## 📸 Screenshots
(adicionar prints)

## ✅ Checklist
- [x] Código testado localmente
- [x] Testes unitários adicionados
- [x] Documentação atualizada
- [ ] Code review solicitado

## 🔗 Issues relacionadas
Closes #42
Related to #38
```

**3. Configurar PR:**
- **Base:** dev (branch de destino)
- **Compare:** feat/nova-funcionalidade (sua branch)
- **Reviewers:** Selecionar quem vai revisar
- **Assignees:** Você mesmo
- **Labels:** feature, backend
- **Projects:** Sprint 5
- **Milestone:** v1.2.0

**4. Review:**

Revisor analisa e comenta:
```markdown
// No código:
Linha 45: Adicionar validação de email aqui

// Geral:
@joao pode adicionar testes para validação de senha?
Código está ótimo! Apenas pequenos ajustes.
```

**5. Responder a review:**
```bash
# Fazer mudanças solicitadas
# Editar código...

git add .
git commit -m "fix: adiciona validação de email conforme review"
git push

# PR atualiza automaticamente
```

**6. Aprovação e Merge:**
```markdown
✅ Aprovado por @maria-dev
✅ Testes passando
✅ Sem conflitos

Merge pull request #123 from joao/feat/nova-funcionalidade
```

**Tipos de merge no PR:**
- **Merge commit:** Mantém todos commits
- **Squash and merge:** Achata em 1 commit
- **Rebase and merge:** Reaplica commits linearmente

**Status do PR:**
- 🟡 **Open:** Aberto, aguardando review
- 🟢 **Approved:** Aprovado, pode mergear
- 🔴 **Changes requested:** Precisa ajustes
- 🟣 **Merged:** Mergeado, concluído
- ⚫ **Closed:** Fechado sem merge

**Comandos úteis no PR:**
```markdown
/cc @time-backend     # Mencionar time
Closes #42           # Fechar issue
Fixes #123           # Corrigir issue
Related to #88       # Relacionar issue
```

---

### Push
**O que é:** Enviar commits locais para repositório remoto (GitHub).

**Analogia:** É como fazer upload de arquivos para o Google Drive. Sai do seu computador e vai para nuvem.

**Uso básico:**
```bash
# Push básico (branch já configurada)
git push

# Push especificando remoto e branch
git push origin main

# Primeira vez (criar branch remota)
git push -u origin feat/nova-funcionalidade
# -u = --set-upstream (configura tracking)
```

**O que acontece:**
```bash
git push origin dev

# Contando objetos: 10, pronto.
# Comprimindo objetos: 100% (8/8), pronto.
# Escrevendo objetos: 100% (10/10), 1.5 KiB | 0 bytes/s, pronto.
# Total 10 (delta 3), reused 0 (delta 0)
# To https://github.com/usuario/projeto.git
#    a1b2c3d..e5f6g7h  dev -> dev
```

**Push com força (cuidado!):**
```bash
# Force push (reescreve histórico remoto)
git push --force origin feat/minha-branch

# Force with lease (mais seguro)
git push --force-with-lease origin feat/minha-branch
```

**⚠️ NUNCA use --force em:**
- main
- dev
- Branches compartilhadas

**Push rejeitado:**
```bash
git push
# ! [rejected]        dev -> dev (fetch first)
# error: failed to push some refs

# Solução:
git pull origin dev  # Puxar mudanças primeiro
git push origin dev  # Tentar novamente
```

**Push de todas as branches:**
```bash
# Push todas as branches
git push --all origin

# Push todas as tags
git push --tags origin
```

**Push de tag específica:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**Deletar branch remota:**
```bash
git push origin --delete feat/antiga
```

---

## R

### Rebase
**O que é:** Replicar commits de uma branch em outra, "movendo" a base.

**Analogia:** É como reescrever a história. Ao invés de "fulano escreveu isso quando beltrano já tinha escrito aquilo", você faz parecer que "fulano escreveu depois de beltrano".

**Diferença entre merge e rebase:**

**MERGE:**
```
main  ●──────●──────●────●  (commit de merge)
            ╲            ╱
feat         ●──────●──●

Histórico: mostra que houve trabalho paralelo
```

**REBASE:**
```
main  ●──────●──────●──●──●──●  (linear)
                     (commits de feat "movidos")

Histórico: parece que tudo foi feito em sequência
```

**Como usar:**
```bash
# Você está em feat/login
git rebase dev

# Git "move" seus commits para depois dos de dev
```

**Processo de rebase:**
```bash
git checkout feat/login
git rebase dev

# Se houver conflitos:
# CONFLICT (content): Merge conflict in arquivo.py

# 1. Resolver conflito
nano arquivo.py

# 2. Adicionar
git add arquivo.py

# 3. Continuar rebase
git rebase --continue

# Ou cancelar tudo:
git rebase --abort
```

**Rebase interativo** (editar histórico):
```bash
# Últimos 3 commits
git rebase -i HEAD~3

# Editor abre com:
pick a1b2c3d feat: adiciona login
pick e5f6g7h fix: corrige bug
pick i9j0k1l feat: melhora validação

# Você pode:
# pick   = manter commit
# reword = mudar mensagem
# edit   = editar commit
# squash = juntar com anterior
# drop   = deletar commit
```

**Exemplo de squash:**
```bash
# Antes (3 commits):
feat: adiciona login (a1b2c3d)
fix: corrige typo (e5f6g7h)
fix: outro typo (i9j0k1l)

# Rebase interativo:
git rebase -i HEAD~3

# Mudar para:
pick a1b2c3d feat: adiciona login
squash e5f6g7h fix: corrige typo
squash i9j0k1l fix: outro typo

# Resultado (1 commit):
feat: adiciona login (novo-hash)
```

**Quando usar rebase:**
✅ Antes de abrir PR (limpar histórico)
✅ Atualizar sua branch com dev
✅ Corrigir commits desorganizados

**Quando NÃO usar:**
❌ Em branches públicas/compartilhadas
❌ Depois de push (a menos que seja sua branch pessoal)
❌ Se não entender bem o que está fazendo

**Golden Rule of Rebase:**
> Nunca rebase commits que já foram enviados para repositório público compartilhado

---

### Reflog
**O que é:** Histórico de TUDO que você fez no Git. Registra cada movimento do HEAD.

**Analogia:** É a caixa preta do avião. Mesmo se você deletar branches ou commits, o reflog tem registro.

**Para que serve:**
- Recuperar commits "perdidos"
- Ver histórico de comandos
- Desfazer ações que deram errado

**Como usar:**
```bash
git reflog

# Saída:
a1b2c3d HEAD@{0}: commit: feat: adiciona login
e5f6g7h HEAD@{1}: checkout: moving from dev to feat/login
i9j0k1l HEAD@{2}: pull: Fast-forward
m3n4o5p HEAD@{3}: commit: fix: corrige bug
q6r7s8t HEAD@{4}: reset: moving to HEAD~1
```

**Cada entrada mostra:**
- Hash do commit
- Referência HEAD@{n}
- Ação realizada
- Mensagem

**Recuperar commit "perdido":**
```bash
# Você fez:
git reset --hard HEAD~5  # Ops! Deletou commits importantes

# Solução:
git reflog
# Encontrar commit antes do reset:
# e5f6g7h HEAD@{1}: commit: trabalho importante

# Voltar para ele:
git reset --hard e5f6g7h

# Ou criar branch a partir dele:
git checkout -b recuperacao e5f6g7h
```

**Reflog de branch específica:**
```bash
git reflog show dev
```

**Limpar reflog:**
```bash
# Expirar entradas antigas
git reflog expire --expire=30.days --all

# Limpar tudo (cuidado!)
git reflog delete HEAD@{1}
```

**Exemplo de recuperação:**
```bash
# Cenário: Você deletou branch por engano
git branch -D feat/importante  # Ops!

# Recuperar:
git reflog | grep feat/importante
# a1b2c3d HEAD@{5}: commit: último commit da branch

git checkout -b feat/importante a1b2c3d
# Branch recuperada!
```

---

### Remote
**O que é:** Versão do repositório hospedada em servidor (GitHub, GitLab, etc).

**Analogia:** É a cópia do projeto na nuvem. Seu computador tem a cópia local, o servidor tem a remota.

**Ver remotos:**
```bash
git remote
# origin

git remote -v
# origin  https://github.com/usuario/projeto.git (fetch)
# origin  https://github.com/usuario/projeto.git (push)
```

**Adicionar remoto:**
```bash
git remote add nome-do-remoto https://github.com/usuario/projeto.git

# Exemplo:
git remote add upstream https://github.com/original/projeto.git
```

**Remover remoto:**
```bash
git remote remove upstream
```

**Renomear remoto:**
```bash
git remote rename origin novo-nome
```

**Ver informações do remoto:**
```bash
git remote show origin

# * remote origin
#   Fetch URL: https://github.com/usuario/projeto.git
#   Push  URL: https://github.com/usuario/projeto.git
#   HEAD branch: main
#   Remote branches:
#     dev    tracked
#     main   tracked
#   Local branch configured for 'git pull':
#     main merges with remote main
#   Local ref configured for 'git push':
#     main pushes to main (up to date)
```

**Múltiplos remotos (fork workflow):**
```bash
# Seu fork
git remote add origin https://github.com/seu-usuario/projeto.git

# Repositório original
git remote add upstream https://github.com/original/projeto.git

git remote -v
# origin    https://github.com/seu-usuario/projeto.git (fetch)
# origin    https://github.com/seu-usuario/projeto.git (push)
# upstream  https://github.com/original/projeto.git (fetch)
# upstream  https://github.com/original/projeto.git (push)

# Pull do original:
git pull upstream main

# Push para seu fork:
git push origin main
```

---

### Repository (Repositório)
**O que é:** Pasta de projeto rastreada pelo Git. Contém todo código e histórico.

**Analogia:** É um projeto completo com histórico. Como um caderno de anotações onde você não apenas vê a versão atual, mas pode folhear e ver tudo que foi escrito antes.

**Estrutura:**
```
meu-repositorio/
├── .git/              ← Pasta mágica do Git (não mexer!)
├── .gitignore         ← Arquivos para ignorar
├── README.md          ← Documentação
├── src/               ← Código fonte
│   ├── main.py
│   └── utils.py
├── tests/             ← Testes
└── docs/              ← Documentação
```

**Tipos de repositório:**

**Local:**
```bash
# Seu computador
~/Projetos/meu-projeto/
```

**Remoto:**
```bash
# Servidor (GitHub)
https://github.com/usuario/meu-projeto.git
```

**Criar repositório:**

**Opção 1: Do zero (init):**
```bash
mkdir novo-projeto
cd novo-projeto
git init
```

**Opção 2: Clonar existente:**
```bash
git clone https://github.com/usuario/projeto.git
```

**Repositório bare** (só no servidor):
```bash
git init --bare
# Sem working directory, apenas .git/
# Usado para servidores centrais
```

---

### Reset
**O que é:** Desfazer commits, movendo HEAD e/ou modificando working directory.

**Analogia:** É como usar o botão "desfazer" da vida real. Pode voltar no tempo com ou sem perder suas mudanças.

**Três modos:**

**1. Soft (mais seguro):**
```bash
git reset --soft HEAD~1
```
- Move HEAD para trás
- Mantém mudanças no working directory
- Mantém mudanças na staging area
- **Use quando:** Quer desfazer commit mas manter código

**2. Mixed (padrão):**
```bash
git reset HEAD~1
# ou
git reset --mixed HEAD~1
```
- Move HEAD para trás
- Mantém mudanças no working directory
- Remove mudanças da staging area
- **Use quando:** Quer desfazer commit e refazer staging

**3. Hard (perigoso!):**
```bash
git reset --hard HEAD~1
```
- Move HEAD para trás
- **APAGA** mudanças do working directory
- **APAGA** mudanças da staging area
- **Use quando:** Quer apagar tudo mesmo

**Visualização:**
```
Commit: A ← B ← C ← D (HEAD)

git reset --soft B
Commit: A ← B (HEAD)
Working directory: tem mudanças de C e D
Staging: tem mudanças de C e D

git reset --mixed B
Commit: A ← B (HEAD)
Working directory: tem mudanças de C e D
Staging: vazio

git reset --hard B
Commit: A ← B (HEAD)
Working directory: limpo
Staging: vazio
Mudanças de C e D: PERDIDAS PARA SEMPRE!
```

**Exemplos práticos:**

**Desfazer último commit (manter código):**
```bash
git reset --soft HEAD~1
# Agora pode editar e recommitar
git add .
git commit -m "Nova mensagem correta"
```

**Desfazer últimos 3 commits:**
```bash
git reset --soft HEAD~3
```

**Voltar para commit específico:**
```bash
git reset --hard a1b2c3d
```

**Desfazer staging de arquivo:**
```bash
git add arquivo.py
git reset arquivo.py
# Arquivo volta para unstaged
```

**⚠️ ATENÇÃO:**
- Só use reset em commits locais (não enviados)
- `--hard` apaga permanentemente
- Se já deu push, use `revert` ao invés de reset

**Recuperar de reset acidental:**
```bash
# Se usou --hard por engano
git reflog
# Encontrar hash antes do reset

git reset --hard <hash-antes-do-reset>
```

---

### Revert
**O que é:** Criar novo commit que desfaz mudanças de commit anterior.

**Analogia:** É como escrever uma correção em um livro publicado. Você não pode apagar o que já foi impresso, mas pode adicionar uma errata.

**Diferença entre reset e revert:**

**RESET:** (reescreve histórico)
```
Antes: A ← B ← C ← D
Depois: A ← B
(C e D desaparecem)
```

**REVERT:** (mantém histórico)
```
Antes: A ← B ← C ← D
Depois: A ← B ← C ← D ← D' (desfaz D)
```

**Como usar:**
```bash
# Reverter último commit
git revert HEAD

# Reverter commit específico
git revert a1b2c3d

# Reverter sem commitar (para editar)
git revert --no-commit a1b2c3d
```

**Exemplo prático:**
```bash
# Histórico:
git log --oneline
# a1b2c3d (HEAD) feat: quebrou tudo
# e5f6g7h feat: funcionalidade boa
# i9j0k1l feat: inicial

# Reverter commit problemático
git revert a1b2c3d

# Editor abre para mensagem:
Revert "feat: quebrou tudo"

This reverts commit a1b2c3d.

# Novo histórico:
# m3n4o5p (HEAD) Revert "feat: quebrou tudo"
# a1b2c3d feat: quebrou tudo
# e5f6g7h feat: funcionalidade boa
# i9j0k1l feat: inicial
```

**Reverter merge:**
```bash
# Merge tem dois parents
git revert -m 1 <hash-do-merge>

# -m 1 = manter primeiro parent
# -m 2 = manter segundo parent
```

**Reverter múltiplos commits:**
```bash
# Reverter últimos 3
git revert HEAD~3..HEAD

# Sem criar commits individuais
git revert -n HEAD~3..HEAD
git commit -m "Revert últimos 3 commits"
```

**Quando usar revert:**
✅ Código já foi enviado (push)
✅ Outros já baixaram seus commits
✅ Precisa manter histórico transparente
✅ Ambiente de produção

**Quando usar reset:**
✅ Commits ainda locais (não enviados)
✅ Você é o único na branch
✅ Quer limpar histórico

---

## S

### Stage/Staging Area
**O que é:** Área intermediária onde arquivos aguardam antes de serem commitados.

**Analogia:** É a sacola de compras. Você coloca produtos (add), revisa, pode tirar alguns, e só depois vai ao caixa (commit).

**Os três estados:**
```
Working Directory (modificado) 
        ↓ git add
Staging Area (preparado)
        ↓ git commit  
Repository (commitado)
```

**Visualização:**
```
📁 Working Directory:
   - arquivo.py (modificado)
   - novo.py (novo)

↓ git add arquivo.py

📦 Staging Area:
   - arquivo.py ✓

⚪ Ainda em Working:
   - novo.py

↓ git commit

📚 Repository:
   - arquivo.py (commitado)

⚪ Ainda em Working:
   - novo.py (não foi commitado)
```

**Comandos:**
```bash
# Adicionar a staging
git add arquivo.py

# Ver o que está staged
git status
# Changes to be committed:
#   modified: arquivo.py

# Ver diferenças staged
git diff --staged

# Remover de staging (unstage)
git reset arquivo.py

# Commitar o que está staged
git commit -m "mensagem"
```

**Por que staging existe?**
- Controle fino sobre o que commitar
- Pode separar mudanças em múltiplos commits
- Revisa antes de commitar

**Exemplo prático:**
```bash
# Você alterou 3 arquivos
git status
# modified: login.py
# modified: register.py
# modified: database.py

# Quer commitar em commits separados
git add login.py
git commit -m "feat: melhora validação de login"

git add register.py
git commit -m "feat: adiciona campo telefone no registro"

git add database.py
git commit -m "refactor: otimiza queries"
```

---

### Stash
**O que é:** Guardar temporariamente mudanças sem commitar.

**Analogia:** É como guardar um rascunho. Você para o que está fazendo, guarda numa gaveta, faz outra coisa, e depois volta ao rascunho.

**Quando usar:**
- Precisa mudar de branch mas não quer commitar ainda
- Quer puxar atualizações mas tem mudanças locais
- Precisa pausar trabalho temporariamente

**Comandos básicos:**
```bash
# Guardar mudanças
git stash

# Ou com mensagem
git stash save "Trabalho em progresso na tela de login"

# Ver lista de stashes
git stash list
# stash@{0}: On feat/login: Trabalho em progresso
# stash@{1}: WIP on dev: último trabalho
# stash@{2}: On feat/users: trabalho antigo

# Recuperar último stash
git stash pop

# Aplicar sem remover da lista
git stash apply

# Aplicar stash específico
git stash apply stash@{1}

# Ver conteúdo do stash
git stash show

# Ver diff do stash
git stash show -p

# Deletar stash
git stash drop stash@{0}

# Limpar todos stashes
git stash clear
```

**Exemplo prático:**
```bash
# Você está trabalhando em feat/login
git status
# modified: login.py
# modified: auth.py

# Chefe pede: "Corrige bug urgente!"

# 1. Guardar trabalho atual
git stash save "Login em progresso - falta validação"

# 2. Mudar para outra tarefa
git checkout dev
git checkout -b hotfix/bug-urgente

# 3. Corrigir bug
# ... editar ...
git add .
git commit -m "hotfix: corrige bug"
git push

# 4. Voltar ao trabalho anterior
git checkout feat/login

# 5. Recuperar trabalho guardado
git stash pop

# Pronto! Continue de onde parou
```

**Stash com arquivos untracked:**
```bash
# Incluir arquivos novos (não rastreados)
git stash -u
# ou
git stash --include-untracked

# Incluir até arquivos ignorados
git stash -a
# ou
git stash --all
```

**Criar branch a partir de stash:**
```bash
git stash branch nova-branch stash@{0}

# Cria branch e aplica stash nela
```

---

### Status
**O que é:** Comando mais importante do Git. Mostra estado atual do repositório.

**Analogia:** É o painel do carro. Mostra velocidade (branch), combustível (mudanças), alertas (conflitos).

**Uso:**
```bash
git status
```

**Saída típica:**
```bash
On branch feat/login
Your branch is up to date with 'origin/feat/login'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   login.py

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes)
	modified:   auth.py

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	validators.py
```

**Interpretando:**

**1. Branch atual:**
```
On branch feat/login
```

**2. Status remoto:**
```
Your branch is up to date with 'origin/feat/login'
# Ou:
Your branch is ahead of 'origin/feat/login' by 2 commits
Your branch is behind 'origin/feat/login' by 3 commits
```

**3. Staged (pronto para commit):**
```
Changes to be committed:
	modified:   login.py
```

**4. Modified (alterado mas não staged):**
```
Changes not staged for commit:
	modified:   auth.py
```

**5. Untracked (arquivo novo):**
```
Untracked files:
	validators.py
```

**Status curto:**
```bash
git status -s
# ou
git status --short

# Saída:
# M  login.py      (staged)
#  M auth.py       (modified, not staged)
# ?? validators.py (untracked)
# A  novo.py       (added)
# D  velho.py      (deleted)
```

**Símbolos:**
- `M` = Modified (modificado)
- `A` = Added (adicionado)
- `D` = Deleted (deletado)
- `R` = Renamed (renomeado)
- `C` = Copied (copiado)
- `U` = Updated (atualizado mas não mergeado)
- `?` = Untracked (não rastreado)

**Dica de ouro:**
> Use `git status` ANTES e DEPOIS de cada comando Git!

---

### Switch
**O que é:** Comando moderno para trocar de branch (Git 2.23+).

**Analogia:** É o substituto mais claro do `checkout` para mudar de branch.

**Diferença:**
```bash
# Antigo (ainda funciona)
git checkout dev

# Novo (mais claro)
git switch dev
```

**Comandos:**
```bash
# Trocar para branch existente
git switch dev

# Criar e trocar
git switch -c nova-branch

# Trocar para branch remota
git switch -c feat/login origin/feat/login

# Voltar para branch anterior
git switch -

# Forçar troca (descartar mudanças locais)
git switch -f dev
```

**Switch vs Checkout:**

**SWITCH:** (especializado em branches)
```bash
git switch dev           # Trocar branch
git switch -c nova      # Criar branch
```

**RESTORE:** (especializado em arquivos)
```bash
git restore arquivo.py   # Restaurar arquivo
```

**CHECKOUT:** (faz ambos, mas confuso)
```bash
git checkout dev        # Trocar branch
git checkout arquivo.py # Restaurar arquivo
# Confuso!
```

---

## T

### Tag
**O que é:** Marcador para ponto específico no histórico. Geralmente usado para versões.

**Analogia:** É como colocar um marcador de página. Marca um ponto importante para voltar depois.

**Tipos:**

**Lightweight (leve):**
```bash
git tag v1.0.0
# Apenas um ponteiro para commit
```

**Annotated (anotada - recomendada):**
```bash
git tag -a v1.0.0 -m "Versão 1.0.0 - Primeiro release"
# Inclui: autor, data, mensagem
```

**Criar tags:**
```bash
# Tag no commit atual
git tag v1.0.0

# Tag com mensagem
git tag -a v1.0.0 -m "Versão 1.0.0 - Release inicial"

# Tag em commit específico
git tag -a v0.9.0 a1b2c3d -m "Versão beta"
```

**Listar tags:**
```bash
# Todas tags
git tag

# Tags que correspondem ao padrão
git tag -l "v1.*"
# v1.0.0
# v1.0.1
# v1.1.0
```

**Ver informações da tag:**
```bash
git show v1.0.0

# tag v1.0.0
# Tagger: João Silva <joao@email.com>
# Date:   Wed Oct 15 14:30:00 2025 -0300
# 
# Versão 1.0.0 - Release inicial
# 
# commit a1b2c3d...
```

**Fazer checkout de tag:**
```bash
git checkout v1.0.0
# Entra em detached HEAD
```

**Enviar tags:**
```bash
# Uma tag
git push origin v1.0.0

# Todas tags
git push origin --tags

# Apenas annotated tags
git push --follow-tags
```

**Deletar tag:**
```bash
# Local
git tag -d v1.0.0

# Remota
git push origin --delete v1.0.0
```

**Convenções de versionamento (Semantic Versioning):**
```
v1.2.3
│ │ │
│ │ └─ PATCH: Correções de bugs
│ └─── MINOR: Novas funcionalidades (compatíveis)
└───── MAJOR: Mudanças incompatíveis

Exemplos:
v1.0.0 - Release inicial
v1.0.1 - Correção de bug
v1.1.0 - Nova funcionalidade
v2.0.0 - Breaking change
```

**Boas práticas:**
```bash
# Sempre use annotated tags para releases
git tag -a v1.0.0 -m "Release 1.0.0

Funcionalidades:
- Sistema de login
- Cadastro de usuários
- Dashboard inicial

Correções:
- Bug no cálculo de impostos
- Validação de email"

git push origin v1.0.0
```

---

### Tracking Branch
**O que é:** Branch local configurada para seguir branch remota.

**Analogia:** É como assinar um canal no YouTube. Você recebe atualizações automaticamente.

**Como funciona:**
```bash
# Criar tracking branch
git checkout -b feat/login origin/feat/login
# ou
git switch -c feat/login origin/feat/login

# Agora feat/login local rastreia origin/feat/login
```

**Configurar tracking:**
```bash
# No push
git push -u origin feat/login
# -u = --set-upstream

# Manualmente
git branch --set-upstream-to=origin/feat/login feat/login
# ou
git branch -u origin/feat/login
```

**Ver tracking branches:**
```bash
git branch -vv

# * feat/login    a1b2c3d [origin/feat/login: ahead 2] feat: adiciona validação
#   dev           e5f6g7h [origin/dev] fix: corrige bug
#   main          i9j0k1l [origin/main] docs: atualiza README
```

**Benefícios:**
```bash
# Com tracking configurado:
git push      # Sabe para onde enviar
git pull      # Sabe de onde puxar

# Sem tracking:
git push origin feat/login      # Precisa especificar
git pull origin feat/login      # Precisa especificar
```

---

## U

### Unstage
**O que é:** Remover arquivo da staging area (desfazer `git add`).

**Analogia:** É tirar item do carrinho de compras antes de finalizar.

**Como fazer:**
```bash
# Git antigo
git reset HEAD arquivo.py

# Git novo (2.23+)
git restore --staged arquivo.py
```

**Exemplo prático:**
```bash
# Você adicionou vários arquivos
git add .

git status
# Changes to be committed:
#   modified: arquivo1.py
#   modified: arquivo2.py
#   modified: arquivo3.py

# Mas quer commitar apenas arquivo1.py
git restore --staged arquivo2.py
git restore --staged arquivo3.py

git status
# Changes to be committed:
#   modified: arquivo1.py
# 
# Changes not staged for commit:
#   modified: arquivo2.py
#   modified: arquivo3.py

# Agora pode commitar só arquivo1.py
git commit -m "feat: atualiza arquivo1"
```

**Unstage tudo:**
```bash
git reset
# ou
git restore --staged .
```

---

### Upstream
**O que é:** Repositório original de onde você fez fork.

**Analogia:** É a fonte original. Seu fork é a cópia, upstream é o original.

**Configurar upstream:**
```bash
# Seu fork
git remote add origin https://github.com/seu-usuario/projeto.git

# Repositório original
git remote add upstream https://github.com/organizacao/projeto.git

git remote -v
# origin    https://github.com/seu-usuario/projeto.git (fetch)
# origin    https://github.com/seu-usuario/projeto.git (push)
# upstream  https://github.com/organizacao/projeto.git (fetch)
# upstream  https://github.com/organizacao/projeto.git (push)
```

**Sincronizar com upstream:**
```bash
# 1. Baixar atualizações do upstream
git fetch upstream

# 2. Ir para main
git checkout main

# 3. Mesclar mudanças do upstream
git merge upstream/main

# 4. Enviar para seu fork
git push origin main
```

**Workflow completo:**
```bash
# Setup inicial (uma vez)
git clone https://github.com/seu-usuario/projeto.git
cd projeto
git remote add upstream https://github.com/organizacao/projeto.git

# Toda vez que começar a trabalhar:
git fetch upstream
git checkout main
git merge upstream/main
git checkout -b feat/nova-funcionalidade

# Trabalhar...
git add .
git commit -m "feat: nova funcionalidade"
git push origin feat/nova-funcionalidade

# Abrir PR no GitHub do seu fork para upstream
```

---

## W

### Working Directory/Working Tree
**O que é:** Pasta do projeto onde você trabalha. Arquivos que você vê e edita.

**Analogia:** É sua mesa de trabalho. Onde você de fato escreve código.

**Os três estados:**
```
Working Directory (sua mesa)
        ↓
Staging Area (organizar)
        ↓
Repository (arquivo)
```

**Estados de arquivos:**
```
📁 Working Directory pode ter:
  - Untracked (novos)
  - Modified (alterados)
  - Deleted (deletados)
  - Renamed (renomeados)
```

**Ver estado:**
```bash
git status

# working tree clean
# = nada modificado, tudo commitado

# Changes not staged for commit
# = arquivos modificados no working directory
```

**Limpar working directory:**
```bash
# Descartar mudanças em arquivo
git restore arquivo.py

# Descartar todas mudanças
git restore .

# Remover arquivos untracked
git clean -f

# Remover arquivos e diretórios untracked
git clean -fd
```

---

## Termos Complementares

### .git/
**O que é:** Pasta oculta onde Git guarda todas informações do repositório.

**⚠️ NUNCA MEXA NESTA PASTA!**

**Estrutura:**
```
.git/
├── config          # Configurações do repo
├── HEAD           # Branch atual
├── index          # Staging area
├── objects/       # Commits, trees, blobs
├── refs/          # Referências (branches, tags)
│   ├── heads/     # Branches locais
│   └── remotes/   # Branches remotas
├── hooks/         # Scripts automáticos
└── logs/          # Reflog
```

---

### Commit Message
**O que é:** Mensagem que descreve o que foi mudado no commit.

**Estrutura ideal:**
```
tipo(escopo): descrição curta (máx 50 caracteres)

Descrição detalhada do que foi mudado e por quê.
Pode ter múltiplas linhas.

Closes #42
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

---

### Fast-forward
**Veja:** [Fast-forward](#fast-forward)

---

### Rebase Interactive
**O que é:** Modo interativo do rebase para editar histórico.

**Comandos:**
- `pick`: Manter commit
- `reword`: Mudar mensagem
- `edit`: Editar commit
- `squash`: Juntar com anterior
- `fixup`: Juntar sem mensagem
- `drop`: Deletar commit

---

### SHA-1
**O que é:** Algoritmo de hash usado pelo Git para identificar commits.

**Resultado:** String de 40 caracteres hexadecimais

**Exemplo:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

---

### Three-way Merge
**O que é:** Merge que usa três pontos: base comum e duas pontas.

**Visual:**
```
        Base
         ●
        ╱ ╲
      A●   ●B
       ╲ ╱
      Merge
```

---

### WIP
**O que é:** Work In Progress (trabalho em progresso).

**Uso:**
```bash
git commit -m "wip: implementação parcial do login"
```

Indica que trabalho não está completo.

---

## 🎓 Resumo dos Termos Mais Importantes

### Básico (use todo dia):
1. **Commit** - Ponto de salvamento
2. **Branch** - Linha de desenvolvimento
3. **Push** - Enviar para GitHub
4. **Pull** - Baixar do GitHub
5. **Add** - Preparar para commit
6. **Status** - Ver estado atual

### Intermediário:
7. **Merge** - Juntar branches
8. **Clone** - Copiar repositório
9. **Remote** - Repositório remoto
10. **Checkout** - Mudar branch

### Avançado:
11. **Rebase** - Reescrever histórico
12. **Stash** - Guardar temporariamente
13. **Cherry-pick** - Copiar commit
14. **Reflog** - Histórico completo
15. **Reset** - Desfazer commits

---

## 📚 Como Usar Este Dicionário

1. **Busque** (Ctrl+F) o termo que você não entende
2. **Leia** a definição e analogia
3. **Veja** os exemplos práticos
4. **Pratique** o comando
5. **Volte** sempre que esquecer

---

**Feito com ❤️ para o Time TudoGestão+**

*Se este dicionário te ajudou, compartilhe com outros desenvolvedores!*

---

*Última atualização: Outubro 2025*
*Versão: 1.0*