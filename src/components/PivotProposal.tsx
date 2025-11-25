import { useState } from 'react';
import { Zap, MapPin, DollarSign, Star, Activity, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Activity {
  id: string;
  time: string;
  title: string;
  type: string;
  location: string;
  intensity: 'low' | 'medium' | 'high';
  cost: number;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
}

interface Alternative {
  id: string;
  title: string;
  type: string;
  location: string;
  distance: string;
  intensity: 'low' | 'medium' | 'high';
  cost: number;
  availability: boolean;
  rating: number;
  description: string;
}

interface Pivot {
  id: string;
  triggeredBy: string;
  reason: string;
  timestamp: string;
  originalActivities: Activity[];
  alternatives: Alternative[];
  status: 'pending' | 'approved' | 'rejected';
}

interface PivotProposalProps {
  pivot: Pivot;
  onApprove: (selectedAlternatives: string[]) => void;
  onReject: () => void;
  isOrganizer: boolean;
}

export function PivotProposal({ pivot, onApprove, onReject, isOrganizer }: PivotProposalProps) {
  const [selectedAlternatives, setSelectedAlternatives] = useState<string[]>([]);

  const intensityColors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-orange-600 bg-orange-50',
    high: 'text-red-600 bg-red-50',
  };

  const toggleAlternative = (id: string) => {
    setSelectedAlternatives(prev =>
      prev.includes(id) ? prev.filter(altId => altId !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg border-2 border-orange-300 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-orange-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-500 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-gray-900">Mood Pivot Suggested</h2>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                Action Required
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{pivot.reason}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Triggered by: {pivot.triggeredBy}</span>
              <span>·</span>
              <span>{pivot.timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Activities to Cancel/Downgrade */}
        <div>
          <h3 className="text-gray-900 mb-3">Activities Affected</h3>
          <div className="space-y-2">
            {pivot.originalActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-lg p-4 border border-gray-200 opacity-60"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{activity.time}</span>
                      <span className={`px-2 py-0.5 text-xs rounded ${intensityColors[activity.intensity]}`}>
                        {activity.intensity} intensity
                      </span>
                    </div>
                    <p className="text-gray-900 mb-1">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">${activity.cost}</p>
                    <p className="text-xs text-red-600 mt-1">To be cancelled</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Options */}
        <div>
          <h3 className="text-gray-900 mb-3">
            Suggested Alternatives
            <span className="text-sm text-gray-500 ml-2">
              ({selectedAlternatives.length} selected)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pivot.alternatives.map((alt) => {
              const isSelected = selectedAlternatives.includes(alt.id);
              return (
                <button
                  key={alt.id}
                  onClick={() => toggleAlternative(alt.id)}
                  className={`text-left bg-white rounded-lg p-4 border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-900">{alt.title}</p>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{alt.type}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-700">{alt.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{alt.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{alt.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span className={intensityColors[alt.intensity].split(' ')[0]}>
                        {alt.intensity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>${alt.cost}</span>
                    </div>
                  </div>

                  {alt.availability && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-green-600">✓ Available for immediate booking</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        {isOrganizer && (
          <div className="flex items-center gap-3 pt-4 border-t border-orange-200">
            <button
              onClick={() => onApprove(selectedAlternatives)}
              disabled={selectedAlternatives.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                Approve Pivot {selectedAlternatives.length > 0 && `(${selectedAlternatives.length} activities)`}
              </span>
            </button>
            <button
              onClick={onReject}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              <span>Keep Original</span>
            </button>
          </div>
        )}

        {!isOrganizer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ℹ️ Waiting for organizer approval. You'll be notified once a decision is made.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
