import React from 'react';

const LoadingSpinner = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${spinnerSize} border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;