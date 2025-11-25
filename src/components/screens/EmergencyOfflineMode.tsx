import { ArrowLeft, AlertTriangle, Phone, MapPin, Download, Wifi, WifiOff, Hospital, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { TripData, DayItinerary } from '../../App';

interface EmergencyOfflineModeProps {
  tripData: TripData;
  currentDay: DayItinerary;
  onBack: () => void;
}

export function EmergencyOfflineMode({ tripData, currentDay, onBack }: EmergencyOfflineModeProps) {
  const [isOffline, setIsOffline] = useState(false);

  const emergencyContacts = [
    { name: 'Police', number: '100', description: 'India Police Emergency' },
    { name: 'Fire Brigade', number: '101', description: 'Fire Emergency Services' },
    { name: 'Ambulance', number: '108', description: 'Medical Emergency (Free Service)' },
    { name: 'Unified Emergency', number: '112', description: 'All Emergency Services' },
    { name: 'Tourist Helpline', number: '1363', description: 'Andhra Pradesh Tourism' },
    { name: 'Hotel Concierge', number: '+91 891 256 0000', description: tripData.hotel },
  ];

  const nearbyHospitals = [
    { name: 'King George Hospital (KGH)', distance: '3.2 km', address: 'Maharani Peta, Visakhapatnam', lat: 17.7099, lng: 83.2953 },
    { name: 'KIMS ICON Hospital', distance: '4.5 km', address: 'Dwarakanagar, Visakhapatnam', lat: 17.7231, lng: 83.3098 },
    { name: 'Seven Hills Hospital', distance: '5.1 km', address: 'Rockdale Layout, Visakhapatnam', lat: 17.7378, lng: 83.3085 },
  ];

  const regroupPoint = {
    name: tripData.hotel,
    address: 'Beach Road, Visakhapatnam, Andhra Pradesh',
    time: 'Meet by 6:00 PM if separated',
    lat: 17.7231,
    lng: 83.3260,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-red-600 text-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-white/80"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Exit Emergency Mode</span>
            </button>
            
            <div className="flex items-center gap-2">
              {isOffline ? (
                <>
                  <WifiOff className="w-5 h-5" />
                  <span className="text-sm">Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-5 h-5" />
                  <span className="text-sm">Online</span>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Emergency Alert */}
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-red-900 mb-2">Emergency & Offline Mode</h2>
              <p className="text-sm text-red-700 mb-4">
                Quick access to emergency contacts, offline itinerary, and regroup information. 
                All data is cached and available without internet.
              </p>
              <Button
                variant="secondary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  // Download offline data
                  const offlineData = {
                    emergencyContacts,
                    nearbyHospitals,
                    regroupPoint,
                    itinerary: currentDay.activities.map(a => ({
                      time: a.time,
                      title: a.title,
                      location: a.location,
                      cost: a.cost,
                    }))
                  };
                  const blob = new Blob([JSON.stringify(offlineData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `traverse-offline-emergency-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download Full Offline Pack
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Emergency Contacts */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-red-600" />
              <h3 className="text-gray-900">Emergency Contacts</h3>
            </div>
            
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-gray-900 mb-1">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                  </div>
                  <a 
                    href={`tel:${contact.number}`}
                    className="block w-full mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-center transition-colors"
                  >
                    Call {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </Card>

          {/* Nearby Hospitals */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Hospital className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">Nearest Hospitals</h3>
            </div>
            
            <div className="space-y-3 mb-4">
              {nearbyHospitals.map((hospital, index) => (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-900">{hospital.name}</h4>
                    <span className="text-sm text-blue-600">{hospital.distance}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{hospital.address}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
                      window.open(url, '_blank');
                    }}
                  >
                    Get Directions
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Regroup Point */}
          <Card className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">Group Regroup Point</h3>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              {/* Mini Map Placeholder */}
              <div className="bg-purple-100 rounded-lg h-48 mb-4 flex items-center justify-center relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #9333ea 1px, transparent 1px),
                      linear-gradient(to bottom, #9333ea 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
                <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-2 animate-bounce" />
                  <p className="text-purple-700">Regroup Point</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-purple-700 mb-1">Location</p>
                  <p className="text-gray-900">{regroupPoint.name}</p>
                  <p className="text-sm text-gray-600">{regroupPoint.address}</p>
                </div>
                <div className="pt-3 border-t border-purple-200">
                  <p className="text-purple-700">
                    ⏰ {regroupPoint.time}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${regroupPoint.lat},${regroupPoint.lng}`;
                      window.open(url, '_blank');
                    }}
                  >
                    Navigate to Hotel
                  </Button>
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                          const shareText = `I'm at the regroup point: ${regroupPoint.name}, ${regroupPoint.address}. My coordinates: ${position.coords.latitude}, ${position.coords.longitude}`;
                          if (navigator.share) {
                            navigator.share({
                              title: 'My Location - Traverse',
                              text: shareText,
                            });
                          } else {
                            navigator.clipboard.writeText(shareText);
                            alert('Location copied to clipboard!');
                          }
                        });
                      }
                    }}
                  >
                    Share Location
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Offline Itinerary */}
          <Card className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Today's Offline Itinerary</h3>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1">
                <Download className="w-3 h-3" />
                Cached
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(currentDay.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-900">
                  {currentDay.activities.length} activities · {currentDay.totalDistance}
                </p>
              </div>
              
              {currentDay.activities.map((activity, index) => (
                <div key={activity.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                        <span className="text-sm text-gray-900">₹{activity.cost}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{activity.location}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{activity.distance}</span>
                        <span>·</span>
                        <span>{activity.travelTime} min travel</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Important Info */}
          <Card className="md:col-span-2 bg-gray-50">
            <h3 className="text-gray-900 mb-4">Important Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Consulate</p>
                <p className="text-gray-900">US Consulate Hyderabad</p>
                <p className="text-sm text-gray-600">+91 40 2329 8000</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Emergency</p>
                <p className="text-gray-900">Police/Fire/Ambulance</p>
                <p className="text-sm text-gray-600">Dial 112</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Local Time</p>
                <p className="text-gray-900">IST (UTC+5:30)</p>
                <p className="text-sm text-gray-600">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}