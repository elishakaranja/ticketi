import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick, 
  type = 'button', 
  className = '',
  disabled = false
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-primary-200 text-neutral-800 hover:bg-primary-300 active:bg-primary-400 focus:ring-primary-300',
    outline: 'border-2 border-primary-300 text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-300',
    accent: 'bg-accent-300 text-neutral-800 hover:bg-accent-400 active:bg-accent-200 focus:ring-accent-300',
    ghost: 'text-neutral-600 hover:bg-primary-100 active:bg-primary-200 focus:ring-primary-200'
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 