// 🎨 Najla Cardeal - QA/Designer
// 💻 Felipe Gonzaga - Frontend Developer
// Componente de loading

import React from 'react';

const Loading = ({ 
  fullscreen = false, 
  size = 'md', 
  text = 'Carregando...' 
}) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`loading-spinner ${sizes[size]}`} />
      {text && (
        <p className="text-body text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loading;