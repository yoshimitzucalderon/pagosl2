import React from 'react';

interface CardBoxProps {
  children: React.ReactNode;
  className?: string;
}

const CardBox: React.FC<CardBoxProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default CardBox; 