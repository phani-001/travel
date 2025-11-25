import { ReactNode } from 'react';
import { Zap, Battery, BatteryLow, Sun, Cloud, DollarSign, Home } from 'lucide-react';

interface TagProps {
  children: ReactNode;
  type?: 'energy' | 'weather' | 'cost' | 'indoor' | 'outdoor' | 'custom';
  variant?: 'low' | 'medium' | 'high' | 'default';
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

export function Tag({ children, type = 'custom', variant = 'default', icon, size = 'md' }: TagProps) {
  const getIcon = () => {
    if (icon) return icon;
    
    if (type === 'energy') {
      if (variant === 'low') return <BatteryLow className="w-3 h-3" />;
      if (variant === 'medium') return <Battery className="w-3 h-3" />;
      if (variant === 'high') return <Zap className="w-3 h-3" />;
    }
    
    if (type === 'weather') return <Sun className="w-3 h-3" />;
    if (type === 'cost') return <DollarSign className="w-3 h-3" />;
    if (type === 'indoor') return <Home className="w-3 h-3" />;
    
    return null;
  };
  
  const getStyles = () => {
    if (type === 'energy') {
      if (variant === 'low') return 'bg-green-100 text-green-700 border-green-200';
      if (variant === 'medium') return 'bg-orange-100 text-orange-700 border-orange-200';
      if (variant === 'high') return 'bg-red-100 text-red-700 border-red-200';
    }
    
    if (type === 'cost') {
      if (variant === 'low') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      if (variant === 'medium') return 'bg-amber-100 text-amber-700 border-amber-200';
      if (variant === 'high') return 'bg-rose-100 text-rose-700 border-rose-200';
    }
    
    if (type === 'indoor') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (type === 'outdoor') return 'bg-teal-100 text-teal-700 border-teal-200';
    if (type === 'weather') return 'bg-sky-100 text-sky-700 border-sky-200';
    
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };
  
  const sizeStyles = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  
  return (
    <span className={`
      inline-flex items-center gap-1 rounded-lg border
      ${getStyles()}
      ${sizeStyles}
    `}>
      {getIcon()}
      {children}
    </span>
  );
}
