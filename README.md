# 🚀 TudoGestão+ - Sistema de Gestão Empresarial

Sistema ERP completo para gestão de pequenas e médias empresas, desenvolvido com tecnologias modernas e design inspirado na Apple.

## 👥 Equipe de Desenvolvimento

- 👨‍💻 **Michael Santos** - Tech Lead & Arquitetura
- ⚙️ **Rubens Neto** - Backend Developer
- 💻 **Felipe Gonzaga** - Frontend Developer
- 🔧 **Thaynara Ribeiro** - Full Stack Developer
- 🚀 **Eliseu Junior** - Full Stack Developer
- 💼 **Larissa Oliveira** - Product Manager
- 🎨 **Najla Cardeal** - QA & Designer

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT para autenticação
- Bcrypt para criptografia
- PDFKit e ExcelJS para relatórios

### Frontend
- React 18
- Redux Toolkit
- React Router v6
- TailwindCSS
- Recharts
- Lucide Icons

tudogestao-plus/
│
├── 📁 backend/
│   ├── 📄 .env.example                          # 👨‍💻 Michael Santos - Tech Lead
│   ├── 📄 .gitignore                            # 👨‍💻 Michael Santos - Tech Lead
│   ├── 📄 package.json                          # 👨‍💻 Michael Santos - Tech Lead
│   ├── 📄 server.js                             # 👨‍💻 Michael Santos - Tech Lead
│   │
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma                     # 👨‍💻 Michael Santos - Tech Lead
│   │   └── 📁 migrations/                       # Gerado automaticamente pelo Prisma
│   │
│   ├── 📁 config/
│   │   └── 📄 database.js                       # 👨‍💻 Michael Santos - Tech Lead
│   │
│   ├── 📁 middleware/
│   │   ├── 📄 auth.middleware.js                # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 error.middleware.js               # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 permission.middleware.js          # ⚙️ Rubens Neto - Backend Developer
│   │   └── 📄 validation.middleware.js          # ⚙️ Rubens Neto - Backend Developer
│   │
│   ├── 📁 controllers/
│   │   ├── 📄 auth.controller.js                # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 customer.controller.js            # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 product.controller.js             # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 sale.controller.js                # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 financial.controller.js           # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 dashboard.controller.js           # 💼 Larissa Oliveira - Product Manager
│   │   │                                         # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 report.controller.js              # 💼 Larissa Oliveira - Product Manager
│   │   │                                         # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 supplier.controller.js            # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 category.controller.js            # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 employee.controller.js            # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 nfe.controller.js                 # 🚀 Eliseu Junior - Full Stack
│   │   ├── 📄 user.controller.js                # ⚙️ Rubens Neto - Backend Developer
│   │   └── 📄 company.controller.js             # ⚙️ Rubens Neto - Backend Developer
│   │
│   ├── 📁 routes/
│   │   ├── 📄 auth.routes.js                    # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 customer.routes.js                # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 supplier.routes.js                # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 product.routes.js                 # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 sale.routes.js                    # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 financial.routes.js               # 💼 Larissa Oliveira - Product Manager
│   │   │                                         # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 dashboard.routes.js               # 💼 Larissa Oliveira - Product Manager
│   │   ├── 📄 report.routes.js                  # 💼 Larissa Oliveira - Product Manager
│   │   ├── 📄 category.routes.js                # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 employee.routes.js                # 🔧 Thaynara Ribeiro - Full Stack
│   │   ├── 📄 nfe.routes.js                     # 🚀 Eliseu Junior - Full Stack
│   │   ├── 📄 user.routes.js                    # ⚙️ Rubens Neto - Backend Developer
│   │   └── 📄 company.routes.js                 # ⚙️ Rubens Neto - Backend Developer
│   │
│   ├── 📁 services/
│   │   ├── 📄 audit.service.js                  # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 pdf.service.js                    # 💼 Larissa Oliveira - Product Manager
│   │   │                                         # ⚙️ Rubens Neto - Backend Developer
│   │   ├── 📄 excel.service.js                  # 💼 Larissa Oliveira - Product Manager
│   │   ├── 📄 nfe.service.js                    # 🚀 Eliseu Junior - Full Stack
│   │   └── 📁 security/
│   │       ├── 📄 license.js                    # 👨‍💻 Michael Santos - Tech Lead
│   │       └── 📄 encryption.js                 # 👨‍💻 Michael Santos - Tech Lead
│   │
│   ├── 📁 scripts/
│   │   ├── 📄 setup-database.js                 # 👨‍💻 Michael Santos - Tech Lead
│   │   ├── 📄 seed-demo-data.js                 # 👨‍💻 Michael Santos - Tech Lead
│   │   │                                         # 💼 Larissa Oliveira - Product Manager
│   │   └── 📄 backup-scheduler.js               # 👨‍💻 Michael Santos - Tech Lead
│   │
│   └── 📁 uploads/                               # Arquivos enviados (gerado em runtime)
│
├── 📁 frontend/
│   ├── 📄 .env.example                          # 💻 Felipe Gonzaga - Frontend Developer
│   ├── 📄 .gitignore                            # 💻 Felipe Gonzaga - Frontend Developer
│   ├── 📄 package.json                          # 💻 Felipe Gonzaga - Frontend Developer
│   ├── 📄 index.html                            # 💻 Felipe Gonzaga - Frontend Developer
│   ├── 📄 vite.config.js                        # 💻 Felipe Gonzaga - Frontend Developer
│   ├── 📄 tailwind.config.js                    # 🎨 Najla Cardeal - QA/Designer
│   ├── 📄 postcss.config.js                     # 🎨 Najla Cardeal - QA/Designer
│   │
│   ├── 📁 public/
│   │   ├── 📄 favicon.ico                       # 🎨 Najla Cardeal - QA/Designer
│   │   └── 📁 images/                           # 🎨 Najla Cardeal - QA/Designer
│   │
│   └── 📁 src/
│       ├── 📄 index.jsx                         # 💻 Felipe Gonzaga - Frontend Developer
│       ├── 📄 App.jsx                           # 💻 Felipe Gonzaga - Frontend Developer
│       │
│       ├── 📁 styles/
│       │   ├── 📄 globals.css                   # 🎨 Najla Cardeal - QA/Designer
│       │   └── 📄 apple-theme.css               # 🎨 Najla Cardeal - QA/Designer
│       │
│       ├── 📁 store/
│       │   ├── 📄 store.js                      # 💻 Felipe Gonzaga - Frontend Developer
│       │   └── 📁 slices/
│       │       ├── 📄 authSlice.js              # 💻 Felipe Gonzaga - Frontend Developer
│       │       ├── 📄 customerSlice.js          # 💻 Felipe Gonzaga - Frontend Developer
│       │       ├── 📄 productSlice.js           # 💻 Felipe Gonzaga - Frontend Developer
│       │       ├── 📄 saleSlice.js              # 💻 Felipe Gonzaga - Frontend Developer
│       │       ├── 📄 financialSlice.js         # 💻 Felipe Gonzaga - Frontend Developer
│       │       └── 📄 dashboardSlice.js         # 💻 Felipe Gonzaga - Frontend Developer
│       │                                         # 💼 Larissa Oliveira - Product Manager
│       │
│       ├── 📁 services/
│       │   └── 📄 api.js                        # 💻 Felipe Gonzaga - Frontend Developer
│       │
│       ├── 📁 utils/
│       │   ├── 📄 currency.js                   # 💻 Felipe Gonzaga - Frontend Developer
│       │   ├── 📄 date.js                       # 💻 Felipe Gonzaga - Frontend Developer
│       │   └── 📄 validators.js                 # 💻 Felipe Gonzaga - Frontend Developer
│       │
│       ├── 📁 hooks/
│       │   ├── 📄 useAuth.js                    # 💻 Felipe Gonzaga - Frontend Developer
│       │   ├── 📄 useToast.js                   # 💻 Felipe Gonzaga - Frontend Developer
│       │   ├── 📄 useDebounce.js                # 💻 Felipe Gonzaga - Frontend Developer
│       │   └── 📄 usePagination.js              # 💻 Felipe Gonzaga - Frontend Developer
│       │
│       ├── 📁 components/
│       │   ├── 📁 UI/
│       │   │   ├── 📁 Common/
│       │   │   │   ├── 📄 Button.jsx            # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Card.jsx              # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Modal.jsx             # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Loading.jsx           # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Toast.jsx             # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Table.jsx             # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Input.jsx             # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Select.jsx            # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Badge.jsx             # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 Pagination.jsx        # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   ├── 📄 SearchBar.jsx         # 🎨 Najla Cardeal - QA/Designer
│       │   │   │   │                             # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │   └── 📄 EmptyState.jsx        # 🎨 Najla Cardeal - QA/Designer
│       │   │   │                                 # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   │
│       │   │   └── 📁 Layout/
│       │   │       ├── 📄 MainLayout.jsx        # 💻 Felipe Gonzaga - Frontend Developer
│       │   │       │                             # 🎨 Najla Cardeal - QA/Designer
│       │   │       ├── 📄 Sidebar.jsx           # 💻 Felipe Gonzaga - Frontend Developer
│       │   │       │                             # 🎨 Najla Cardeal - QA/Designer
│       │   │       ├── 📄 Header.jsx            # 💻 Felipe Gonzaga - Frontend Developer
│       │   │       │                             # 🎨 Najla Cardeal - QA/Designer
│       │   │       └── 📄 AuthLayout.jsx        # 💻 Felipe Gonzaga - Frontend Developer
│       │   │                                     # 🎨 Najla Cardeal - QA/Designer
│       │   │
│       │   ├── 📁 Auth/
│       │   │   └── 📄 PrivateRoute.jsx          # 💻 Felipe Gonzaga - Frontend Developer
│       │   │
│       │   ├── 📁 Customers/
│       │   │   ├── 📄 CustomerForm.jsx          # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   └── 📄 CustomerDetails.jsx       # 💻 Felipe Gonzaga - Frontend Developer
│       │   │
│       │   ├── 📁 Suppliers/
│       │   │   ├── 📄 SupplierForm.jsx          # 🔧 Thaynara Ribeiro - Full Stack
│       │   │   └── 📄 SupplierDetails.jsx       # 🔧 Thaynara Ribeiro - Full Stack
│       │   │
│       │   ├── 📁 Products/
│       │   │   ├── 📄 ProductForm.jsx           # 🔧 Thaynara Ribeiro - Full Stack
│       │   │   ├── 📄 ProductDetails.jsx        # 🔧 Thaynara Ribeiro - Full Stack
│       │   │   └── 📄 StockAdjustment.jsx       # 🔧 Thaynara Ribeiro - Full Stack
│       │   │
│       │   ├── 📁 Sales/
│       │   │   ├── 📄 SaleForm.jsx              # ⚙️ Rubens Neto - Backend Developer
│       │   │   │                                 # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   ├── 📄 SaleDetails.jsx           # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   └── 📄 PDV.jsx                   # 🚀 Eliseu Junior - Full Stack
│       │   │
│       │   ├── 📁 Financial/
│       │   │   ├── 📄 PayableForm.jsx           # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   ├── 📄 ReceivableForm.jsx        # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   ├── 📄 TransactionForm.jsx       # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   └── 📄 CashFlowChart.jsx         # 💼 Larissa Oliveira - Product Manager
│       │   │                                     # 💻 Felipe Gonzaga - Frontend Developer
│       │   │
│       │   ├── 📁 Reports/
│       │   │   ├── 📄 DREReport.jsx             # 💼 Larissa Oliveira - Product Manager
│       │   │   │                                 # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   ├── 📄 SalesReport.jsx           # 💼 Larissa Oliveira - Product Manager
│       │   │   │                                 # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   ├── 📄 StockReport.jsx           # 💻 Felipe Gonzaga - Frontend Developer
│       │   │   └── 📄 CustomerReport.jsx        # 💻 Felipe Gonzaga - Frontend Developer
│       │   │
│       │   └── 📁 NFe/
│       │       ├── 📄 NFeList.jsx               # 🚀 Eliseu Junior - Full Stack
│       │       └── 📄 NFeDetails.jsx            # 🚀 Eliseu Junior - Full Stack
│       │
│       └── 📁 pages/
│           ├── 📁 Auth/
│           │   ├── 📄 LoginPage.jsx             # 💻 Felipe Gonzaga - Frontend Developer
│           │   │                                 # 🎨 Najla Cardeal - QA/Designer
│           │   └── 📄 RegisterPage.jsx          # 💻 Felipe Gonzaga - Frontend Developer
│           │                                     # 🎨 Najla Cardeal - QA/Designer
│           │
│           ├── 📁 Dashboard/
│           │   └── 📄 DashboardPage.jsx         # 💻 Felipe Gonzaga - Frontend Developer
│           │                                     # 💼 Larissa Oliveira - Product Manager
│           │                                     # 🎨 Najla Cardeal - QA/Designer
│           │
│           ├── 📁 Customers/
│           │   └── 📄 CustomersPage.jsx         # 💻 Felipe Gonzaga - Frontend Developer
│           │                                     # 🔧 Thaynara Ribeiro - Full Stack
│           │
│           ├── 📁 Suppliers/
│           │   └── 📄 SuppliersPage.jsx         # 🔧 Thaynara Ribeiro - Full Stack
│           │
│           ├── 📁 Products/
│           │   └── 📄 ProductsPage.jsx          # 🔧 Thaynara Ribeiro - Full Stack
│           │
│           ├── 📁 Sales/
│           │   └── 📄 SalesPage.jsx             # 💻 Felipe Gonzaga - Frontend Developer
│           │                                     # ⚙️ Rubens Neto - Backend Developer
│           │
│           ├── 📁 Financial/
│           │   └── 📄 FinancialPage.jsx         # 💻 Felipe Gonzaga - Frontend Developer
│           │                                     # 💼 Larissa Oliveira - Product Manager
│           │
│           ├── 📁 Reports/
│           │   └── 📄 ReportsPage.jsx           # 💼 Larissa Oliveira - Product Manager
│           │                                     # 💻 Felipe Gonzaga - Frontend Developer
│           │
│           └── 📁 Settings/
│               └── 📄 SettingsPage.jsx          # 💻 Felipe Gonzaga - Frontend Developer
│
├── 📁 docs/
│   ├── 📄 ARCHITECTURE.md                       # 👨‍💻 Michael Santos - Tech Lead
│   ├── 📄 API_DOCUMENTATION.md                  # ⚙️ Rubens Neto - Backend Developer
│   ├── 📄 DATABASE_SCHEMA.md                    # 👨‍💻 Michael Santos - Tech Lead
│   ├── 📄 DEPLOYMENT.md                         # 👨‍💻 Michael Santos - Tech Lead
│   ├── 📄 USER_MANUAL.md                        # 💼 Larissa Oliveira - Product Manager
│   └── 📄 DEVELOPMENT_GUIDE.md                  # 👨‍💻 Michael Santos - Tech Lead
│
├── 📄 README.md                                 # 👨‍💻 Michael Santos - Tech Lead
├── 📄 LICENSE                                   # 👨‍💻 Michael Santos - Tech Lead
└── 📄 .gitignore                                # 👨‍💻 Michael Santos - Tech Lead

## ✨ Funcionalidades

- 📊 Dashboard interativo com gráficos
- 👥 Gestão de clientes e fornecedores
- 📦 Controle de estoque e produtos
- 💰 Sistema financeiro completo
- 🛒 PDV (Ponto de Venda)
- 📄 Emissão de Nota Fiscal Eletrônica (NFe)
- 📈 Relatórios gerenciais
- 👨‍💼 Gestão de funcionários e folha de pagamento
- 🔒 Sistema de licenciamento e proteção
- 📱 Design responsivo

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/tudogestao.git
cd tudogestao
```

2. Configure o Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npm run db:setup
npm run db:seed
```

3. Configure o Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

4. Inicie o sistema
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📝 Licença

Este projeto é proprietário e requer licença para uso comercial.

## 📧 Contato

Para dúvidas e suporte: suporte@tudogestao.com.br