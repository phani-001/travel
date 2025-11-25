import { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { Activity } from '../App';

interface Amenity {
  id: string;
  name: string;
  type: 'washroom' | 'atm';
  distance: string;
  address: string;
  lat: number;
  lng: number;
  isOpen?: boolean;
  timing?: string;
}

interface NearbyAmenitiesProps {
  activities: Activity[];
  onClose: () => void;
  onNavigate?: (amenity: Amenity) => void;
}

export function NearbyAmenities({ activities, onClose, onNavigate }: NearbyAmenitiesProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'washroom' | 'atm'>('all');

  // Use first activity location as current location, or default to Visakhapatnam center
  const currentLocation = activities.length > 0
    ? { lat: activities[0].lat, lng: activities[0].lng }
    : { lat: 17.6869, lng: 83.2185 };

  // Mock data for Visakhapatnam amenities
  const amenities: Amenity[] = [
    // Washrooms
    {
      id: 'w1',
      name: 'RK Beach Public Washroom',
      type: 'washroom',
      distance: '0.3 km',
      address: 'RK Beach Road, near VUDA Park',
      lat: 17.7231,
      lng: 83.3260,
      isOpen: true,
      timing: '24 hours'
    },
    {
      id: 'w2',
      name: 'Beach Road Sulabh Complex',
      type: 'washroom',
      distance: '0.5 km',
      address: 'Beach Road, Kirlampudi Layout',
      lat: 17.7251,
      lng: 83.3280,
      isOpen: true,
      timing: '6:00 AM - 10:00 PM'
    },
    {
      id: 'w3',
      name: 'CMR Central Restrooms',
      type: 'washroom',
      distance: '0.8 km',
      address: 'CMR Central Mall, Maddilapalem',
      lat: 17.7311,
      lng: 83.3151,
      isOpen: true,
      timing: '10:00 AM - 9:00 PM'
    },
    {
      id: 'w4',
      name: 'Jagadamba Junction Public Toilet',
      type: 'washroom',
      distance: '1.2 km',
      address: 'Near Jagadamba Theatre',
      lat: 17.7211,
      lng: 83.3100,
      isOpen: true,
      timing: '24 hours'
    },
    {
      id: 'w5',
      name: 'Rushikonda Beach Facilities',
      type: 'washroom',
      distance: '2.1 km',
      address: 'Rushikonda Beach, near parking',
      lat: 17.7833,
      lng: 83.3789,
      isOpen: true,
      timing: '6:00 AM - 8:00 PM'
    },
    // ATMs
    {
      id: 'a1',
      name: 'SBI ATM - Beach Road',
      type: 'atm',
      distance: '0.2 km',
      address: 'State Bank of India, Beach Road',
      lat: 17.7221,
      lng: 83.3270,
      isOpen: true,
      timing: '24 hours'
    },
    {
      id: 'a2',
      name: 'HDFC Bank ATM',
      type: 'atm',
      distance: '0.4 km',
      address: 'Siripuram Circle',
      lat: 17.7241,
      lng: 83.3290,
      isOpen: true,
      timing: '24 hours'
    },
    {
      id: 'a3',
      name: 'ICICI Bank ATM',
      type: 'atm',
      distance: '0.6 km',
      address: 'Waltair Main Road',
      lat: 17.7261,
      lng: 83.3180,
      isOpen: true,
      timing: '24 hours'
    },
    {
      id: 'a4',
      name: 'Andhra Bank ATM',
      type: 'atm',
      distance: '0.7 km',
      address: 'Dwaraka Nagar Main Road',
      lat: 17.7191,
      lng: 83.3140,
      isOpen: true,
      timing: '24 hours'
    },
    {
      id: 'a5',
      name: 'Axis Bank ATM',
      type: 'atm',
      distance: '0.9 km',
      address: 'CMR Central, Maddilapalem',
      lat: 17.7311,
      lng: 83.3151,
      isOpen: true,
      timing: '24 hours'
    },
    {
      id: 'a6',
      name: 'Canara Bank ATM',
      type: 'atm',
      distance: '1.1 km',
      address: 'Jagadamba Junction',
      lat: 17.7211,
      lng: 83.3100,
      isOpen: true,
      timing: '24 hours'
    },
    {
      id: 'a7',
      name: 'PNB ATM - MVP Colony',
      type: 'atm',
      distance: '1.5 km',
      address: 'MVP Colony, Sector 4',
      lat: 17.7551,
      lng: 83.3291,
      isOpen: true,
      timing: '24 hours'
    },
  ];

  const filteredAmenities = selectedType === 'all' 
    ? amenities 
    : amenities.filter(a => a.type === selectedType);

  // Sort by distance
  const sortedAmenities = [...filteredAmenities].sort((a, b) => {
    const distA = parseFloat(a.distance);
    const distB = parseFloat(b.distance);
    return distA - distB;
  });

  const getTypeIcon = (type: 'washroom' | 'atm') => {
    if (type === 'washroom') {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M9 6v11a3 3 0 0 0 6 0V6" />
          <path d="M15 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    );
  };

  const getTypeColor = (type: 'washroom' | 'atm') => {
    return type === 'washroom' 
      ? 'bg-blue-50 border-blue-200 text-blue-600' 
      : 'bg-green-50 border-green-200 text-green-600';
  };

  const getTypeLabel = (type: 'washroom' | 'atm') => {
    return type === 'washroom' ? 'Washroom' : 'ATM';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-600 to-blue-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white mb-1">Nearby Amenities</h2>
              <p className="text-teal-100 text-sm">Find washrooms and ATMs near you</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`
                px-4 py-2 rounded-lg text-sm transition-all
                ${selectedType === 'all' 
                  ? 'bg-white text-teal-700 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
                }
              `}
            >
              All ({amenities.length})
            </button>
            <button
              onClick={() => setSelectedType('washroom')}
              className={`
                px-4 py-2 rounded-lg text-sm transition-all
                ${selectedType === 'washroom' 
                  ? 'bg-white text-blue-700 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
                }
              `}
            >
              Washrooms ({amenities.filter(a => a.type === 'washroom').length})
            </button>
            <button
              onClick={() => setSelectedType('atm')}
              className={`
                px-4 py-2 rounded-lg text-sm transition-all
                ${selectedType === 'atm' 
                  ? 'bg-white text-green-700 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
                }
              `}
            >
              ATMs ({amenities.filter(a => a.type === 'atm').length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {sortedAmenities.map(amenity => (
              <Card 
                key={amenity.id} 
                className="hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0
                    ${getTypeColor(amenity.type)}
                  `}>
                    {getTypeIcon(amenity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-1 truncate">{amenity.name}</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`
                            px-2 py-0.5 rounded-full
                            ${getTypeColor(amenity.type)}
                          `}>
                            {getTypeLabel(amenity.type)}
                          </span>
                          {amenity.isOpen && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              Open
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-teal-600">{amenity.distance}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{amenity.address}</p>
                    
                    {amenity.timing && (
                      <p className="text-xs text-gray-500 mb-3">
                        ⏰ {amenity.timing}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        icon={<Navigation className="w-3 h-3" />}
                        onClick={() => {
                          // Open in Google Maps
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${amenity.lat},${amenity.lng}`;
                          window.open(url, '_blank');
                        }}
                      >
                        Navigate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Copy address to clipboard
                          navigator.clipboard.writeText(amenity.address);
                          // Show a brief confirmation (in a real app, use a toast)
                          const btn = document.activeElement as HTMLButtonElement;
                          const originalText = btn.innerText;
                          btn.innerText = 'Copied!';
                          setTimeout(() => {
                            btn.innerText = originalText;
                          }, 1500);
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {sortedAmenities.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No amenities found</p>
              <p className="text-sm text-gray-500">Try selecting a different filter</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {sortedAmenities.length} nearby {selectedType === 'all' ? 'amenities' : selectedType === 'washroom' ? 'washrooms' : 'ATMs'}
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}