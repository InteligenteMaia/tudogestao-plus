// 💻 Felipe Gonzaga - Frontend Developer
// 🔧 Thaynara Ribeiro - Full Stack
// Página de clientes

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import Card from '../../components/UI/Common/Card';
import Button from '../../components/UI/Common/Button';
import Table from '../../components/UI/Common/Table';
import SearchBar from '../../components/UI/Common/SearchBar';
import Pagination from '../../components/UI/Common/Pagination';
import Badge from '../../components/UI/Common/Badge';
import CustomerForm from '../../components/Customers/CustomerForm';
import CustomerDetails from '../../components/Customers/CustomerDetails';
import api from '../../services/api';
import { formatCPF, formatCNPJ } from '../../utils/validators';
import { formatDate } from '../../utils/date';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';

const CustomersList = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, debouncedSearch]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/customers', {
        params: {
          page: currentPage,
          limit: 20,
          search: debouncedSearch,
        },
      });
      
      setCustomers(response.data.customers);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      showError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return;
    
    try {
      await api.delete(`/customers/${id}`);
      success('Cliente excluído com sucesso');
      fetchCustomers();
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao excluir cliente');
    }
  };

  const columns = [
    {
      header: 'Nome',
      accessor: 'name',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'CPF/CNPJ',
      accessor: 'cpfCnpj',
      render: (value, row) => 
        row.type === 'INDIVIDUAL' ? formatCPF(value) : formatCNPJ(value),
    },
    {
      header: 'Telefone',
      accessor: 'phone',
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (value) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      header: 'Cadastro',
      accessor: 'createdAt',
      render: (value) => formatDate(value),
    },
    {
      header: 'Ações',
      accessor: 'id',
      render: (value) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/customers/${value}`)}
          >
            Ver
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(value)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-gray-900 dark:text-gray-100 mb-2">
            Clientes
          </h1>
          <p className="text-body text-gray-600 dark:text-gray-400">
            Gerencie seus clientes
          </p>
        </div>
        <Button
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowForm(true)}
        >
          Novo Cliente
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, CPF/CNPJ ou email..."
              fullWidth
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" icon={<Filter className="w-5 h-5" />}>
              Filtros
            </Button>
            <Button variant="secondary" icon={<Download className="w-5 h-5" />}>
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={customers}
          loading={loading}
          emptyMessage="Nenhum cliente encontrado"
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Form Modal */}
      {showForm && (
        <CustomerForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchCustomers();
          }}
        />
      )}
    </div>
  );
};

const CustomersPage = () => {
  return (
    <Routes>
      <Route index element={<CustomersList />} />
      <Route path=":id" element={<CustomerDetails />} />
    </Routes>
  );
};

export default CustomersPage;