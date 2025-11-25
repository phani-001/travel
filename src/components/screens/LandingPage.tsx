import { Plane, Sparkles, Map, Clock, Heart, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { Screen } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (screen: Screen) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-2 rounded-xl">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-900">FlowTrip</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900">Features</button>
              <button className="text-gray-600 hover:text-gray-900">How It Works</button>
              <button className="text-gray-600 hover:text-gray-900">Pricing</button>
              <Button variant="outline" size="sm" onClick={() => onNavigate('signin')}>Sign In</Button>
              <Button variant="primary" size="sm" onClick={() => onNavigate('signup')}>Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Travel Intelligence</span>
              </div>
              
              <h1 className="text-gray-900 leading-tight">
                AI-Powered Mood-Based Trip Planner
              </h1>
              
              <p className="text-gray-600 text-xl">
                Create perfect itineraries that adapt to your energy, weather, budget, and real-time mood changes. 
                Never waste a vacation day again.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  icon={<Plane className="w-5 h-5" />}
                  onClick={() => onNavigate('create-trip')}
                >
                  Create Your Trip
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => onNavigate('itinerary')}
                >
                  View Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-teal-600">50K+</div>
                  <div className="text-sm text-gray-600">Trips Planned</div>
                </div>
                <div>
                  <div className="text-teal-600">4.9/5</div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
                <div>
                  <div className="text-teal-600">120+</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </div>
              </div>
            </div>
            
            {/* Right: Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1739373851064-4a5d6ad1d912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBkZXN0aW5hdGlvbnxlbnwxfHx8fDE3NjQwNDgxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Travel destination"
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Floating cards */}
                <div className="absolute top-6 right-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-gray-700">Mood-Adaptive</span>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Smart Optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Why FlowTrip?</h2>
            <p className="text-gray-600 text-lg">
              The smartest way to plan and adapt your travel itinerary
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card hover>
              <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-gray-900 mb-2">AI-Powered Planning</h3>
              <p className="text-gray-600">
                Our AI analyzes distance, weather, energy levels, and preferences to create the perfect daily flow.
              </p>
            </Card>
            
            <Card hover>
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Mood-Based Adaptation</h3>
              <p className="text-gray-600">
                Feeling tired? Group not well? The plan instantly adjusts with alternative low-energy options.
              </p>
            </Card>
            
            <Card hover>
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">
                Weather changed? Activity closed? Get instant re-routing with nearby alternatives.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="bg-gradient-to-r from-teal-500 to-blue-500 border-none text-white text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-white mb-4">Ready to Plan Your Perfect Trip?</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join thousands of travelers who never waste a vacation day
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => onNavigate('create-trip')}
            >
              Start Planning Now
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-2 rounded-xl">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">FlowTrip</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered travel planning for the modern explorer.
              </p>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            © 2025 FlowTrip. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}