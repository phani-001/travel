import { useState } from 'react';
import { ArrowLeft, Share2, Edit, RotateCcw, Calendar, TrendingUp, MapPin, Users, AlertCircle, IndianRupee } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MoodChip } from '../ui/MoodChip';
import { ActivityCard } from '../ActivityCard';
import { MapView } from '../MapView';
import { MoodInputPanel } from '../MoodInputPanel';
import { ReplanSuggestions } from '../ReplanSuggestions';
import { ActivityDetailsPopup } from '../ActivityDetailsPopup';
import { ExpenditureSplitting } from '../ExpenditureSplitting';
import { NearbyAmenities } from '../NearbyAmenities';
import type { TripData, DayItinerary, Activity, Screen } from '../../App';

interface ItineraryOutputScreenProps {
  tripData: TripData;
  itinerary: DayItinerary[];
  onNavigate: (screen: Screen) => void;
  onRegenerate: (data: TripData) => void;
  onCheckIn: (activity: Activity) => void;
  completedActivities?: Set<string>;
  offlineMapDownloaded?: boolean;
  onDownloadMap?: () => void;
}

export function ItineraryOutputScreen({ 
  tripData, 
  itinerary, 
  onNavigate, 
  onRegenerate, 
  onCheckIn, 
  completedActivities = new Set(),
  offlineMapDownloaded = false,
  onDownloadMap 
}: ItineraryOutputScreenProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [showMoodPanel, setShowMoodPanel] = useState(false);
  const [showReplanSuggestions, setShowReplanSuggestions] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [groupMood, setGroupMood] = useState<'tired' | 'ok' | 'high-energy' | 'sick'>('ok');
  const [showExpenditureSplitting, setShowExpenditureSplitting] = useState(false);
  const [showNearbyAmenities, setShowNearbyAmenities] = useState(false);

  const currentDay = itinerary[selectedDay];
  const stabilityScore = 87; // Mock stability score

  const handleMoodUpdate = (mood: 'tired' | 'ok' | 'high-energy' | 'sick') => {
    setGroupMood(mood);
    if (mood === 'tired' || mood === 'sick') {
      setShowReplanSuggestions(true);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('landing')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h2 className="text-gray-900">{tripData.city} Trip</h2>
                <p className="text-sm text-gray-600">
                  {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoodPanel(!showMoodPanel)}
              >
                Update Mood
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<Users className="w-4 h-4" />}
                onClick={() => onNavigate('group-member')}
              >
                Member View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<AlertCircle className="w-4 h-4" />}
                onClick={() => onNavigate('emergency')}
              >
                Emergency
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={() => onRegenerate(tripData)}
              >
                Re-plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Share2 className="w-4 h-4" />}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mood Panel */}
        {showMoodPanel && (
          <div className="mb-6">
            <MoodInputPanel
              currentMood={groupMood}
              onMoodUpdate={handleMoodUpdate}
              onClose={() => setShowMoodPanel(false)}
            />
          </div>
        )}

        {/* Replan Suggestions */}
        {showReplanSuggestions && (
          <div className="mb-6">
            <ReplanSuggestions
              currentPlan={currentDay}
              mood={groupMood}
              onSelectPlan={(plan) => {
                setShowReplanSuggestions(false);
                // Handle plan selection
              }}
              onClose={() => setShowReplanSuggestions(false)}
            />
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card padding="sm">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Plan Stability</div>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-green-600">{stabilityScore}%</span>
              </div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Total Days</div>
              <div className="text-gray-900">{itinerary.length}</div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Total Budget</div>
              <div className="text-gray-900">
                <IndianRupee className="w-4 h-4 inline-block mr-1" />
                {itinerary.reduce((sum, day) => sum + day.totalCost, 0)}
              </div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Group Size</div>
              <div className="text-gray-900">{tripData.groupSize} travelers</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            icon={<IndianRupee className="w-4 h-4" />}
            onClick={() => setShowExpenditureSplitting(true)}
          >
            Split Expenses
          </Button>
          <Button
            variant="outline"
            icon={<MapPin className="w-4 h-4" />}
            onClick={() => setShowNearbyAmenities(true)}
          >
            Nearby Amenities
          </Button>
        </div>

        {/* Day Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Select Day</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {itinerary.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`
                  flex-shrink-0 px-6 py-4 rounded-xl border-2 transition-all min-w-[140px]
                  ${selectedDay === index
                    ? 'bg-gradient-to-br from-teal-500 to-blue-500 border-transparent text-white shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className="text-sm mb-1">Day {index + 1}</div>
                <div className={`text-xs ${selectedDay === index ? 'text-white/80' : 'text-gray-500'}`}>
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Timeline */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900">
                    {new Date(currentDay.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentDay.activities.length} activities · {currentDay.totalDistance} · ${currentDay.totalCost}
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm border border-teal-200">
                  {currentDay.energyProfile}
                </div>
              </div>

              <div className="space-y-4">
                {currentDay.activities.map((activity, index) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isLast={index === currentDay.activities.length - 1}
                    onClick={() => setSelectedActivity(activity)}
                    onCheckIn={onCheckIn}
                    completed={completedActivities.has(activity.id)}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <MapView 
                activities={currentDay.activities} 
                offlineMapDownloaded={offlineMapDownloaded}
                onDownloadMap={onDownloadMap}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Details Popup */}
      {selectedActivity && (
        <ActivityDetailsPopup
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}

      {/* Expenditure Splitting Popup */}
      {showExpenditureSplitting && (
        <ExpenditureSplitting
          itinerary={itinerary}
          onClose={() => setShowExpenditureSplitting(false)}
        />
      )}

      {/* Nearby Amenities Popup */}
      {showNearbyAmenities && (
        <NearbyAmenities
          activities={currentDay.activities}
          onClose={() => setShowNearbyAmenities(false)}
        />
      )}
    </div>
  );
}