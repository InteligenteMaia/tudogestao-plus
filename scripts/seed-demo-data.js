// 👨‍💻 Michael Santos - Tech Lead
// 💼 Larissa Oliveira - Product Manager
// Script para popular banco com dados de demonstração

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed de dados de demonstração...\n');

  try {
    // Cria empresa de demonstração
    console.log('🏢 Criando empresa...');
    const company = await prisma.company.create({
      data: {
        cnpj: '12.345.678/0001-90',
        name: 'Empresa Demonstração Ltda',
        tradeName: 'Demo Store',
        email: 'contato@demostore.com',
        phone: '(11) 3456-7890',
        fiscalRegime: 'Simples Nacional',
        active: true
      }
    });
    console.log('✅ Empresa criada:', company.name);

    // Cria usuário admin
    console.log('\n👤 Criando usuário admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        companyId: company.id,
        name: 'Administrador',
        email: 'admin@demostore.com',
        password: hashedPassword,
        role: 'ADMIN',
        active: true
      }
    });
    console.log('✅ Usuário admin criado');
    console.log('   Email: admin@demostore.com');
    console.log('   Senha: admin123');

    // Cria usuário vendedor
    const seller = await prisma.user.create({
      data: {
        companyId: company.id,
        name: 'Vendedor Demo',
        email: 'vendedor@demostore.com',
        password: hashedPassword,
        role: 'SALESPERSON',
        active: true
      }
    });
    console.log('✅ Usuário vendedor criado');

    // Cria categorias
    console.log('\n📁 Criando categorias...');
    const categories = await prisma.category.createMany({
      data: [
        { companyId: company.id, name: 'Vendas', type: 'INCOME', color: '#34C759' },
        { companyId: company.id, name: 'Serviços', type: 'INCOME', color: '#0071E3' },
        { companyId: company.id, name: 'Outras Receitas', type: 'INCOME', color: '#5AC8FA' },
        { companyId: company.id, name: 'Fornecedores', type: 'EXPENSE', color: '#FF3B30' },
        { companyId: company.id, name: 'Salários', type: 'EXPENSE', color: '#FF9500' },
        { companyId: company.id, name: 'Impostos', type: 'EXPENSE', color: '#AF52DE' },
        { companyId: company.id, name: 'Aluguel', type: 'EXPENSE', color: '#FF2D55' },
        { companyId: company.id, name: 'Eletrônicos', type: 'PRODUCT', color: '#0071E3' },
        { companyId: company.id, name: 'Alimentos', type: 'PRODUCT', color: '#34C759' },
        { companyId: company.id, name: 'Vestuário', type: 'PRODUCT', color: '#FF9500' },
      ]
    });
    console.log(`✅ ${categories.count} categorias criadas`);

    // Busca IDs das categorias
    const allCategories = await prisma.category.findMany({
      where: { companyId: company.id }
    });
    const productCategory = allCategories.find(c => c.name === 'Eletrônicos');

    // Cria fornecedores
    console.log('\n🏭 Criando fornecedores...');
    const suppliers = await prisma.supplier.createMany({
      data: [
        {
          companyId: company.id,
          cnpj: '11.222.333/0001-44',
          name: 'Fornecedor Tech Ltda',
          email: 'contato@fornecedortech.com',
          phone: '(11) 9999-8888',
          active: true
        },
        {
          companyId: company.id,
          cnpj: '22.333.444/0001-55',
          name: 'Distribuidora Global',
          email: 'vendas@global.com',
          phone: '(11) 8888-7777',
          active: true
        }
      ]
    });
    console.log(`✅ ${suppliers.count} fornecedores criados`);

    // Cria clientes
    console.log('\n👥 Criando clientes...');
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          companyId: company.id,
          type: 'INDIVIDUAL',
          cpfCnpj: '123.456.789-00',
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '(11) 98765-4321',
          active: true
        }
      }),
      prisma.customer.create({
        data: {
          companyId: company.id,
          type: 'INDIVIDUAL',
          cpfCnpj: '987.654.321-00',
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '(11) 91234-5678',
          active: true
        }
      }),
      prisma.customer.create({
        data: {
          companyId: company.id,
          type: 'COMPANY',
          cpfCnpj: '33.444.555/0001-66',
          name: 'Empresa Cliente Ltda',
          email: 'contato@empresacliente.com',
          phone: '(11) 3333-4444',
          active: true
        }
      })
    ]);
    console.log(`✅ ${customers.length} clientes criados`);

    // Cria produtos
    console.log('\n📦 Criando produtos...');
    const products = await Promise.all([
      prisma.product.create({
        data: {
          companyId: company.id,
          categoryId: productCategory?.id,
          sku: 'PROD-001',
          name: 'Mouse Sem Fio',
          description: 'Mouse ergonômico sem fio 2.4GHz',
          unitPrice: 89.90,
          costPrice: 45.00,
          stock: 50,
          minStock: 10,
          active: true
        }
      }),
      prisma.product.create({
        data: {
          companyId: company.id,
          categoryId: productCategory?.id,
          sku: 'PROD-002',
          name: 'Teclado Mecânico',
          description: 'Teclado mecânico RGB',
          unitPrice: 299.90,
          costPrice: 150.00,
          stock: 30,
          minStock: 5,
          active: true
        }
      }),
      prisma.product.create({
        data: {
          companyId: company.id,
          categoryId: productCategory?.id,
          sku: 'PROD-003',
          name: 'Webcam HD',
          description: 'Webcam Full HD 1080p',
          unitPrice: 199.90,
          costPrice: 100.00,
          stock: 8,
          minStock: 10,
          active: true
        }
      }),
      prisma.product.create({
        data: {
          companyId: company.id,
          categoryId: productCategory?.id,
          sku: 'PROD-004',
          name: 'Headset Gamer',
          description: 'Headset com som surround 7.1',
          unitPrice: 349.90,
          costPrice: 180.00,
          stock: 25,
          minStock: 8,
          active: true
        }
      }),
      prisma.product.create({
        data: {
          companyId: company.id,
          categoryId: productCategory?.id,
          sku: 'PROD-005',
          name: 'Monitor 24"',
          description: 'Monitor LED 24 polegadas Full HD',
          unitPrice: 799.90,
          costPrice: 400.00,
          stock: 15,
          minStock: 5,
          active: true
        }
      })
    ]);
    console.log(`✅ ${products.length} produtos criados`);

    // Cria conta bancária
    console.log('\n🏦 Criando conta bancária...');
    const bankAccount = await prisma.bankAccount.create({
      data: {
        companyId: company.id,
        bankName: 'Banco Demo',
        agency: '1234',
        account: '12345-6',
        accountType: 'Corrente',
        initialBalance: 10000.00,
        currentBalance: 10000.00,
        active: true
      }
    });
    console.log('✅ Conta bancária criada');

    // Cria vendas de exemplo
    console.log('\n🛒 Criando vendas de exemplo...');
    const sale1 = await prisma.sale.create({
      data: {
        companyId: company.id,
        customerId: customers[0].id,
        userId: seller.id,
        saleNumber: 'VD000001',
        totalAmount: 389.80,
        discount: 0,
        netAmount: 389.80,
        status: 'PAID',
        paymentMethod: 'CARTAO_CREDITO',
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              unitPrice: 89.90,
              total: 179.80
            },
            {
              productId: products[2].id,
              quantity: 1,
              unitPrice: 199.90,
              total: 199.90
            }
          ]
        }
      }
    });

    const sale2 = await prisma.sale.create({
      data: {
        companyId: company.id,
        customerId: customers[1].id,
        userId: seller.id,
        saleNumber: 'VD000002',
        totalAmount: 1149.80,
        discount: 50.00,
        netAmount: 1099.80,
        status: 'PENDING',
        paymentMethod: 'BOLETO',
        items: {
          create: [
            {
              productId: products[1].id,
              quantity: 1,
              unitPrice: 299.90,
              total: 299.90
            },
            {
              productId: products[4].id,
              quantity: 1,
              unitPrice: 799.90,
              total: 799.90
            }
          ]
        }
      }
    });
    console.log('✅ Vendas criadas');

    // Cria transações
    console.log('\n💰 Criando transações...');
    const incomeCategory = allCategories.find(c => c.name === 'Vendas');
    const expenseCategory = allCategories.find(c => c.name === 'Fornecedores');

    await prisma.transaction.createMany({
      data: [
        {
          companyId: company.id,
          bankAccountId: bankAccount.id,
          categoryId: incomeCategory?.id,
          type: 'INCOME',
          description: 'Venda #VD000001',
          amount: 389.80,
          date: new Date(),
          paymentMethod: 'CARTAO_CREDITO'
        },
        {
          companyId: company.id,
          bankAccountId: bankAccount.id,
          categoryId: expenseCategory?.id,
          type: 'EXPENSE',
          description: 'Compra de mercadorias',
          amount: 1500.00,
          date: new Date(),
          paymentMethod: 'TRANSFERENCIA'
        }
      ]
    });
    console.log('✅ Transações criadas');

    // Cria contas a receber
    console.log('\n📥 Criando contas a receber...');
    await prisma.accountReceivable.createMany({
      data: [
        {
          companyId: company.id,
          customerId: customers[1].id,
          saleId: sale2.id,
          description: 'Venda #VD000002 - Parcela 1/2',
          amount: 549.90,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'PENDING'
        },
        {
          companyId: company.id,
          customerId: customers[1].id,
          saleId: sale2.id,
          description: 'Venda #VD000002 - Parcela 2/2',
          amount: 549.90,
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          status: 'PENDING'
        }
      ]
    });
    console.log('✅ Contas a receber criadas');

    // Cria contas a pagar
    console.log('\n📤 Criando contas a pagar...');
    await prisma.accountPayable.createMany({
      data: [
        {
          companyId: company.id,
          description: 'Aluguel - Janeiro/2025',
          amount: 2500.00,
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          status: 'PENDING'
        },
        {
          companyId: company.id,
          description: 'Energia elétrica',
          amount: 450.00,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: 'PENDING'
        }
      ]
    });
    console.log('✅ Contas a pagar criadas');

    console.log('\n✅ =======================================');
    console.log('✅ Seed concluído com sucesso!');
    console.log('✅ =======================================\n');
    console.log('📊 Dados criados:');
    console.log(`   - 1 Empresa`);
    console.log(`   - 2 Usuários`);
    console.log(`   - 10 Categorias`);
    console.log(`   - 2 Fornecedores`);
    console.log(`   - 3 Clientes`);
    console.log(`   - 5 Produtos`);
    console.log(`   - 1 Conta Bancária`);
    console.log(`   - 2 Vendas`);
    console.log(`   - 2 Transações`);
    console.log(`   - 2 Contas a Receber`);
    console.log(`   - 2 Contas a Pagar\n`);
    console.log('🔐 Credenciais:');
    console.log('   Admin: admin@demostore.com / admin123');
    console.log('   Vendedor: vendedor@demostore.com / admin123\n');

  } catch (error) {
    console.error('\n❌ Erro durante o seed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();