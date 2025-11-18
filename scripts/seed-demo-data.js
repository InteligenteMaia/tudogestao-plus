const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes
    console.log('🗑️  Limpando dados existentes...');
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.accountReceivable.deleteMany();
    await prisma.accountPayable.deleteMany();
    await prisma.financialTransaction.deleteMany();
    await prisma.product.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();

    const hashedPassword = await bcrypt.hash('123456', 10);

    console.log('🏢 Criando empresa...');
    const company = await prisma.company.create({
      data: {
        name: 'Demo Store Ltda',
        tradeName: 'Demo Store',
        cnpj: '12.345.678/0001-90',
        email: 'contato@demostore.com',
        phone: '(11) 98765-4321',
        address: { street: 'Av. Paulista', number: '1000', city: 'São Paulo', state: 'SP', zipCode: '01310-100' },
        active: true
      }
    });

    console.log('👤 Criando usuários...');
    const adminUser = await prisma.user.create({
      data: { name: 'Admin Demo', email: 'admin@demostore.com', password: hashedPassword, role: 'ADMIN', companyId: company.id, active: true }
    });

    await prisma.user.create({
      data: { name: 'Gerente Demo', email: 'gerente@demostore.com', password: hashedPassword, role: 'MANAGER', companyId: company.id, active: true }
    });

    console.log('📦 Criando categorias...');
    const categories = await Promise.all([
      prisma.category.create({ data: { name: 'Eletrônicos', description: 'Produtos eletrônicos' } }),
      prisma.category.create({ data: { name: 'Alimentos', description: 'Alimentos e bebidas' } }),
      prisma.category.create({ data: { name: 'Vestuário', description: 'Roupas e acessórios' } })
    ]);

    console.log('🏭 Criando fornecedores...');
    const suppliers = await Promise.all([
      prisma.supplier.create({
        data: { companyId: company.id, cpfCnpj: '11.222.333/0001-44', name: 'Tech Distribuidora', email: 'tech@dist.com', phone: '(11) 3333-4444', address: {}, active: true }
      }),
      prisma.supplier.create({
        data: { companyId: company.id, cpfCnpj: '22.333.444/0001-55', name: 'Alimentos Brasil', email: 'ali@brasil.com', phone: '(11) 5555-6666', address: {}, active: true }
      })
    ]);

    console.log('📱 Criando produtos...');
    const products = await Promise.all([
      prisma.product.create({
        data: { companyId: company.id, categoryId: categories[0].id, supplierId: suppliers[0].id, code: 'PROD-001', name: 'Notebook Dell', costPrice: 2500, salePrice: 3500, stock: 10, minStock: 3, active: true }
      }),
      prisma.product.create({
        data: { companyId: company.id, categoryId: categories[0].id, supplierId: suppliers[0].id, code: 'PROD-002', name: 'Mouse Logitech', costPrice: 250, salePrice: 399, stock: 25, minStock: 5, active: true }
      })
    ]);

    console.log('👥 Criando clientes...');
    const customers = await Promise.all([
      prisma.customer.create({
        data: { companyId: company.id, type: 'INDIVIDUAL', cpfCnpj: '123.456.789-00', name: 'João Silva', email: 'joao@email.com', phone: '(11) 91111-2222', address: {}, active: true }
      }),
      prisma.customer.create({
        data: { companyId: company.id, type: 'COMPANY', cpfCnpj: '44.555.666/0001-77', name: 'Empresa XYZ', email: 'xyz@empresa.com', phone: '(11) 95555-6666', address: {}, active: true }
      })
    ]);

    console.log('✅ Seed concluído!');
    console.log('\n📊 Resumo:');
    console.log(`  Email: admin@demostore.com`);
    console.log(`  Senha: 123456`);

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
