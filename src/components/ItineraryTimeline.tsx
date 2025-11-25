import { Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

interface DayPlan {
  date: string;
  activities: Activity[];
}

interface ItineraryTimelineProps {
  dayPlan: DayPlan;
  currentTime: string;
}

export function ItineraryTimeline({ dayPlan, currentTime }: ItineraryTimelineProps) {
  const intensityColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-orange-600 bg-orange-50 border-orange-200',
    high: 'text-red-600 bg-red-50 border-red-200',
  };

  const statusConfig = {
    confirmed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'Confirmed',
    },
    pending: {
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      label: 'Pending',
    },
    cancelled: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Cancelled',
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Today's Itinerary</h2>
          <p className="text-sm text-gray-500">
            {new Date(dayPlan.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current time</p>
          <p className="text-gray-900">{currentTime} AM</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {dayPlan.activities.map((activity, index) => {
            const status = statusConfig[activity.bookingStatus];
            const StatusIcon = status.icon;
            const isCurrentOrUpcoming = activity.time >= currentTime;
            const isCancelled = activity.bookingStatus === 'cancelled';

            return (
              <div key={activity.id} className="relative pl-16">
                {/* Time marker */}
                <div className="absolute left-0 top-0 flex items-center">
                  <div className={`w-12 h-12 rounded-full border-4 ${
                    isCancelled 
                      ? 'bg-gray-100 border-gray-300'
                      : isCurrentOrUpcoming 
                      ? 'bg-blue-500 border-blue-200' 
                      : 'bg-white border-gray-300'
                  } flex items-center justify-center shadow-sm z-10`}>
                    <Clock className={`w-5 h-5 ${
                      isCancelled 
                        ? 'text-gray-400'
                        : isCurrentOrUpcoming 
                        ? 'text-white' 
                        : 'text-gray-400'
                    }`} />
                  </div>
                </div>

                {/* Activity Card */}
                <div className={`bg-white rounded-lg border-2 ${status.border} ${
                  isCancelled ? 'opacity-50' : 'shadow-sm'
                } overflow-hidden transition-all hover:shadow-md`}>
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-500">{activity.time}</span>
                          <span className={`px-2 py-0.5 text-xs rounded border ${intensityColors[activity.intensity]}`}>
                            {activity.intensity}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded ${status.bg} ${status.color} flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <h3 className={`text-gray-900 mb-1 ${isCancelled ? 'line-through' : ''}`}>
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600">{activity.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">${activity.cost}</p>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{activity.location}</span>
                    </div>

                    {/* Additional info for pending bookings */}
                    {activity.bookingStatus === 'pending' && (
                      <div className="mt-3 pt-3 border-t border-orange-100">
                        <p className="text-xs text-orange-700">
                          ⏳ Booking in progress. Confirmation expected within 15 minutes.
                        </p>
                      </div>
                    )}

                    {/* Additional info for cancelled */}
                    {activity.bookingStatus === 'cancelled' && (
                      <div className="mt-3 pt-3 border-t border-red-100">
                        <p className="text-xs text-red-700">
                          Cancelled due to group mood pivot. Refund processed automatically.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">Total Activities</p>
            <p className="text-gray-900">{dayPlan.activities.length}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Confirmed</p>
            <p className="text-green-600">
              {dayPlan.activities.filter(a => a.bookingStatus === 'confirmed').length}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Total Cost</p>
            <p className="text-gray-900">
              ${dayPlan.activities
                .filter(a => a.bookingStatus !== 'cancelled')
                .reduce((sum, a) => sum + a.cost, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
