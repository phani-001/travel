import { MapPin, Navigation, Download, CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/Card';
import type { Activity } from '../App';

interface MapViewProps {
  activities: Activity[];
  offlineMapDownloaded?: boolean;
  onDownloadMap?: () => void;
}

export function MapView({ activities, offlineMapDownloaded = false, onDownloadMap }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add Leaflet CSS to document head
    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Dynamically import Leaflet
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;

      try {
        // Import Leaflet from CDN
        const L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');

        // Fix default marker icon paths
        const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
        const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
        const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl,
          iconUrl,
          shadowUrl,
        });

        // Clear existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Initialize map centered on Visakhapatnam
        const map = L.map(mapRef.current).setView([17.6869, 83.2185], 12);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for each activity
        if (activities.length > 0) {
          const bounds: [number, number][] = [];

          activities.forEach((activity, index) => {
            // Create custom numbered icon
            const customIcon = L.divIcon({
              html: `
                <div style="
                  background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%);
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                ">${index + 1}</div>
              `,
              className: 'custom-marker',
              iconSize: [36, 36],
              iconAnchor: [18, 18],
            });

            const marker = L.marker([activity.lat, activity.lng], { icon: customIcon })
              .addTo(map)
              .bindPopup(`
                <div style="min-width: 200px;">
                  <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #111827;">${activity.title}</h4>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${activity.time}</p>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${activity.location}</p>
                  <p style="margin: 0; font-size: 12px; color: #059669; font-weight: 500;">₹${activity.cost}</p>
                </div>
              `);

            markersRef.current.push(marker);
            bounds.push([activity.lat, activity.lng]);
          });

          // Fit map to show all markers
          if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [50, 50] });
          }

          // Draw route line between activities
          if (activities.length > 1) {
            const routeCoords = activities.map(a => [a.lat, a.lng] as [number, number]);
            L.polyline(routeCoords, {
              color: '#14b8a6',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 5',
            }).addTo(map);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading map:', error);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activities]);

  return (
    <Card padding="none">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-teal-600" />
          <h3 className="text-gray-900">Route Map</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {activities.length} stops · Total: {activities.reduce((sum, a) => sum + a.travelTime, 0)} min travel
        </p>
      </div>

      {/* Real Map */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="h-[500px] w-full relative z-0" />
      </div>

      {/* Activity List */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 max-h-60 overflow-y-auto">
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-center gap-3 p-2 bg-white rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time} · {activity.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Map Button */}
      {onDownloadMap && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-lg"
            onClick={onDownloadMap}
          >
            {offlineMapDownloaded ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {offlineMapDownloaded ? 'Map Downloaded' : 'Download Map'}
          </button>
        </div>
      )}
    </Card>
  );
}