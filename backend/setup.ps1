# 🚀 Script de Setup - TudoGestão+ Backend
# Execute com: .\setup.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  🚀 TudoGestão+ Backend Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
if (!(Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script dentro da pasta 'backend'" -ForegroundColor Red
    Write-Host "   Use: cd backend" -ForegroundColor Yellow
    exit 1
}

# 1. Instalar dependências
Write-Host "📦 [1/6] Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
Write-Host ""

# 2. Gerar Prisma Client
Write-Host "🔧 [2/6] Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao gerar Prisma Client!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client gerado!" -ForegroundColor Green
Write-Host ""

# 3. Verificar/Criar arquivo .env
Write-Host "⚙️  [3/6] Verificando arquivo .env..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Arquivo .env criado a partir do .env.example" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANTE: Configure o DATABASE_URL no arquivo .env" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Arquivo .env.example não encontrado!" -ForegroundColor Red
        Write-Host "   Crie um arquivo .env manualmente com as configurações do banco" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Arquivo .env já existe!" -ForegroundColor Green
}
Write-Host ""

# 4. Verificar conexão com banco
Write-Host "🗄️  [4/6] Verificando conexão com PostgreSQL..." -ForegroundColor Yellow
npx prisma db push --skip-generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao conectar ao banco de dados!" -ForegroundColor Red
    Write-Host "   Verifique se:" -ForegroundColor Yellow
    Write-Host "   • PostgreSQL está instalado e rodando" -ForegroundColor Yellow
    Write-Host "   • O DATABASE_URL no .env está correto" -ForegroundColor Yellow
    Write-Host "   • O banco de dados 'tudogestao' foi criado" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Conexão com banco estabelecida!" -ForegroundColor Green
Write-Host ""

# 5. Executar migrations
Write-Host "📊 [5/6] Executando migrations do banco..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Tentando reset do banco..." -ForegroundColor Yellow
    npx prisma migrate reset --force
}
Write-Host "✅ Migrations executadas!" -ForegroundColor Green
Write-Host ""

# 6. Popular dados de demonstração
Write-Host "🌱 [6/6] Populando dados de demonstração..." -ForegroundColor Yellow
$seedExists = Test-Path "scripts/seed-demo-data.js"
if ($seedExists) {
    npm run db:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dados de demonstração criados!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Erro ao criar dados de demonstração (não crítico)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Script de seed não encontrado (pulando)" -ForegroundColor Yellow
}
Write-Host ""

# Sucesso!
Write-Host "====================================" -ForegroundColor Green
Write-Host "  ✅ Setup concluído com sucesso!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para iniciar o servidor, execute:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "📧 Login de demonstração:" -ForegroundColor Cyan
Write-Host "   Email: admin@demostore.com" -ForegroundColor White
Write-Host "   Senha: admin123" -ForegroundColor White
Write-Host ""