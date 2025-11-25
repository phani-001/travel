import { ArrowLeft, Bell, Lock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MoodChip } from '../ui/MoodChip';
import { ActivityCard } from '../ActivityCard';
import type { TripData, DayItinerary } from '../../App';

interface GroupMemberViewProps {
  tripData: TripData;
  itinerary: DayItinerary[];
  onBack: () => void;
}

export function GroupMemberView({ tripData, itinerary, onBack }: GroupMemberViewProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [myMood, setMyMood] = useState<'tired' | 'ok' | 'high-energy' | 'sick'>('ok');
  const [notifications] = useState([
    { id: 1, message: 'Organizer updated Day 2 itinerary', time: '10 min ago', read: false },
    { id: 2, message: 'Weather alert: Rain expected tomorrow', time: '1 hour ago', read: false },
  ]);

  const currentDay = itinerary[selectedDay];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Organizer View</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm">
                M
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Read-only Banner */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-900 mb-1">Member View (Read-Only)</h3>
              <p className="text-sm text-blue-700">
                You're viewing this trip as a group member. Only the organizer can edit the itinerary. 
                You can update your mood and view notifications.
              </p>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        {notifications.filter(n => !n.read).length > 0 && (
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Updates</h3>
            </div>
            <div className="space-y-2">
              {notifications.filter(n => !n.read).map((notif) => (
                <div key={notif.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-900 mb-1">{notif.message}</p>
                  <p className="text-xs text-gray-600">{notif.time}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Mood Update */}
        <Card className="mb-6">
          <h3 className="text-gray-900 mb-4">How Are You Feeling Today?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MoodChip
              mood="high-energy"
              selected={myMood === 'high-energy'}
              onClick={() => setMyMood('high-energy')}
            />
            <MoodChip
              mood="ok"
              selected={myMood === 'ok'}
              onClick={() => setMyMood('ok')}
            />
            <MoodChip
              mood="tired"
              selected={myMood === 'tired'}
              onClick={() => setMyMood('tired')}
            />
            <MoodChip
              mood="sick"
              selected={myMood === 'sick'}
              onClick={() => setMyMood('sick')}
            />
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700">
              Your mood has been shared with the group organizer
            </p>
          </div>
        </Card>

        {/* Trip Info */}
        <Card className="mb-6">
          <h3 className="text-gray-900 mb-4">{tripData.city} Trip</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Dates</p>
              <p className="text-gray-900">
                {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Accommodation</p>
              <p className="text-gray-900">{tripData.hotel}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Group Size</p>
              <p className="text-gray-900">{tripData.groupSize} travelers</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Budget Tier</p>
              <p className="text-gray-900 capitalize">{tripData.budgetTier}</p>
            </div>
          </div>
        </Card>

        {/* Day Selector */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">Daily Itinerary</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {itinerary.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`
                  flex-shrink-0 px-6 py-4 rounded-xl border-2 transition-all min-w-[140px]
                  ${selectedDay === index
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-transparent text-white shadow-lg'
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

        {/* Activities */}
        <Card>
          <div className="mb-6">
            <h3 className="text-gray-900 mb-2">
              {new Date(currentDay.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <p className="text-sm text-gray-600">
              {currentDay.activities.length} activities · {currentDay.totalDistance} · ${currentDay.totalCost}
            </p>
          </div>

          <div className="space-y-4">
            {currentDay.activities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isLast={index === currentDay.activities.length - 1}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
