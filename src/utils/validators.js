// 💻 Felipe Gonzaga - Frontend Developer
// Validadores de formulários

/**
 * Valida CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} CPF válido
 */
export const isValidCPF = (cpf) => {
  if (!cpf) return false;
  
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

/**
 * Valida CNPJ
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} CNPJ válido
 */
export const isValidCNPJ = (cnpj) => {
  if (!cnpj) return false;
  
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} Email válido
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} Telefone válido
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  phone = phone.replace(/[^\d]/g, '');
  return phone.length === 10 || phone.length === 11;
};

/**
 * Valida CEP
 * @param {string} cep - CEP a ser validado
 * @returns {boolean} CEP válido
 */
export const isValidCEP = (cep) => {
  if (!cep) return false;
  
  cep = cep.replace(/[^\d]/g, '');
  return cep.length === 8;
};

/**
 * Formata CPF
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} CPF formatado
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata CNPJ
 * @param {string} cnpj - CNPJ a ser formatado
 * @returns {string} CNPJ formatado
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  
  cnpj = cnpj.replace(/[^\d]/g, '');
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Formata telefone
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  phone = phone.replace(/[^\d]/g, '');
  
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

/**
 * Formata CEP
 * @param {string} cep - CEP a ser formatado
 * @returns {string} CEP formatado
 */
export const formatCEP = (cep) => {
  if (!cep) return '';
  
  cep = cep.replace(/[^\d]/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};