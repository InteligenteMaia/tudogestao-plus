# 🎨 Najla Cardeal - QA Engineer & Designer

## 📋 Informações Profissionais

- **Cargo:** QA Engineer & UI/UX Designer
- **Salário:** R$ 9.000/mês
- **Regime:** Home Office
- **Horário:** Seg-Sex • 09h-18h

## 🎯 Responsabilidades

Como QA Engineer e Designer, você tem dupla função:

1. **Quality Assurance (QA)**
   - Testes funcionais e de integração
   - Testes de usabilidade
   - Validação de requisitos
   - Reporte de bugs
   - Testes de regressão

2. **UI/UX Design**
   - Design de interfaces
   - Sistema de design (cores, tipografia, componentes)
   - Prototipagem
   - Design responsivo
   - Experiência do usuário

## 📂 Seus Arquivos Principais

### Design System

```
frontend/src/
├── 📄 index.css                      ✅ Estilos globais e variáveis CSS
├── 📁 components/
│   ├── 📄 Navbar.jsx                 ✅ Navegação principal
│   ├── 📄 Sidebar.jsx                ✅ Menu lateral
│   └── 📄 Card.jsx                   ✅ Componente de card reutilizável
└── 📁 pages/
    ├── 📄 Dashboard.jsx              ✅ Dashboard com cards e gráficos
    ├── 📄 Customers.jsx              ✅ Interface CRUD de clientes
    ├── 📄 Products.jsx               ✅ Interface CRUD de produtos
    ├── 📄 Sales.jsx                  ✅ PDV (Ponto de Venda)
    ├── 📄 Reports.jsx                ✅ Relatórios formatados
    └── 📄 NFe.jsx                    ✅ Emissão de nota fiscal
```

### Documentação de Testes

```
docs/
├── 📄 TEST_PLAN.md                   📝 Plano de testes
├── 📄 BUG_REPORTS.md                 📝 Relatórios de bugs
├── 📄 UI_GUIDELINES.md               📝 Guia de interface
└── 📄 USABILITY_TESTS.md             📝 Testes de usabilidade
```

## 🎨 Design System Implementado

### 1. Paleta de Cores

**Arquivo:** `frontend/src/index.css`

```css
:root {
  /* Cores primárias */
  --primary: #667eea;        /* Roxo principal */
  --primary-dark: #5568d3;   /* Roxo escuro (hover) */
  --primary-light: #f0f4ff;  /* Roxo claro (backgrounds) */

  /* Cores de status */
  --success: #48bb78;        /* Verde - sucesso */
  --warning: #ed8936;        /* Laranja - alerta */
  --danger: #f56565;         /* Vermelho - erro */
  --info: #4299e1;           /* Azul - informação */

  /* Neutros */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

**Por que essas cores?**
- **Roxo (#667eea):** Transmite profissionalismo, inovação e confiança
- **Verde (#48bb78):** Para feedbacks positivos (sucesso, confirmação)
- **Vermelho (#f56565):** Para alertas e erros
- **Cinzas:** Para textos, bordas e backgrounds neutros

### 2. Tipografia

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
               'Roboto', 'Oxygen', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-800);
}

h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 600; }
h3 { font-size: 1.5rem; font-weight: 600; }
h4 { font-size: 1.25rem; font-weight: 500; }

.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
```

**Hierarquia:**
- H1: Títulos principais de páginas
- H2: Seções importantes
- H3: Subseccões
- Text-sm/xs: Informações secundárias

### 3. Componentes UI

#### Botões

```css
/* Botão primário */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* Botão secundário */
.btn-secondary {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
}

/* Botão de perigo */
.btn-danger {
  background: var(--danger);
  color: white;
}
```

**Estados:**
- Default: Estado normal
- Hover: Elevação com sombra
- Active: Ligeiramente pressionado
- Disabled: Opacidade reduzida

#### Cards

```jsx
// Exemplo de card com gradiente
<div style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '1rem',
  padding: '1.5rem',
  color: 'white',
  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
}}>
  <h3>Total de Vendas</h3>
  <p className="text-3xl font-bold">R$ 125.000,00</p>
</div>
```

**Características:**
- Border radius de 0.5rem ou 1rem (suave)
- Box shadow para profundidade
- Gradientes para cards de destaque
- Padding consistente de 1.5rem

#### Modais

```jsx
// Modal com overlay escuro
<div style={{
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}}>
  <div style={{
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  }}>
    {/* Conteúdo do modal */}
  </div>
</div>
```

**Boas práticas:**
- Overlay semi-transparente (backdrop)
- Modal centralizado
- Border radius suave
- Scroll interno se necessário
- Botão de fechar visível

#### Formulários

```css
/* Input padrão */
input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Input com erro */
input.error {
  border-color: var(--danger);
}

/* Label */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-700);
}
```

**Estados:**
- Default: Borda cinza clara
- Focus: Borda roxa + ring de foco
- Error: Borda vermelha
- Disabled: Opacidade reduzida

#### Badges/Tags

```jsx
// Badge de status
const Badge = ({ status, children }) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {children}
    </span>
  );
};

// Uso
<Badge status="success">Ativo</Badge>
<Badge status="danger">Inativo</Badge>
<Badge status="warning">Pendente</Badge>
```

## 🧪 Quality Assurance - Engenharia Reversa

### 1. Casos de Teste Implementados

#### Teste: Criação de Cliente

**Arquivo testado:** `frontend/src/pages/customers/Customers.jsx`

```javascript
// CASO DE TESTE 1: Criar cliente PF com sucesso
const testCreateIndividualCustomer = async () => {
  // ARRANGE (Preparar)
  const customerData = {
    type: 'INDIVIDUAL',
    name: 'João Silva',
    cpfCnpj: '123.456.789-00',
    email: 'joao@email.com',
    phone: '(11) 98765-4321'
  };

  // ACT (Agir)
  // 1. Usuário clica em "Novo Cliente"
  // 2. Preenche formulário com dados acima
  // 3. Clica em "Salvar"

  // ASSERT (Verificar)
  // ✅ Modal deve fechar
  // ✅ Toast de sucesso deve aparecer
  // ✅ Cliente deve aparecer na lista
  // ✅ API deve retornar status 201
};

// CASO DE TESTE 2: Validação de CPF duplicado
const testDuplicateCPF = async () => {
  // ARRANGE
  const existingCPF = '123.456.789-00';

  // ACT
  // 1. Tenta criar cliente com CPF já existente

  // ASSERT
  // ✅ Deve mostrar erro "CPF já cadastrado"
  // ✅ Modal NÃO deve fechar
  // ✅ Cliente NÃO deve ser criado
};

// CASO DE TESTE 3: Validação de campos obrigatórios
const testRequiredFields = () => {
  // ARRANGE
  const invalidData = {
    type: 'INDIVIDUAL',
    name: '', // VAZIO - DEVE FALHAR
    cpfCnpj: ''
  };

  // ACT
  // 1. Tenta enviar formulário com campos vazios

  // ASSERT
  // ✅ Campos devem ficar com borda vermelha
  // ✅ Mensagem "Campo obrigatório" deve aparecer
  // ✅ Formulário NÃO deve ser enviado
};
```

### 2. Matriz de Testes do Sistema

| Módulo | Funcionalidade | Casos de Teste | Status |
|--------|----------------|----------------|---------|
| **Clientes** | Criar cliente PF | CPF válido, CPF duplicado, campos obrigatórios | ✅ |
| **Clientes** | Criar cliente PJ | CNPJ válido, CNPJ duplicado, razão social | ✅ |
| **Clientes** | Editar cliente | Dados válidos, CPF não pode mudar | ✅ |
| **Clientes** | Excluir cliente | Sem vendas, com vendas (bloquear) | ✅ |
| **Produtos** | Criar produto | Código único, estoque válido, preço válido | ✅ |
| **Produtos** | Editar produto | Atualizar estoque, preço, categoria | ✅ |
| **Produtos** | Excluir produto | Sem vendas, com vendas (bloquear) | ✅ |
| **Vendas** | Realizar venda | Adicionar produtos, calcular total, baixar estoque | ✅ |
| **Vendas** | Aplicar desconto | Desconto percentual, desconto fixo | ✅ |
| **Vendas** | Forma de pagamento | Dinheiro, Cartão, PIX | ✅ |
| **NFe** | Emitir nota | Venda paga, gerar DANFE | ✅ |
| **NFe** | Imprimir DANFE | Layout correto, dados completos | ✅ |
| **Relatórios** | DRE | Período válido, cálculos corretos | ✅ |
| **Relatórios** | Vendas | Filtros, exportação | ✅ |
| **Relatórios** | Estoque | Produtos baixos, todos produtos | ✅ |

### 3. Checklist de Validação UI/UX

#### ✅ Navegação
- [x] Menu lateral funcional em todas as páginas
- [x] Breadcrumbs (se aplicável)
- [x] Botão "voltar" onde necessário
- [x] Links ativos destacados
- [x] Navegação intuitiva

#### ✅ Responsividade
- [x] Layout funcional em desktop (1920x1080)
- [x] Layout funcional em laptop (1366x768)
- [x] Layout funcional em tablet (768px)
- [x] Layout funcional em mobile (375px)
- [x] Menu hambúrguer em telas pequenas

#### ✅ Feedback Visual
- [x] Loading states (spinners, skeletons)
- [x] Toast notifications (sucesso, erro, info)
- [x] Botões com hover/active states
- [x] Estados vazios (empty states)
- [x] Mensagens de erro claras

#### ✅ Acessibilidade
- [x] Contraste de cores adequado (WCAG AA)
- [x] Textos legíveis (mínimo 14px)
- [x] Labels em todos os inputs
- [x] Foco visível em elementos interativos
- [x] Alt text em imagens (quando aplicável)

#### ✅ Performance
- [x] Tempo de carregamento < 3s
- [x] Sem travamentos na UI
- [x] Transições suaves
- [x] Lazy loading de imagens
- [x] Paginação em listas grandes

### 4. Fluxo de Teste Completo - PDV (Ponto de Venda)

**Arquivo:** `frontend/src/pages/sales/Sales.jsx`

```
CENÁRIO: Realizar uma venda completa

1. PRÉ-CONDIÇÃO
   - Usuário logado
   - Produtos cadastrados com estoque > 0
   - Cliente cadastrado

2. PASSOS
   ┌─────────────────────────────────────────┐
   │ 1. Selecionar Cliente                   │
   │    - Clicar no select de cliente        │
   │    - Escolher "João Silva"              │
   │    ✅ Verificar: Nome aparece no campo  │
   └─────────────────────────────────────────┘

   ┌─────────────────────────────────────────┐
   │ 2. Adicionar Produto 1                  │
   │    - Clicar no select de produto        │
   │    - Escolher "Notebook Dell"           │
   │    - Digitar quantidade: 2              │
   │    - Clicar "Adicionar"                 │
   │    ✅ Produto aparece na tabela         │
   │    ✅ Total atualizado                  │
   └─────────────────────────────────────────┘

   ┌─────────────────────────────────────────┐
   │ 3. Adicionar Produto 2                  │
   │    - Escolher "Mouse Logitech"          │
   │    - Quantidade: 1                      │
   │    ✅ Dois produtos na tabela           │
   │    ✅ Total = (Notebook × 2) + Mouse    │
   └─────────────────────────────────────────┘

   ┌─────────────────────────────────────────┐
   │ 4. Aplicar Desconto                     │
   │    - Digitar: 10                        │
   │    ✅ Total com desconto calculado      │
   │    ✅ Desconto = 10% do subtotal        │
   └─────────────────────────────────────────┘

   ┌─────────────────────────────────────────┐
   │ 5. Selecionar Pagamento                 │
   │    - Escolher "PIX"                     │
   │    ✅ Método selecionado                │
   └─────────────────────────────────────────┘

   ┌─────────────────────────────────────────┐
   │ 6. Finalizar Venda                      │
   │    - Clicar "Finalizar Venda"           │
   │    ✅ Toast "Venda realizada"           │
   │    ✅ Carrinho limpo                    │
   │    ✅ Estoque atualizado                │
   │    ✅ Número de venda gerado            │
   └─────────────────────────────────────────┘

3. PÓS-CONDIÇÃO
   - Venda registrada no banco
   - Estoque dos produtos reduzido
   - Venda aparece em "Histórico de Vendas"
   - Possível emitir NFe dessa venda
```

### 5. Análise de Usabilidade

#### Dashboard - Análise Heurística

**Arquivo:** `frontend/src/pages/dashboard/Dashboard.jsx`

| Heurística | Implementação | Nota |
|------------|---------------|------|
| **Visibilidade do status** | Cards mostram valores em tempo real | ⭐⭐⭐⭐⭐ |
| **Linguagem do usuário** | Termos claros: "Vendas Hoje", "Total de Clientes" | ⭐⭐⭐⭐⭐ |
| **Controle do usuário** | Filtros de data, refresh manual | ⭐⭐⭐⭐ |
| **Consistência** | Mesmo padrão de cards e cores | ⭐⭐⭐⭐⭐ |
| **Prevenção de erros** | Valores não-editáveis (read-only) | ⭐⭐⭐⭐⭐ |
| **Reconhecer > Lembrar** | Ícones + texto em todos os cards | ⭐⭐⭐⭐ |
| **Flexibilidade** | Atalhos para páginas importantes | ⭐⭐⭐⭐ |
| **Design minimalista** | Sem informações desnecessárias | ⭐⭐⭐⭐⭐ |
| **Recuperação de erros** | Mensagens claras se API falhar | ⭐⭐⭐⭐ |
| **Ajuda e documentação** | Tooltips onde necessário | ⭐⭐⭐ |

**Sugestões de melhoria:**
- Adicionar tooltips explicativos nos cards
- Implementar gráficos interativos
- Adicionar comparação com período anterior

## 📝 Documentação de Bugs

### Template de Bug Report

```markdown
## BUG #001 - [Título Descritivo]

**Severidade:** 🔴 Crítico | 🟡 Médio | 🟢 Baixo

**Módulo:** Nome do módulo (Ex: Clientes, Vendas)

**Descrição:**
Breve descrição do problema encontrado.

**Passos para Reproduzir:**
1. Primeiro passo
2. Segundo passo
3. Terceiro passo

**Resultado Esperado:**
O que deveria acontecer

**Resultado Atual:**
O que realmente acontece

**Evidências:**
- Screenshot 1
- Screenshot 2
- Log de erro (se houver)

**Ambiente:**
- Navegador: Chrome 120
- SO: Windows 11
- Resolução: 1920x1080

**Desenvolvedor Responsável:**
@nome-do-dev

**Status:** 🟡 Aberto | 🔵 Em análise | 🟢 Resolvido
```

## 🎯 Checklist de QA para Release

### Antes de Liberar em Produção

**Testes Funcionais:**
- [ ] Todos os CRUDs funcionando
- [ ] Login/Logout funcionando
- [ ] Autenticação JWT válida
- [ ] Permissões por role (Admin/Manager/User)
- [ ] Validações de formulário
- [ ] Mensagens de erro apropriadas

**Testes de Integração:**
- [ ] Backend + Frontend integrados
- [ ] API retornando dados corretos
- [ ] Rotas protegidas funcionando
- [ ] Upload de arquivos (se houver)
- [ ] Exportação de relatórios

**Testes de UI/UX:**
- [ ] Layout consistente em todas as páginas
- [ ] Responsividade em diferentes resoluções
- [ ] Botões com estados hover/active/disabled
- [ ] Modais abrindo/fechando corretamente
- [ ] Toasts aparecendo nos momentos certos
- [ ] Loading states durante requisições

**Performance:**
- [ ] Tempo de carregamento < 3s
- [ ] Sem memory leaks
- [ ] Consultas ao banco otimizadas
- [ ] Imagens otimizadas
- [ ] Bundle size aceitável

**Segurança:**
- [ ] Senhas hasheadas (bcrypt)
- [ ] Tokens JWT com expiração
- [ ] SQL injection prevenido (Prisma)
- [ ] XSS prevenido
- [ ] CORS configurado corretamente

**Acessibilidade:**
- [ ] Contraste de cores adequado
- [ ] Navegação por teclado funcional
- [ ] Labels em todos os inputs
- [ ] Foco visível
- [ ] Textos alternativos

## 💡 Dicas para QA & Design

### 1. Pense no Usuário Final
```
❌ "O botão está em cima à esquerda"
✅ "O botão de criar cliente está facilmente visível no topo da página"

❌ "Clique no terceiro ícone"
✅ "Clique no ícone de engrenagem para abrir configurações"
```

### 2. Documente Tudo
- Tire screenshots dos bugs
- Grave vídeos de fluxos problemáticos
- Mantenha planilha de testes atualizada
- Use ferramentas: Jira, Trello, Notion

### 3. Teste em Múltiplos Cenários
```javascript
// Não teste apenas o "caminho feliz"
✅ Teste com sucesso
✅ Teste com erro
✅ Teste com campos vazios
✅ Teste com valores extremos (0, números gigantes)
✅ Teste com internet lenta
✅ Teste com dados inválidos
```

### 4. Consistência é Chave
```
Todos os botões primários devem:
- Mesma cor (#667eea)
- Mesmo border-radius (0.5rem)
- Mesmo padding (0.75rem 1.5rem)
- Mesmo hover effect

Todos os modais devem:
- Mesmo overlay (rgba(0,0,0,0.5))
- Mesma animação de entrada
- Mesmo botão de fechar
- Mesmo layout de botões (Cancelar/Confirmar)
```

### 5. Use Ferramentas de Design
- **Figma:** Para protótipos
- **ColorHunt:** Para paletas de cores
- **Google Fonts:** Para tipografia
- **Unsplash:** Para imagens de alta qualidade
- **Icons8, Heroicons:** Para ícones

## 📚 Recursos de Aprendizado

### Livros
- "Don't Make Me Think" - Steve Krug (UX)
- "The Design of Everyday Things" - Don Norman
- "Software Testing" - Ron Patton

### Cursos
- Nielsen Norman Group (nngroup.com)
- Interaction Design Foundation
- Udemy - QA Testing Courses

### Ferramentas
- **Figma** - Design de interfaces
- **Jest + React Testing Library** - Testes automatizados
- **Lighthouse** - Auditoria de performance/acessibilidade
- **BrowserStack** - Testes cross-browser

---

**Próximos Passos:**
1. Criar plano de testes completo
2. Documentar sistema de design em Figma
3. Implementar testes automatizados (E2E com Cypress)
4. Realizar testes de usabilidade com usuários reais
