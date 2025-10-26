// 👨‍💻 Michael Santos - Tech Lead
// Script de configuração inicial do banco de dados

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 =======================================');
  console.log('🏢 TudoGestão+ - Setup do Banco de Dados');
  console.log('🚀 =======================================\n');

  try {
    // Verifica conexão
    console.log('📡 Testando conexão com o banco...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Executa migrations
    console.log('📦 Executando migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations executadas com sucesso!\n');

    // Gera Prisma Client
    console.log('🔧 Gerando Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client gerado com sucesso!\n');

    // Pergunta se quer popular com dados de exemplo
    const seedData = await question('❓ Deseja popular o banco com dados de exemplo? (s/n): ');
    
    if (seedData.toLowerCase() === 's') {
      console.log('\n📝 Populando banco de dados...');
      execSync('node scripts/seed-demo-data.js', { stdio: 'inherit' });
    }

    console.log('\n✅ =======================================');
    console.log('✅ Setup concluído com sucesso!');
    console.log('✅ =======================================\n');
    console.log('🎉 Você já pode iniciar o sistema com: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Erro durante o setup:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

setup();    