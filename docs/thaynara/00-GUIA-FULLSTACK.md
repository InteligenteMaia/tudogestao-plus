# 🔧 Thaynara Ribeiro - Full Stack Developer

## 📋 Informações Profissionais

- **Cargo:** Full Stack Developer
- **Salário:** R$ 10.500/mês
- **Regime:** Híbrido
- **Horário:** Seg-Sex • 10h-19h

## 🎯 Responsabilidades

Como Full Stack, você transita entre Backend e Frontend:

1. **Backend:**
   - Implementar Controllers complexos
   - Criar Services (PDF, Excel, Email)
   - Otimizar queries do banco

2. **Frontend:**
   - Páginas completas com CRUD
   - Componentização avançada
   - Integração com múltiplos endpoints

## 📂 Seus Arquivos Principais

### Backend - Controllers e Services

```
backend/
├── 📁 controllers/
│   ├── 📄 product.controller.js         ✅ Produtos
│   ├── 📄 supplier.controller.js        ✅ Fornecedores
│   └── 📄 employee.controller.js        ✅ Funcionários
├── 📁 services/
│   ├── 📄 pdf.service.js                ✅ Geração de PDFs
│   ├── 📄 excel.service.js              ✅ Export para Excel
│   └── 📄 audit.service.js              ✅ Log de auditoria
└── 📁 routes/
    ├── 📄 product.routes.js             ✅ Rotas de produtos
    ├── 📄 supplier.routes.js            ✅ Rotas de fornecedores
    └── 📄 employee.routes.js            ✅ Rotas de funcionários
```

### Frontend - Páginas Complexas

```
frontend/src/pages/
├── 📁 products/
│   └── 📄 Products.jsx                  ✅ CRUD completo
├── 📁 suppliers/
│   └── 📄 Suppliers.jsx                 ✅ CRUD completo
└── 📁 employees/
    └── 📄 Employees.jsx                 ✅ CRUD completo
```

## 🔧 Engenharia Reversa

### 1. Service Pattern - PDF Service

**Arquivo:** `backend/services/pdf.service.js`

```javascript
const PDFDocument = require('pdfkit');
const fs = require('fs');

class PDFService {
  // Gera relatório em PDF
  async generateSalesReport(sales, period) {
    return new Promise((resolve, reject) => {
      // Cria novo documento PDF
      const doc = new PDFDocument({ margin: 50 });
      const filename = `vendas-${Date.now()}.pdf`;
      const filepath = `./temp/${filename}`;

      // Stream para salvar arquivo
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Cabeçalho
      doc
        .fontSize(20)
        .text('Relatório de Vendas', { align: 'center' })
        .fontSize(12)
        .text(`Período: ${period.start} a ${period.end}`, {
          align: 'center'
        })
        .moveDown();

      // Tabela de vendas
      let y = 150;
      doc.fontSize(10);

      sales.forEach(sale => {
        doc
          .text(sale.number, 50, y)
          .text(sale.customer, 150, y)
          .text(sale.total, 350, y, { align: 'right' });
        y += 20;
      });

      // Finaliza PDF
      doc.end();

      // Quando terminar, resolve com caminho
      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', reject);
    });
  }
}

module.exports = new PDFService();
```

### 2. Excel Export Service

**Arquivo:** `backend/services/excel.service.js`

```javascript
const ExcelJS = require('exceljs');

class ExcelService {
  async exportProducts(products) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos');

    // Define colunas
    worksheet.columns = [
      { header: 'Código', key: 'code', width: 15 },
      { header: 'Nome', key: 'name', width: 30 },
      { header: 'Categoria', key: 'category', width: 20 },
      { header: 'Estoque', key: 'stock', width: 10 },
      { header: 'Preço', key: 'price', width: 15 }
    ];

    // Estiliza cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    };

    // Adiciona dados
    products.forEach(product => {
      worksheet.addRow({
        code: product.code,
        name: product.name,
        category: product.category?.name,
        stock: product.stock,
        price: product.salePrice
      });
    });

    // Salva arquivo
    const filename = `produtos-${Date.now()}.xlsx`;
    await workbook.xlsx.writeFile(`./temp/${filename}`);

    return filename;
  }
}

module.exports = new ExcelService();
```

### 3. Audit Service - Log de Ações

**Arquivo:** `backend/services/audit.service.js`

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuditService {
  /**
   * Registra ação do usuário
   * @param {string} userId - ID do usuário
   * @param {string} action - CREATE, UPDATE, DELETE
   * @param {string} entity - Customer, Product, etc
   * @param {string} entityId - ID do registro afetado
   * @param {object} data - Dados da operação
   */
  async log(userId, action, entity, entityId, data = null) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          data: data ? JSON.stringify(data) : null,
          timestamp: new Date(),
          ipAddress: null // Pode pegar do req
        }
      });
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
      // Não falha operação principal se log falhar
    }
  }

  // Busca logs de uma entidade
  async getEntityLogs(entity, entityId) {
    return await prisma.auditLog.findMany({
      where: { entity, entityId },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { timestamp: 'desc' }
    });
  }
}

module.exports = new AuditService();
```

**Como usar no controller:**

```javascript
const auditService = require('../services/audit.service');

async create(req, res) {
  const customer = await prisma.customer.create({ data });

  // Registra criação
  await auditService.log(
    req.userId,
    'CREATE',
    'Customer',
    customer.id,
    req.body
  );

  res.json(customer);
}
```

## 📚 Conceitos Full Stack

### 1. Transaction Pattern

Quando uma operação afeta múltiplas tabelas:

```javascript
// ❌ SEM TRANSAÇÃO - Pode deixar dados inconsistentes
await prisma.sale.create({ data: saleData });
await prisma.product.update({ data: stockUpdate });
// Se falhar aqui, venda foi criada mas estoque não atualizado!

// ✅ COM TRANSAÇÃO - Tudo ou nada
await prisma.$transaction(async (tx) => {
  const sale = await tx.sale.create({ data: saleData });

  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } }
  });

  return sale;
});
// Se qualquer operação falhar, TODAS são revertidas
```

### 2. File Upload

```javascript
const multer = require('multer');

// Configuração
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Rota
router.post('/upload',
  upload.single('file'),  // Campo do form
  async (req, res) => {
    const file = req.file;  // Arquivo upado
    res.json({ path: file.path });
  }
);
```

### 3. Background Jobs

Para tarefas demoradas (enviar email, gerar relatório grande):

```javascript
const Queue = require('bull');

// Cria fila
const emailQueue = new Queue('emails');

// Processa jobs
emailQueue.process(async (job) => {
  const { to, subject, body } = job.data;
  await sendEmail(to, subject, body);
});

// Adiciona job à fila (não espera terminar)
async sendWelcomeEmail(user) {
  await emailQueue.add({
    to: user.email,
    subject: 'Bem-vindo!',
    body: `Olá ${user.name}!`
  });

  // Retorna imediatamente, email será enviado em background
}
```

## 🎯 Checklist Full Stack

### Criar feature completa (Backend + Frontend)

**Backend:**
- [ ] Criar model no Prisma schema
- [ ] Gerar migration
- [ ] Criar controller com CRUD
- [ ] Criar rotas com validação
- [ ] Adicionar testes
- [ ] Documentar API

**Frontend:**
- [ ] Criar página React
- [ ] Implementar formulário
- [ ] Conectar com API
- [ ] Adicionar validações
- [ ] Loading states
- [ ] Error handling
- [ ] Toasts de sucesso/erro

## 💡 Dicas

1. **Pense em reusabilidade**
   - Services podem ser usados em múltiplos controllers
   - Componentes podem ser usados em múltiplas páginas

2. **Separe responsabilidades**
   - Controller = orquestra lógica
   - Service = implementa operação específica
   - Model = define estrutura de dados

3. **Documente decisões importantes**
   ```javascript
   /**
    * IMPORTANTE: Usamos transação aqui porque se falhar
    * ao atualizar estoque, a venda não deve ser criada
    */
   await prisma.$transaction(/*...*/)
   ```

---

**Próximos Passos:**
1. Estudar fluxo completo de uma feature
2. Praticar criar services
3. Implementar nova funcionalidade end-to-end
