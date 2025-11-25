import { Smile, Meh, Zap, HeartPulse } from 'lucide-react';

interface MoodChipProps {
  mood: 'tired' | 'ok' | 'high-energy' | 'sick';
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function MoodChip({ mood, selected = false, onClick, size = 'md' }: MoodChipProps) {
  const moodConfig = {
    'tired': {
      label: 'Tired',
      icon: Meh,
      color: 'orange',
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300',
      selectedBg: 'bg-orange-500',
      selectedText: 'text-white',
    },
    'ok': {
      label: 'OK',
      icon: Smile,
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      selectedBg: 'bg-blue-500',
      selectedText: 'text-white',
    },
    'high-energy': {
      label: 'High Energy',
      icon: Zap,
      color: 'green',
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      selectedBg: 'bg-green-500',
      selectedText: 'text-white',
    },
    'sick': {
      label: 'Not Well',
      icon: HeartPulse,
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      selectedBg: 'bg-red-500',
      selectedText: 'text-white',
    },
  };
  
  const config = moodConfig[mood];
  const Icon = config.icon;
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        rounded-xl border-2 flex items-center gap-2 transition-all
        ${sizeStyles[size]}
        ${selected 
          ? `${config.selectedBg} ${config.selectedText} border-transparent shadow-lg` 
          : `${config.bg} ${config.text} ${config.border} hover:shadow-md`
        }
      `}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </button>
  );
}
