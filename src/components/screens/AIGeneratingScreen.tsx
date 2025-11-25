import { useEffect, useState } from 'react';
import { Sparkles, Map, Cloud, Zap, DollarSign, Check } from 'lucide-react';
import type { TripData } from '../../App';

interface AIGeneratingScreenProps {
  tripData: TripData | null;
}

export function AIGeneratingScreen({ tripData }: AIGeneratingScreenProps) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: Map, label: 'Analyzing distances & routes', color: 'text-teal-600' },
    { icon: Cloud, label: 'Checking weather patterns', color: 'text-blue-600' },
    { icon: Zap, label: 'Optimizing energy levels', color: 'text-orange-600' },
    { icon: DollarSign, label: 'Balancing budget allocation', color: 'text-green-600' },
    { icon: Sparkles, label: 'Creating your perfect itinerary', color: 'text-purple-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Loading Animation */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Animated circles */}
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 rounded-full border-4 border-teal-200 animate-ping opacity-20" />
              <div className="absolute inset-0 rounded-full border-4 border-teal-300 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-6 rounded-full shadow-xl">
                  <Sparkles className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-gray-900 mt-8 mb-3">Creating Your Perfect Trip</h1>
          <p className="text-gray-600 text-lg">
            Our AI is analyzing {tripData?.city || 'your destination'} to build an optimized itinerary
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="space-y-4">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isComplete = index < step;
              const isCurrent = index === step;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isCurrent ? 'bg-teal-50 scale-105' : isComplete ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${isComplete 
                      ? 'bg-green-500' 
                      : isCurrent 
                      ? 'bg-gradient-to-br from-teal-500 to-blue-500' 
                      : 'bg-gray-200'
                    }
                  `}>
                    {isComplete ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`transition-all ${
                      isCurrent ? 'text-gray-900' : isComplete ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {stepItem.label}
                    </p>
                  </div>
                  
                  {isCurrent && (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trip Summary */}
        {tripData && (
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Trip Summary:</p>
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                📍 {tripData.city}
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                👥 {tripData.groupSize} travelers
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                💰 {tripData.budgetTier}
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                ⚡ {tripData.intensityLevel}
              </div>
              {tripData.mustDo.length > 0 && (
                <div className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700">
                  ✨ {tripData.mustDo.length} must-do places
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
