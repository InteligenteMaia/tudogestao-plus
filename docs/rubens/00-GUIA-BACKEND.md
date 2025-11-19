# ⚙️ Rubens Neto - Backend Developer

## 📋 Informações Profissionais

- **Cargo:** Backend Developer
- **Salário:** R$ 12.000/mês
- **Regime:** Presencial/Híbrido
- **Horário:** Seg-Sex • 09h-18h

## 🎯 Responsabilidades no Projeto

Como Backend Developer, você é responsável por:

1. **APIs e Controllers**
   - Implementar endpoints REST
   - Validação de dados de entrada
   - Lógica de negócio

2. **Banco de Dados**
   - Modelagem com Prisma
   - Otimização de queries
   - Migrations

3. **Integrações**
   - APIs externas (NFe, pagamento)
   - Serviços de terceiros
   - Webhooks

## 📂 Seus Arquivos Principais

### Controllers (Lógica de Negócio)

```
backend/controllers/
├── 📄 customer.controller.js    ✅ SEU CÓDIGO
├── 📄 supplier.controller.js    ✅ SEU CÓDIGO
├── 📄 employee.controller.js    ✅ SEU CÓDIGO
├── 📄 product.controller.js     ✅ SEU CÓDIGO
├── 📄 sale.controller.js        ✅ SEU CÓDIGO
├── 📄 financial.controller.js   ✅ SEU CÓDIGO
├── 📄 report.controller.js      ✅ SEU CÓDIGO
└── 📄 company.controller.js     ✅ SEU CÓDIGO
```

### Routes (Definição de Rotas)

```
backend/routes/
├── 📄 customer.routes.js        ✅ SEU CÓDIGO
├── 📄 supplier.routes.js        ✅ SEU CÓDIGO
├── 📄 employee.routes.js        ✅ SEU CÓDIGO
├── 📄 product.routes.js         ✅ SEU CÓDIGO
├── 📄 sale.routes.js            ✅ SEU CÓDIGO
├── 📄 financial.routes.js       ✅ SEU CÓDIGO
└── 📄 report.routes.js          ✅ SEU CÓDIGO
```

### Prisma Schema (Banco de Dados)

```
backend/prisma/
├── 📄 schema.prisma             ✅ VOCÊ DEFINE TABELAS
└── 📁 migrations/               ✅ VOCÊ CRIA MIGRATIONS
```

## 🔧 Engenharia Reversa - Controllers

### 1. Customer Controller

**Arquivo:** `backend/controllers/customer.controller.js`

```javascript
class CustomerController {
  // CREATE - Criar novo cliente
  async create(req, res) {
    // 1. Extrai dados do request body
    const { type, cpfCnpj, name, email, phone, address } = req.body;

    // 2. Pega ID da empresa do usuário logado
    const companyId = req.companyId; // Vem do middleware auth

    // 3. Verifica se CPF/CNPJ já existe
    const existing = await prisma.customer.findFirst({
      where: { companyId, cpfCnpj }
    });

    if (existing) {
      throw new AppError('CPF/CNPJ já cadastrado', 409);
    }

    // 4. Cria o cliente no banco
    const customer = await prisma.customer.create({
      data: {
        companyId,
        type,        // INDIVIDUAL ou COMPANY
        cpfCnpj,
        name,
        email,
        phone,
        address,     // JSON com rua, cidade, estado, etc
        active: true
      }
    });

    // 5. Registra ação no log de auditoria
    await auditService.log(req.userId, 'CREATE', 'Customer', customer.id);

    // 6. Retorna resposta de sucesso
    res.status(201).json({
      message: 'Cliente criado com sucesso',
      customer
    });
  }

  // READ - Listar clientes
  async list(req, res) {
    const companyId = req.companyId;
    const { page = 1, limit = 20, search } = req.query;

    // Busca com paginação e filtro
    const customers = await prisma.customer.findMany({
      where: {
        companyId,
        // Se tem busca, filtra por nome OU cpfCnpj
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { cpfCnpj: { contains: search } }
          ]
        })
      },
      skip: (page - 1) * limit,  // Pula registros
      take: parseInt(limit),      // Limita quantidade
      orderBy: { name: 'asc' }    // Ordena por nome
    });

    res.json({ customers });
  }

  // UPDATE - Atualizar cliente
  async update(req, res) {
    const { id } = req.params;
    const { cpfCnpj, name, email, phone, address } = req.body;

    // Busca cliente
    const existing = await prisma.customer.findFirst({
      where: { id, companyId: req.companyId }
    });

    if (!existing) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // Atualiza
    const customer = await prisma.customer.update({
      where: { id },
      data: { cpfCnpj, name, email, phone, address }
    });

    res.json({ message: 'Cliente atualizado', customer });
  }

  // DELETE - Excluir cliente
  async delete(req, res) {
    const { id } = req.params;

    // Verifica se tem vendas vinculadas
    const sales = await prisma.sale.count({
      where: { customerId: id }
    });

    if (sales > 0) {
      throw new AppError('Cliente possui vendas vinculadas', 400);
    }

    await prisma.customer.delete({ where: { id } });

    res.json({ message: 'Cliente excluído' });
  }
}
```

### 2. Product Controller

**Arquivo:** `backend/controllers/product.controller.js`

```javascript
class ProductController {
  async create(req, res) {
    const {
      code,
      name,
      description,
      categoryId,
      supplierId,
      costPrice,
      salePrice,
      stock,
      minStock
    } = req.body;

    const product = await prisma.product.create({
      data: {
        companyId: req.companyId,
        code,
        name,
        description,
        categoryId,
        supplierId,
        costPrice: parseFloat(costPrice),   // Converte string para número
        salePrice: parseFloat(salePrice),
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 0
      },
      // Include traz dados relacionados
      include: {
        category: true,   // Inclui dados da categoria
        supplier: true    // Inclui dados do fornecedor
      }
    });

    res.status(201).json(product);
  }

  // Lista produtos com filtros e paginação
  async list(req, res) {
    const { page = 1, limit = 50, search, categoryId } = req.query;

    const where = {
      companyId: req.companyId,
      // Busca por nome OU código
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } }
        ]
      }),
      // Filtra por categoria se fornecida
      ...(categoryId && { categoryId })
    };

    // Executa 2 queries em paralelo (Promise.all)
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        include: {
          category: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } }
        }
      }),
      prisma.product.count({ where })  // Total para paginação
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }

  // Produtos com estoque baixo
  async lowStock(req, res) {
    const products = await prisma.product.findMany({
      where: {
        companyId: req.companyId,
        // Compara stock <= minStock
        stock: {
          lte: prisma.product.fields.minStock
        }
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: { stock: 'asc' }
    });

    res.json(products);
  }
}
```

### 3. Sale Controller

**Arquivo:** `backend/controllers/sale.controller.js`

```javascript
class SaleController {
  async create(req, res) {
    const { customerId, items, discount, paymentMethod } = req.body;

    // 1. Calcula valor total dos itens
    let totalAmount = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      // Verifica estoque
      if (product.stock < item.quantity) {
        throw new AppError(`Estoque insuficiente para ${product.name}`, 400);
      }

      totalAmount += parseFloat(product.salePrice) * item.quantity;
    }

    const discountAmount = discount ? parseFloat(discount) : 0;
    const netAmount = totalAmount - discountAmount;

    // 2. Gera número sequencial da venda
    const lastSale = await prisma.sale.findFirst({
      where: { companyId: req.companyId },
      orderBy: { saleNumber: 'desc' }
    });

    const nextNumber = lastSale
      ? parseInt(lastSale.saleNumber.split('-')[1]) + 1
      : 1;
    const saleNumber = `VND-${String(nextNumber).padStart(6, '0')}`;
    // Exemplo: VND-000001, VND-000002, etc

    // 3. Cria venda com itens em uma transação
    const sale = await prisma.sale.create({
      data: {
        companyId: req.companyId,
        customerId,
        saleNumber,
        date: new Date(),
        totalAmount,
        discount: discountAmount,
        netAmount,
        paymentMethod,
        status: 'PENDING',
        // Cria items relacionados em cascata
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            discount: item.discount || 0
          }))
        }
      },
      include: {
        customer: true,
        items: { include: { product: true } }
      }
    });

    // 4. Atualiza estoque dos produtos vendidos
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }  // Subtrai do estoque
        }
      });
    }

    res.status(201).json(sale);
  }
}
```

### 4. Report Controller

**Arquivo:** `backend/controllers/report.controller.js`

```javascript
class ReportController {
  // DRE - Demonstração do Resultado do Exercício
  async getDRE(req, res) {
    const { startDate, endDate } = req.query;

    const dateFilter = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };

    // Agrupa receitas por categoria
    const revenues = await prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'INCOME',
        date: dateFilter
      },
      _sum: { amount: true }  // Soma os valores
    });

    // Agrupa despesas por categoria
    const expenses = await prisma.financialTransaction.groupBy({
      by: ['category'],
      where: {
        type: 'EXPENSE',
        date: dateFilter
      },
      _sum: { amount: true }
    });

    // Calcula totais
    const totalRevenue = revenues.reduce((sum, r) =>
      sum + parseFloat(r._sum.amount), 0
    );
    const totalExpense = expenses.reduce((sum, e) =>
      sum + parseFloat(e._sum.amount), 0
    );
    const netProfit = totalRevenue - totalExpense;
    const profitMargin = totalRevenue > 0
      ? (netProfit / totalRevenue) * 100
      : 0;

    res.json({
      period: { startDate, endDate },
      revenues,
      totalRevenue,
      expenses,
      totalExpense,
      netProfit,
      profitMargin
    });
  }
}
```

## 📚 Conceitos Importantes para Dominar

### 1. Prisma ORM

**O que é:** Ferramenta que facilita trabalhar com banco de dados usando JavaScript.

```javascript
// Ao invés de escrever SQL:
SELECT * FROM customers WHERE companyId = '123' AND active = true;

// Você escreve:
await prisma.customer.findMany({
  where: { companyId: '123', active: true }
});
```

**Principais métodos:**
- `findMany()` - Buscar vários registros
- `findUnique()` - Buscar um registro único
- `findFirst()` - Buscar primeiro registro que bate
- `create()` - Criar novo registro
- `update()` - Atualizar registro
- `delete()` - Deletar registro
- `count()` - Contar registros
- `groupBy()` - Agrupar e agregar dados

### 2. Async/Await

Todo acesso ao banco é **assíncrono**:

```javascript
// ❌ ERRADO - Não espera resposta
const customer = prisma.customer.findUnique({ where: { id } });
console.log(customer.name); // undefined

// ✅ CERTO - Espera resposta com await
const customer = await prisma.customer.findUnique({ where: { id } });
console.log(customer.name); // "João Silva"
```

### 3. Tratamento de Erros

Use try/catch OU classe AppError:

```javascript
// Jeito 1: Try/Catch
async function createCustomer(req, res) {
  try {
    const customer = await prisma.customer.create({ data });
    res.json(customer);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
}

// Jeito 2: AppError (preferido)
async function createCustomer(req, res) {
  const existing = await prisma.customer.findUnique({ where: { cpfCnpj } });

  if (existing) {
    throw new AppError('CPF já cadastrado', 409);
  }

  // ... resto do código
}
```

### 4. Validação de Dados

Use express-validator nas rotas:

```javascript
// Em customer.routes.js
router.post('/',
  [
    body('name').notEmpty().withMessage('Nome obrigatório'),
    body('cpfCnpj').notEmpty().withMessage('CPF/CNPJ obrigatório'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    validate  // Middleware que verifica erros
  ],
  asyncHandler(customerController.create)
);
```

## 🎯 Checklist de Tarefas

### Ao criar um novo Controller

- [ ] Criar arquivo `nome.controller.js`
- [ ] Implementar métodos CRUD (create, list, getById, update, delete)
- [ ] Adicionar validações
- [ ] Usar req.companyId para multi-tenancy
- [ ] Incluir dados relacionados quando necessário
- [ ] Tratar erros com AppError
- [ ] Adicionar logs de auditoria
- [ ] Testar todos os endpoints

### Ao criar uma nova Rota

- [ ] Criar arquivo `nome.routes.js`
- [ ] Adicionar middleware de autenticação
- [ ] Adicionar validações com express-validator
- [ ] Usar asyncHandler para erros assíncronos
- [ ] Documentar endpoint (comentários)
- [ ] Testar com Postman

## 💡 Dicas de Boas Práticas

1. **Sempre use transações para operações relacionadas**
   ```javascript
   // Se criar venda falhar, items não são criados
   const sale = await prisma.sale.create({
     data: {
       // ... dados da venda
       items: {
         create: [/* items */]
       }
     }
   });
   ```

2. **Faça validações antes de salvar**
   ```javascript
   if (!email || !isValidEmail(email)) {
     throw new AppError('Email inválido', 400);
   }
   ```

3. **Use includes para evitar múltiplas queries**
   ```javascript
   // ❌ RUIM - 2 queries
   const sale = await prisma.sale.findUnique({ where: { id } });
   const customer = await prisma.customer.findUnique({
     where: { id: sale.customerId }
   });

   // ✅ BOM - 1 query
   const sale = await prisma.sale.findUnique({
     where: { id },
     include: { customer: true }
   });
   ```

---

**Próximos Passos:**
1. Estudar cada controller em detalhes
2. Entender o fluxo de dados
3. Praticar criando novos endpoints
4. Ler documentação do Prisma
