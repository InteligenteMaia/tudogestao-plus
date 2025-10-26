# Script para corrigir o schema.prisma
# Execute na pasta backend: .\fix-schema.ps1

Write-Host "🔧 Corrigindo schema.prisma..." -ForegroundColor Yellow
Write-Host ""

# Verificar se está na pasta backend
if (!(Test-Path "prisma")) {
    Write-Host "❌ Erro: Execute este script na pasta 'backend'" -ForegroundColor Red
    exit 1
}

# Fazer backup do schema atual
$backupPath = "prisma\schema.prisma.backup"
if (Test-Path "prisma\schema.prisma") {
    Write-Host "📦 Fazendo backup do schema atual..." -ForegroundColor Cyan
    Copy-Item "prisma\schema.prisma" $backupPath -Force
    Write-Host "✅ Backup salvo em: $backupPath" -ForegroundColor Green
    Write-Host ""
}

# Criar o novo schema corrigido
Write-Host "📝 Criando schema.prisma corrigido..." -ForegroundColor Cyan

$schemaContent = @'
// 👨‍💻 Michael Santos - Tech Lead & Arquitetura
// Schema do banco de dados - TudoGestão+

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== EMPRESAS ==========
model Company {
  id          String   @id @default(uuid())
  name        String
  tradeName   String?
  cnpj        String   @unique
  ie          String?
  im          String?
  email       String
  phone       String
  address     Json
  active      Boolean  @default(true)
  licenseKey  String?
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users       User[]
  customers   Customer[]
  suppliers   Supplier[]
  products    Product[]
  sales       Sale[]
  employees   Employee[]

  @@map("companies")
}

// ========== USUÁRIOS ==========
model User {
  id          String   @id @default(uuid())
  companyId   String
  name        String
  email       String   @unique
  password    String
  role        UserRole @default(USER)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  company     Company  @relation(fields: [companyId], references: [id])
  auditLogs   AuditLog[]

  @@map("users")
}

enum UserRole {
  ADMIN
  MANAGER
  SALESPERSON
  FINANCIAL
  USER
}

// ========== CLIENTES ==========
model Customer {
  id          String       @id @default(uuid())
  companyId   String
  type        CustomerType @default(INDIVIDUAL)
  cpfCnpj     String
  name        String
  tradeName   String?
  email       String?
  phone       String?
  address     Json?
  active      Boolean      @default(true)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  company     Company      @relation(fields: [companyId], references: [id])
  sales       Sale[]

  @@unique([companyId, cpfCnpj])
  @@map("customers")
}

enum CustomerType {
  INDIVIDUAL
  COMPANY
}

// ========== FORNECEDORES ==========
model Supplier {
  id          String   @id @default(uuid())
  companyId   String
  cpfCnpj     String
  name        String
  tradeName   String?
  email       String?
  phone       String?
  address     Json?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  company     Company  @relation(fields: [companyId], references: [id])
  products    Product[]

  @@unique([companyId, cpfCnpj])
  @@map("suppliers")
}

// ========== CATEGORIAS ==========
model Category {
  id          String   @id @default(uuid())
  name        String
  description String?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products    Product[]

  @@map("categories")
}

// ========== PRODUTOS ==========
model Product {
  id           String   @id @default(uuid())
  companyId    String
  supplierId   String?
  categoryId   String?
  code         String
  barcode      String?
  name         String
  description  String?
  unit         String   @default("UN")
  costPrice    Decimal  @db.Decimal(10, 2)
  salePrice    Decimal  @db.Decimal(10, 2)
  stock        Int      @default(0)
  minStock     Int      @default(0)
  maxStock     Int?
  ncm          String?
  cest         String?
  cfop         String?
  active       Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  company      Company     @relation(fields: [companyId], references: [id])
  supplier     Supplier?   @relation(fields: [supplierId], references: [id])
  category     Category?   @relation(fields: [categoryId], references: [id])
  saleItems    SaleItem[]
  stockMovements StockMovement[]

  @@unique([companyId, code])
  @@map("products")
}

// ========== MOVIMENTAÇÕES DE ESTOQUE ==========
model StockMovement {
  id          String            @id @default(uuid())
  productId   String
  type        StockMovementType
  quantity    Int
  reason      String?
  userId      String?
  createdAt   DateTime          @default(now())

  product     Product           @relation(fields: [productId], references: [id])

  @@map("stock_movements")
}

enum StockMovementType {
  IN
  OUT
  ADJUSTMENT
  RETURN
}

// ========== VENDAS ==========
model Sale {
  id           String       @id @default(uuid())
  companyId    String
  customerId   String
  saleNumber   String
  date         DateTime     @default(now())
  totalAmount  Decimal      @db.Decimal(10, 2)
  discount     Decimal?     @db.Decimal(10, 2)
  netAmount    Decimal      @db.Decimal(10, 2)
  status       SaleStatus   @default(PENDING)
  paymentMethod PaymentMethod?
  observations String?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  company      Company      @relation(fields: [companyId], references: [id])
  customer     Customer     @relation(fields: [customerId], references: [id])
  items        SaleItem[]
  nfe          NFe?

  @@unique([companyId, saleNumber])
  @@map("sales")
}

enum SaleStatus {
  PENDING
  PAID
  CANCELLED
}

enum PaymentMethod {
  CASH
  CREDIT_CARD
  DEBIT_CARD
  PIX
  BANK_SLIP
  CHECK
  OTHER
}

// ========== ITENS DE VENDA ==========
model SaleItem {
  id          String   @id @default(uuid())
  saleId      String
  productId   String
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  discount    Decimal? @db.Decimal(10, 2)
  total       Decimal  @db.Decimal(10, 2)

  sale        Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])

  @@map("sale_items")
}

// ========== NOTAS FISCAIS ELETRÔNICAS ==========
model NFe {
  id           String    @id @default(uuid())
  saleId       String    @unique
  number       String
  series       String
  accessKey    String?
  status       NFeStatus @default(PENDING)
  xml          String?
  protocol     String?
  issuedAt     DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  sale         Sale      @relation(fields: [saleId], references: [id])

  @@map("nfes")
}

enum NFeStatus {
  PENDING
  AUTHORIZED
  CANCELLED
  DENIED
  ERROR
}

// ========== CONTAS A RECEBER ==========
model AccountReceivable {
  id           String          @id @default(uuid())
  customerId   String?
  saleId       String?
  description  String
  amount       Decimal         @db.Decimal(10, 2)
  dueDate      DateTime
  paymentDate  DateTime?
  status       AccountStatus   @default(PENDING)
  observations String?
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  @@map("accounts_receivable")
}

// ========== CONTAS A PAGAR ==========
model AccountPayable {
  id           String        @id @default(uuid())
  supplierId   String?
  description  String
  amount       Decimal       @db.Decimal(10, 2)
  dueDate      DateTime
  paymentDate  DateTime?
  status       AccountStatus @default(PENDING)
  observations String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@map("accounts_payable")
}

enum AccountStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

// ========== TRANSAÇÕES FINANCEIRAS ==========
model FinancialTransaction {
  id           String            @id @default(uuid())
  type         TransactionType
  category     String
  description  String
  amount       Decimal           @db.Decimal(10, 2)
  date         DateTime          @default(now())
  bankAccount  String?
  observations String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  @@map("financial_transactions")
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

// ========== FUNCIONÁRIOS ==========
model Employee {
  id           String   @id @default(uuid())
  companyId    String
  cpf          String   @unique
  name         String
  email        String?
  phone        String?
  position     String
  department   String?
  salary       Decimal  @db.Decimal(10, 2)
  admissionDate DateTime
  dismissalDate DateTime?
  active       Boolean  @default(true)
  address      Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  company      Company  @relation(fields: [companyId], references: [id])
  payrolls     Payroll[]

  @@map("employees")
}

// ========== FOLHA DE PAGAMENTO ==========
model Payroll {
  id            String   @id @default(uuid())
  employeeId    String
  referenceMonth DateTime
  grossSalary   Decimal  @db.Decimal(10, 2)
  inss          Decimal  @db.Decimal(10, 2)
  irrf          Decimal  @db.Decimal(10, 2)
  fgts          Decimal  @db.Decimal(10, 2)
  benefits      Decimal? @db.Decimal(10, 2)
  deductions    Decimal? @db.Decimal(10, 2)
  netSalary     Decimal  @db.Decimal(10, 2)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  employee      Employee @relation(fields: [employeeId], references: [id])

  @@map("payrolls")
}

// ========== AUDITORIA ==========
model AuditLog {
  id          String   @id @default(uuid())
  userId      String
  action      String
  entity      String
  entityId    String?
  changes     Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])

  @@map("audit_logs")
}
'@

# Escrever o novo schema
Set-Content -Path "prisma\schema.prisma" -Value $schemaContent -Encoding UTF8

Write-Host "✅ Schema corrigido criado!" -ForegroundColor Green
Write-Host ""

# Gerar Prisma Client
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Schema corrigido com sucesso!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. npx prisma migrate dev --name init" -ForegroundColor Yellow
    Write-Host "2. npm run db:seed" -ForegroundColor Yellow
    Write-Host "3. npm run dev" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao gerar Prisma Client" -ForegroundColor Red
    Write-Host "Verifique os erros acima" -ForegroundColor Yellow
}