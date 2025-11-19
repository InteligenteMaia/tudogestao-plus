/**
 * =================================================================================
 * CUSTOMER CONTROLLER - CÓDIGO COMENTADO LINHA POR LINHA
 * =================================================================================
 *
 * Este arquivo é uma versão EDUCACIONAL do CustomerController real.
 * Cada linha está comentada explicando O QUE FAZ e POR QUÊ.
 *
 * OBJETIVO: Aprender por engenharia reversa
 * DESENVOLVEDOR: Rubens Neto (Backend Developer)
 * DATA: 19/11/2025
 *
 * =================================================================================
 */

// =================================================================================
// IMPORTS (Importações)
// =================================================================================

/**
 * Importa o Prisma Client
 * Prisma Client é uma biblioteca auto-gerada que fornece type-safe database access
 * É gerado a partir do schema.prisma
 */
const { prisma } = require('../config/database');

/**
 * Importa a classe AppError
 * AppError é uma classe customizada para erros da aplicação
 * Permite definir status code e mensagem
 * Exemplo: throw new AppError('Cliente não encontrado', 404);
 */
const AppError = require('../utils/AppError');

/**
 * Importa o AuditService
 * Service responsável por registrar todas as ações (CREATE, UPDATE, DELETE)
 * no log de auditoria para rastreabilidade
 */
const auditService = require('../services/audit.service');

// =================================================================================
// CONTROLLER CLASS
// =================================================================================

/**
 * CustomerController
 *
 * Responsável por toda a lógica de negócio relacionada a clientes
 * Segue o padrão MVC (Model-View-Controller)
 *
 * Métodos:
 * - index()  -> Listar todos os clientes
 * - show()   -> Buscar um cliente específico
 * - create() -> Criar novo cliente
 * - update() -> Atualizar cliente existente
 * - delete() -> Excluir cliente (soft delete)
 */
class CustomerController {

  // =============================================================================
  // INDEX - Listar todos os clientes
  // =============================================================================

  /**
   * GET /api/customers
   *
   * Lista todos os clientes da empresa do usuário logado
   *
   * Query Params:
   * - page: número da página (padrão: 1)
   * - limit: itens por página (padrão: 10)
   * - search: busca por nome ou CPF/CNPJ
   * - type: filtrar por INDIVIDUAL ou COMPANY
   * - active: filtrar por ativos (true/false)
   *
   * Resposta:
   * {
   *   customers: [...],
   *   total: 50,
   *   page: 1,
   *   totalPages: 5
   * }
   */
  async index(req, res) {
    // -------------------------------------------------------------------------
    // 1. EXTRAIR QUERY PARAMS
    // -------------------------------------------------------------------------

    /**
     * Extrai parâmetros da query string
     * Exemplo: GET /api/customers?page=2&limit=20&search=João
     *
     * Usa destructuring + valores padrão
     */
    const {
      page = 1,        // Página atual (padrão: 1)
      limit = 10,      // Itens por página (padrão: 10)
      search = '',     // Termo de busca (padrão: vazio)
      type,            // INDIVIDUAL ou COMPANY
      active          // true ou false
    } = req.query;

    /**
     * Converte page e limit para inteiros
     * Query params sempre chegam como string, precisamos converter
     * parseInt(string, base)
     */
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // -------------------------------------------------------------------------
    // 2. CONSTRUIR FILTROS DINÂMICOS
    // -------------------------------------------------------------------------

    /**
     * Objeto where do Prisma
     * Aceita múltiplos filtros combinados com AND implícito
     */
    const where = {
      /**
       * companyId vem do middleware de autenticação
       * Garante isolamento: cada empresa vê apenas seus próprios clientes
       *
       * MUITO IMPORTANTE para multi-tenancy!
       */
      companyId: req.companyId
    };

    /**
     * Adiciona filtro de busca se o usuário digitou algo
     *
     * OR: busca em QUALQUER um dos campos
     * contains: busca parcial (SQL LIKE '%term%')
     * mode: 'insensitive' = case-insensitive (ignora maiúsculas/minúsculas)
     */
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          cpfCnpj: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    /**
     * Adiciona filtro de tipo se especificado
     * type pode ser 'INDIVIDUAL' ou 'COMPANY'
     */
    if (type) {
      where.type = type;
    }

    /**
     * Adiciona filtro de ativo se especificado
     * Converte string 'true'/'false' para boolean
     */
    if (active !== undefined) {
      where.active = active === 'true';
    }

    // -------------------------------------------------------------------------
    // 3. EXECUTAR QUERIES
    // -------------------------------------------------------------------------

    /**
     * Promise.all executa queries em PARALELO
     * Mais rápido que executar sequencialmente
     *
     * [count, customers] = destructuring da resposta
     */
    const [count, customers] = await Promise.all([
      /**
       * COUNT
       * Conta total de registros (para paginação)
       */
      prisma.customer.count({ where }),

      /**
       * FIND MANY
       * Busca os registros da página atual
       */
      prisma.customer.findMany({
        where,           // Filtros construídos acima
        skip,            // Quantos registros pular
        take,            // Quantos registros retornar
        orderBy: {
          name: 'asc'    // Ordena por nome A-Z
        },
        /**
         * SELECT
         * Especifica quais campos retornar
         * Por padrão, Prisma retorna TODOS os campos
         * Aqui selecionamos apenas o necessário para economizar bandwidth
         */
        select: {
          id: true,
          type: true,
          cpfCnpj: true,
          name: true,
          tradeName: true,
          email: true,
          phone: true,
          active: true,
          createdAt: true,
          // address: true,  // Pode adicionar se necessário
          /**
           * Include relacionamentos
           * _count conta relacionamentos sem trazer os dados
           */
          _count: {
            select: {
              sales: true  // Conta quantas vendas o cliente tem
            }
          }
        }
      })
    ]);

    // -------------------------------------------------------------------------
    // 4. CALCULAR PAGINAÇÃO
    // -------------------------------------------------------------------------

    /**
     * Math.ceil arredonda para cima
     * Exemplo: 51 registros / 10 por página = 5.1 → 6 páginas
     */
    const totalPages = Math.ceil(count / take);

    // -------------------------------------------------------------------------
    // 5. RETORNAR RESPOSTA
    // -------------------------------------------------------------------------

    /**
     * res.json() envia resposta JSON
     * Status code 200 é implícito (sucesso)
     */
    return res.json({
      customers,
      total: count,
      page: parseInt(page),
      totalPages
    });
  }

  // =============================================================================
  // SHOW - Buscar um cliente específico
  // =============================================================================

  /**
   * GET /api/customers/:id
   *
   * Busca um cliente pelo ID
   *
   * Parâmetros:
   * - id: UUID do cliente (na URL)
   *
   * Resposta:
   * { customer: {...} }
   */
  async show(req, res) {
    // -------------------------------------------------------------------------
    // 1. EXTRAIR ID DA URL
    // -------------------------------------------------------------------------

    /**
     * req.params contém parâmetros da rota
     * Rota: /api/customers/:id
     * URL: /api/customers/123-abc-456
     * req.params.id = '123-abc-456'
     */
    const { id } = req.params;

    // -------------------------------------------------------------------------
    // 2. BUSCAR NO BANCO
    // -------------------------------------------------------------------------

    /**
     * findUnique busca por campo único (PRIMARY KEY ou UNIQUE)
     * Retorna 1 registro ou null
     */
    const customer = await prisma.customer.findUnique({
      where: { id },
      /**
       * Include traz dados relacionados
       * Aqui trazemos as vendas do cliente
       */
      include: {
        sales: {
          /**
           * Ordena vendas por data decrescente (mais recente primeiro)
           */
          orderBy: { createdAt: 'desc' },
          /**
           * Limita a 10 vendas mais recentes
           * Evita trazer milhares de registros
           */
          take: 10,
          /**
           * Select apenas campos necessários das vendas
           */
          select: {
            id: true,
            saleNumber: true,
            total: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    // -------------------------------------------------------------------------
    // 3. VALIDAÇÃO
    // -------------------------------------------------------------------------

    /**
     * Se não encontrou, retorna erro 404
     * throw interrompe a execução e vai para o middleware de erro
     */
    if (!customer) {
      throw new AppError('Cliente não encontrado', 404);
    }

    /**
     * SEGURANÇA MULTI-TENANCY
     * Verifica se o cliente pertence à empresa do usuário
     * Previne que usuário da Empresa A veja cliente da Empresa B
     */
    if (customer.companyId !== req.companyId) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // -------------------------------------------------------------------------
    // 4. RETORNAR RESPOSTA
    // -------------------------------------------------------------------------

    return res.json({ customer });
  }

  // =============================================================================
  // CREATE - Criar novo cliente
  // =============================================================================

  /**
   * POST /api/customers
   *
   * Cria um novo cliente
   *
   * Body:
   * {
   *   type: 'INDIVIDUAL' ou 'COMPANY',
   *   cpfCnpj: '123.456.789-00',
   *   name: 'João Silva',
   *   tradeName: 'João Silva ME',  // Opcional (PJ)
   *   email: 'joao@email.com',      // Opcional
   *   phone: '(11) 98765-4321',     // Opcional
   *   address: {                    // Opcional
   *     cep: '12345-678',
   *     street: 'Rua X',
   *     number: '100',
   *     complement: 'Apto 5',
   *     neighborhood: 'Centro',
   *     city: 'São Paulo',
   *     state: 'SP'
   *   }
   * }
   *
   * Resposta:
   * { message: 'Cliente criado com sucesso', customer: {...} }
   */
  async create(req, res) {
    // -------------------------------------------------------------------------
    // 1. EXTRAIR DADOS DO BODY
    // -------------------------------------------------------------------------

    /**
     * IMPORTANTE: Destructuring EXPLÍCITO
     *
     * ❌ ERRADO: const data = req.body
     * Por quê? req.body pode conter campos extras que não existem no schema
     *
     * ✅ CORRETO: Extrair apenas campos válidos
     * Isso previne o erro de "campos duplicados" que tivemos antes
     */
    const {
      type,        // INDIVIDUAL ou COMPANY
      cpfCnpj,     // CPF (11 dígitos) ou CNPJ (14 dígitos)
      name,        // Nome completo ou razão social
      tradeName,   // Nome fantasia (PJ)
      email,       // Email
      phone,       // Telefone
      address      // Objeto JSON com endereço completo
    } = req.body;

    // -------------------------------------------------------------------------
    // 2. VALIDAÇÃO DE NEGÓCIO
    // -------------------------------------------------------------------------

    /**
     * Valida se CPF/CNPJ já existe nesta empresa
     *
     * Por que findFirst e não findUnique?
     * Porque a unique constraint é composta (companyId + cpfCnpj)
     *
     * findFirst retorna o primeiro registro encontrado ou null
     */
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        companyId: req.companyId,  // Mesma empresa
        cpfCnpj                    // Mesmo CPF/CNPJ
      }
    });

    /**
     * Se encontrou, lança erro 409 (Conflict)
     */
    if (existingCustomer) {
      throw new AppError('CPF/CNPJ já cadastrado nesta empresa', 409);
    }

    // -------------------------------------------------------------------------
    // 3. CRIAR NO BANCO
    // -------------------------------------------------------------------------

    /**
     * create() cria um novo registro
     *
     * data: objeto com os campos a serem salvos
     */
    const customer = await prisma.customer.create({
      data: {
        // Campos obrigatórios
        type,
        cpfCnpj,
        name,
        companyId: req.companyId,  // Vem do middleware (JWT)
        active: true,              // Novo cliente sempre ativo

        // Campos opcionais (undefined se não fornecidos)
        tradeName,
        email,
        phone,
        address  // JSON armazenado como JSONB no PostgreSQL
      }
    });

    // -------------------------------------------------------------------------
    // 4. REGISTRAR AUDITORIA
    // -------------------------------------------------------------------------

    /**
     * Registra no log de auditoria
     *
     * Parâmetros:
     * - userId: quem fez a ação
     * - action: tipo de ação (CREATE, UPDATE, DELETE)
     * - model: qual entidade (Customer, Product, etc)
     * - recordId: ID do registro afetado
     * - data: dados enviados (para histórico)
     *
     * await garante que a auditoria seja salva antes de continuar
     */
    await auditService.log(
      req.userId,      // ID do usuário logado
      'CREATE',
      'Customer',
      customer.id,
      req.body
    );

    // -------------------------------------------------------------------------
    // 5. RETORNAR RESPOSTA
    // -------------------------------------------------------------------------

    /**
     * status(201) = Created
     * Código HTTP correto para criação de recursos
     */
    return res.status(201).json({
      message: 'Cliente criado com sucesso',
      customer
    });
  }

  // =============================================================================
  // UPDATE - Atualizar cliente existente
  // =============================================================================

  /**
   * PUT /api/customers/:id
   *
   * Atualiza um cliente existente
   *
   * Parâmetros:
   * - id: UUID do cliente (na URL)
   *
   * Body: (todos opcionais exceto o que deseja alterar)
   * {
   *   name: 'Novo Nome',
   *   email: 'novo@email.com',
   *   phone: '(11) 99999-9999',
   *   address: {...},
   *   active: false
   * }
   *
   * IMPORTANTE: CPF/CNPJ NÃO pode ser alterado!
   *
   * Resposta:
   * { message: 'Cliente atualizado com sucesso', customer: {...} }
   */
  async update(req, res) {
    // -------------------------------------------------------------------------
    // 1. EXTRAIR ID E DADOS
    // -------------------------------------------------------------------------

    const { id } = req.params;

    /**
     * Extrai apenas campos PERMITIDOS para atualização
     * CPF/CNPJ e type são IMUTÁVEIS (não podem ser alterados)
     */
    const {
      name,
      tradeName,
      email,
      phone,
      address,
      active
    } = req.body;

    // -------------------------------------------------------------------------
    // 2. VERIFICAR SE EXISTE
    // -------------------------------------------------------------------------

    /**
     * Busca o cliente antes de atualizar
     * Necessário para:
     * 1. Verificar se existe
     * 2. Verificar se pertence à empresa (segurança)
     */
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      throw new AppError('Cliente não encontrado', 404);
    }

    /**
     * SEGURANÇA: Verifica companyId
     */
    if (existingCustomer.companyId !== req.companyId) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // -------------------------------------------------------------------------
    // 3. ATUALIZAR NO BANCO
    // -------------------------------------------------------------------------

    /**
     * update() atualiza um registro existente
     *
     * Apenas campos fornecidos serão atualizados
     * Campos omitidos permanecem inalterados
     */
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        /**
         * Spread operator condicional
         * Apenas adiciona campo se foi fornecido (não é undefined)
         */
        ...(name && { name }),
        ...(tradeName && { tradeName }),
        ...(email !== undefined && { email }),  // Permite limpar email
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(active !== undefined && { active }),

        /**
         * updatedAt é atualizado automaticamente pelo Prisma
         * Definido no schema como @updatedAt
         */
      }
    });

    // -------------------------------------------------------------------------
    // 4. REGISTRAR AUDITORIA
    // -------------------------------------------------------------------------

    await auditService.log(
      req.userId,
      'UPDATE',
      'Customer',
      customer.id,
      req.body  // Registra o que foi alterado
    );

    // -------------------------------------------------------------------------
    // 5. RETORNAR RESPOSTA
    // -------------------------------------------------------------------------

    return res.json({
      message: 'Cliente atualizado com sucesso',
      customer
    });
  }

  // =============================================================================
  // DELETE - Excluir cliente (Soft Delete)
  // =============================================================================

  /**
   * DELETE /api/customers/:id
   *
   * Exclui (inativa) um cliente
   *
   * SOFT DELETE: Não remove fisicamente do banco
   * Apenas marca como inativo (active = false)
   *
   * Vantagens:
   * - Histórico preservado
   * - Relacionamentos mantidos (vendas antigas)
   * - Possível restaurar depois
   * - Auditoria completa
   *
   * Parâmetros:
   * - id: UUID do cliente (na URL)
   *
   * Resposta:
   * { message: 'Cliente excluído com sucesso' }
   */
  async delete(req, res) {
    // -------------------------------------------------------------------------
    // 1. EXTRAIR ID
    // -------------------------------------------------------------------------

    const { id } = req.params;

    // -------------------------------------------------------------------------
    // 2. VERIFICAR SE EXISTE
    // -------------------------------------------------------------------------

    const customer = await prisma.customer.findUnique({
      where: { id },
      /**
       * Include _count para verificar relacionamentos
       */
      include: {
        _count: {
          select: {
            sales: true  // Conta vendas
          }
        }
      }
    });

    if (!customer) {
      throw new AppError('Cliente não encontrado', 404);
    }

    /**
     * SEGURANÇA: Verifica companyId
     */
    if (customer.companyId !== req.companyId) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // -------------------------------------------------------------------------
    // 3. VALIDAÇÃO DE INTEGRIDADE
    // -------------------------------------------------------------------------

    /**
     * OPCIONAL: Impedir exclusão se houver vendas
     *
     * Descomente se quiser bloquear exclusão de clientes com vendas
     */
    // if (customer._count.sales > 0) {
    //   throw new AppError(
    //     'Não é possível excluir cliente com vendas registradas',
    //     400
    //   );
    // }

    // -------------------------------------------------------------------------
    // 4. SOFT DELETE
    // -------------------------------------------------------------------------

    /**
     * Usa update() ao invés de delete()
     * Apenas marca como inativo
     */
    await prisma.customer.update({
      where: { id },
      data: {
        active: false
      }
    });

    /**
     * HARD DELETE (use com cuidado!)
     * Descomente apenas se realmente quiser remover do banco
     */
    // await prisma.customer.delete({
    //   where: { id }
    // });

    // -------------------------------------------------------------------------
    // 5. REGISTRAR AUDITORIA
    // -------------------------------------------------------------------------

    await auditService.log(
      req.userId,
      'DELETE',
      'Customer',
      id,
      { reason: 'Soft delete via API' }
    );

    // -------------------------------------------------------------------------
    // 6. RETORNAR RESPOSTA
    // -------------------------------------------------------------------------

    /**
     * Status 200 é adequado para DELETE
     * Alguns usam 204 (No Content), mas preferimos retornar mensagem
     */
    return res.json({
      message: 'Cliente excluído com sucesso'
    });
  }

}

// =================================================================================
// EXPORT
// =================================================================================

/**
 * Exporta instância única do controller (Singleton)
 * Todos os imports usarão a mesma instância
 */
module.exports = new CustomerController();

// =================================================================================
// CONCEITOS IMPORTANTES APRENDIDOS
// =================================================================================

/**
 * 1. ASYNC/AWAIT
 *    - Todas as funções são async
 *    - await pausa execução até promise resolver
 *    - Código mais legível que .then().catch()
 *
 * 2. PRISMA ORM
 *    - findMany() = SELECT com filtros
 *    - findUnique() = SELECT WHERE id/unique
 *    - create() = INSERT
 *    - update() = UPDATE
 *    - delete() = DELETE
 *    - count() = COUNT
 *    - include = JOIN
 *    - select = escolher campos
 *
 * 3. VALIDAÇÕES
 *    - Sempre validar se registro existe
 *    - Sempre validar companyId (multi-tenancy)
 *    - Validar regras de negócio (CPF duplicado)
 *
 * 4. ERROS
 *    - throw AppError para erros esperados
 *    - Status codes corretos (404, 409, 400, 500)
 *    - Mensagens claras para o frontend
 *
 * 5. AUDITORIA
 *    - Registrar todas as ações (CREATE, UPDATE, DELETE)
 *    - Rastreabilidade completa
 *    - Histórico de mudanças
 *
 * 6. SOFT DELETE
 *    - Nunca deletar fisicamente dados importantes
 *    - Usar campo active/deleted
 *    - Preservar histórico
 *
 * 7. SEGURANÇA
 *    - Sempre filtrar por companyId
 *    - Validar ownership de recursos
 *    - Não confiar em dados do cliente
 *
 * 8. PERFORMANCE
 *    - Usar Promise.all para queries paralelas
 *    - Select apenas campos necessários
 *    - Paginação em listas
 *    - Indexes no banco de dados
 */

// =================================================================================
// EXERCÍCIOS PRÁTICOS
// =================================================================================

/**
 * EXERCÍCIO 1: Adicionar filtro por cidade
 * Modifique o método index() para aceitar query param ?city=São Paulo
 * Dica: address é JSONB, use: address: { path: ['city'], equals: 'São Paulo' }
 *
 * EXERCÍCIO 2: Endpoint de estatísticas
 * Crie método statistics() que retorna:
 * - Total de clientes ativos
 * - Total de clientes inativos
 * - Total de vendas por cliente
 *
 * EXERCÍCIO 3: Restaurar cliente deletado
 * Crie método restore(req, res) que reativa um cliente inativo
 *
 * EXERCÍCIO 4: Busca avançada
 * Modifique index() para buscar também por cidade e email
 *
 * EXERCÍCIO 5: Validação de CPF/CNPJ
 * Crie função validateCpfCnpj(value) e use no create/update
 */
