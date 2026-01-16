import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-main font-header font-bold mb-2 ml-1">
          {label}
        </label>
      )}
      <input 
        className={`input-chunky ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 ml-1 text-sm text-red font-bold">{error}</p>
      )}
    </div>
  );
};
