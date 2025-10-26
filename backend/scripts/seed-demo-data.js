// 👨‍💻 Michael Santos - Tech Lead
// 💼 Larissa Oliveira - Product Manager
// Script de seed - Dados de demonstração

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed de dados de demonstração...\n');

  try {
    // Limpar dados existentes (cuidado em produção!)
    console.log('🧹 Limpando dados existentes...');
    await prisma.auditLog.deleteMany();
    await prisma.payroll.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.financialTransaction.deleteMany();
    await prisma.accountPayable.deleteMany();
    await prisma.accountReceivable.deleteMany();
    await prisma.nFe.deleteMany();
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    console.log('✅ Dados limpos!\n');

    // Criar empresa de demonstração
    console.log('🏢 Criando empresa...');
    const company = await prisma.company.create({
      data: {
        cnpj: '12.345.678/0001-90',
        name: 'Empresa Demonstração Ltda',
        tradeName: 'Demo Store',
        email: 'contato@demostore.com',
        phone: '(11) 3456-7890',
        ie: '123.456.789.012',
        im: '12345678',
        address: {
          zipCode: '01310-100',
          street: 'Avenida Paulista',
          number: '1578',
          complement: 'Conjunto 501',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
        },
        active: true,
        licenseKey: 'TUDO-GESTAO-2024-FULL-ACCESS-KEY',
        expiresAt: new Date('2025-12-31'),
      },
    });
    console.log('✅ Empresa criada!\n');

    // Criar usuário admin
    console.log('👤 Criando usuário admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        companyId: company.id,
        name: 'Administrador',
        email: 'admin@demostore.com',
        password: hashedPassword,
        role: 'ADMIN',
        active: true,
      },
    });
    console.log('✅ Usuário admin criado!\n');

    // Criar outros usuários
    console.log('👥 Criando outros usuários...');
    const managerUser = await prisma.user.create({
      data: {
        companyId: company.id,
        name: 'Gerente Silva',
        email: 'gerente@demostore.com',
        password: await bcrypt.hash('gerente123', 10),
        role: 'MANAGER',
        active: true,
      },
    });

    const salesUser = await prisma.user.create({
      data: {
        companyId: company.id,
        name: 'Vendedor João',
        email: 'vendedor@demostore.com',
        password: await bcrypt.hash('vendedor123', 10),
        role: 'SALESPERSON',
        active: true,
      },
    });
    console.log('✅ Usuários criados!\n');

    // Criar categorias
    console.log('📁 Criando categorias...');
    const categoryEletronicos = await prisma.category.create({
      data: {
        name: 'Eletrônicos',
        description: 'Produtos eletrônicos em geral',
        active: true,
      },
    });

    const categoryInformatica = await prisma.category.create({
      data: {
        name: 'Informática',
        description: 'Computadores, notebooks e acessórios',
        active: true,
      },
    });

    const categoryEscritorios = await prisma.category.create({
      data: {
        name: 'Escritório',
        description: 'Material de escritório e papelaria',
        active: true,
      },
    });
    console.log('✅ Categorias criadas!\n');

    // Criar fornecedores
    console.log('🏭 Criando fornecedores...');
    const supplier1 = await prisma.supplier.create({
      data: {
        companyId: company.id,
        cpfCnpj: '98.765.432/0001-10',
        name: 'Tech Distribuidora Ltda',
        tradeName: 'Tech Distribuidora',
        email: 'contato@techdist.com',
        phone: '(11) 3333-4444',
        address: {
          zipCode: '01310-200',
          street: 'Rua Augusta',
          number: '2000',
          neighborhood: 'Consolação',
          city: 'São Paulo',
          state: 'SP',
        },
        active: true,
      },
    });

    const supplier2 = await prisma.supplier.create({
      data: {
        companyId: company.id,
        cpfCnpj: '11.222.333/0001-44',
        name: 'Office Supply Co',
        tradeName: 'Office Supply',
        email: 'vendas@officesupply.com',
        phone: '(11) 4444-5555',
        address: {
          zipCode: '04551-001',
          street: 'Avenida Brigadeiro Faria Lima',
          number: '3000',
          neighborhood: 'Itaim Bibi',
          city: 'São Paulo',
          state: 'SP',
        },
        active: true,
      },
    });
    console.log('✅ Fornecedores criados!\n');

    // Criar produtos
    console.log('📦 Criando produtos...');
    const products = await Promise.all([
      prisma.product.create({
        data: {
          companyId: company.id,
          supplierId: supplier1.id,
          categoryId: categoryInformatica.id,
          code: 'PROD-001',
          barcode: '7891234567890',
          name: 'Mouse Sem Fio',
          description: 'Mouse óptico sem fio 2.4GHz',
          unit: 'UN',
          costPrice: 45.00,
          salePrice: 79.90,
          stock: 50,
          minStock: 10,
          maxStock: 200,
          ncm: '84716053',
          active: true,
        },
      }),
      prisma.product.create({
        data: {
          companyId: company.id,
          supplierId: supplier1.id,
          categoryId: categoryInformatica.id,
          code: 'PROD-002',
          barcode: '7891234567891',
          name: 'Teclado USB',
          description: 'Teclado ABNT2 com fio USB',
          unit: 'UN',
          costPrice: 35.00,
          salePrice: 59.90,
          stock: 30,
          minStock: 10,
          maxStock: 150,
          ncm: '84716053',
          active: true,
        },
      }),
      prisma.product.create({
        data: {
          companyId: company.id,
          supplierId: supplier1.id,
          categoryId: categoryEletronicos.id,
          code: 'PROD-003',
          barcode: '7891234567892',
          name: 'Webcam HD',
          description: 'Webcam Full HD 1080p com microfone',
          unit: 'UN',
          costPrice: 120.00,
          salePrice: 199.90,
          stock: 15,
          minStock: 5,
          maxStock: 50,
          ncm: '85258019',
          active: true,
        },
      }),
      prisma.product.create({
        data: {
          companyId: company.id,
          supplierId: supplier2.id,
          categoryId: categoryEscritorios.id,
          code: 'PROD-004',
          barcode: '7891234567893',
          name: 'Caderno Universitário',
          description: 'Caderno 10 matérias 200 folhas',
          unit: 'UN',
          costPrice: 12.00,
          salePrice: 24.90,
          stock: 100,
          minStock: 20,
          maxStock: 500,
          ncm: '48201030',
          active: true,
        },
      }),
      prisma.product.create({
        data: {
          companyId: company.id,
          supplierId: supplier2.id,
          categoryId: categoryEscritorios.id,
          code: 'PROD-005',
          barcode: '7891234567894',
          name: 'Caneta Esferográfica Azul',
          description: 'Caneta esferográfica azul caixa com 50 unidades',
          unit: 'CX',
          costPrice: 25.00,
          salePrice: 45.00,
          stock: 80,
          minStock: 15,
          maxStock: 300,
          ncm: '96081010',
          active: true,
        },
      }),
    ]);
    console.log(`✅ ${products.length} produtos criados!\n`);

    // Criar clientes
    console.log('👥 Criando clientes...');
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          companyId: company.id,
          type: 'INDIVIDUAL',
          cpfCnpj: '123.456.789-00',
          name: 'João da Silva',
          email: 'joao@email.com',
          phone: '(11) 98888-7777',
          address: {
            zipCode: '01310-100',
            street: 'Rua das Flores',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
          },
          active: true,
        },
      }),
      prisma.customer.create({
        data: {
          companyId: company.id,
          type: 'INDIVIDUAL',
          cpfCnpj: '987.654.321-00',
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '(11) 97777-6666',
          address: {
            zipCode: '04551-001',
            street: 'Avenida Paulista',
            number: '2000',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
          },
          active: true,
        },
      }),
      prisma.customer.create({
        data: {
          companyId: company.id,
          type: 'COMPANY',
          cpfCnpj: '55.666.777/0001-88',
          name: 'Empresa XYZ Ltda',
          tradeName: 'XYZ Comércio',
          email: 'contato@xyz.com',
          phone: '(11) 3333-2222',
          address: {
            zipCode: '01310-200',
            street: 'Rua Augusta',
            number: '1500',
            neighborhood: 'Consolação',
            city: 'São Paulo',
            state: 'SP',
          },
          active: true,
        },
      }),
    ]);
    console.log(`✅ ${customers.length} clientes criados!\n`);

    // Criar vendas
    console.log('🛒 Criando vendas de demonstração...');
    const sale1 = await prisma.sale.create({
      data: {
        companyId: company.id,
        customerId: customers[0].id,
        saleNumber: 'VND-001',
        date: new Date('2024-10-01'),
        totalAmount: 139.80,
        discount: 0,
        netAmount: 139.80,
        status: 'PAID',
        paymentMethod: 'CREDIT_CARD',
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              unitPrice: 79.90,
              total: 79.90,
            },
            {
              productId: products[1].id,
              quantity: 1,
              unitPrice: 59.90,
              total: 59.90,
            },
          ],
        },
      },
    });

    const sale2 = await prisma.sale.create({
      data: {
        companyId: company.id,
        customerId: customers[1].id,
        saleNumber: 'VND-002',
        date: new Date('2024-10-15'),
        totalAmount: 199.90,
        discount: 0,
        netAmount: 199.90,
        status: 'PAID',
        paymentMethod: 'PIX',
        items: {
          create: [
            {
              productId: products[2].id,
              quantity: 1,
              unitPrice: 199.90,
              total: 199.90,
            },
          ],
        },
      },
    });

    const sale3 = await prisma.sale.create({
      data: {
        companyId: company.id,
        customerId: customers[2].id,
        saleNumber: 'VND-003',
        date: new Date(),
        totalAmount: 294.50,
        discount: 20.00,
        netAmount: 274.50,
        status: 'PENDING',
        paymentMethod: 'BANK_SLIP',
        items: {
          create: [
            {
              productId: products[3].id,
              quantity: 5,
              unitPrice: 24.90,
              total: 124.50,
            },
            {
              productId: products[4].id,
              quantity: 3,
              unitPrice: 45.00,
              discount: 20.00,
              total: 115.00,
            },
          ],
        },
      },
    });
    console.log('✅ Vendas criadas!\n');

    // Criar funcionários
    console.log('👨‍💼 Criando funcionários...');
    const employee1 = await prisma.employee.create({
      data: {
        companyId: company.id,
        cpf: '111.222.333-44',
        name: 'Carlos Oliveira',
        email: 'carlos@demostore.com',
        phone: '(11) 96666-5555',
        position: 'Gerente de Vendas',
        department: 'Comercial',
        salary: 5000.00,
        admissionDate: new Date('2023-01-15'),
        active: true,
        address: {
          zipCode: '01310-100',
          street: 'Rua Teste',
          number: '100',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
        },
      },
    });

    const employee2 = await prisma.employee.create({
      data: {
        companyId: company.id,
        cpf: '555.666.777-88',
        name: 'Ana Paula Costa',
        email: 'ana@demostore.com',
        phone: '(11) 95555-4444',
        position: 'Assistente Administrativo',
        department: 'Administrativo',
        salary: 3000.00,
        admissionDate: new Date('2023-03-01'),
        active: true,
        address: {
          zipCode: '04551-001',
          street: 'Rua Exemplo',
          number: '200',
          neighborhood: 'Jardins',
          city: 'São Paulo',
          state: 'SP',
        },
      },
    });
    console.log('✅ Funcionários criados!\n');

    // Criar contas a receber
    console.log('💰 Criando contas a receber...');
    await prisma.accountReceivable.create({
      data: {
        customerId: customers[2].id,
        saleId: sale3.id,
        description: 'Venda VND-003 - Empresa XYZ',
        amount: 274.50,
        dueDate: new Date('2024-11-15'),
        status: 'PENDING',
      },
    });
    console.log('✅ Contas a receber criadas!\n');

    // Criar contas a pagar
    console.log('💸 Criando contas a pagar...');
    await prisma.accountPayable.create({
      data: {
        supplierId: supplier1.id,
        description: 'Compra de produtos - Tech Distribuidora',
        amount: 5000.00,
        dueDate: new Date('2024-11-10'),
        status: 'PENDING',
      },
    });
    console.log('✅ Contas a pagar criadas!\n');

    console.log('========================================');
    console.log('✅ Seed concluído com sucesso!');
    console.log('========================================\n');
    console.log('📧 Credenciais de acesso:');
    console.log('   Admin:');
    console.log('   Email: admin@demostore.com');
    console.log('   Senha: admin123\n');
    console.log('   Gerente:');
    console.log('   Email: gerente@demostore.com');
    console.log('   Senha: gerente123\n');
    console.log('   Vendedor:');
    console.log('   Email: vendedor@demostore.com');
    console.log('   Senha: vendedor123\n');
  } catch (error) {
    console.error('\n❌ Erro durante o seed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(() => {
    console.log('👋 Seed finalizado!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });