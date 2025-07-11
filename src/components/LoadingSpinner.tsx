import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'is-small',
    medium: 'is-medium',
    large: 'is-large'
  };

  return (
    <div className="has-text-centered p-4">
      <div className={`spinner ${sizeClasses[size]}`}>
        <div className="spinner-border" role="status">
          <span className="sr-only">{message}</span>
        </div>
      </div>
      {message && (
        <p className="has-text-grey mt-2">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 