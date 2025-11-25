import { Sparkles, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import type { ActivityFeedback } from './CheckInSurvey';

interface AIReplanningScreenProps {
  feedback: ActivityFeedback;
  activityName: string;
}

export function AIReplanningScreen({ feedback, activityName }: AIReplanningScreenProps) {
  // Analyze feedback to determine if replanning is needed
  const needsReplanning = 
    feedback.overallRating <= 2 ||
    feedback.moodAfter === 'exhausted' ||
    feedback.moodAfter === 'sick' ||
    feedback.healthStatus === 'unwell' ||
    feedback.healthStatus === 'sick' ||
    feedback.energyLevel === 'low' ||
    feedback.weatherExperience === 'bad';

  const isPositive = 
    feedback.overallRating >= 4 &&
    (feedback.moodAfter === 'excellent' || feedback.moodAfter === 'good') &&
    (feedback.healthStatus === 'great' || feedback.healthStatus === 'good') &&
    feedback.energyLevel !== 'low';

  return (
    <div className="space-y-4">
      {/* Analysis Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">AI Analysis Complete</h3>
            <p className="text-sm text-gray-600">
              Analyzing your feedback from "{activityName}"
            </p>
          </div>
        </div>
      </Card>

      {/* Feedback Summary */}
      <Card>
        <h4 className="text-gray-900 mb-4">Feedback Summary</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Experience</p>
            <div className="flex items-center gap-2">
              <div className="text-2xl">
                {feedback.overallRating === 5 ? '😍' : feedback.overallRating === 4 ? '😊' : feedback.overallRating === 3 ? '🙂' : feedback.overallRating === 2 ? '😐' : '😞'}
              </div>
              <span className="text-sm text-gray-900">{feedback.overallRating}/5</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Current Mood</p>
            <div className="flex items-center gap-2">
              <div className="text-2xl">
                {feedback.moodAfter === 'excellent' ? '🤩' : feedback.moodAfter === 'good' ? '😊' : feedback.moodAfter === 'tired' ? '😓' : feedback.moodAfter === 'exhausted' ? '😫' : '🤒'}
              </div>
              <span className="text-xs text-gray-900 capitalize">{feedback.moodAfter}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Health Status</p>
            <div className="text-xs text-gray-900 capitalize">{feedback.healthStatus.replace('-', ' ')}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Energy Level</p>
            <div className="text-xs text-gray-900 capitalize">{feedback.energyLevel}</div>
          </div>
        </div>
      </Card>

      {/* AI Decision */}
      {needsReplanning ? (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-1">Itinerary Adjustment Recommended</h4>
              <p className="text-sm text-gray-600">
                Based on your feedback, we suggest modifying your upcoming activities
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-3">
            <h5 className="text-sm text-gray-900">Proposed Changes:</h5>
            <ul className="space-y-2 text-sm text-gray-700">
              {feedback.energyLevel === 'low' && (
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Reduce activity intensity - Add more rest breaks</span>
                </li>
              )}
              {(feedback.moodAfter === 'exhausted' || feedback.moodAfter === 'sick') && (
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Skip next 1-2 activities - Extend rest time at hotel</span>
                </li>
              )}
              {(feedback.healthStatus === 'unwell' || feedback.healthStatus === 'sick') && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Switch to indoor, low-energy activities only</span>
                </li>
              )}
              {feedback.weatherExperience === 'bad' && (
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Replace outdoor activities with indoor alternatives</span>
                </li>
              )}
              {feedback.overallRating <= 2 && (
                <li className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Remove similar activities - Suggest different experience types</span>
                </li>
              )}
            </ul>
          </div>
        </Card>
      ) : isPositive ? (
        <Card className="border-2 border-teal-200 bg-teal-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-1">Great! Continuing as Planned</h4>
              <p className="text-sm text-gray-600">
                You're having a wonderful experience. We'll keep the itinerary as planned with similar activities ahead.
              </p>
            </div>
          </div>
          
          {feedback.energyLevel === 'high' && (
            <div className="mt-4 bg-white rounded-lg p-3 flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Your high energy levels detected! We can add optional activities if you'd like more to explore.
              </p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-1">Keeping Current Plan</h4>
              <p className="text-sm text-gray-600">
                Your feedback indicates you're comfortable with the current pace. No major changes needed.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Processing Animation */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span>AI processing your preferences...</span>
      </div>
    </div>
  );
}
