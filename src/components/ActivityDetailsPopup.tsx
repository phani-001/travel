import { X, MapPin, Clock, Star, DollarSign, Cloud, Sun, CloudRain, CheckCircle, Navigation } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Tag } from './ui/Tag';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Activity } from '../App';

interface ActivityDetailsPopupProps {
  activity: Activity;
  onClose: () => void;
}

export function ActivityDetailsPopup({ activity, onClose }: ActivityDetailsPopupProps) {
  const nearbyAlternatives = [
    {
      id: '1',
      name: 'Casa Batlló',
      distance: '0.8 km',
      type: 'Similar',
      rating: 4.7,
    },
    {
      id: '2',
      name: 'La Pedrera',
      distance: '1.2 km',
      type: 'Similar',
      rating: 4.6,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <Card padding="none" className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg transition-colors z-10 shadow-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <ImageWithFallback
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <h2 className="text-white mb-2">{activity.title}</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">{activity.rating}</span>
                </div>
                <span className="text-white/90 text-sm">{activity.category}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 mb-1">Time</p>
                <p className="text-gray-900">{activity.time}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Navigation className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 mb-1">Travel</p>
                <p className="text-gray-900">{activity.travelTime} min</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 mb-1">Cost</p>
                <p className="text-gray-900">${activity.cost}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 mb-1">Distance</p>
                <p className="text-gray-900">{activity.distance}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{activity.description}</p>
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-gray-900 mb-3">Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm text-gray-900">{activity.location}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Open Hours</span>
                    <span className="text-sm text-gray-900">{activity.hours}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Energy Level</span>
                    <Tag type="energy" variant={activity.energy} size="sm">
                      {activity.energy}
                    </Tag>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Environment</span>
                    <Tag type={activity.indoor ? 'indoor' : 'outdoor'} size="sm">
                      {activity.indoor ? 'Indoor' : 'Outdoor'}
                    </Tag>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 mb-3">Weather Suitability</h4>
                <div className="space-y-2 mb-4">
                  {activity.weatherSuitable.map((weather) => (
                    <div key={weather} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 capitalize">{weather}</span>
                      {weather === 'sunny' && <Sun className="w-4 h-4 text-yellow-500" />}
                      {weather === 'cloudy' && <Cloud className="w-4 h-4 text-gray-400" />}
                      {weather === 'rainy' && <CloudRain className="w-4 h-4 text-blue-500" />}
                    </div>
                  ))}
                </div>

                <h4 className="text-gray-900 mb-3">Dietary Compatible</h4>
                <div className="flex flex-wrap gap-2">
                  {activity.dietary.map((diet) => (
                    <Tag key={diet} type="custom" size="sm">
                      {diet}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* Nearby Alternatives */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-gray-900 mb-4">Nearby Alternatives</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {nearbyAlternatives.map((alt) => (
                  <button
                    key={alt.id}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-gray-900">{alt.name}</h4>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-gray-700">{alt.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {alt.distance}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        {alt.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button variant="primary" fullWidth>
                Keep This Activity
              </Button>
              <Button variant="outline" fullWidth>
                Swap Activity
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
