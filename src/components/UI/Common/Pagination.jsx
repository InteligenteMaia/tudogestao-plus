// 🎨 Najla Cardeal - QA/Designer
// 💻 Felipe Gonzaga - Frontend Developer
// Componente de paginação

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 5,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const halfMax = Math.floor(maxButtons / 2);
    
    let startPage = Math.max(currentPage - halfMax, 1);
    let endPage = Math.min(startPage + maxButtons - 1, totalPages);
    
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(endPage - maxButtons + 1, 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon={<ChevronLeft className="w-4 h-4" />}
      />

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${page === currentPage
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }
          `}
        >
          {page}
        </button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        icon={<ChevronRight className="w-4 h-4" />}
      />
    </div>
  );
};

export default Pagination;