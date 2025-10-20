# 🎭 Git & GitHub - Cenários Práticos do Dia a Dia
### Situações reais e como resolver

---

## 📖 Índice de Cenários

1. [Primeiro Dia no Projeto](#cenário-1-primeiro-dia-no-projeto)
2. [Trabalhando em Múltiplas Tarefas](#cenário-2-trabalhando-em-múltiplas-tarefas)
3. [Conflito no Merge](#cenário-3-conflito-no-merge)
4. [Commitou na Branch Errada](#cenário-4-commitou-na-branch-errada)
5. [Precisa Desfazer um Commit](#cenário-5-precisa-desfazer-um-commit)
6. [Esqueceu de Criar Branch](#cenário-6-esqueceu-de-criar-branch)
7. [Atualizando Branch Antiga](#cenário-7-atualizando-branch-antiga)
8. [Precisa Revisar PR](#cenário-8-precisa-revisar-pr-de-colega)
9. [Push Rejected](#cenário-9-push-rejected)
10. [Deletou Arquivo por Engano](#cenário-10-deletou-arquivo-por-engano)
11. [Código de Produção Quebrou](#cenário-11-código-de-produção-quebrou-hotfix-urgente)
12. [Sincronizando Fork](#cenário-12-sincronizando-seu-fork-com-o-original)
13. [Commit com Arquivo Sensível](#cenário-13-commitou-senha-ou-arquivo-sensível)
14. [Branch Desatualizada há Dias](#cenário-14-branch-desatualizada-há-dias)
15. [Voltando Atrás em um Merge](#cenário-15-voltando-atrás-em-um-merge)

---

## Cenário 1: Primeiro Dia no Projeto

### Situação:
É seu primeiro dia trabalhando no TudoGestão+. Você precisa configurar tudo e começar sua primeira tarefa.

### Objetivo:
Configurar ambiente e fazer primeira contribuição.

### Passo a passo completo:

```bash
# ========================================
# PARTE 1: Configuração Inicial (uma vez)
# ========================================

# 1. Verificar se Git está instalado
git --version
# Se não estiver: baixe de https://git-scm.com

# 2. Configurar seu nome e email
git config --global user.name "Maria Silva"
git config --global user.email "maria.silva@empresa.com"

# 3. Configurar editor padrão (opcional)
git config --global core.editor "code --wait"  # VS Code

# 4. Verificar configurações
git config --list

# ========================================
# PARTE 2: Clonar o Projeto
# ========================================

# 5. Criar pasta para projetos (se não tiver)
mkdir ~/Projetos
cd ~/Projetos

# 6. Clonar o repositório
git clone https://github.com/InteligenteMaia/tudogestao-plus.git

# 7. Entrar na pasta do projeto
cd tudogestao-plus

# 8. Ver estrutura do projeto
ls -la

# 9. Ver branches disponíveis
git branch -a

# ========================================
# PARTE 3: Primeira Tarefa
# ========================================

# 10. Ir para branch de desenvolvimento
git checkout dev

# 11. Atualizar branch dev
git pull origin dev

# 12. Criar sua primeira branch
git checkout -b feat/meu-primeiro-commit

# 13. Fazer uma pequena alteração
# Por exemplo, adicionar seu nome no README
echo "- Maria Silva" >> CONTRIBUTORS.md

# 14. Ver o que mudou
git status
git diff

# 15. Adicionar mudança
git add CONTRIBUTORS.md

# 16. Fazer commit
git commit -m "docs: adiciona Maria Silva aos contribuidores"

# 17. Enviar para GitHub
git push -u origin feat/meu-primeiro-commit

# ========================================
# PARTE 4: Criar Pull Request
# ========================================

# 18. Abrir navegador
# Ir para: https://github.com/InteligenteMia/tudogestao-plus

# 19. Clicar em "Compare & Pull Request"

# 20. Preencher:
#     - Título: "docs: Adiciona Maria Silva aos contribuidores"
#     - Descrição: "Primeira contribuição - adicionando meu nome à lista"
#     - Base: dev
#     - Compare: feat/meu-primeiro-commit

# 21. Clicar em "Create Pull Request"
```

### Resultado esperado:
✅ Ambiente configurado
✅ Projeto clonado
✅ Primeiro commit feito
✅ Primeiro PR aberto

---

## Cenário 2: Trabalhando em Múltiplas Tarefas

### Situação:
Você está desenvolvendo a tela de relatórios (feat/relatorios), mas seu líder pede para você corrigir um bug urgente no login.

### Objetivo:
Pausar trabalho atual, corrigir bug, voltar ao trabalho anterior.

### Solução:

```bash
# ========================================
# ESTADO ATUAL
# ========================================
# Você está em: feat/relatorios
# Tem alterações não commitadas

git status
# On branch feat/relatorios
# Changes not staged for commit:
#   modified:   frontend/pages/relatorios.py
#   modified:   backend/api/routes/relatorios.py

# ========================================
# PAUSAR TRABALHO ATUAL
# ========================================

# Opção 1: Se o trabalho está em bom ponto (funcional)
# Commitar as mudanças
git add .
git commit -m "wip: implementação inicial de relatórios (em progresso)"
git push

# Opção 2: Se o trabalho não está pronto para commit
# Guardar temporariamente
git stash save "Trabalho em progresso - relatórios"

# Verificar que está limpo
git status
# On branch feat/relatorios
# nothing to commit, working tree clean

# ========================================
# TRABALHAR NO BUG URGENTE
# ========================================

# Voltar para dev
git checkout dev

# Atualizar dev
git pull origin dev

# Criar branch do bug
git checkout -b fix/bug-login-validacao

# Corrigir o bug
# Editar: frontend/pages/login.py
nano frontend/pages/login.py
# ... fazer as correções ...

# Testar a correção
python -m pytest tests/test_login.py

# Commitar
git add frontend/pages/login.py
git commit -m "fix: corrige validação de senha no login

- Adiciona verificação de caracteres especiais
- Melhora mensagem de erro para o usuário
- Adiciona teste unitário para validação"

# Enviar
git push -u origin fix/bug-login-validacao

# Abrir PR no GitHub
# Base: dev
# Compare: fix/bug-login-validacao
# Título: "fix: Corrige validação de senha no login"

# ========================================
# VOLTAR AO TRABALHO ANTERIOR
# ========================================

# Voltar para sua branch de relatórios
git checkout feat/relatorios

# Opção 1: Se tinha commitado (wip)
# Apenas continue trabalhando

# Opção 2: Se tinha usado stash
# Recuperar mudanças guardadas
git stash list
# stash@{0}: On feat/relatorios: Trabalho em progresso - relatórios

git stash pop

# Verificar que está tudo de volta
git status
# On branch feat/relatorios
# Changes not staged for commit:
#   modified:   frontend/pages/relatorios.py
#   modified:   backend/api/routes/relatorios.py

# Continue trabalhando normalmente...
```

### Resultado esperado:
✅ Bug urgente corrigido sem perder trabalho em progresso
✅ PR do bug criado
✅ Voltou para trabalho original mantendo estado

---

## Cenário 3: Conflito no Merge

### Situação:
Você terminou sua funcionalidade e ao tentar fazer merge com dev, apareceram conflitos.

### Objetivo:
Resolver conflitos e completar o merge.

### Solução:

```bash
# ========================================
# TENTANDO FAZER MERGE
# ========================================

git checkout dev
git pull origin dev
git checkout feat/calculo-impostos
git merge dev

# ⚠️ CONFLITO!
# Auto-merging backend/services/tax_calculator.py
# CONFLICT (content): Merge conflict in backend/services/tax_calculator.py
# Automatic merge failed; fix conflicts and then commit the result.

# ========================================
# IDENTIFICANDO CONFLITOS
# ========================================

git status
# On branch feat/calculo-impostos
# You have unmerged paths.
#   (fix conflicts and run "git commit")
# 
# Unmerged paths:
#   (use "git add <file>..." to mark resolution)
#         both modified:   backend/services/tax_calculator.py

# ========================================
# RESOLVENDO CONFLITOS
# ========================================

# Abrir arquivo com conflito
code backend/services/tax_calculator.py

# Você verá algo assim:
```

```python
class TaxCalculator:
    def calculate_icms(self, valor, estado):
<<<<<<< HEAD
        # Código da branch dev (atual)
        aliquota = self.get_aliquota_icms(estado)
        return valor * aliquota * 1.05  # Novo ajuste de 5%
=======
        # Seu código
        base_calculo = valor * 0.95  # Desconta base reduzida
        aliquota = self.get_aliquota_icms(estado)
        return base_calculo * aliquota
>>>>>>> feat/calculo-impostos
```

```bash
# ========================================
# DECIDIR O QUE MANTER
# ========================================

# Opção 1: Manter apenas o código de dev
# Deletar desde <<<<< até >>>>> e manter só o de cima

# Opção 2: Manter apenas seu código
# Deletar desde <<<<< até >>>>> e manter só o de baixo

# Opção 3: Combinar ambos (mais comum)
# Editar para combinar as duas lógicas
```

```python
# CÓDIGO FINAL APÓS RESOLVER:
class TaxCalculator:
    def calculate_icms(self, valor, estado):
        # Combina base reduzida com ajuste de 5%
        base_calculo = valor * 0.95  # Desconta base reduzida
        aliquota = self.get_aliquota_icms(estado)
        return base_calculo * aliquota * 1.05  # Ajuste de 5%
```

```bash
# ========================================
# FINALIZANDO RESOLUÇÃO
# ========================================

# Salvar arquivo

# Marcar conflito como resolvido
git add backend/services/tax_calculator.py

# Verificar se há mais conflitos
git status
# On branch feat/calculo-impostos
# All conflicts fixed but you are still merging.
#   (use "git commit" to conclude merge)

# Finalizar merge
git commit -m "merge: resolve conflito em tax_calculator.py

- Combina base de cálculo reduzida com ajuste de 5%
- Mantém compatibilidade com mudanças recentes da dev"

# Enviar
git push

# ========================================
# VERIFICAR RESULTADO
# ========================================

# Testar que tudo está funcionando
python -m pytest tests/test_tax_calculator.py

# Se testes passarem, está resolvido!
```

### Resultado esperado:
✅ Conflitos resolvidos
✅ Código funcionando com ambas as mudanças
✅ Merge completo
✅ Testes passando

---

## Cenário 4: Commitou na Branch Errada

### Situação:
Você estava distraído e commitou sua funcionalidade direto na branch `dev` ao invés de criar uma branch separada.

### Objetivo:
Mover commit para branch correta e limpar dev.

### Solução:

```bash
# ========================================
# SITUAÇÃO ATUAL
# ========================================

git branch
# * dev
#   main

git log --oneline -5
# a1b2c3d (HEAD -> dev) feat: adiciona tela de produtos  ← SEU COMMIT
# e4f5g6h docs: atualiza README
# i7j8k9l fix: corrige bug no login

# 😱 Você commitou direto na dev!

# ========================================
# SOLUÇÃO
# ========================================

# 1. Criar branch correta A PARTIR do commit atual
git checkout -b feat/tela-produtos

# Agora você está na branch nova com seu commit

# 2. Voltar dev para o estado antes do seu commit
git checkout dev

# 3. Desfazer seu commit na dev
git reset --hard HEAD~1

# Verificar que dev voltou ao normal
git log --oneline -5
# e4f5g6h (HEAD -> dev, origin/dev) docs: atualiza README
# i7j8k9l fix: corrige bug no login

# 4. Voltar para sua branch correta
git checkout feat/tela-produtos

# Verificar que seu commit está aqui
git log --oneline -5
# a1b2c3d (HEAD -> feat/tela-produtos) feat: adiciona tela de produtos
# e4f5g6h docs: atualiza README
# i7j8k9l fix: corrige bug no login

# 5. Enviar para GitHub
git push -u origin feat/tela-produtos

# ========================================
# RESULTADO
# ========================================
# ✅ Commit está na branch correta
# ✅ Dev está limpa
# ✅ Pode abrir PR normalmente
```

### Resultado esperado:
✅ Commit movido para branch apropriada
✅ Branch dev limpa
✅ Pode continuar workflow normal

---

## Cenário 5: Precisa Desfazer um Commit

### Situação:
Você fez um commit mas percebeu que tem erros e quer desfazer.

### Objetivo:
Desfazer commit mantendo ou descartando mudanças.

### Soluções possíveis:

#### Caso 1: Desfazer mas manter mudanças (mais comum)

```bash
# ========================================
# SITUAÇÃO
# ========================================

git log --oneline -3
# a1b2c3d (HEAD -> feat/pagamentos) feat: adiciona validação de cartão
# e4f5g6h feat: implementa integração com gateway
# i7j8k9l docs: atualiza documentação

# Você percebeu que o commit a1b2c3d tem erros

# ========================================
# DESFAZER MANTENDO MUDANÇAS
# ========================================

git reset --soft HEAD~1

# Verificar estado
git status
# On branch feat/pagamentos
# Changes to be committed:
#   modified:   backend/services/payment.py
#   modified:   backend/validators/card.py

# Agora você pode:
# 1. Editar os arquivos
# 2. Corrigir os erros
# 3. Commitar novamente

git add .
git commit -m "feat: adiciona validação de cartão com correções

- Corrige validação de data de validade
- Melhora detecção de bandeira do cartão
- Adiciona testes unitários"
```

#### Caso 2: Desfazer e descartar mudanças (cuidado!)

```bash
# ⚠️ ATENÇÃO: Isso apaga suas mudanças permanentemente!

git reset --hard HEAD~1

# Tudo do último commit foi deletado
git status
# On branch feat/pagamentos
# nothing to commit, working tree clean
```

#### Caso 3: Já fez push (criar commit reverso)

```bash
# Se já enviou para GitHub, não use reset!
# Use revert para criar commit que desfaz o anterior

git log --oneline -3
# a1b2c3d (HEAD -> feat/pagamentos, origin/feat/pagamentos) feat: com erro
# e4f5g6h feat: implementa integração
# i7j8k9l docs: atualiza documentação

# Reverter commit
git revert a1b2c3d

# Isso cria um NOVO commit que desfaz o anterior
# Editor vai abrir para mensagem:
# "Revert 'feat: adiciona validação de cartão'"
# Você pode editar ou deixar assim

# Salvar e fechar editor

# Enviar
git push

# Histórico fica assim:
git log --oneline -4
# f9g8h7i (HEAD -> feat/pagamentos) Revert "feat: com erro"
# a1b2c3d feat: com erro ← ainda existe mas foi desfeito
# e4f5g6h feat: implementa integração
# i7j8k9l docs: atualiza documentação
```

### Resultado esperado:
✅ Commit indesejado removido ou revertido
✅ Histórico limpo ou corrigido
✅ Pode continuar trabalhando

---

## Cenário 6: Esqueceu de Criar Branch

### Situação:
Você já fez várias mudanças no código mas esqueceu de criar uma branch antes. Tudo está ainda não commitado.

### Objetivo:
Criar branch sem perder trabalho feito.

### Solução:

```bash
# ========================================
# SITUAÇÃO ATUAL
# ========================================

git branch
# * dev  ← você está aqui

git status
# On branch dev
# Changes not staged for commit:
#   modified:   frontend/pages/clientes.py
#   modified:   frontend/pages/fornecedores.py
#   modified:   backend/api/routes/clientes.py
# 
# Untracked files:
#   frontend/components/client_form.py

# 😱 Você trabalhou mas esqueceu de criar branch!

# ========================================
# SOLUÇÃO RÁPIDA
# ========================================

# Simplesmente crie a branch agora!
# Suas mudanças VÃO JUNTO automaticamente
git checkout -b feat/cadastro-clientes-fornecedores

# Verificar que está tudo lá
git status
# On branch feat/cadastro-clientes-fornecedores
# Changes not staged for commit:
#   modified:   frontend/pages/clientes.py
#   modified:   frontend/pages/fornecedores.py
#   modified:   backend/api/routes/clientes.py
# 
# Untracked files:
#   frontend/components/client_form.py

# ✅ Pronto! Agora é só commitar normalmente
git add .
git commit -m "feat: implementa cadastro de clientes e fornecedores"
git push -u origin feat/cadastro-clientes-fornecedores
```

### Por que isso funciona?
Git não "prende" mudanças não commitadas a uma branch. Quando você muda de branch ou cria uma nova, as mudanças não commitadas vão junto!

### Resultado esperado:
✅ Branch criada
✅ Mudanças preservadas
✅ Pode continuar normalmente

---

## Cenário 7: Atualizando Branch Antiga

### Situação:
Você está trabalhando há 3 dias na sua branch. Nesse tempo, muitas coisas foram adicionadas à `dev`. Você precisa atualizar sua branch para evitar conflitos no futuro.

### Objetivo:
Trazer mudanças mais recentes da dev para sua branch.

### Solução:

```bash
# ========================================
# SITUAÇÃO ATUAL
# ========================================

git branch
# * feat/dashboard-analytics  ← sua branch
#   dev

git log --oneline -3
# a1b2c3d (HEAD -> feat/dashboard-analytics) feat: adiciona gráficos
# b2c3d4e feat: implementa filtros
# c3d4e5f feat: cria layout do dashboard

# Sua branch foi criada há 3 dias
# Desde então, muitos PRs foram mergeados na dev

# ========================================
# ATUALIZAR SUA BRANCH
# ========================================

# 1. Commitar seu trabalho atual
git status
# ... veja se tem mudanças não commitadas

git add .
git commit -m "feat: finaliza implementação de gráficos"

# 2. Atualizar branch dev localmente
git checkout dev
git pull origin dev

# Ver novos commits
git log --oneline -10
# f9g8h7i (HEAD -> dev, origin/dev) fix: corrige cálculo de impostos
# e8f7g6h feat: adiciona validação de CNPJ
# d7e6f5g refactor: otimiza queries do banco
# c6d5e4f docs: atualiza API documentation
# ... mais commits ...
# c3d4e5f feat: cria layout do dashboard ← aqui você criou sua branch

# 3. Voltar para sua branch
git checkout feat/dashboard-analytics

# 4. Trazer mudanças da dev (MERGE)
git merge dev

# ========================================
# SE HOUVER CONFLITOS
# ========================================

# Git vai mostrar:
# Auto-merging frontend/utils/calculations.py
# CONFLICT (content): Merge conflict in frontend/utils/calculations.py
# Automatic merge failed; fix conflicts and then commit the result.

# Resolver conflitos (ver Cenário 3)
# 1. Abrir arquivo
# 2. Resolver conflitos
# 3. git add arquivo.py
# 4. git commit

# ========================================
# SE NÃO HOUVER CONFLITOS
# ========================================

# Merge será automático!
# Merge made by the 'recursive' strategy.
#  backend/services/tax_calculator.py | 15 ++++---
#  backend/validators/document.py     | 45 ++++++++++++++++++
#  3 files changed, 98 insertions(+), 5 deletions(-)

# 5. Enviar mudanças
git push

# ========================================
# ALTERNATIVA: REBASE (mais limpo)
# ========================================

# Ao invés de merge, pode usar rebase
# Isso "move" seus commits para o topo

git checkout feat/dashboard-analytics
git rebase dev

# Se houver conflitos, resolver e:
git add .
git rebase --continue

# Ao final:
git push --force-with-lease

# ⚠️ Atenção: só use rebase se você é o único trabalhando nessa branch!
```

### Resultado esperado:
✅ Sua branch atualizada com mudanças recentes
✅ Conflitos resolvidos (se houver)
✅ Menor chance de problemas no merge final

---

## Cenário 8: Precisa Revisar PR de Colega

### Situação:
Seu colega João abriu um PR e pediu para você revisar e testar o código dele.

### Objetivo:
Baixar e testar código do PR sem bagunçar seu trabalho.

### Solução:

```bash
# ========================================
# PREPARAÇÃO
# ========================================

# 1. Salvar seu trabalho atual
git status
# ... veja se tem mudanças

# Se tiver, commitar ou usar stash
git stash save "Meu trabalho antes de revisar PR do João"

# 2. Atualizar repositório
git fetch origin

# ========================================
# BAIXAR BRANCH DO PR
# ========================================

# PR do João está em: origin/feat/relatorio-financeiro

# Criar branch local baseada na remota
git checkout -b review-joao origin/feat/relatorio-financeiro

# Ou, se a branch já existe localmente:
git checkout feat/relatorio-financeiro
git pull origin feat/relatorio-financeiro

# ========================================
# TESTAR O CÓDIGO
# ========================================

# Instalar dependências se necessário
pip install -r requirements.txt

# Rodar testes
python -m pytest

# Rodar aplicação
streamlit run frontend/main.py

# Testar funcionalidades manualmente
# - Abrir a nova tela
# - Testar cada botão
# - Verificar se não quebrou nada

# ========================================
# FAZER REVISÃO NO GITHUB
# ========================================

# Após testar, ir para o GitHub
# https://github.com/InteligenteMaia/tudogestao-plus/pull/42

# Clicar em "Files changed"

# Adicionar comentários:
# - Clicar na linha de código
# - Adicionar sugestão ou comentário

# Exemplos de comentários:

# ✅ Aprovação:
# "Testei localmente e está funcionando perfeitamente! 
#  Testes passaram. Código está limpo e bem documentado. 
#  Aprovado! 🚀"

# 💬 Sugestões:
# "Linha 45: Seria bom adicionar tratamento de erro aqui 
#  para caso a API não responda."

# ❓ Perguntas:
# "Por que optou por usar dicionário ao invés de dataclass aqui?"

# ========================================
# VOLTAR AO SEU TRABALHO
# ========================================

# Voltar para sua branch
git checkout feat/sua-funcionalidade

# Recuperar trabalho guardado
git stash pop

# ========================================
# APROVAR OU SOLICITAR MUDANÇAS
# ========================================

# No GitHub, na página do PR:

# Se estiver tudo OK:
# Clicar em "Review changes"
# Selecionar "Approve"
# Clicar em "Submit review"

# Se precisa mudanças:
# Clicar em "Review changes"
# Selecionar "Request changes"
# Descrever o que precisa mudar
# Clicar em "Submit review"

# Se só comentar:
# Clicar em "Review changes"
# Selecionar "Comment"
# Clicar em "Submit review"
```

### Checklist de Revisão:

```markdown
## Code Review Checklist

### Funcionalidade
- [ ] Código faz o que deveria fazer
- [ ] Testes passam
- [ ] Funcionalidade testada manualmente
- [ ] Não quebra funcionalidades existentes

### Código
- [ ] Código está limpo e legível
- [ ] Variáveis e funções têm nomes descritivos
- [ ] Não há código comentado desnecessário
- [ ] Não há código duplicado
- [ ] Funções têm tamanho razoável

### Documentação
- [ ] Funções complexas têm docstrings
- [ ] README atualizado se necessário
- [ ] Comentários onde o código não é óbvio

### Segurança
- [ ] Sem senhas ou tokens no código
- [ ] Validação de entrada de usuário
- [ ] Tratamento de erros adequado

### Performance
- [ ] Queries otimizadas
- [ ] Sem loops desnecessários
- [ ] Recursos liberados adequadamente

### Estilo
- [ ] Segue padrões do projeto (PEP 8)
- [ ] Formatação consistente
- [ ] Imports organizados
```

### Resultado esperado:
✅ Código do colega revisado
✅ Feedback fornecido
✅ Voltou ao seu trabalho sem perder nada

---

## Cenário 9: Push Rejected

### Situação:
Você tentou dar `git push` mas recebeu erro de push rejeitado.

### Objetivo:
Entender por que foi rejeitado e resolver.

### Possíveis causas e soluções:

#### Causa 1: Branch remota está à frente

```bash
# ========================================
# ERRO
# ========================================

git push
# ! [rejected]        feat/produtos -> feat/produtos (fetch first)
# error: failed to push some refs to 'github.com/InteligenteMaia/tudogestao-plus.git'
# hint: Updates were rejected because the remote contains work that you do
# hint: not have locally. This is usually caused by another repository pushing
# hint: to the same ref. You may want to first integrate the remote changes
# hint: (e.g., 'git pull ...') before pushing again.

# ========================================
# CAUSA
# ========================================
# Alguém (talvez você de outro computador) fez push
# Você precisa puxar as mudanças primeiro

# ========================================
# SOLUÇÃO
# ========================================

# 1. Puxar mudanças
git pull origin feat/produtos

# Se não houver conflitos:
# Merge feito automaticamente

# Se houver conflitos:
# Resolver conflitos (ver Cenário 3)
# git add arquivo.py
# git commit

# 2. Push novamente
git push
```

#### Causa 2: Você usou reset ou rebase

```bash
# ========================================
# ERRO
# ========================================

git push
# ! [rejected]        feat/produtos -> feat/produtos (non-fast-forward)

# ========================================
# CAUSA
# ========================================
# Você reescreveu histórico (reset --hard ou rebase)

# ========================================
# SOLUÇÃO
# ========================================

# ⚠️ APENAS se você é o único trabalhando nessa branch!

# Opção 1: Force push (mais seguro)
git push --force-with-lease origin feat/produtos

# Opção 2: Force push (menos seguro)
git push --force origin feat/produtos

# ⚠️ NUNCA use force em branches compartilhadas (dev, main)!
```

#### Causa 3: Branch não existe no remoto

```bash
# ========================================
# ERRO
# ========================================

git push
# fatal: The current branch feat/produtos has no upstream branch.

# ========================================
# SOLUÇÃO
# ========================================

# Criar branch no remoto e fazer push
git push -u origin feat/produtos
```

### Resultado esperado:
✅ Push bem-sucedido
✅ Branch local e remota sincronizadas

---

## Cenário 10: Deletou Arquivo por Engano

### Situação:
Você deletou um arquivo importante e quer recuperar.

### Objetivo:
Restaurar arquivo deletado.

### Soluções por situação:

#### Caso 1: Deletou mas não commitou

```bash
# ========================================
# SITUAÇÃO
# ========================================

# Você deletou: backend/services/payment.py
rm backend/services/payment.py

git status
# On branch feat/pagamentos
# Changes not staged for commit:
#   deleted:    backend/services/payment.py

# ========================================
# SOLUÇÃO
# ========================================

# Restaurar arquivo
git checkout -- backend/services/payment.py

# Ou, no Git mais novo (2.23+):
git restore backend/services/payment.py

# Verificar que voltou
ls backend/services/
# payment.py  ← voltou!
```

#### Caso 2: Deletou e já commitou (mas não deu push)

```bash
# ========================================
# SITUAÇÃO
# ========================================

git log --oneline -3
# a1b2c3d (HEAD -> feat/pagamentos) refactor: reorganiza arquivos
# e4f5g6h feat: adiciona validação
# i7j8k9l feat: cria serviço de pagamento  ← arquivo estava aqui

# backend/services/payment.py foi deletado no commit a1b2c3d

# ========================================
# SOLUÇÃO
# ========================================

# Recuperar arquivo do commit anterior
git checkout e4f5g6h -- backend/services/payment.py

# Commitar de volta
git add backend/services/payment.py
git commit -m "fix: recupera arquivo payment.py deletado por engano"
```

#### Caso 3: Deletou, commitou e deu push

```bash
# ========================================
# ENCONTRAR QUANDO FOI DELETADO
# ========================================

# Ver histórico do arquivo
git log --all --full-history -- backend/services/payment.py

# Saída:
# commit a1b2c3d
# refactor: reorganiza arquivos
# 
# commit e4f5g6h
# feat: adiciona validação
# 
# commit i7j8k9l
# feat: cria serviço de pagamento

# ========================================
# RECUPERAR
# ========================================

# Pegar arquivo do commit antes da deleção
git checkout e4f5g6h -- backend/services/payment.py

# Commitar
git add backend/services/payment.py
git commit -m "fix: recupera arquivo payment.py deletado acidentalmente"

# Push
git push
```

### Resultado esperado:
✅ Arquivo recuperado
✅ Histórico mantido
✅ Pode continuar trabalhando

---

## Cenário 11: Código de Produção Quebrou - Hotfix Urgente

### Situação:
Um bug crítico foi descoberto em produção (branch `main`). Você precisa corrigir URGENTE.

### Objetivo:
Criar hotfix, corrigir bug, fazer merge na main e dev.

### Solução:

```bash
# ========================================
# PREPARAÇÃO
# ========================================

# 1. Salvar trabalho atual
git stash save "Trabalho em progresso antes de hotfix"

# 2. Ir para main
git checkout main
git pull origin main

# 3. Criar branch de hotfix
git checkout -b hotfix/erro-critico-pagamento

# ========================================
# CORRIGIR BUG
# ========================================

# Fazer correção mínima necessária
# Editar apenas o arquivo problemático
nano backend/services/payment.py

# Testar MUITO BEM
python -m pytest tests/test_payment.py
python -m pytest tests/  # Todos os testes

# ========================================
# COMMITAR E ENVIAR
# ========================================

git add backend/services/payment.py
git commit -m "hotfix: corrige erro de divisão por zero no pagamento

Bug causava crash quando valor do pagamento era zero.

- Adiciona validação de valor mínimo
- Adiciona tratamento de erro
- Adiciona teste unitário para o caso"

git push -u origin hotfix/erro-critico-pagamento

# ========================================
# PULL REQUEST PARA MAIN
# ========================================

# GitHub → Abrir PR
# Base: main
# Compare: hotfix/erro-critico-pagamento

# Marcar como URGENTE
# Pedir aprovação rápida do líder

# ========================================
# DEPOIS DO MERGE NA MAIN
# ========================================

# Atualizar local
git checkout main
git pull origin main

# IMPORTANTE: Também fazer merge na dev!
git checkout dev
git pull origin dev
git merge main
git push origin dev

# ========================================
# VOLTAR AO TRABALHO ANTERIOR
# ========================================

git checkout feat/sua-branch
git stash pop

# Atualizar sua branch com a correção
git merge dev
```

### Checklist de Hotfix:

```markdown
## Hotfix Checklist

Antes de mergear:
- [ ] Bug identificado e isolado
- [ ] Correção mínima (não adicionar features)
- [ ] Todos os testes passando
- [ ] Testado em ambiente similar a produção
- [ ] PR revisado por pelo menos um líder
- [ ] Changelog atualizado
- [ ] Tag de versão criada (ex: v1.2.3)

Depois do merge:
- [ ] Merge feito na main
- [ ] Merge feito na dev
- [ ] Deploy em produção realizado
- [ ] Monitoramento do bug verificado
- [ ] Time notificado
- [ ] Post-mortem agendado
```

### Resultado esperado:
✅ Bug crítico corrigido
✅ Correção em produção (main)
✅ Correção também na dev
✅ Histórico limpo

---

## Cenário 12: Sincronizando seu Fork com o Original

### Situação:
Você fez um fork do projeto TudoGestão+ para contribuir. O repositório original teve várias atualizações. Seu fork está desatualizado.

### Objetivo:
Sincronizar seu fork com o repositório original.

### Solução:

```bash
# ========================================
# CONFIGURAR UPSTREAM (uma vez)
# ========================================

# Ver repositórios remotos atuais
git remote -v
# origin  https://github.com/SEU-USUARIO/tudogestao-plus.git (fetch)
# origin  https://github.com/SEU-USUARIO/tudogestao-plus.git (push)

# Adicionar repositório original como "upstream"
git remote add upstream https://github.com/InteligenteMaia/tudogestao-plus.git

# Verificar
git remote -v
# origin    https://github.com/SEU-USUARIO/tudogestao-plus.git (fetch)
# origin    https://github.com/SEU-USUARIO/tudogestao-plus.git (push)
# upstream  https://github.com/InteligenteMaia/tudogestao-plus.git (fetch)
# upstream  https://github.com/InteligenteMaia/tudogestao-plus.git (push)

# ========================================
# SINCRONIZAR (sempre que necessário)
# ========================================

# 1. Buscar mudanças do upstream
git fetch upstream

# 2. Ir para sua branch main
git checkout main

# 3. Mesclar mudanças do upstream
git merge upstream/main

# 4. Enviar para seu fork
git push origin main

# 5. Fazer o mesmo para dev
git checkout dev
git merge upstream/dev
git push origin dev

# ========================================
# ATUALIZAR BRANCH DE FEATURE
# ========================================

# Se você tem uma branch de feature desatualizada
git checkout feat/sua-funcionalidade

# Atualizar com as mudanças
git merge dev

# Ou
git rebase dev

# Push
git push
```

### Sincronização pelo GitHub (mais fácil):

```markdown
1. Acessar seu fork no GitHub
2. Clicar em "Sync fork"
3. Clicar em "Update branch"
4. No terminal local:
   git checkout main
   git pull origin main
```

### Resultado esperado:
✅ Fork sincronizado com original
✅ Todas as branches atualizadas
✅ Pode contribuir com código atualizado

---

## Cenário 13: Commitou Senha ou Arquivo Sensível

### Situação:
Você acidentalmente commitou um arquivo com senhas, tokens da API, ou dados sensíveis.

### Objetivo:
Remover arquivo sensível do histórico.

### Solução (se NÃO deu push):

```bash
# ========================================
# SITUAÇÃO
# ========================================

git log --oneline -3
# a1b2c3d (HEAD -> feat/config) feat: adiciona configurações
# e4f5g6h feat: cria serviço de email
# i7j8k9l docs: atualiza README

# Você commitou: config/credentials.py com senhas!

# ========================================
# SOLUÇÃO SIMPLES (ainda não deu push)
# ========================================

# 1. Desfazer último commit mantendo mudanças
git reset --soft HEAD~1

# 2. Remover arquivo sensível
rm config/credentials.py

# 3. Adicionar ao .gitignore
echo "config/credentials.py" >> .gitignore
echo "*.env" >> .gitignore
echo "*.key" >> .gitignore

# 4. Commitar sem o arquivo sensível
git add .
git commit -m "feat: adiciona configurações (sem credenciais)"

# 5. Criar arquivo de exemplo
cp config/credentials.py config/credentials.example.py

# 6. Editar arquivo de exemplo removendo valores reais
nano config/credentials.example.py
# Substituir:
# API_KEY = "abc123real"  →  API_KEY = "your-api-key-here"

# 7. Adicionar exemplo
git add config/credentials.example.py .gitignore
git commit -m "docs: adiciona exemplo de arquivo de credenciais"

# 8. Agora pode fazer push
git push
```

### Solução (se JÁ deu push):

```bash
# ⚠️ MUITO MAIS COMPLICADO!

# ========================================
# OPÇÃO 1: USAR GIT FILTER-BRANCH
# ========================================

# Remover arquivo de TODO o histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch config/credentials.py" \
  --prune-empty --tag-name-filter cat -- --all

# Push forçado (⚠️ cuidado!)
git push origin --force --all

# ========================================
# OPÇÃO 2: USAR BFG REPO-CLEANER (mais fácil)
# ========================================

# 1. Baixar BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# 2. Fazer backup do repositório

# 3. Remover arquivo
java -jar bfg.jar --delete-files credentials.py

# 4. Limpar referências
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Push forçado
git push origin --force --all

# ========================================
# AÇÕES ADICIONAIS IMPORTANTES
# ========================================

# 1. Revogar/trocar TODAS as credenciais expostas
#    - Senhas
#    - API tokens
#    - Chaves de acesso
#    - Certificados

# 2. Verificar se dados não foram indexados
#    - GitHub Security Alerts
#    - Ferramentas de scan de segurança

# 3. Notificar time de segurança se necessário

# 4. Documentar o incidente
```

### Prevenção para o futuro:

```bash
# ========================================
# CONFIGURAR .GITIGNORE ADEQUADAMENTE
# ========================================

cat >> .gitignore << EOF
# Credenciais e Secrets
.env
.env.local
.env.*.local
*.key
*.pem
config/credentials.py
config/secrets.json
credentials/
secrets/

# Arquivos de configuração local
config/local_settings.py
settings_local.py

# Logs com dados sensíveis
logs/
*.log

# Banco de dados local
*.db
*.sqlite
*.sqlite3
EOF

# Commitar .gitignore
git add .gitignore
git commit -m "chore: atualiza .gitignore para proteger dados sensíveis"
```

### Criar template de configuração:

```python
# config/settings.example.py
"""
Template de configuração
Copie para settings.py e preencha com valores reais
"""

class Config:
    # Database
    DB_HOST = "localhost"
    DB_USER = "your-username"
    DB_PASSWORD = "your-password"
    DB_NAME = "database-name"
    
    # API Keys
    API_KEY = "your-api-key-here"
    API_SECRET = "your-api-secret-here"
    
    # Email
    EMAIL_HOST = "smtp.example.com"
    EMAIL_USER = "your-email@example.com"
    EMAIL_PASSWORD = "your-email-password"
```

### Resultado esperado:
✅ Dados sensíveis removidos
✅ Credenciais revogadas/trocadas
✅ .gitignore configurado
✅ Template de configuração criado

---

## Cenário 14: Branch Desatualizada há Dias

### Situação:
Você começou uma funcionalidade há 5 dias. Desde então, 15 PRs foram mergeados na `dev`. Sua branch está muito desatualizada.

### Objetivo:
Atualizar branch minimizando conflitos.

### Solução:

```bash
# ========================================
# ANÁLISE DA SITUAÇÃO
# ========================================

git checkout feat/sua-funcionalidade-antiga

# Ver quanto está desatualizada
git fetch origin
git log --oneline feat/sua-funcionalidade-antiga..origin/dev
# ... 15 commits de diferença!

# ========================================
# PREPARAÇÃO
# ========================================

# 1. Commitar todo trabalho atual
git status
git add .
git commit -m "wip: progresso atual antes de atualizar branch"

# 2. Fazer backup da branch (segurança)
git branch backup-feat-sua-funcionalidade

# ========================================
# ATUALIZAÇÃO (OPÇÃO 1: MERGE)
# ========================================

# Atualizar dev local
git checkout dev
git pull origin dev

# Voltar para sua branch
git checkout feat/sua-funcionalidade-antiga

# Fazer merge
git merge dev

# ⚠️ Provavelmente haverá conflitos!
# Auto-merging backend/services/calculation.py
# CONFLICT (content): Merge conflict in backend/services/calculation.py
# Auto-merging frontend/pages/dashboard.py
# CONFLICT (content): Merge conflict in frontend/pages/dashboard.py

# Ver arquivos com conflito
git status
# Unmerged paths:
#   both modified:   backend/services/calculation.py
#   both modified:   frontend/pages/dashboard.py

# Resolver cada conflito
# 1. Abrir arquivo
code backend/services/calculation.py

# 2. Procurar marcadores <<<<<<<, =======, >>>>>>>
# 3. Decidir qual código manter
# 4. Salvar

# 5. Marcar como resolvido
git add backend/services/calculation.py

# Repetir para cada arquivo

# Finalizar merge
git add .
git commit -m "merge: atualiza branch com mudanças recentes da dev

Conflitos resolvidos em:
- backend/services/calculation.py
- frontend/pages/dashboard.py"

# ========================================
# ATUALIZAÇÃO (OPÇÃO 2: REBASE - mais limpo)
# ========================================

git checkout feat/sua-funcionalidade-antiga
git rebase dev

# Se houver conflitos:
# CONFLICT (content): Merge conflict in arquivo.py
# Resolve conflicts, then run "git rebase --continue"

# Resolver conflito
code arquivo.py
# ... editar ...

git add arquivo.py
git rebase --continue

# Repetir até terminar todos os conflitos

# Se estragar tudo, pode abortar:
# git rebase --abort

# Forçar push (branch reescrita)
git push --force-with-lease

# ========================================
# TESTAR TUDO
# ========================================

# Rodar testes
python -m pytest

# Testar aplicação
streamlit run frontend/main.py

# Testar funcionalidades manualmente

# ========================================
# SE DEU MUITO ERRADO
# ========================================

# Voltar para backup
git reset --hard backup-feat-sua-funcionalidade

# Começar de novo ou pedir ajuda
```

### Estratégia para minimizar conflitos:

```bash
# ========================================
# ATUALIZAR INCREMENTALMENTE
# ========================================

# Ao invés de atualizar tudo de uma vez,
# atualizar em blocos menores

# Ver commits individuais da dev
git log --oneline feat/sua-funcionalidade..dev

# Pegar commits em grupos
git checkout feat/sua-funcionalidade

# Merge de 5 commits por vez
git merge dev~10  # Merge até 10 commits atrás
# Resolver conflitos
git add .
git commit

git merge dev~5   # Mais 5 commits
# Resolver conflitos
git add .
git commit

git merge dev     # Resto
# Resolver conflitos
git add .
git commit
```

### Resultado esperado:
✅ Branch atualizada com mudanças da dev
✅ Conflitos resolvidos
✅ Testes passando
✅ Pronto para continuar desenvolvimento

---

## Cenário 15: Voltando Atrás em um Merge

### Situação:
Você fez merge de uma branch mas percebeu que quebrou tudo. Precisa desfazer o merge.

### Objetivo:
Reverter merge mantendo histórico limpo.

### Solução:

```bash
# ========================================
# SITUAÇÃO
# ========================================

git log --oneline -5
# a1b2c3d (HEAD -> dev) Merge branch 'feat/nova-funcionalidade' ← PROBLEMA!
# e4f5g6h feat: adiciona nova tela
# i7j8k9l feat: implementa lógica
# m1n2o3p docs: atualiza README
# q4r5s6t fix: corrige bug anterior

# Depois do merge, testes quebraram!

# ========================================
# SOLUÇÃO 1: REVERT DO MERGE (se já deu push)
# ========================================

# Identificar hash do merge
# a1b2c3d

# Reverter merge
git revert -m 1 a1b2c3d

# -m 1 significa: manter mudanças do primeiro parent (dev)
# Isso desfaz as mudanças da branch mergeada

# Editor vai abrir para mensagem:
# "Revert 'Merge branch 'feat/nova-funcionalidade''"

# Salvar e fechar

# Push
git push origin dev

# Histórico fica:
git log --oneline -6
# b2c3d4e (HEAD -> dev) Revert "Merge branch 'feat/nova-funcionalidade'"
# a1b2c3d Merge branch 'feat/nova-funcionalidade'
# e4f5g6h feat: adiciona nova tela
# ...

# ========================================
# SOLUÇÃO 2: RESET (se NÃO deu push ainda)
# ========================================

# Mais simples, mas reescreve histórico

# Voltar para commit antes do merge
git reset --hard m1n2o3p

# Verificar
git log --oneline -5
# m1n2o3p (HEAD -> dev) docs: atualiza README
# q4r5s6t fix: corrige bug anterior
# ...

# Merge sumiu!

# ⚠️ Só faça isso se NÃO deu push!
# Se já deu push, use revert (Solução 1)

# ========================================
# CORRIGIR PROBLEMAS E TENTAR NOVAMENTE
# ========================================

# 1. Voltar para branch problemática
git checkout feat/nova-funcionalidade

# 2. Investigar o que quebrou
python -m pytest -v
# ... ver quais testes falharam ...

# 3. Corrigir problemas
# ... editar arquivos ...

# 4. Testar
python -m pytest

# 5. Commitar correções
git add .
git commit -m "fix: corrige problemas encontrados nos testes"

# 6. Tentar merge novamente
git checkout dev
git merge feat/nova-funcionalidade

# 7. Testar antes de push!
python -m pytest

# 8. Se passou, push
git push origin dev
```

### Prevenção:

```bash
# ========================================
# TESTAR ANTES DE MERGEAR
# ========================================

# Criar branch temporária para testar merge
git checkout dev
git checkout -b test-merge-feat-nova

# Fazer merge de teste
git merge feat/nova-funcionalidade

# Testar tudo
python -m pytest
streamlit run frontend/main.py
# ... testes manuais ...

# Se tudo OK:
git checkout dev
git merge feat/nova-funcionalidade
git push

# Se algo errado:
git checkout dev
git branch -D test-merge-feat-nova
# Voltar para branch e corrigir problemas
```

### Resultado esperado:
✅ Merge problemático desfeito
✅ Dev estável novamente
✅ Problemas identificados e corrigidos
✅ Novo merge bem-sucedido

---

## 💡 Lições Gerais dos Cenários

### Sempre:
✅ Use `git status` antes de qualquer coisa
✅ Faça backup (branch ou stash) antes de operações arriscadas
✅ Teste antes de fazer push
✅ Leia as mensagens de erro do Git
✅ Quando em dúvida, pergunte

### Nunca:
❌ Force push em branches compartilhadas (dev, main)
❌ Commite diretamente em dev ou main
❌ Ignore conflitos durante merge
❌ Apague branches sem certeza
❌ Commite código quebrado

### Em emergências:
```bash
# Se tudo der errado:
git reflog
# Mostra TUDO que você fez
# Você pode voltar para qualquer ponto

# Ver estado de 5 comandos atrás:
git reflog
# HEAD@{5}: commit: sua mensagem

# Voltar para esse estado:
git reset --hard HEAD@{5}
```

---

## 📚 Recursos Adicionais

Para cada cenário específico:
- Pergunte no Slack/Discord do time
- Consulte: https://docs.github.com
- Use: https://ohshitgit.com (sim, é um site real!)

---

**🎯 Dica Final:** Pratique esses cenários em um repositório de testes antes de fazer em projetos reais!

---

*Guia criado para o time TudoGestão+*
*Mantenha esta referência sempre à mão!*