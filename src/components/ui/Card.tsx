import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`
      bg-white rounded-2xl shadow-md border border-gray-100
      ${hover ? 'hover:shadow-xl transition-shadow duration-200' : ''}
      ${paddingStyles[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
}
