import { MapPin, Clock, Users, Star, CheckCircle, Circle } from 'lucide-react';
import { Card } from './ui/Card';
import { Tag } from './ui/Tag';
import type { Activity } from '../App';

interface ActivityCardProps {
  activity: Activity;
  showDetails?: boolean;
  onClick?: () => void;
  completed?: boolean;
  onCheckIn?: (activity: Activity) => void;
  isLast?: boolean;
}

export function ActivityCard({ activity, showDetails = false, onClick, completed = false, onCheckIn }: ActivityCardProps) {
  return (
    <Card 
      hover={!!onClick} 
      onClick={onClick}
      className={`relative transition-all ${completed ? 'bg-teal-50 border-teal-200' : ''}`}
    >
      {/* Completion Badge */}
      {completed && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-teal-500 text-white rounded-full p-1">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <img 
            src={activity.image} 
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-teal-600">{activity.time}</span>
                {completed && (
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              <h4 className="text-gray-900 mb-1 truncate">{activity.title}</h4>
              <p className="text-sm text-gray-600">{activity.category}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-gray-900">₹{activity.cost}</div>
              <div className="text-xs text-gray-500">per person</div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{activity.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{activity.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{activity.rating}</span>
            </div>
          </div>

          {/* Tags & Check-in */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              <Tag type="energy" variant={activity.energy} size="sm">
                {activity.energy}
              </Tag>
              <Tag type="custom" size="sm">
                {activity.indoor ? 'Indoor' : 'Outdoor'}
              </Tag>
            </div>
            
            {/* Check-in Button */}
            {onCheckIn && !completed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckIn(activity);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex-shrink-0"
              >
                <Circle className="w-3 h-3" />
                <span>Check In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Hours: {activity.hours}</span>
          </div>
        </div>
      )}
    </Card>
  );
}