import { useState } from 'react';
import { X, CheckCircle, ThumbsUp, ThumbsDown, Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { Activity } from '../App';

interface CheckInSurveyProps {
  activity: Activity;
  onComplete: (feedback: ActivityFeedback) => void;
  onClose: () => void;
}

export interface ActivityFeedback {
  activityId: string;
  overallRating: number;
  moodAfter: 'excellent' | 'good' | 'tired' | 'exhausted' | 'sick';
  healthStatus: 'great' | 'good' | 'slightly-unwell' | 'unwell' | 'sick';
  weatherExperience: 'perfect' | 'good' | 'too-hot' | 'too-cold' | 'rainy' | 'bad';
  wouldRecommend: boolean;
  energyLevel: 'high' | 'medium' | 'low';
  comments?: string;
}

export function CheckInSurvey({ activity, onComplete, onClose }: CheckInSurveyProps) {
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState<Partial<ActivityFeedback>>({
    activityId: activity.id,
  });

  const handleComplete = () => {
    if (isFormComplete()) {
      onComplete(feedback as ActivityFeedback);
    }
  };

  const isFormComplete = () => {
    return feedback.overallRating && feedback.moodAfter && feedback.healthStatus && 
           feedback.weatherExperience && feedback.wouldRecommend !== undefined && feedback.energyLevel;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">Activity Check-In</h2>
                <p className="text-sm text-gray-600">{activity.title}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    s <= step ? 'bg-teal-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Overall Rating */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">How was this activity?</h3>
                <p className="text-sm text-gray-600 mb-4">Rate your overall experience</p>
              </div>
              
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFeedback({ ...feedback, overallRating: rating })}
                    className={`w-14 h-14 rounded-xl border-2 transition-all ${
                      feedback.overallRating === rating
                        ? 'border-teal-500 bg-teal-50 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl">
                      {rating === 1 ? '😞' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '😍'}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          )}

          {/* Step 2: Mood After Activity */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">How are you feeling now?</h3>
                <p className="text-sm text-gray-600 mb-4">This helps us adjust the pace</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'excellent', label: 'Excellent', emoji: '🤩', color: 'green' },
                  { value: 'good', label: 'Good', emoji: '😊', color: 'teal' },
                  { value: 'tired', label: 'Tired', emoji: '😓', color: 'yellow' },
                  { value: 'exhausted', label: 'Exhausted', emoji: '😫', color: 'orange' },
                  { value: 'sick', label: 'Not Well', emoji: '🤒', color: 'red' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFeedback({ ...feedback, moodAfter: option.value as any })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      feedback.moodAfter === option.value
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="text-sm text-gray-900">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Health Status */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">Health Check</h3>
                <p className="text-sm text-gray-600 mb-4">How is your physical health right now?</p>
              </div>
              
              <div className="space-y-2">
                {[
                  { value: 'great', label: 'Feeling Great', desc: 'Ready for more activities', color: 'green' },
                  { value: 'good', label: 'Feeling Good', desc: 'Can continue as planned', color: 'teal' },
                  { value: 'slightly-unwell', label: 'Slightly Unwell', desc: 'Minor discomfort', color: 'yellow' },
                  { value: 'unwell', label: 'Unwell', desc: 'Need to take it easy', color: 'orange' },
                  { value: 'sick', label: 'Sick', desc: 'Need rest or medical attention', color: 'red' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFeedback({ ...feedback, healthStatus: option.value as any })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      feedback.healthStatus === option.value
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-gray-900 mb-1">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Weather Experience */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">Weather Conditions</h3>
                <p className="text-sm text-gray-600 mb-4">How was the weather during this activity?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'perfect', label: 'Perfect', icon: Sun, color: 'green' },
                  { value: 'good', label: 'Good', icon: Sun, color: 'teal' },
                  { value: 'too-hot', label: 'Too Hot', icon: Sun, color: 'orange' },
                  { value: 'too-cold', label: 'Too Cold', icon: Wind, color: 'blue' },
                  { value: 'rainy', label: 'Rainy', icon: CloudRain, color: 'indigo' },
                  { value: 'bad', label: 'Bad Weather', icon: Cloud, color: 'red' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFeedback({ ...feedback, weatherExperience: option.value as any })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        feedback.weatherExperience === option.value
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 text-${option.color}-500`} />
                      <div className="text-sm text-gray-900">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Energy & Recommendation */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-2">Final Questions</h3>
                <p className="text-sm text-gray-600 mb-4">Help us optimize your itinerary</p>
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-sm text-gray-700 mb-3">Current Energy Level</label>
                <div className="flex gap-3">
                  {[
                    { value: 'high', label: 'High Energy', emoji: '⚡' },
                    { value: 'medium', label: 'Medium', emoji: '✨' },
                    { value: 'low', label: 'Low Energy', emoji: '🔋' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFeedback({ ...feedback, energyLevel: option.value as any })}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        feedback.energyLevel === option.value
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs text-gray-900">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Would Recommend */}
              <div>
                <label className="block text-sm text-gray-700 mb-3">Would you recommend this activity?</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFeedback({ ...feedback, wouldRecommend: true })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      feedback.wouldRecommend === true
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                    <div className="text-sm text-gray-900">Yes, Loved it!</div>
                  </button>
                  <button
                    onClick={() => setFeedback({ ...feedback, wouldRecommend: false })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      feedback.wouldRecommend === false
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ThumbsDown className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-sm text-gray-900">Not Really</div>
                  </button>
                </div>
              </div>

              {/* Optional Comments */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Additional Comments (Optional)</label>
                <textarea
                  value={feedback.comments || ''}
                  onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                  placeholder="Any specific feedback or concerns?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <div className="flex-1" />
            {step < 5 ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !feedback.overallRating) ||
                  (step === 2 && !feedback.moodAfter) ||
                  (step === 3 && !feedback.healthStatus) ||
                  (step === 4 && !feedback.weatherExperience)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleComplete}
                disabled={!isFormComplete()}
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Submit Check-In
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
