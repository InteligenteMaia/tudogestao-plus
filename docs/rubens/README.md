# ⚙️ Rubens Neto - Backend Developer

**Salário:** R$ 12.000/mês
**Regime:** Presencial/Híbrido
**Horário:** Seg-Sex • 09h-18h

---

## 📋 Sua Documentação

### 📄 Guia Principal
- **00-GUIA-BACKEND.md** - Guia completo de backend development

### 💻 Código Comentado
- **customer-controller-comentado.js** - CustomerController linha por linha (800+ linhas!)
  - Todas as operações CRUD explicadas
  - Prisma ORM em detalhes
  - Validações de negócio
  - Soft delete
  - Auditoria
  - 5 exercícios práticos

---

## 🎯 Como Estudar

### Passo 1: Leia o Guia
1. Abra **00-GUIA-BACKEND.md**
2. Leia do início ao fim (não pule partes!)
3. Anote dúvidas

### Passo 2: Código Comentado vs Código Real

Abra lado a lado:
```bash
# Terminal 1 - Código comentado
code docs/rubens/customer-controller-comentado.js

# Terminal 2 - Código real
code backend/controllers/customer.controller.js
```

**Compare:**
- Estrutura
- Lógica de negócio
- Uso do Prisma
- Tratamento de erros

### Passo 3: Experimente

```bash
# Inicie o backend
cd backend
npm run dev

# Em outro terminal, teste com curl ou Postman
curl http://localhost:3333/api/customers \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Passo 4: Exercícios Práticos

Faça os 5 exercícios no final de `customer-controller-comentado.js`:

1. ✅ Adicionar filtro por cidade
2. ✅ Endpoint de estatísticas
3. ✅ Restaurar cliente deletado
4. ✅ Busca avançada
5. ✅ Validação de CPF/CNPJ

---

## 📂 Seus Arquivos no Projeto

```
backend/controllers/
├── customer.controller.js    ✅ Seu principal
├── product.controller.js     ✅ Seu
├── category.controller.js    ✅ Seu
├── supplier.controller.js    ✅ Seu
└── employee.controller.js    ✅ Seu (parcial)

backend/routes/
├── customer.routes.js        ✅ Seu
├── product.routes.js         ✅ Seu
├── category.routes.js        ✅ Seu
└── supplier.routes.js        ✅ Seu

prisma/
└── schema.prisma             ✅ Você ajudou a criar
```

---

## 💡 Conceitos que Você Deve Dominar

### 1. Prisma ORM
```javascript
// FIND
await prisma.customer.findMany({ where, orderBy, take, skip })
await prisma.customer.findUnique({ where: { id } })
await prisma.customer.findFirst({ where })

// CREATE
await prisma.customer.create({ data })

// UPDATE
await prisma.customer.update({ where, data })

// DELETE
await prisma.customer.delete({ where })

// COUNT
await prisma.customer.count({ where })

// TRANSACTION
await prisma.$transaction(async (tx) => {
  // Operações atômicas
})
```

### 2. Async/Await
```javascript
// ❌ ERRADO (callbacks)
prisma.customer.findMany((err, customers) => {
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.json(customers);
  }
});

// ✅ CORRETO (async/await)
async function getCustomers() {
  try {
    const customers = await prisma.customer.findMany();
    return customers;
  } catch (error) {
    throw error;
  }
}
```

### 3. Validações
```javascript
// Validação de existência
const customer = await prisma.customer.findUnique({ where: { id } });
if (!customer) {
  throw new AppError('Cliente não encontrado', 404);
}

// Validação de duplicidade
const existing = await prisma.customer.findFirst({
  where: { companyId, cpfCnpj }
});
if (existing) {
  throw new AppError('CPF/CNPJ já cadastrado', 409);
}

// Validação de ownership (multi-tenancy)
if (customer.companyId !== req.companyId) {
  throw new AppError('Acesso negado', 403);
}
```

### 4. Error Handling
```javascript
// AppError para erros esperados
throw new AppError('Mensagem', statusCode);

// Try/catch para capturar erros
try {
  await operacao();
} catch (error) {
  // Tratar erro
}
```

---

## 🛠️ Ferramentas que Você Deve Usar

### Prisma Studio
```bash
cd backend
npx prisma studio
```
**O que faz:** Abre interface gráfica para visualizar/editar banco de dados
**Quando usar:** Para ver dados, testar queries, debug

### Postman / Insomnia
**O que faz:** Testa endpoints da API
**Quando usar:** Para testar seus controllers sem depender do frontend

**Exemplo de requisição:**
```
POST http://localhost:3333/api/customers
Headers:
  Authorization: Bearer eyJhbGc...
  Content-Type: application/json

Body:
{
  "type": "INDIVIDUAL",
  "cpfCnpj": "123.456.789-00",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

### PostgreSQL Client (DBeaver / pgAdmin)
**O que faz:** Visualiza banco de dados, executa SQL
**Quando usar:** Para queries complexas, otimização, debug

---

## 📚 Recursos de Aprendizado

### Documentação Oficial
- [Prisma Docs](https://prisma.io/docs) ⭐⭐⭐⭐⭐
- [Express Docs](https://expressjs.com) ⭐⭐⭐⭐
- [PostgreSQL Docs](https://postgresql.org/docs) ⭐⭐⭐⭐

### Cursos Recomendados
- **Node.js: The Complete Guide** (Udemy) - Maximilian Schwarzmüller
- **Complete Node.js Developer** (ZTM) - Andrei Neagoie
- **SQL & Database Design** (Udemy)

### YouTube Channels
- Traversy Media
- Web Dev Simplified
- Fireship

### Livros
- "Node.js Design Patterns" - Mario Casciaro
- "Database Internals" - Alex Petrov

---

## 🎯 Checklist de Competências

Marque conforme for dominando:

### Básico
- [ ] Entender async/await
- [ ] Criar controllers simples
- [ ] Usar Prisma para CRUD
- [ ] Validar dados de entrada
- [ ] Retornar status codes corretos

### Intermediário
- [ ] Usar Prisma relations (include)
- [ ] Implementar paginação
- [ ] Filtros dinâmicos
- [ ] Soft delete
- [ ] Auditoria de ações

### Avançado
- [ ] Transações complexas
- [ ] Otimização de queries
- [ ] Indexes no banco
- [ ] Error handling robusto
- [ ] Testes unitários

---

## 📝 Próximos Passos

### Esta Semana
1. ✅ Estudar customer-controller-comentado.js completo
2. ✅ Fazer exercício 1 (filtro por cidade)
3. ✅ Testar endpoints no Postman
4. ✅ Ler sobre Prisma transactions

### Próxima Semana
1. ⏳ Estudar Product Controller
2. ⏳ Fazer exercício 2 (estatísticas)
3. ⏳ Implementar testes unitários
4. ⏳ Otimizar queries lentas

### Este Mês
1. ⏳ Dominar todos os controllers
2. ⏳ Implementar novos endpoints
3. ⏳ Code review de outros PRs
4. ⏳ Mentorar júniores

---

## 💬 Dúvidas Frequentes

**P: Quando usar findUnique vs findFirst?**
R: `findUnique` apenas para campos únicos (id, unique constraint). `findFirst` para qualquer filtro.

**P: Como testar sem o frontend?**
R: Use Postman ou Insomnia. Exemplos em `customer-controller-comentado.js`

**P: Como debugar código async?**
R: Use `console.log`, debugger do VS Code, ou Prisma Studio

**P: Devo usar SQL direto ou sempre Prisma?**
R: Sempre Prisma. Apenas use SQL raw para queries muito específicas.

---

**Bons estudos! 🚀**

**Dúvidas?** Pergunte ao Michael (Tech Lead)
