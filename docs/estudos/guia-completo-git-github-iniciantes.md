# 🚀 Git & GitHub - Cheat Sheet de Referência Rápida
### Comandos mais usados no dia a dia

---

## ⚡ Comandos Essenciais (Use TODO DIA)

```bash
# Ver status (USE SEMPRE!)
git status

# Ver histórico
git log --oneline

# Ver branches
git branch
```

---

## 🎬 Começando o Dia

```bash
# 1. Atualizar projeto
git checkout dev
git pull origin dev

# 2. Criar branch para trabalhar
git checkout -b feat/nome-da-tarefa
```

---

## 💾 Salvando Trabalho

```bash
# 1. Ver o que mudou
git status
git diff

# 2. Adicionar arquivos
git add .                    # Adiciona tudo
git add arquivo.py           # Adiciona arquivo específico

# 3. Commitar
git commit -m "feat: descrição curta"

# 4. Enviar para GitHub
git push                     # Da segunda vez em diante
git push -u origin feat/...  # Primeira vez na branch
```

---

## 🔄 Mudando de Branch

```bash
# Listar branches
git branch                   # Locais
git branch -a                # Locais + remotas

# Mudar de branch
git checkout nome-da-branch

# Criar e mudar
git checkout -b nova-branch

# Deletar branch local
git branch -d nome-da-branch
```

---

## 📥 Atualizando

```bash
# Puxar mudanças
git pull origin dev

# Baixar info sem mesclar
git fetch
```

---

## ⏪ Desfazendo Coisas

```bash
# Desfazer git add (tirar do staging)
git reset arquivo.py

# Desfazer mudanças em arquivo
git checkout -- arquivo.py

# Desfazer último commit (mantém código)
git reset --soft HEAD~1

# Desfazer último commit (APAGA código!)
git reset --hard HEAD~1      # ⚠️ CUIDADO!

# Guardar mudanças temporariamente
git stash
git stash pop                # Recuperar depois
```

---

## 🔍 Investigando

```bash
# Ver diferenças
git diff                     # Todas mudanças
git diff arquivo.py          # Arquivo específico

# Ver quem mudou cada linha
git blame arquivo.py

# Ver histórico de um arquivo
git log -- arquivo.py
```

---

## 🔀 Trabalhando com Branches

```bash
# Atualizar sua branch com mudanças da dev
git checkout dev
git pull origin dev
git checkout feat/sua-branch
git merge dev

# Resolver conflitos
# 1. Edite os arquivos marcados com <<<<<<<
# 2. git add arquivo.py
# 3. git commit -m "merge: resolve conflitos"
```

---

## 📋 Tipos de Commit (Conventional Commits)

```bash
feat:      # Nova funcionalidade
fix:       # Correção de bug
docs:      # Documentação
style:     # Formatação (não afeta lógica)
refactor:  # Refatoração de código
test:      # Adicionar/modificar testes
chore:     # Tarefas de manutenção
```

### Exemplos:
```bash
git commit -m "feat: adiciona tela de login"
git commit -m "fix: corrige validação de email"
git commit -m "docs: atualiza README com instruções"
git commit -m "refactor: otimiza query de clientes"
```

---

## 🎯 Fluxo Completo Resumido

```bash
# 1. Atualizar dev
git checkout dev && git pull origin dev

# 2. Criar branch
git checkout -b feat/nova-funcionalidade

# 3. Trabalhar...
# ... editar arquivos ...

# 4. Salvar
git add .
git commit -m "feat: adiciona funcionalidade X"

# 5. Enviar
git push -u origin feat/nova-funcionalidade

# 6. Abrir PR no GitHub
# Navegador: github.com → Compare & Pull Request

# 7. Após merge, atualizar
git checkout dev
git pull origin dev
git branch -d feat/nova-funcionalidade
```

---

## 🆘 Comandos de Emergência

```bash
# Ver tudo que você fez (até commits "perdidos")
git reflog

# Voltar para estado anterior
git reset --hard <hash>

# Cancelar merge problemático
git merge --abort

# Ver configurações
git config --list

# Remover arquivo do Git (mas manter no disco)
git rm --cached arquivo.py
```

---

## 📝 Padrões de Nome de Branch

```
feat/nome-da-funcionalidade      # Nova funcionalidade
fix/descricao-do-bug             # Correção
docs/o-que-foi-documentado       # Documentação
refactor/o-que-foi-refatorado    # Refatoração
test/o-que-foi-testado           # Testes
```

### Exemplos Reais:
```
feat/cadastro-clientes
feat/relatorio-vendas-mensais
fix/bug-calculo-imposto
fix/erro-login-senha-invalida
docs/atualiza-guia-instalacao
refactor/reorganiza-estrutura-api
test/adiciona-testes-unitarios-api
```

---

## 🎨 Aliases Úteis (Opcional)

Configure atalhos para comandos frequentes:

```bash
# Configurar aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --all'

# Usar depois:
git st      # Mesmo que git status
git co dev  # Mesmo que git checkout dev
git br      # Mesmo que git branch
```

---

## 🔧 Configuração Inicial (Uma vez só)

```bash
# Seu nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Editor padrão
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "nano"         # Nano

# Cores
git config --global color.ui auto

# Verificar
git config --list
```

---

## 📊 Visualizando Histórico

```bash
# Histórico simples
git log --oneline

# Histórico com gráfico
git log --oneline --graph --all

# Últimos 5 commits
git log -5

# Commits de hoje
git log --since="midnight"

# Commits de um autor
git log --author="João"

# Commits que mexeram em arquivo
git log -- arquivo.py
```

---

## 🌐 Trabalhando com Remoto

```bash
# Ver repositórios remotos
git remote -v

# Adicionar remoto
git remote add origin https://github.com/user/repo.git

# Mudar URL do remoto
git remote set-url origin https://nova-url.git

# Ver info de remoto
git remote show origin

# Listar branches remotas
git branch -r
```

---

## 💡 Dicas Rápidas

**✅ FAÇA:**
- Use `git status` antes e depois de cada comando
- Commits pequenos e frequentes
- Mensagens de commit descritivas
- Sempre trabalhe em branches
- Pull antes de começar a trabalhar
- Push regularmente

**❌ NÃO FAÇA:**
- Commitar direto na main/dev
- Mensagens vagas ("mudanças", "update")
- Commits gigantes com muitas mudanças
- Deixar commits só na máquina local
- Usar `git push --force` em branches compartilhadas
- Commitar senhas, tokens, ou dados sensíveis

---

## 🎯 Checklist Rápido

### Começando uma nova tarefa:
```
☐ git checkout dev
☐ git pull origin dev
☐ git checkout -b feat/nome-tarefa
```

### Durante o trabalho:
```
☐ Editar arquivos
☐ git status
☐ git add .
☐ git commit -m "feat: ..."
☐ git push
```

### Finalizando:
```
☐ git push
☐ Abrir Pull Request no GitHub
☐ Aguardar review
☐ Após merge: git checkout dev && git pull
```

---

## 🔍 Resolvendo Conflitos

Quando aparece conflito:

```bash
# 1. Git mostra quais arquivos têm conflito
git status

# 2. Abra o arquivo e encontre:
seu código

# 3. Edite para manter o código correto
# 4. Remova os marcadores <<<<, ====, >>>>
# 5. Salve o arquivo

# 6. Marque como resolvido
git add arquivo.py

# 7. Continue o merge
git commit -m "merge: resolve conflito em arquivo.py"

# 8. Envie
git push
```

---

## 📱 Git no VS Code

### Atalhos úteis:
```
Ctrl+Shift+G    → Abrir painel Git
Ctrl+Enter      → Commit
Ctrl+Shift+P    → Command palette
  → "Git: Pull"
  → "Git: Push"
  → "Git: Checkout to..."
```

### Extensões recomendadas:
- GitLens
- Git Graph
- Git History

---

## 🎓 Comandos por Frequência de Uso

### TODO DIA (90%):
```bash
git status
git checkout
git pull
git add
git commit
git push
git branch
```

### TODA SEMANA (8%):
```bash
git merge
git log
git diff
git stash
```

### RARAMENTE (2%):
```bash
git reset
git revert
git rebase
git cherry-pick
git reflog
```

---

## 🚨 Erros Comuns e Soluções

### "fatal: not a git repository"
```bash
# Você não está na pasta do projeto
cd /caminho/correto/do/projeto
```

### "Your branch is behind"
```bash
# Simplesmente puxe as atualizações
git pull
```

### "You have unstaged changes"
```bash
# Commite ou guarde as mudanças
git stash         # Guardar temporariamente
# ou
git add .
git commit -m "wip: trabalho em progresso"
```

### "Merge conflict"
```bash
# Veja os arquivos com conflito
git status
# Edite cada arquivo
# Marque como resolvido
git add .
git commit -m "merge: resolve conflitos"
```

---

## 📞 Precisa de Ajuda?

```bash
# Ajuda geral
git --help

# Ajuda de comando específico
git commit --help
git pull --help

# Versão curta da ajuda
git commit -h
```

---

**💾 Salve esta página nos favoritos!**

*Para o guia completo, veja: `guia-completo-git-github-iniciantes.md`*