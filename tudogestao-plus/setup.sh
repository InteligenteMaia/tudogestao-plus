#!/bin/bash

# TudoGestão+ - Script de Setup Automatizado
# Este script configura o ambiente de desenvolvimento

echo "🚀 TudoGestão+ - Setup Automatizado"
echo "===================================="
echo ""

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js >= 18.0.0"
    echo "   Download: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION encontrado"
echo ""

# Verificar npm
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION encontrado"
echo ""

# Instalar dependências
echo "📥 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso"
echo ""

# Criar arquivo .env
echo "⚙️  Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Arquivo .env criado"
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais:"
    echo "   - SMTP_USER: Seu email"
    echo "   - SMTP_PASS: Senha de app do Gmail"
    echo "   - GITHUB_TOKEN: Token do GitHub"
    echo ""
else
    echo "ℹ️  Arquivo .env já existe"
    echo ""
fi

# Criar diretórios necessários
echo "📁 Criando diretórios necessários..."
mkdir -p temp/reports temp/abnt
echo "✅ Diretórios criados"
echo ""

# Verificar configurações
echo "🔍 Verificando configurações..."
if grep -q "seu-email@gmail.com" .env; then
    echo "⚠️  ATENÇÃO: Configure suas credenciais no arquivo .env"
fi
echo ""

echo "✅ Setup concluído com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Edite o arquivo .env com suas credenciais"
echo "   2. Execute: npm start"
echo "   3. Acesse: http://localhost:3000"
echo ""
echo "📚 Documentação: docs/QUICK-START.md"
echo "🆘 Suporte: GitHub Issues"
echo ""
echo "Bom uso! 🎉"
