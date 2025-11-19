# 💻 Felipe Gonzaga - Frontend Developer

## 📋 Informações Profissionais

- **Cargo:** Frontend Developer
- **Salário:** R$ 11.000/mês
- **Regime:** Home Office
- **Horário:** Seg-Sex • 09h-18h

## 🎯 Responsabilidades no Projeto

Como Frontend Developer, você é responsável por:

1. **Interfaces de Usuário**
   - Componentes React reutilizáveis
   - Páginas responsivas
   - Experiência do usuário (UX)

2. **Integração com API**
   - Consumir endpoints REST
   - Gerenciamento de estado
   - Tratamento de erros

3. **Performance Frontend**
   - Otimização de renderização
   - Code splitting
   - Lazy loading

## 📂 Seus Arquivos Principais

### Páginas da Aplicação

```
frontend/src/pages/
├── 📁 dashboard/
│   └── 📄 Dashboard.jsx          ✅ SEU CÓDIGO - Tela inicial
├── 📁 customers/
│   └── 📄 Customers.jsx          ✅ SEU CÓDIGO - Gestão de clientes
├── 📁 suppliers/
│   └── 📄 Suppliers.jsx          ✅ SEU CÓDIGO - Gestão de fornecedores
├── 📁 products/
│   └── 📄 Products.jsx           ✅ SEU CÓDIGO - Gestão de produtos
├── 📁 sales/
│   └── 📄 Sales.jsx              ✅ SEU CÓDIGO - PDV e vendas
├── 📁 financial/
│   └── 📄 Financial.jsx          ✅ SEU CÓDIGO - Financeiro
├── 📁 reports/
│   └── 📄 Reports.jsx            ✅ SEU CÓDIGO - Relatórios
├── 📁 employees/
│   └── 📄 Employees.jsx          ✅ SEU CÓDIGO - Funcionários
├── 📁 nfe/
│   └── 📄 NFe.jsx                ✅ SEU CÓDIGO - Notas fiscais
├── 📁 settings/
│   └── 📄 Settings.jsx           ✅ SEU CÓDIGO - Configurações
└── 📁 users/
    └── 📄 Users.jsx              ✅ SEU CÓDIGO - Usuários do sistema
```

### Componentes Reutilizáveis

```
frontend/src/components/
├── 📁 layout/
│   ├── 📄 Layout.jsx             ✅ SEU CÓDIGO - Layout geral
│   ├── 📄 Sidebar.jsx            ✅ SEU CÓDIGO - Menu lateral
│   └── 📄 Header.jsx             ✅ SEU CÓDIGO - Cabeçalho
├── 📁 common/
│   ├── 📄 Button.jsx             ✅ SEU CÓDIGO - Botões
│   ├── 📄 Modal.jsx              ✅ SEU CÓDIGO - Modais
│   ├── 📄 Table.jsx              ✅ SEU CÓDIGO - Tabelas
│   └── 📄 Card.jsx               ✅ SEU CÓDIGO - Cards
└── 📁 forms/
    ├── 📄 Input.jsx              ✅ SEU CÓDIGO - Inputs
    └── 📄 Select.jsx             ✅ SEU CÓDIGO - Selects
```

### Serviços e Utilitários

```
frontend/src/
├── 📁 services/
│   ├── 📄 api.js                 ✅ SEU CÓDIGO - Cliente HTTP
│   └── 📄 auth.js                ✅ SEU CÓDIGO - Autenticação
├── 📁 contexts/
│   └── 📄 AuthContext.jsx        ✅ SEU CÓDIGO - Contexto de auth
└── 📁 utils/
    ├── 📄 formatters.js          ✅ SEU CÓDIGO - Formatação
    └── 📄 validators.js          ✅ SEU CÓDIGO - Validações
```

## 🔧 Engenharia Reversa - React Components

### 1. Estrutura de uma Página Completa

**Arquivo:** `frontend/src/pages/customers/Customers.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Customers() {
  // 1. ESTADO DO COMPONENTE
  const [customers, setCustomers] = useState([]);        // Lista de clientes
  const [loading, setLoading] = useState(true);          // Estado de carregamento
  const [showModal, setShowModal] = useState(false);     // Modal aberto/fechado
  const [editingCustomer, setEditingCustomer] = useState(null);  // Cliente sendo editado
  const [formData, setFormData] = useState({             // Dados do formulário
    type: 'INDIVIDUAL',
    cpfCnpj: '',
    name: '',
    email: '',
    phone: '',
    // ... outros campos
  });

  // 2. EFEITO - Carrega dados quando componente monta
  useEffect(() => {
    loadCustomers();
  }, []); // Array vazio = executa só uma vez

  // 3. FUNÇÃO - Buscar clientes da API
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers');
      setCustomers(response.data.customers || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar clientes');
      setCustomers([]);
      setLoading(false);
    }
  };

  // 4. FUNÇÃO - Abrir modal (criar ou editar)
  const handleOpenModal = (customer = null) => {
    if (customer) {
      // Modo edição - preenche formulário
      setEditingCustomer(customer);
      setFormData({
        type: customer.type,
        cpfCnpj: customer.cpfCnpj,
        name: customer.name,
        // ... outros campos
      });
    } else {
      // Modo criação - formulário limpo
      setEditingCustomer(null);
      setFormData({
        type: 'INDIVIDUAL',
        cpfCnpj: '',
        name: '',
        // ... campos vazios
      });
    }
    setShowModal(true);
  };

  // 5. FUNÇÃO - Salvar (criar ou atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne reload da página

    try {
      const payload = {
        ...formData,
        // Monta objeto de endereço
        address: formData.cep ? {
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          city: formData.city,
          state: formData.state
        } : null
      };

      if (editingCustomer) {
        // ATUALIZAR - PUT
        await api.put(`/customers/${editingCustomer.id}`, payload);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        // CRIAR - POST
        await api.post('/customers', payload);
        toast.success('Cliente criado com sucesso!');
      }

      setShowModal(false);      // Fecha modal
      setEditingCustomer(null);  // Limpa edição
      loadCustomers();           // Recarrega lista
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar');
    }
  };

  // 6. FUNÇÃO - Excluir cliente
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) {
      return;
    }

    try {
      await api.delete(`/customers/${id}`);
      toast.success('Cliente excluído com sucesso!');
      loadCustomers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao excluir');
    }
  };

  // 7. RENDER - Interface visual
  return (
    <div>
      {/* Cabeçalho com botão Novo */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Clientes</h1>
        <button onClick={() => handleOpenModal()}>
          <FaPlus /> Novo Cliente
        </button>
      </div>

      {/* Tabela de clientes */}
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.cpfCnpj}</td>
                <td>{customer.email}</td>
                <td>
                  <button onClick={() => handleOpenModal(customer)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(customer.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de formulário */}
      {showModal && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>{editingCustomer ? 'Editar' : 'Novo'} Cliente</h2>

            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({
                ...formData,
                name: e.target.value
              })}
              required
            />

            {/* ... outros campos ... */}

            <button type="submit">Salvar</button>
            <button type="button" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
```

### 2. Hooks do React

#### useState - Gerenciar Estado

```jsx
const [valor, setValor] = useState(valorInicial);

// Exemplo:
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [user, setUser] = useState(null);
const [items, setItems] = useState([]);

// Atualizar estado:
setCount(count + 1);                    // Novo valor
setCount(prevCount => prevCount + 1);   // Baseado no anterior
setItems([...items, newItem]);          // Adicionar ao array
setUser({ ...user, name: 'João' });     // Atualizar objeto
```

#### useEffect - Efeitos Colaterais

```jsx
useEffect(() => {
  // Código a executar
}, [dependências]);

// Exemplo 1: Executar só uma vez (ao montar)
useEffect(() => {
  loadData();
}, []);

// Exemplo 2: Executar quando 'search' mudar
useEffect(() => {
  filterResults(search);
}, [search]);

// Exemplo 3: Cleanup (limpar timer, etc)
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);

  return () => clearInterval(timer); // Cleanup
}, []);
```

### 3. Integração com API

**Arquivo:** `frontend/src/services/api.js`

```javascript
import axios from 'axios';

// Cria instância do Axios com configuração base
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Adiciona token em todas requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Trata erros globalmente
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token inválido - redireciona para login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Como usar:**

```jsx
import api from '../../services/api';

// GET - Buscar dados
const response = await api.get('/customers');
const customers = response.data.customers;

// GET com parâmetros
const response = await api.get('/customers', {
  params: { page: 1, limit: 20, search: 'João' }
});
// Gera: /customers?page=1&limit=20&search=João

// POST - Criar
await api.post('/customers', {
  name: 'João Silva',
  cpfCnpj: '12345678900'
});

// PUT - Atualizar
await api.put(`/customers/${id}`, {
  name: 'João Silva Atualizado'
});

// DELETE - Excluir
await api.delete(`/customers/${id}`);
```

### 4. Context API (Autenticação)

**Arquivo:** `frontend/src/contexts/AuthContext.jsx`

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica se está autenticado ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado
export function useAuth() {
  return useContext(AuthContext);
}
```

**Como usar:**

```jsx
import { useAuth } from '../../contexts/AuthContext';

function MeuComponente() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <p>Olá, {user?.name}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### 5. React Hot Toast (Notificações)

```jsx
import toast from 'react-hot-toast';

// Sucesso
toast.success('Cliente criado com sucesso!');

// Erro
toast.error('Erro ao salvar cliente');

// Aviso
toast('Atenção: Campo obrigatório', {
  icon: '⚠️',
});

// Loading
const toastId = toast.loading('Salvando...');
// Depois...
toast.success('Salvo!', { id: toastId });
```

## 📚 Conceitos Importantes

### 1. Props vs State

```jsx
// PROPS - Passadas pelo componente pai (READ-ONLY)
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

<Button label="Salvar" onClick={handleSave} />

// STATE - Estado interno do componente (PODE MUDAR)
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

### 2. Renderização Condicional

```jsx
// If simples
{isLoading && <div>Carregando...</div>}

// If/Else (ternário)
{isLoading ? (
  <div>Carregando...</div>
) : (
  <div>Conteúdo</div>
)}

// Multiple conditions
{error ? (
  <div>Erro!</div>
) : isLoading ? (
  <div>Carregando...</div>
) : (
  <div>Conteúdo</div>
)}
```

### 3. Listas e Keys

```jsx
// Sempre use 'key' único em listas
{customers.map(customer => (
  <div key={customer.id}>
    {customer.name}
  </div>
))}

// ❌ NUNCA use index como key
{customers.map((customer, index) => (
  <div key={index}>  {/* ERRADO! */}
    {customer.name}
  </div>
))}
```

### 4. Formulários Controlados

```jsx
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
    </form>
  );
}
```

## 🎯 Checklist de Tarefas

### Ao criar uma nova página

- [ ] Criar arquivo na pasta pages
- [ ] Importar hooks necessários (useState, useEffect)
- [ ] Definir estados do componente
- [ ] Criar funções de API (load, create, update, delete)
- [ ] Implementar useEffect para carregar dados
- [ ] Criar interface (JSX)
- [ ] Adicionar validações de formulário
- [ ] Implementar feedback (toast)
- [ ] Testar em diferentes resoluções
- [ ] Adicionar loading states

### Boas Práticas

1. **Componentes pequenos e reutilizáveis**
2. **Nomes descritivos para estados e funções**
3. **Extrair lógica complexa para custom hooks**
4. **Usar destructuring**
   ```jsx
   // ✅ BOM
   const { name, email } = user;

   // ❌ RUIM
   const name = user.name;
   const email = user.email;
   ```
5. **Evitar inline styles em produção (use CSS)**

---

**Próximos Passos:**
1. Estudar cada página em detalhes
2. Entender fluxo de dados
3. Praticar criando componentes
4. Ler docs do React
