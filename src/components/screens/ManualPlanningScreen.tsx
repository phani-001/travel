import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Clock, MapPin, Calendar, CheckCircle, Edit2, DollarSign, Hotel, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { TripData, DayItinerary, Activity } from '../../App';

interface ManualPlanningScreenProps {
  onBack: () => void;
  tripData: TripData | null;
  onComplete: (itinerary: DayItinerary[], tripData: TripData) => void;
}

export function ManualPlanningScreen({ onBack, tripData: initialTripData, onComplete }: ManualPlanningScreenProps) {
  const [step, setStep] = useState(1); // 1: Trip Details, 2: Build Itinerary
  
  // Trip Details State
  const [city, setCity] = useState(initialTripData?.city || '');
  const [startDate, setStartDate] = useState(initialTripData?.startDate || '');
  const [endDate, setEndDate] = useState(initialTripData?.endDate || '');
  const [hotel, setHotel] = useState(initialTripData?.hotel || '');
  const [groupSize, setGroupSize] = useState(initialTripData?.groupSize || 2);
  
  // Itinerary State
  const [selectedDay, setSelectedDay] = useState(0);
  const [days, setDays] = useState<DayItinerary[]>([]);
  
  // Custom Activity Form State
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityTime, setActivityTime] = useState('09:00');
  const [activityLocation, setActivityLocation] = useState('');
  const [activityCategory, setActivityCategory] = useState('');
  const [activityCost, setActivityCost] = useState(0);
  const [activityEnergy, setActivityEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [activityIndoor, setActivityIndoor] = useState(false);

  // Initialize days when moving to step 2
  const initializeDays = () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newDays: DayItinerary[] = Array.from({ length: dayCount }, (_, i) => {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      return {
        date: currentDate.toISOString().split('T')[0],
        activities: [],
        totalDistance: '0 km',
        totalCost: 0,
        energyProfile: 'Custom Day',
      };
    });
    
    setDays(newDays);
    setStep(2);
  };

  const addCustomActivity = () => {
    if (!activityName || !activityLocation) return;

    const newActivity: Activity = {
      id: `manual-${Date.now()}`,
      time: activityTime,
      title: activityName,
      category: activityCategory || 'Custom Activity',
      location: activityLocation,
      distance: '0 km',
      travelTime: 0,
      energy: activityEnergy,
      indoor: activityIndoor,
      cost: activityCost,
      description: `Custom activity: ${activityName}`,
      hours: 'As planned',
      weatherSuitable: activityIndoor ? ['sunny', 'cloudy', 'rainy'] : ['sunny', 'cloudy'],
      dietary: ['all'],
      image: activityIndoor 
        ? 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGx8ZW58MXx8fHwxNzY0MDQ5Nzg4fDA&ixlib=rb-4.1.0&q=80&w=1080'
        : 'https://images.unsplash.com/photo-1707340247339-5ad8eef7c04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWxsdG9wJTIwdmlld3BvaW50JTIwY2l0eXxlbnwxfHx8fDE3NjQwNDk3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      lat: 17.7100,
      lng: 83.3100,
    };

    setDays(prevDays => {
      const updated = [...prevDays];
      updated[selectedDay] = {
        ...updated[selectedDay],
        activities: [...updated[selectedDay].activities, newActivity].sort((a, b) => a.time.localeCompare(b.time)),
        totalCost: updated[selectedDay].totalCost + newActivity.cost,
      };
      return updated;
    });

    // Reset form
    setActivityName('');
    setActivityTime('09:00');
    setActivityLocation('');
    setActivityCategory('');
    setActivityCost(0);
    setActivityEnergy('medium');
    setActivityIndoor(false);
    setShowAddActivity(false);
  };

  const removeActivity = (activityId: string) => {
    setDays(prevDays => {
      const updated = [...prevDays];
      const removedActivity = updated[selectedDay].activities.find(a => a.id === activityId);
      updated[selectedDay] = {
        ...updated[selectedDay],
        activities: updated[selectedDay].activities.filter(a => a.id !== activityId),
        totalCost: updated[selectedDay].totalCost - (removedActivity?.cost || 0),
      };
      return updated;
    });
  };

  const handleComplete = () => {
    const tripData: TripData = {
      city,
      startDate,
      endDate,
      hotel,
      groupSize,
      mustDo: [],
      budgetTier: 'moderate',
      intensityLevel: 'balanced',
      maxTravelTime: 30,
      dietary: [],
    };
    
    onComplete(days, tripData);
  };

  const isStep1Valid = city && startDate && endDate && hotel;

  if (step === 1) {
    // Step 1: Trip Details
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-peach-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">Manual Trip Planning</h1>
            <p className="text-gray-600">Enter your trip details to get started</p>
          </div>

          <Card>
            <h2 className="text-gray-900 mb-6">Trip Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Destination City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter destination (e.g., Paris, Tokyo, Mumbai)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Hotel className="w-4 h-4 inline mr-1" />
                  Hotel / Accommodation *
                </label>
                <input
                  type="text"
                  value={hotel}
                  onChange={(e) => setHotel(e.target.value)}
                  placeholder="Enter hotel name or address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Group Size
                </label>
                <input
                  type="number"
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={onBack}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={initializeDays}
                disabled={!isStep1Valid}
              >
                Continue to Build Itinerary
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Build Itinerary
  const currentDay = days[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-peach-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Trip Details</span>
              </button>
              <p className="text-sm text-gray-600 ml-7">{city} • {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</p>
            </div>
            <Button
              variant="primary"
              onClick={handleComplete}
              icon={<CheckCircle className="w-4 h-4" />}
              disabled={days.every(d => d.activities.length === 0)}
            >
              Complete Planning
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Build Your Itinerary</h1>
          <p className="text-gray-600">Add activities to each day of your trip</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Day Selector & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day Selector */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Select Day</h3>
                <div className="text-sm text-gray-600">
                  {days.reduce((sum, d) => sum + d.activities.length, 0)} total activities
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedDay === index
                        ? 'bg-teal-50 border-teal-500 text-teal-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm">Day {index + 1}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-teal-600 mt-1">
                      {day.activities.length} activities
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Current Day Activities */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900">
                    Day {selectedDay + 1} - {new Date(currentDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentDay.activities.length} activities • ₹{currentDay.totalCost}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowAddActivity(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Activity
                </Button>
              </div>

              {currentDay.activities.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No activities added yet</p>
                  <p className="text-sm text-gray-500">Click "Add Activity" to start planning this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentDay.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs">
                                  {activity.time}
                                </span>
                                <h4 className="text-gray-900">{activity.title}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{activity.category}</p>
                            </div>
                            <button
                              onClick={() => removeActivity(activity.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              <span>₹{activity.cost}</span>
                            </div>
                            <div>
                              <span className={`px-2 py-0.5 rounded ${
                                activity.energy === 'low' ? 'bg-green-100 text-green-700' :
                                activity.energy === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {activity.energy} energy
                              </span>
                            </div>
                            <div>
                              <span className={`px-2 py-0.5 rounded ${
                                activity.indoor ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {activity.indoor ? 'Indoor' : 'Outdoor'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right: Activity Summary */}
          <div>
            <Card className="sticky top-6">
              <h3 className="text-gray-900 mb-4">Trip Summary</h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Activities</p>
                  <p className="text-2xl text-gray-900">
                    {days.reduce((sum, d) => sum + d.activities.length, 0)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                  <p className="text-2xl text-gray-900">
                    ₹{days.reduce((sum, d) => sum + d.totalCost, 0)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Trip Duration</p>
                  <p className="text-2xl text-gray-900">
                    {days.length} days
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm text-gray-700 mb-3">Daily Breakdown</h4>
                  <div className="space-y-2">
                    {days.map((day, index) => (
                      <div
                        key={index}
                        className={`flex justify-between text-sm p-2 rounded ${
                          selectedDay === index ? 'bg-teal-50' : ''
                        }`}
                      >
                        <span className="text-gray-600">Day {index + 1}</span>
                        <span className="text-gray-900">{day.activities.length} activities</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Add New Activity</h2>
                <button
                  onClick={() => setShowAddActivity(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-600 text-xl">×</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Activity Name *</label>
                  <input
                    type="text"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="e.g., Visit Eiffel Tower, Lunch at Italian Restaurant"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time *
                    </label>
                    <input
                      type="time"
                      value={activityTime}
                      onChange={(e) => setActivityTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={activityCost}
                      onChange={(e) => setActivityCost(parseInt(e.target.value) || 0)}
                      min="0"
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={activityLocation}
                    onChange={(e) => setActivityLocation(e.target.value)}
                    placeholder="e.g., Champs-Élysées, Downtown, Beach Road"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={activityCategory}
                    onChange={(e) => setActivityCategory(e.target.value)}
                    placeholder="e.g., Sightseeing, Dining, Adventure, Shopping"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Energy Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setActivityEnergy(level)}
                        className={`p-3 rounded-xl border-2 transition-all capitalize ${
                          activityEnergy === level
                            ? 'bg-teal-50 border-teal-500 text-teal-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activityIndoor}
                      onChange={(e) => setActivityIndoor(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">Indoor Activity</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowAddActivity(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={addCustomActivity}
                  disabled={!activityName || !activityLocation}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Activity
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
