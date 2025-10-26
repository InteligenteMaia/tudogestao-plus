// 🎨 Najla Cardeal - QA/Designer
// 💻 Felipe Gonzaga - Frontend Developer
// Componente de card

import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`card-apple ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            {title && (
              <h3 className="text-h3 text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-caption text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default Card;