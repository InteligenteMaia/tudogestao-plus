/**
 * =================================================================================
 * CUSTOMERS PAGE - CÓDIGO REACT COMENTADO LINHA POR LINHA
 * =================================================================================
 *
 * Este arquivo é uma versão EDUCACIONAL da página Customers.jsx real.
 * Cada linha está comentada explicando O QUE FAZ e POR QUÊ.
 *
 * OBJETIVO: Aprender React por engenharia reversa
 * DESENVOLVEDOR: Felipe Gonzaga (Frontend Developer)
 * DATA: 19/11/2025
 *
 * CONCEITOS ABORDADOS:
 * - useState para gerenciar estado
 * - useEffect para buscar dados da API
 * - Renderização condicional
 * - Event handlers
 * - Modais
 * - Formulários controlados
 * - Toast notifications
 * - Axios para chamadas HTTP
 *
 * =================================================================================
 */

// =================================================================================
// IMPORTS
// =================================================================================

/**
 * React e Hooks
 *
 * React: biblioteca principal
 * useState: hook para criar estados reativos
 * useEffect: hook para efeitos colaterais (buscar dados, subscriptions, etc)
 */
import React, { useState, useEffect } from 'react';

/**
 * API Client
 *
 * axios configurado com:
 * - baseURL: http://localhost:3333/api
 * - Interceptor que adiciona token JWT automaticamente
 * - Interceptor que trata erros 401 (logout automático)
 */
import api from '../../services/api';

/**
 * Toast Notifications
 *
 * Biblioteca para mostrar notificações:
 * - toast.success('Mensagem')
 * - toast.error('Erro')
 * - toast.loading('Carregando...')
 */
import toast from 'react-hot-toast';

/**
 * Ícones
 *
 * Biblioteca react-icons com ícones do Font Awesome
 * Uso: <FaPlus />, <FaEdit />, <FaTrash />
 */
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';

// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================

/**
 * Componente Customers
 *
 * Responsável por:
 * - Listar clientes
 * - Criar novo cliente (modal)
 * - Editar cliente (modal)
 * - Excluir cliente (confirmação)
 * - Buscar clientes
 * - Paginação
 */
function Customers() {

  // ===============================================================================
  // ESTADOS (useState)
  // ===============================================================================

  /**
   * Lista de clientes
   *
   * useState([]) cria um estado com valor inicial []
   * customers: valor atual do estado
   * setCustomers: função para atualizar o estado
   *
   * Quando setCustomers é chamado, React re-renderiza o componente
   */
  const [customers, setCustomers] = useState([]);

  /**
   * Estado de carregamento
   *
   * true: mostra skeleton/spinner
   * false: mostra dados
   */
  const [loading, setLoading] = useState(true);

  /**
   * Termo de busca
   *
   * Conectado ao input de busca
   * Atualiza a cada tecla digitada
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Controle do modal
   *
   * false: modal fechado
   * true: modal aberto
   */
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Modo do modal
   *
   * 'create': criando novo cliente
   * 'edit': editando cliente existente
   *
   * Usado para mudar título do modal e comportamento do submit
   */
  const [modalMode, setModalMode] = useState('create');

  /**
   * Cliente sendo editado
   *
   * null: nenhum cliente selecionado
   * {...}: dados do cliente para editar
   */
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  /**
   * Dados do formulário
   *
   * Objeto com todos os campos do form
   * Atualizado conforme usuário digita (controlled components)
   */
  const [formData, setFormData] = useState({
    type: 'INDIVIDUAL',  // INDIVIDUAL ou COMPANY
    cpfCnpj: '',
    name: '',
    tradeName: '',
    email: '',
    phone: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    }
  });

  /**
   * Paginação
   */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // ===============================================================================
  // EFEITOS (useEffect)
  // ===============================================================================

  /**
   * Busca clientes quando componente monta ou quando dependências mudam
   *
   * useEffect(função, dependências)
   *
   * Dependências [page, searchTerm]:
   * - Se page muda, executa novamente
   * - Se searchTerm muda, executa novamente
   *
   * [] vazio = executa apenas uma vez (componentDidMount)
   * [dep] com deps = executa quando deps mudam (componentDidUpdate)
   *
   * return () => {} = cleanup (componentWillUnmount)
   */
  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm]); // Array de dependências

  // ===============================================================================
  // FUNÇÕES DE API
  // ===============================================================================

  /**
   * Busca clientes da API
   *
   * async/await para código assíncrono mais legível
   * try/catch para tratamento de erros
   */
  const fetchCustomers = async () => {
    try {
      // Inicia loading
      setLoading(true);

      /**
       * GET /api/customers
       *
       * params: query string (?page=1&search=João)
       * response.data: dados retornados pela API
       *
       * API retorna:
       * {
       *   customers: [...],
       *   total: 50,
       *   page: 1,
       *   totalPages: 5
       * }
       */
      const response = await api.get('/customers', {
        params: {
          page,
          limit: 10,
          search: searchTerm,
          active: true  // Apenas clientes ativos
        }
      });

      /**
       * Destructuring da resposta
       * Extrai propriedades do objeto response.data
       */
      const { customers, total, totalPages } = response.data;

      /**
       * Atualiza estados
       * Causa re-render do componente
       */
      setCustomers(customers);
      setTotal(total);
      setTotalPages(totalPages);

    } catch (error) {
      /**
       * Se der erro:
       * - Mostra toast de erro
       * - Mensagem vem de error.response.data.error (backend)
       * - Fallback para mensagem genérica se não houver
       */
      toast.error(
        error.response?.data?.error || 'Erro ao carregar clientes'
      );
    } finally {
      /**
       * finally executa SEMPRE (sucesso ou erro)
       * Usado para parar loading
       */
      setLoading(false);
    }
  };

  /**
   * Cria novo cliente
   *
   * Chamado quando formulário é submetido no modo 'create'
   */
  const createCustomer = async () => {
    try {
      /**
       * POST /api/customers
       *
       * Envia formData como body da requisição
       * Backend valida e salva no banco
       */
      await api.post('/customers', formData);

      /**
       * Sucesso:
       * - Mostra toast verde
       * - Fecha modal
       * - Recarrega lista
       */
      toast.success('Cliente criado com sucesso!');
      closeModal();
      fetchCustomers();

    } catch (error) {
      /**
       * Erro:
       * - Mostra toast vermelho
       * - Modal permanece aberto para correção
       */
      toast.error(
        error.response?.data?.error || 'Erro ao criar cliente'
      );
    }
  };

  /**
   * Atualiza cliente existente
   *
   * Chamado quando formulário é submetido no modo 'edit'
   */
  const updateCustomer = async () => {
    try {
      /**
       * PUT /api/customers/:id
       *
       * Envia apenas campos alterados
       * selectedCustomer.id = ID do cliente sendo editado
       */
      await api.put(`/customers/${selectedCustomer.id}`, formData);

      toast.success('Cliente atualizado com sucesso!');
      closeModal();
      fetchCustomers();

    } catch (error) {
      toast.error(
        error.response?.data?.error || 'Erro ao atualizar cliente'
      );
    }
  };

  /**
   * Exclui cliente
   *
   * Chamado quando usuário confirma exclusão
   *
   * @param {string} id - UUID do cliente
   */
  const deleteCustomer = async (id) => {
    /**
     * window.confirm mostra dialog nativo do browser
     * Retorna true se usuário clicar OK
     * Retorna false se clicar Cancelar
     */
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
      return; // Cancela exclusão
    }

    try {
      /**
       * DELETE /api/customers/:id
       *
       * Backend faz soft delete (active = false)
       */
      await api.delete(`/customers/${id}`);

      toast.success('Cliente excluído com sucesso!');
      fetchCustomers(); // Recarrega lista

    } catch (error) {
      toast.error(
        error.response?.data?.error || 'Erro ao excluir cliente'
      );
    }
  };

  // ===============================================================================
  // FUNÇÕES DE UI
  // ===============================================================================

  /**
   * Abre modal no modo 'create'
   *
   * Reseta formulário para valores padrão
   */
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCustomer(null);

    // Reseta formulário
    setFormData({
      type: 'INDIVIDUAL',
      cpfCnpj: '',
      name: '',
      tradeName: '',
      email: '',
      phone: '',
      address: {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    });

    setModalOpen(true);
  };

  /**
   * Abre modal no modo 'edit'
   *
   * Preenche formulário com dados do cliente
   *
   * @param {object} customer - Dados do cliente
   */
  const openEditModal = (customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);

    /**
     * Preenche form com dados do cliente
     *
     * Spread operator (...) copia todos os campos
     * || {} garante que address não seja null
     */
    setFormData({
      type: customer.type,
      cpfCnpj: customer.cpfCnpj,
      name: customer.name,
      tradeName: customer.tradeName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    });

    setModalOpen(true);
  };

  /**
   * Fecha modal
   *
   * Limpa estados relacionados ao modal
   */
  const closeModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
    setFormData({
      type: 'INDIVIDUAL',
      cpfCnpj: '',
      name: '',
      tradeName: '',
      email: '',
      phone: '',
      address: {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    });
  };

  /**
   * Manipula mudanças nos inputs
   *
   * Controlled components: value vem do state
   *
   * @param {object} e - Event object
   */
  const handleInputChange = (e) => {
    /**
     * e.target = elemento que disparou o evento
     * name: atributo name do input
     * value: valor digitado
     */
    const { name, value } = e.target;

    /**
     * Atualiza formData
     *
     * Spread operator (...) mantém campos existentes
     * [name]: value atualiza apenas o campo específico
     *
     * Exemplo:
     * name = 'email'
     * value = 'novo@email.com'
     *
     * { ...formData, email: 'novo@email.com' }
     */
    setFormData({
      ...formData,
      [name]: value
    });
  };

  /**
   * Manipula mudanças em campos de endereço
   *
   * Address é objeto aninhado, precisa tratamento especial
   *
   * @param {object} e - Event object
   */
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    /**
     * Atualiza campo dentro de address
     *
     * address: { ...formData.address, [name]: value }
     *
     * Spread operator no address mantém outros campos
     */
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value
      }
    });
  };

  /**
   * Submete formulário
   *
   * Chamado quando usuário clica em Salvar
   *
   * @param {object} e - Event object
   */
  const handleSubmit = async (e) => {
    /**
     * preventDefault() previne comportamento padrão do form
     * (recarregar página)
     */
    e.preventDefault();

    /**
     * Validação básica
     */
    if (!formData.name || !formData.cpfCnpj) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    /**
     * Chama função apropriada baseado no modo
     *
     * Operador ternário: condição ? seVerdadeiro : seFalso
     */
    if (modalMode === 'create') {
      await createCustomer();
    } else {
      await updateCustomer();
    }
  };

  /**
   * Manipula mudança na busca
   *
   * Debounce: espera usuário parar de digitar
   *
   * @param {object} e - Event object
   */
  const handleSearch = (e) => {
    const value = e.target.value;

    /**
     * Atualiza searchTerm
     *
     * useEffect vai disparar e buscar clientes
     */
    setSearchTerm(value);

    /**
     * Volta para página 1 ao buscar
     * Evita ficar em página vazia
     */
    setPage(1);
  };

  // ===============================================================================
  // RENDER
  // ===============================================================================

  /**
   * JSX - JavaScript XML
   *
   * Sintaxe que parece HTML mas é JavaScript
   * Compilado para React.createElement()
   *
   * {} - Interpola JavaScript no JSX
   * {variavel}, {funcao()}, {condicao ? sim : nao}
   */
  return (
    <div style={{ padding: '2rem' }}>

      {/* ========================================================================= */}
      {/* HEADER */}
      {/* ========================================================================= */}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        {/* Título */}
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
          Clientes
          {/* Conditional rendering: só mostra se total > 0 */}
          {total > 0 && (
            <span style={{ color: '#6b7280', fontSize: '1.25rem', marginLeft: '0.5rem' }}>
              ({total})
            </span>
          )}
        </h1>

        {/* Botão Novo Cliente */}
        <button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          /**
           * onMouseOver/onMouseOut para hover effect
           * Alternativa: usar CSS classes
           */
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <FaPlus />
          Novo Cliente
        </button>
      </div>

      {/* ========================================================================= */}
      {/* BUSCA */}
      {/* ========================================================================= */}

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          {/* Ícone de busca */}
          <FaSearch style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />

          {/* Input de busca */}
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABELA */}
      {/* ========================================================================= */}

      {/* Conditional rendering: loading vs dados vs vazio */}
      {loading ? (
        // LOADING STATE
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Carregando...
          </p>
        </div>
      ) : customers.length === 0 ? (
        // EMPTY STATE
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            {searchTerm
              ? `Nenhum cliente encontrado para "${searchTerm}"`
              : 'Nenhum cliente cadastrado'
            }
          </p>
        </div>
      ) : (
        // TABELA COM DADOS
        <>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Tipo
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    CPF/CNPJ
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Nome
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Email
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Telefone
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {/**
                 * .map() itera sobre array
                 * Retorna um novo array de elementos JSX
                 *
                 * key={customer.id} é OBRIGATÓRIO
                 * React usa para otimizar re-renders
                 */}
                {customers.map(customer => (
                  <tr
                    key={customer.id}
                    style={{ borderBottom: '1px solid #e5e7eb' }}
                  >
                    <td style={{ padding: '1rem' }}>
                      {/* Badge de tipo */}
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: customer.type === 'INDIVIDUAL' ? '#dbeafe' : '#fef3c7',
                        color: customer.type === 'INDIVIDUAL' ? '#1e40af' : '#92400e'
                      }}>
                        {customer.type === 'INDIVIDUAL' ? 'PF' : 'PJ'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {customer.cpfCnpj}
                    </td>

                    <td style={{ padding: '1rem', fontWeight: '500', color: '#1f2937' }}>
                      {customer.name}
                      {/* Mostra trade name se houver */}
                      {customer.tradeName && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {customer.tradeName}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {customer.email || '-'}
                    </td>

                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {customer.phone || '-'}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {/* Botão Editar */}
                        <button
                          onClick={() => openEditModal(customer)}
                          style={{
                            padding: '0.5rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                          }}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>

                        {/* Botão Excluir */}
                        <button
                          onClick={() => deleteCustomer(customer.id)}
                          style={{
                            padding: '0.5rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                          }}
                          title="Excluir"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===================================================================== */}
          {/* PAGINAÇÃO */}
          {/* ===================================================================== */}

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '2rem'
            }}>
              {/* Botão Anterior */}
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{
                  padding: '0.5rem 1rem',
                  background: page === 1 ? '#e5e7eb' : '#667eea',
                  color: page === 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: page === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Anterior
              </button>

              {/* Página atual */}
              <span style={{ color: '#6b7280' }}>
                Página {page} de {totalPages}
              </span>

              {/* Botão Próximo */}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  background: page === totalPages ? '#e5e7eb' : '#667eea',
                  color: page === totalPages ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL */}
      {/* ========================================================================= */}

      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Header do Modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {modalMode === 'create' ? 'Novo Cliente' : 'Editar Cliente'}
              </h2>

              {/* Botão fechar */}
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit}>
              {/* Tipo */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Tipo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  <option value="INDIVIDUAL">Pessoa Física</option>
                  <option value="COMPANY">Pessoa Jurídica</option>
                </select>
              </div>

              {/* CPF/CNPJ */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  {formData.type === 'INDIVIDUAL' ? 'CPF' : 'CNPJ'} *
                </label>
                <input
                  type="text"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  required
                  placeholder={formData.type === 'INDIVIDUAL' ? '000.000.000-00' : '00.000.000/0000-00'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Nome */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  {formData.type === 'INDIVIDUAL' ? 'Nome Completo' : 'Razão Social'} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Nome Fantasia (apenas PJ) */}
              {formData.type === 'COMPANY' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    name="tradeName"
                    value={formData.tradeName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Telefone */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Botões */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                marginTop: '2rem'
              }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;

// =================================================================================
// CONCEITOS REACT APRENDIDOS
// =================================================================================

/**
 * 1. COMPONENTES FUNCIONAIS
 *    - function NomeDoComponente() {}
 *    - Return JSX
 *    - Hooks para estado e efeitos
 *
 * 2. HOOKS
 *    - useState: estado local do componente
 *    - useEffect: efeitos colaterais (API, subscriptions)
 *
 * 3. CONTROLLED COMPONENTS
 *    - value={state}
 *    - onChange={handler}
 *    - Estado é "single source of truth"
 *
 * 4. EVENT HANDLERS
 *    - onClick, onChange, onSubmit
 *    - e.preventDefault()
 *    - e.target
 *
 * 5. CONDITIONAL RENDERING
 *    - {condicao && <Componente />}
 *    - {condicao ? <Sim /> : <Nao />}
 *    - Early return
 *
 * 6. LISTS & KEYS
 *    - .map() para iterar
 *    - key={id} obrigatório
 *
 * 7. ASYNC/AWAIT
 *    - Funções assíncronas
 *    - try/catch para erros
 *    - API calls com axios
 *
 * 8. INLINE STYLES
 *    - style={{ propriedade: 'valor' }}
 *    - camelCase ao invés de kebab-case
 *    - Valores numéricos em px
 */

// =================================================================================
// EXERCÍCIOS PRÁTICOS
// =================================================================================

/**
 * EXERCÍCIO 1: Adicionar filtro por tipo
 * Crie botões "Todos", "PF", "PJ" que filtram a lista
 *
 * EXERCÍCIO 2: Implementar debounce na busca
 * Use setTimeout para buscar após usuário parar de digitar
 *
 * EXERCÍCIO 3: Validar CPF/CNPJ
 * Crie função validateCpfCnpj e use no formulário
 *
 * EXERCÍCIO 4: Mascara de telefone
 * Formate telefone automaticamente ao digitar
 *
 * EXERCÍCIO 5: Ordenação de colunas
 * Clique no header da tabela para ordenar
 */
