import { X, Users, TrendingDown } from 'lucide-react';
import { Card } from './ui/Card';
import { MoodChip } from './ui/MoodChip';
import { Button } from './ui/Button';

interface MoodInputPanelProps {
  currentMood: 'tired' | 'ok' | 'high-energy' | 'sick';
  onMoodUpdate: (mood: 'tired' | 'ok' | 'high-energy' | 'sick') => void;
  onClose: () => void;
}

export function MoodInputPanel({ currentMood, onMoodUpdate, onClose }: MoodInputPanelProps) {
  const groupMembers = [
    { id: 1, name: 'Sarah', mood: 'ok' as const },
    { id: 2, name: 'Mike', mood: 'tired' as const },
    { id: 3, name: 'Emma', mood: 'high-energy' as const },
    { id: 4, name: 'James', mood: 'sick' as const },
  ];

  const moodCounts = groupMembers.reduce((acc, member) => {
    acc[member.mood] = (acc[member.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const concernLevel = (moodCounts.tired || 0) + (moodCounts.sick || 0);
  const needsReplan = concernLevel >= groupMembers.length / 2;

  return (
    <Card className="relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <div className="mb-6">
        <h3 className="text-gray-900 mb-2">How's Everyone Feeling?</h3>
        <p className="text-sm text-gray-600">
          Update your mood to help the group adapt the plan
        </p>
      </div>

      {/* Mood Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MoodChip
          mood="high-energy"
          selected={currentMood === 'high-energy'}
          onClick={() => onMoodUpdate('high-energy')}
          size="lg"
        />
        <MoodChip
          mood="ok"
          selected={currentMood === 'ok'}
          onClick={() => onMoodUpdate('ok')}
          size="lg"
        />
        <MoodChip
          mood="tired"
          selected={currentMood === 'tired'}
          onClick={() => onMoodUpdate('tired')}
          size="lg"
        />
        <MoodChip
          mood="sick"
          selected={currentMood === 'sick'}
          onClick={() => onMoodUpdate('sick')}
          size="lg"
        />
      </div>

      {/* Group Summary */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-600" />
          <h4 className="text-gray-900">Group Mood Summary</h4>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {groupMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                {member.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500 capitalize">{member.mood}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alert if needs replan */}
        {needsReplan && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-orange-800 mb-2">
                {concernLevel} out of {groupMembers.length} people need lower-intensity activities
              </p>
              <Button variant="secondary" size="sm">
                Generate Alternative Plans
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
