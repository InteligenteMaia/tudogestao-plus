// 💻 Felipe Gonzaga - Frontend Developer
// Utilitários de formatação de datas

import { format, parseISO, isValid, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata data para formato brasileiro
 * @param {string|Date} date - Data a ser formatada
 * @param {string} formatStr - Formato desejado
 * @returns {string} Data formatada
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, formatStr, { locale: ptBR });
  } catch (error) {
    return '';
  }
};

/**
 * Formata data e hora
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data e hora formatada
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Retorna data relativa (ex: "há 2 dias")
 * @param {string|Date} date - Data
 * @returns {string} Data relativa
 */
export const getRelativeDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const days = differenceInDays(new Date(), dateObj);
  
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `Há ${days} dias`;
  if (days < 30) return `Há ${Math.floor(days / 7)} semanas`;
  if (days < 365) return `Há ${Math.floor(days / 30)} meses`;
  return `Há ${Math.floor(days / 365)} anos`;
};

/**
 * Converte data para formato ISO
 * @param {string|Date} date - Data
 * @returns {string} Data em formato ISO
 */
export const toISODate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};