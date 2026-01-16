import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'btn-3d rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:border-b-0 disabled:mt-[4px]';
  
  const variants = {
    primary: 'bg-red text-white border-red-800',
    // Using a darker shade for the secondary border manually since it's not defined in tokens
    secondary: 'bg-white text-main border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white border-red-900',
    ghost: 'bg-transparent text-main border-transparent shadow-none border-b-0 hover:bg-black/5',
    success: 'bg-green text-white border-[#667d32]', // Darker olive green for border
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
