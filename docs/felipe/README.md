# 💻 Felipe Gonzaga - Frontend Developer

**Salário:** R$ 11.000/mês
**Regime:** Home Office
**Horário:** Seg-Sex • 09h-18h

---

## 📋 Sua Documentação

### 📄 Guia Principal
- **00-GUIA-FRONTEND.md** - Guia completo de React e frontend

### 💻 Código Comentado
- **Customers-comentado.jsx** - Página Customers linha por linha (900+ linhas!)
  - Todos os React Hooks explicados
  - useState e useEffect em detalhes
  - Formulários controlados
  - Chamadas API com Axios
  - Modais
  - Paginação
  - Toast notifications
  - 5 exercícios práticos

---

## 🎯 Como Estudar

### Passo 1: Leia o Guia
1. Abra **00-GUIA-FRONTEND.md**
2. Leia do início ao fim
3. Foque nos conceitos de React Hooks

### Passo 2: Código Comentado vs Código Real

Abra lado a lado:
```bash
# Terminal 1 - Código comentado
code docs/felipe/Customers-comentado.jsx

# Terminal 2 - Código real
code frontend/src/pages/customers/Customers.jsx
```

**Compare:**
- Estrutura do componente
- Uso de hooks (useState, useEffect)
- Chamadas API
- Renderização condicional

### Passo 3: Experimente

```bash
# Inicie o frontend
cd frontend
npm run dev

# Abra no navegador
# http://localhost:5173/customers

# Abra DevTools (F12)
# Console tab - veja logs
# React DevTools - veja state
```

### Passo 4: React DevTools

**Instale a extensão:**
- Chrome: React Developer Tools
- Firefox: React Developer Tools

**Use para:**
- Ver state de componentes
- Ver props
- Debugar re-renders
- Performance profiling

### Passo 5: Exercícios Práticos

Faça os 5 exercícios no final de `Customers-comentado.jsx`:

1. ✅ Adicionar filtro por tipo (PF/PJ)
2. ✅ Implementar debounce na busca
3. ✅ Validar CPF/CNPJ
4. ✅ Máscara de telefone
5. ✅ Ordenação de colunas

---

## 📂 Seus Arquivos no Projeto

```
frontend/src/pages/
├── dashboard/
│   └── Dashboard.jsx         ✅ Seu principal
├── customers/
│   └── Customers.jsx         ✅ Seu principal
├── products/
│   └── Products.jsx          ✅ Seu
├── suppliers/
│   └── Suppliers.jsx         ✅ Parcialmente seu
└── employees/
    └── Employees.jsx         ✅ Parcialmente seu

frontend/src/components/
├── Navbar.jsx                ✅ Seu
├── Sidebar.jsx               ✅ Seu
└── Card.jsx                  ✅ Seu (reutilizável)

frontend/src/services/
└── api.js                    ✅ Configuração Axios (seu)
```

---

## 💡 Conceitos que Você Deve Dominar

### 1. useState
```jsx
// Declaração
const [value, setValue] = useState(initialValue);
//      ↑        ↑              ↑
//   Valor    Setter    Valor inicial

// Uso
const [count, setCount] = useState(0);

// Atualizar
setCount(count + 1);
setCount(prev => prev + 1);  // Preferível para baseado em valor anterior

// Múltiplos estados
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);

// Estado objeto
const [form, setForm] = useState({
  name: '',
  email: '',
  phone: ''
});

// Atualizar campo específico
setForm({
  ...form,
  email: 'novo@email.com'
});
```

### 2. useEffect
```jsx
// Executa após cada render
useEffect(() => {
  console.log('Componente renderizou');
});

// Executa apenas uma vez (componentDidMount)
useEffect(() => {
  fetchData();
}, []); // Array vazio

// Executa quando dependência muda
useEffect(() => {
  fetchData();
}, [page, searchTerm]); // Re-executa se page ou searchTerm mudar

// Cleanup (componentWillUnmount)
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup: executa antes de desmontar ou re-executar
  return () => {
    clearInterval(interval);
  };
}, []);
```

### 3. Axios
```jsx
import api from '../services/api';

// GET
const response = await api.get('/customers');
const customers = response.data.customers;

// GET com params
const response = await api.get('/customers', {
  params: { page: 1, search: 'João' }
});
// Gera: /customers?page=1&search=João

// POST
const response = await api.post('/customers', {
  name: 'João',
  email: 'joao@email.com'
});

// PUT
await api.put(`/customers/${id}`, { name: 'Novo Nome' });

// DELETE
await api.delete(`/customers/${id}`);

// Com try/catch
try {
  const response = await api.post('/customers', data);
  toast.success('Criado!');
} catch (error) {
  toast.error(error.response?.data?.error || 'Erro');
}
```

### 4. Conditional Rendering
```jsx
// If com return antecipado
if (loading) {
  return <p>Carregando...</p>;
}

// Ternário
{loading ? <Spinner /> : <Content />}

// && para renderizar ou não
{error && <ErrorMessage />}
{customers.length > 0 && <Table data={customers} />}

// Switch com múltiplas condições
{status === 'loading' && <Spinner />}
{status === 'error' && <Error />}
{status === 'success' && <Content />}
```

### 5. Lists & Map
```jsx
// Simples
{customers.map(customer => (
  <div key={customer.id}>
    {customer.name}
  </div>
))}

// Com componente
{customers.map(customer => (
  <CustomerCard key={customer.id} customer={customer} />
))}

// Com index (evite se possível)
{items.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ❌ ERRADO: sem key
{customers.map(customer => (
  <div>{customer.name}</div>  // Faltou key!
))}
```

### 6. Event Handlers
```jsx
// onClick
<button onClick={handleClick}>Clique</button>

// Com parâmetro
<button onClick={() => handleDelete(id)}>Excluir</button>

// onChange
<input value={name} onChange={handleChange} />

// onSubmit
<form onSubmit={handleSubmit}>
  {/* inputs */}
</form>

// preventDefault
const handleSubmit = (e) => {
  e.preventDefault(); // Previne reload da página
  // lógica
};

// Event object
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};
```

---

## 🛠️ Ferramentas que Você Deve Usar

### Chrome DevTools
**F12** para abrir

**Console Tab:**
- `console.log()` para debugar
- Ver erros
- Executar JavaScript

**Network Tab:**
- Ver requisições HTTP
- Status codes
- Payloads
- Response data

**React DevTools:**
- Ver componentes
- Ver state e props
- Time travel debugging

### VS Code Extensions
- ES7+ React/Redux snippets
- Auto Rename Tag
- Prettier
- ESLint

**Snippets úteis:**
- `rafce` - React Arrow Function Component Export
- `useState` - useState snippet
- `useEffect` - useEffect snippet

---

## 📚 Recursos de Aprendizado

### Documentação Oficial
- [React Docs](https://react.dev) ⭐⭐⭐⭐⭐ (NOVA!)
- [React Router](https://reactrouter.com) ⭐⭐⭐⭐
- [Axios Docs](https://axios-http.com) ⭐⭐⭐

### Cursos Recomendados
- **React - The Complete Guide** (Udemy) - Maximilian Schwarzmüller ⭐⭐⭐⭐⭐
- **Epic React** - Kent C. Dodds ⭐⭐⭐⭐⭐
- **Complete React Developer** (ZTM) - Andrei Neagoie

### YouTube Channels
- Web Dev Simplified
- Traversy Media
- Fireship
- Codevolution

### Livros
- "Learning React" - Alex Banks & Eve Porcello
- "React Design Patterns" - Michele Bertoli

---

## 🎯 Checklist de Competências

Marque conforme for dominando:

### Básico
- [ ] Criar componentes funcionais
- [ ] Usar useState
- [ ] Usar useEffect
- [ ] Props
- [ ] Event handlers (onClick, onChange)

### Intermediário
- [ ] Formulários controlados
- [ ] Chamadas API com Axios
- [ ] Conditional rendering
- [ ] Lists & Keys
- [ ] React Router

### Avançado
- [ ] Context API
- [ ] Custom Hooks
- [ ] Performance (useMemo, useCallback)
- [ ] Error Boundaries
- [ ] React Testing Library

---

## 📝 Próximos Passos

### Esta Semana
1. ✅ Estudar Customers-comentado.jsx completo
2. ✅ Fazer exercício 1 (filtro por tipo)
3. ✅ Experimentar com useState no DevTools
4. ✅ Ler React Docs (Hooks)

### Próxima Semana
1. ⏳ Estudar Dashboard.jsx
2. ⏳ Fazer exercício 2 (debounce)
3. ⏳ Implementar novo componente
4. ⏳ Aprender Context API

### Este Mês
1. ⏳ Dominar todos os hooks
2. ⏳ Criar custom hooks
3. ⏳ Implementar testes
4. ⏳ Melhorar performance

---

## 💬 Dúvidas Frequentes

**P: Quando usar useState vs useEffect?**
R: `useState` para dados que mudam. `useEffect` para efeitos (API, subscriptions, timers).

**P: Por que meu componente re-renderiza muito?**
R: Provavelmente criando funções/objetos dentro do render. Use `useCallback` e `useMemo`.

**P: Como debugar?**
R: `console.log`, React DevTools, breakpoints no Chrome DevTools.

**P: Qual diferença entre `.then()` e `async/await`?**
R: Mesmo resultado, `async/await` é mais legível. Use `async/await`.

**P: Por que preciso de key em listas?**
R: React usa key para identificar qual item mudou. Sem key, performance é afetada.

---

## 🎨 Dicas de CSS

### Inline Styles
```jsx
<div style={{
  backgroundColor: '#667eea',  // camelCase!
  padding: '1rem',
  borderRadius: '0.5rem'
}}>
  Conteúdo
</div>
```

### Gradientes
```jsx
<div style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}}>
```

### Flexbox
```jsx
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem'
}}>
```

### Hover (com state)
```jsx
const [hover, setHover] = useState(false);

<button
  style={{
    background: hover ? '#5568d3' : '#667eea',
    transform: hover ? 'translateY(-2px)' : 'translateY(0)'
  }}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
>
```

---

**Bons estudos! 🚀**

**Dúvidas?** Pergunte ao Michael (Tech Lead)
