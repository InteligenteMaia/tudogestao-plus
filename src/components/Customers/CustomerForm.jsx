// 💻 Felipe Gonzaga - Frontend Developer
// Formulário de cliente

import React, { useState } from 'react';
import Modal from '../UI/Common/Modal';
import Input from '../UI/Common/Input';
import Select from '../UI/Common/Select';
import Button from '../UI/Common/Button';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';
import { 
  isValidCPF, 
  isValidCNPJ, 
  isValidEmail, 
  formatCPF, 
  formatCNPJ,
  formatPhone 
} from '../../utils/validators';

const CustomerForm = ({ customer, onClose, onSuccess }) => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: customer?.type || 'INDIVIDUAL',
    cpfCnpj: customer?.cpfCnpj || '',
    name: customer?.name || '',
    tradeName: customer?.tradeName || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    active: customer?.active ?? true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === 'cpfCnpj') {
      formattedValue = formData.type === 'INDIVIDUAL' 
        ? formatCPF(value)
        : formatCNPJ(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const validate = () => {
    if (!formData.name) {
      showError('Nome é obrigatório');
      return false;
    }
    
    if (!formData.cpfCnpj) {
      showError('CPF/CNPJ é obrigatório');
      return false;
    }
    
    if (formData.type === 'INDIVIDUAL' && !isValidCPF(formData.cpfCnpj)) {
      showError('CPF inválido');
      return false;
    }
    
    if (formData.type === 'COMPANY' && !isValidCNPJ(formData.cpfCnpj)) {
      showError('CNPJ inválido');
      return false;
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      showError('Email inválido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      if (customer) {
        await api.put(`/customers/${customer.id}`, formData);
        success('Cliente atualizado com sucesso');
      } else {
        await api.post('/customers', formData);
        success('Cliente criado com sucesso');
      }
      
      onSuccess();
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={customer ? 'Editar Cliente' : 'Novo Cliente'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Salvar
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: 'INDIVIDUAL', label: 'Pessoa Física' },
              { value: 'COMPANY', label: 'Pessoa Jurídica' },
            ]}
            fullWidth
          />
          
          <Input
            label={formData.type === 'INDIVIDUAL' ? 'CPF' : 'CNPJ'}
            name="cpfCnpj"
            value={formData.cpfCnpj}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>

        <Input
          label={formData.type === 'INDIVIDUAL' ? 'Nome Completo' : 'Razão Social'}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />

        {formData.type === 'COMPANY' && (
          <Input
            label="Nome Fantasia"
            name="tradeName"
            value={formData.tradeName}
            onChange={handleChange}
            fullWidth
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          
          <Input
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
        </div>

        <div className="divider" />
        
        <h3 className="text-h3 text-gray-900 dark:text-gray-100">Endereço</h3>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="CEP"
            name="zipCode"
            value={formData.address.zipCode}
            onChange={handleAddressChange}
            fullWidth
          />
          
          <Input
            label="Rua"
            name="street"
            value={formData.address.street}
            onChange={handleAddressChange}
            className="col-span-2"
            fullWidth
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Número"
            name="number"
            value={formData.address.number}
            onChange={handleAddressChange}
            fullWidth
          />
          
          <Input
            label="Complemento"
            name="complement"
            value={formData.address.complement}
            onChange={handleAddressChange}
            className="col-span-2"
            fullWidth
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Bairro"
            name="neighborhood"
            value={formData.address.neighborhood}
            onChange={handleAddressChange}
            fullWidth
          />
          
          <Input
            label="Cidade"
            name="city"
            value={formData.address.city}
            onChange={handleAddressChange}
            fullWidth
          />
          
          <Input
            label="Estado"
            name="state"
            value={formData.address.state}
            onChange={handleAddressChange}
            maxLength={2}
            fullWidth
          />
        </div>
      </form>
    </Modal>
  );
};

export default CustomerForm;