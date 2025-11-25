import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Hotel, Users, Plus, X, DollarSign, Zap, Clock, UtensilsCrossed } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { TripData } from '../../App';

interface CreateTripScreenProps {
  onBack: () => void;
  onCreateTrip: (data: TripData) => void;
}

export function CreateTripScreen({ onBack, onCreateTrip }: CreateTripScreenProps) {
  const [city, setCity] = useState('Visakhapatnam');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hotel, setHotel] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [mustDo, setMustDo] = useState<Array<{id: string; name: string; category: string}>>([]);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [intensityLevel, setIntensityLevel] = useState<'relaxed' | 'balanced' | 'active'>('balanced');
  const [maxTravelTime, setMaxTravelTime] = useState(30);
  const [dietary, setDietary] = useState<string[]>([]);
  const [newPlace, setNewPlace] = useState('');

  const popularPlaces = [
    { name: 'Kailasagiri Hill Park', category: 'Nature' },
    { name: 'RK Beach', category: 'Beach' },
    { name: 'INS Kursura Submarine Museum', category: 'Museum' },
    { name: 'Borra Caves', category: 'Adventure' },
    { name: 'Araku Valley', category: 'Nature' },
    { name: 'Simhachalam Temple', category: 'Heritage' },
  ];

  const addMustDo = (name: string, category: string) => {
    if (mustDo.find(p => p.name === name)) return;
    setMustDo([...mustDo, { id: Date.now().toString(), name, category }]);
  };

  const removeMustDo = (id: string) => {
    setMustDo(mustDo.filter(p => p.id !== id));
  };

  const toggleDietary = (option: string) => {
    setDietary(prev => 
      prev.includes(option) 
        ? prev.filter(d => d !== option) 
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    const tripData: TripData = {
      city,
      startDate,
      endDate,
      hotel,
      groupSize,
      mustDo,
      budgetTier,
      intensityLevel,
      maxTravelTime,
      dietary,
    };
    onCreateTrip(tripData);
  };

  const isValid = city && startDate && endDate && hotel;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Create Your Trip</h1>
          <p className="text-gray-600">Tell us about your trip and we'll create the perfect itinerary</p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <h2 className="text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Destination City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Barcelona"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Hotel className="w-4 h-4 inline mr-1" />
                  Base Hotel / Accommodation
                </label>
                <input
                  type="text"
                  value={hotel}
                  onChange={(e) => setHotel(e.target.value)}
                  placeholder="e.g., Hotel Arts Barcelona"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
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
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
                  onChange={(e) => setGroupSize(parseInt(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </Card>

          {/* Must-Do Places */}
          <Card>
            <h2 className="text-gray-900 mb-2">Must-Do Places</h2>
            <p className="text-sm text-gray-600 mb-6">Add places you definitely want to visit</p>
            
            {/* Popular suggestions */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-3">Popular in {city || 'your destination'}:</p>
              <div className="flex flex-wrap gap-2">
                {popularPlaces.map((place) => (
                  <button
                    key={place.name}
                    onClick={() => addMustDo(place.name, place.category)}
                    disabled={mustDo.some(p => p.name === place.name)}
                    className="px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed border border-teal-200"
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    {place.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPlace}
                onChange={(e) => setNewPlace(e.target.value)}
                placeholder="Add custom place..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newPlace) {
                    addMustDo(newPlace, 'Custom');
                    setNewPlace('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (newPlace) {
                    addMustDo(newPlace, 'Custom');
                    setNewPlace('');
                  }
                }}
                disabled={!newPlace}
              >
                Add
              </Button>
            </div>
            
            {/* Selected places */}
            {mustDo.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mustDo.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                  >
                    <span className="text-sm">{place.name}</span>
                    <span className="text-xs bg-blue-200 px-2 py-0.5 rounded">{place.category}</span>
                    <button
                      onClick={() => removeMustDo(place.id)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Constraints */}
          <Card>
            <h2 className="text-gray-900 mb-6">Trip Preferences</h2>
            
            <div className="space-y-6">
              {/* Budget Tier */}
              <div>
                <label className="block text-sm text-gray-700 mb-3">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['budget', 'moderate', 'luxury'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setBudgetTier(tier)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        budgetTier === tier
                          ? 'bg-teal-50 border-teal-500 text-teal-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="capitalize mb-1">{tier}</div>
                      <div className="text-xs text-gray-500">
                        {tier === 'budget' && '$-$$'}
                        {tier === 'moderate' && '$$-$$$'}
                        {tier === 'luxury' && '$$$-$$$$'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Level */}
              <div>
                <label className="block text-sm text-gray-700 mb-3">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Intensity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['relaxed', 'balanced', 'active'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setIntensityLevel(level)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        intensityLevel === level
                          ? 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="capitalize mb-1">{level}</div>
                      <div className="text-xs text-gray-500">
                        {level === 'relaxed' && '2-3 activities/day'}
                        {level === 'balanced' && '4-5 activities/day'}
                        {level === 'active' && '6+ activities/day'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Travel Time */}
              <div>
                <label className="block text-sm text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Max Travel Time Between Activities: {maxTravelTime} min
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={maxTravelTime}
                  onChange={(e) => setMaxTravelTime(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-sm text-gray-700 mb-3">
                  <UtensilsCrossed className="w-4 h-4 inline mr-1" />
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher'].map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleDietary(option)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm transition-all capitalize ${
                        dietary.includes(option)
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              fullWidth
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Generate Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}