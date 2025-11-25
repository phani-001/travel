import { X, CheckCircle, Clock, IndianRupee, Zap } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Tag } from './ui/Tag';
import type { DayItinerary } from '../App';

interface ReplanSuggestionsProps {
  currentPlan: DayItinerary;
  mood: 'tired' | 'ok' | 'high-energy' | 'sick';
  onSelectPlan: (planId: string) => void;
  onClose: () => void;
}

export function ReplanSuggestions({ currentPlan, mood, onSelectPlan, onClose }: ReplanSuggestionsProps) {
  // Generate context-aware alternatives based on mood
  const getAlternativePlans = () => {
    if (mood === 'tired' || mood === 'sick') {
      return [
        {
          id: 'plan-a',
          label: 'Plan A: Relaxed Beach Day',
          description: 'Easy beach visits with minimal walking, nearby cafes',
          activities: 3,
          totalTime: '4 hours',
          cost: 450,
          energyLevel: 'low' as const,
          highlight: 'Perfect for recovery',
          details: ['RK Beach walk', 'Beachfront cafe lunch', 'Hotel spa/pool time'],
        },
        {
          id: 'plan-b',
          label: 'Plan B: Indoor Comfort',
          description: 'Museums, malls, AC restaurants - all indoors',
          activities: 3,
          totalTime: '4.5 hours',
          cost: 600,
          energyLevel: 'low' as const,
          highlight: 'Recommended for feeling unwell',
          details: ['Submarine Museum', 'CMR Central Mall', 'Fine dining lunch'],
        },
        {
          id: 'plan-c',
          label: 'Plan C: Half-Day Modified',
          description: 'Best 2 must-dos + extended rest',
          activities: 2,
          totalTime: '3 hours',
          cost: 350,
          energyLevel: 'low' as const,
          highlight: 'Minimal effort, maximum rest',
          details: ['One scenic spot', 'One meal spot', 'Back to hotel'],
        },
      ];
    } else if (mood === 'high-energy') {
      return [
        {
          id: 'plan-a',
          label: 'Plan A: Adventure Plus',
          description: 'Add water sports, trekking, more activities',
          activities: 7,
          totalTime: '10 hours',
          cost: 2500,
          energyLevel: 'high' as const,
          highlight: 'Maximum activities',
          details: ['Kailasagiri trek', 'Water sports', 'Multiple beaches', 'Night market'],
        },
        {
          id: 'plan-b',
          label: 'Plan B: Full Araku Extension',
          description: 'Extended Araku trip with trekking',
          activities: 6,
          totalTime: '12 hours',
          cost: 2800,
          energyLevel: 'high' as const,
          highlight: 'For adventure seekers',
          details: ['Borra Caves', 'Valley trek', 'Tribal villages', 'Coffee plantations'],
        },
        {
          id: 'plan-c',
          label: 'Plan C: Original + Extras',
          description: 'Keep plan, add evening activities',
          activities: 6,
          totalTime: '9 hours',
          cost: 1800,
          energyLevel: 'medium' as const,
          highlight: 'Balanced enhancement',
          details: ['Current plan', 'Beach sports', 'Night food tour'],
        },
      ];
    } else {
      // mood === 'ok' - balanced alternatives
      return [
        {
          id: 'plan-a',
          label: 'Plan A: Coastal Heritage Mix',
          description: 'Temples, beaches, and local food - balanced pace',
          activities: 4,
          totalTime: '6 hours',
          cost: 800,
          energyLevel: 'medium' as const,
          highlight: 'Cultural + Scenic',
          details: ['Simhachalam Temple', 'RK Beach', 'Seafood lunch', 'Kailasagiri'],
        },
        {
          id: 'plan-b',
          label: 'Plan B: Foodie Explorer',
          description: 'Best Vizag eateries with sightseeing breaks',
          activities: 5,
          totalTime: '7 hours',
          cost: 1200,
          energyLevel: 'medium' as const,
          highlight: 'Recommended for foodies',
          details: ['Breakfast spot', 'Beach walk', 'Famous biryani', 'Cafe hopping', 'Sunset point'],
        },
        {
          id: 'plan-c',
          label: 'Plan C: Shopping & Culture',
          description: 'Local markets, handicrafts, and street food',
          activities: 4,
          totalTime: '5.5 hours',
          cost: 950,
          energyLevel: 'medium' as const,
          highlight: 'Authentic local experience',
          details: ['Jagadamba market', 'Handicraft center', 'Street food tour', 'Beach Road'],
        },
      ];
    }
  };

  const alternativePlans = getAlternativePlans();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">Alternative Plans for Visakhapatnam</h2>
            <p className="text-gray-600">
              Based on your group's current mood ({mood}), we've created {mood === 'sick' || mood === 'tired' ? 'lighter' : mood === 'high-energy' ? 'more adventurous' : 'balanced'} alternatives with real Vizag locations
            </p>
          </div>

          {/* Current Plan Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-900">Current Plan</h3>
              <Tag type="custom">Original</Tag>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{currentPlan.activities.length} activities</span>
              <span>·</span>
              <span>{currentPlan.totalDistance}</span>
              <span>·</span>
              <span>₹{currentPlan.totalCost}</span>
              <span>·</span>
              <span>{currentPlan.energyProfile}</span>
            </div>
          </div>

          {/* Alternative Plans */}
          <div className="grid md:grid-cols-3 gap-4">
            {alternativePlans.map((plan, index) => (
              <Card
                key={plan.id}
                hover
                className="relative border-2 border-gray-200 hover:border-teal-500 transition-colors"
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs shadow-lg">
                      Recommended
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-gray-900 mb-1">{plan.label}</h4>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                {/* Activity Details Preview */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {plan.details.slice(0, 3).map((detail, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-1">
                        <span className="text-teal-500 mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="text-gray-900">{plan.totalTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      Cost
                    </span>
                    <span className="text-gray-900">₹{plan.cost}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Energy
                    </span>
                    <Tag type="energy" variant={plan.energyLevel} size="sm">
                      {plan.energyLevel}
                    </Tag>
                  </div>
                </div>

                {/* Highlight */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4">
                  <p className="text-xs text-blue-700 text-center">
                    ✨ {plan.highlight}
                  </p>
                </div>

                <Button
                  variant={index === 1 ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => onSelectPlan(plan.id)}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  Select Plan
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              All plans are optimized for Visakhapatnam's weather and traffic
            </p>
            <Button variant="ghost" onClick={onClose}>
              Keep Current Plan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}