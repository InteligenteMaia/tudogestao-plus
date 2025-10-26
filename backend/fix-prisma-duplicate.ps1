# Script para corrigir declaração duplicada do PrismaClient
# Execute na pasta backend: .\fix-prisma-duplicate.ps1

Write-Host "🔧 Corrigindo declaração duplicada do PrismaClient..." -ForegroundColor Yellow
Write-Host ""

# Verificar se está na pasta backend
if (!(Test-Path "controllers\dashboard.controller.js")) {
    Write-Host "❌ Erro: Execute na pasta 'backend'" -ForegroundColor Red
    exit 1
}

# Fazer backup
Write-Host "📦 Fazendo backup do arquivo..." -ForegroundColor Cyan
$backupPath = "controllers\dashboard.controller.js.backup"
Copy-Item "controllers\dashboard.controller.js" $backupPath -Force
Write-Host "✅ Backup salvo: $backupPath" -ForegroundColor Green
Write-Host ""

# Ler o arquivo
Write-Host "📖 Lendo arquivo..." -ForegroundColor Cyan
$content = Get-Content "controllers\dashboard.controller.js" -Raw

# Contar quantas vezes PrismaClient aparece
$count = ([regex]::Matches($content, "const \{ PrismaClient \} = require\('@prisma/client'\);")).Count
Write-Host "📊 Encontradas $count declarações de PrismaClient" -ForegroundColor Yellow
Write-Host ""

if ($count -le 1) {
    Write-Host "✅ Arquivo já está correto! (apenas 1 declaração)" -ForegroundColor Green
    exit 0
}

# Remover declarações duplicadas (manter apenas a primeira)
Write-Host "🔨 Removendo declarações duplicadas..." -ForegroundColor Cyan

# Dividir o conteúdo em linhas
$lines = $content -split "`n"
$newLines = @()
$foundFirst = $false

foreach ($line in $lines) {
    if ($line -match "const \{ PrismaClient \} = require\('@prisma/client'\);") {
        if (!$foundFirst) {
            # Primeira ocorrência - manter
            $newLines += $line
            $foundFirst = $true
            Write-Host "  ✅ Mantendo primeira declaração (linha $($newLines.Count))" -ForegroundColor Green
        } else {
            # Declarações adicionais - remover
            Write-Host "  ❌ Removendo declaração duplicada (linha $($newLines.Count + 1))" -ForegroundColor Red
            # Não adiciona a linha (pula)
        }
    } else {
        $newLines += $line
    }
}

# Salvar arquivo corrigido
$newContent = $newLines -join "`n"
Set-Content -Path "controllers\dashboard.controller.js" -Value $newContent -NoNewline

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Arquivo corrigido com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Resumo:" -ForegroundColor Cyan
Write-Host "  • Backup salvo em: $backupPath" -ForegroundColor White
Write-Host "  • Declarações duplicadas removidas" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Tente iniciar o servidor novamente:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""