import { Sparkles, Calendar, MapPin, Users, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { Screen } from '../../App';
import type { UserData } from '../../App';

interface HomeScreenProps {
  user: UserData;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function HomeScreen({ user, onNavigate, onLogout }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-peach-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Traverse</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-3">Plan Your Next Adventure</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose how you'd like to create your perfect trip - let AI do the magic or build it yourself
          </p>
        </div>

        {/* Planning Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* AI Planning */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-teal-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-bl-full" />
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-gray-900 mb-2">AI-Powered Planning</h3>
              <p className="text-gray-600 mb-6">
                Let our intelligent AI create a personalized itinerary based on your preferences, mood, and energy levels
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                  <span>Smart activity recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                  <span>Real-time mood adaptation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                  <span>Weather & distance optimization</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                  <span>Budget-conscious planning</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                fullWidth
                onClick={() => onNavigate('create-trip')}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Start AI Planning
              </Button>
            </div>
          </Card>

          {/* Manual Planning */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full" />
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-gray-900 mb-2">Manual Planning</h3>
              <p className="text-gray-600 mb-6">
                Take full control and build your itinerary from scratch. Choose each activity, time, and location yourself
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Complete customization</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Pick your own activities</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Set custom timings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Drag & drop interface</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                fullWidth
                onClick={() => onNavigate('manual-planning')}
                icon={<Calendar className="w-4 h-4" />}
              >
                Manual Planning
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Trips Section (Optional - for future) */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-gray-900 mb-4">Your Recent Trips</h3>
          <Card className="bg-gray-50 border-dashed">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">No trips yet</p>
              <p className="text-sm text-gray-500">Your created trips will appear here</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}