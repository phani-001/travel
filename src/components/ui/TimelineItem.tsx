import { ReactNode } from 'react';
import { Clock } from 'lucide-react';

interface TimelineItemProps {
  time: string;
  children: ReactNode;
  isLast?: boolean;
  isActive?: boolean;
}

export function TimelineItem({ time, children, isLast = false, isActive = false }: TimelineItemProps) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div className={`
          w-10 h-10 rounded-full border-4 flex items-center justify-center z-10
          ${isActive 
            ? 'bg-teal-500 border-teal-200 shadow-lg' 
            : 'bg-white border-gray-300'
          }
        `}>
          <Clock className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gray-200 mt-2" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="text-sm text-gray-600 mb-2">{time}</div>
        {children}
      </div>
    </div>
  );
}
