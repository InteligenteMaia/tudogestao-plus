// 💻 Felipe Gonzaga - Frontend Developer
// Utilitários de formatação de moeda

/**
 * Formata número para moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Remove formatação de moeda e retorna número
 * @param {string} value - Valor formatado
 * @returns {number} Valor numérico
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  
  const cleaned = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(cleaned) || 0;
};

/**
 * Formata número como porcentagem
 * @param {number} value - Valor a ser formatado
 * @param {number} decimals - Casas decimais
 * @returns {string} Valor formatado
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata número com separadores de milhar
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  
  return new Intl.NumberFormat('pt-BR').format(value);
};