// 🎨 Najla Cardeal - QA/Designer
// 💻 Felipe Gonzaga - Frontend Developer
// Estado vazio

import React from 'react';
import { FileX } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = FileX,
  title = 'Nenhum registro encontrado',
  description,
  action,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-h3 text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-body text-gray-500 dark:text-gray-400 max-w-md mb-6">
          {description}
        </p>
      )}

      {(action || onAction) && (
        <div>
          {action || (
            <Button onClick={onAction}>
              {actionLabel || 'Adicionar'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;