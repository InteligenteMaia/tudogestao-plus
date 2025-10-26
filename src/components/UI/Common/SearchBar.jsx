// 🎨 Najla Cardeal - QA/Designer
// 💻 Felipe Gonzaga - Frontend Developer
// Barra de pesquisa

import React from 'react';
import { Search } from 'lucide-react';
import Input from './Input';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Pesquisar...',
  onSearch,
  ...props 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      icon={<Search className="w-5 h-5" />}
      {...props}
    />
  );
};

export default SearchBar;