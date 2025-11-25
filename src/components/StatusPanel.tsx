import { Smile, Frown, HeartPulse, Meh } from 'lucide-react';

interface StatusPanelProps {
  currentStatus: 'great' | 'tired' | 'sick' | 'bored' | null;
  onStatusUpdate: (status: 'great' | 'tired' | 'sick' | 'bored') => void;
  isOrganizer: boolean;
}

export function StatusPanel({ currentStatus, onStatusUpdate, isOrganizer }: StatusPanelProps) {
  const statuses = [
    { value: 'great', label: 'Feeling Great', icon: Smile, color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-300', textColor: 'text-green-700', hoverColor: 'hover:bg-green-100' },
    { value: 'tired', label: 'Tired', icon: Meh, color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-300', textColor: 'text-orange-700', hoverColor: 'hover:bg-orange-100' },
    { value: 'sick', label: 'Not Feeling Well', icon: HeartPulse, color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-300', textColor: 'text-red-700', hoverColor: 'hover:bg-red-100' },
    { value: 'bored', label: 'Want Change', icon: Frown, color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', textColor: 'text-purple-700', hoverColor: 'hover:bg-purple-100' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-gray-900 mb-2">How are you feeling?</h2>
      <p className="text-sm text-gray-500 mb-4">
        {isOrganizer 
          ? 'Update your status to help the group adapt plans'
          : 'Let the organizer know how you\'re feeling'
        }
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {statuses.map((status) => {
          const Icon = status.icon;
          const isActive = currentStatus === status.value;
          
          return (
            <button
              key={status.value}
              onClick={() => onStatusUpdate(status.value as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? `${status.bgColor} ${status.borderColor} shadow-md`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? status.textColor : 'text-gray-400'}`} />
              <span className={`text-sm block ${isActive ? status.textColor : 'text-gray-600'}`}>
                {status.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {currentStatus && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Last updated: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
      )}
    </div>
  );
}
