import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface Traveler {
  id: string;
  name: string;
  avatar: string;
  status: 'great' | 'tired' | 'sick' | 'bored' | null;
  lastUpdate: string;
}

interface GroupStatusOverviewProps {
  travelers: Traveler[];
}

export function GroupStatusOverview({ travelers }: GroupStatusOverviewProps) {
  const statusColors = {
    great: 'bg-green-500',
    tired: 'bg-orange-500',
    sick: 'bg-red-500',
    bored: 'bg-purple-500',
    null: 'bg-gray-300',
  };

  const statusCounts = travelers.reduce((acc, t) => {
    const status = t.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const concernCount = (statusCounts.tired || 0) + (statusCounts.sick || 0) + (statusCounts.bored || 0);
  const concernPercentage = Math.round((concernCount / travelers.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h2 className="text-gray-900">Group Status</h2>
      </div>

      {/* Alert if concerns */}
      {concernPercentage >= 50 && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-orange-800">
              {concernPercentage}% of group needs attention
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Consider pivoting to lower-intensity activities
            </p>
          </div>
        </div>
      )}

      {/* Traveler list */}
      <div className="space-y-3">
        {travelers.map((traveler) => (
          <div key={traveler.id} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm relative">
              {traveler.avatar}
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusColors[traveler.status || 'null']}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{traveler.name}</p>
              <p className="text-xs text-gray-500">
                {traveler.status ? traveler.status.charAt(0).toUpperCase() + traveler.status.slice(1) : 'No status'} · {traveler.lastUpdate}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Feeling Great</p>
            <p className="text-green-600">{statusCounts.great || 0}/{travelers.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Need Attention</p>
            <p className={concernCount > 0 ? 'text-orange-600' : 'text-gray-600'}>
              {concernCount}/{travelers.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
