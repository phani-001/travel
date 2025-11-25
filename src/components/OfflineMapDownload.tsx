import { useState } from 'react';
import { Download, MapPin, CheckCircle, X, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface OfflineMapDownloadProps {
  cityName: string;
  onClose: () => void;
  onDownloadComplete: () => void;
}

export function OfflineMapDownload({ cityName, onClose, onDownloadComplete }: OfflineMapDownloadProps) {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [estimatedSize] = useState('45.2 MB');
  const [downloadSpeed, setDownloadSpeed] = useState('0 MB/s');

  const startDownload = () => {
    setDownloadStatus('downloading');
    setProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadStatus('complete');
          setTimeout(() => {
            onDownloadComplete();
          }, 1500);
          return 100;
        }
        
        // Update download speed simulation
        const newProgress = prev + Math.random() * 8 + 2;
        const speed = (2.5 + Math.random() * 1.5).toFixed(1);
        setDownloadSpeed(`${speed} MB/s`);
        
        return Math.min(newProgress, 100);
      });
    }, 200);
  };

  const downloadedSize = ((progress / 100) * 45.2).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">Offline Map</h3>
              <p className="text-sm text-gray-600">{cityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {downloadStatus === 'idle' && (
          <>
            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <WifiOff className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 mb-1">
                    Download maps for offline access
                  </p>
                  <p className="text-xs text-blue-700">
                    Navigate even without internet connection. Perfect for areas with poor connectivity.
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Map Area</span>
                <span className="text-sm text-gray-900">{cityName} & Surrounding Areas</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Download Size</span>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{estimatedSize}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Map Quality</span>
                <span className="text-sm text-gray-900">High Definition</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600">Includes</span>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Roads, POIs, Landmarks</p>
                  <p className="text-xs text-gray-500">All itinerary locations</p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <Button
              variant="primary"
              fullWidth
              size="lg"
              icon={<Download className="w-5 h-5" />}
              onClick={startDownload}
            >
              Download Offline Map
            </Button>

            <p className="text-xs text-center text-gray-500 mt-3">
              Make sure you're connected to Wi-Fi for faster download
            </p>
          </>
        )}

        {downloadStatus === 'downloading' && (
          <>
            {/* Downloading Animation */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <Download className="w-8 h-8 text-teal-600 animate-bounce" />
                </div>
              </div>
              <h4 className="text-gray-900 mb-1">Downloading Map Data</h4>
              <p className="text-sm text-gray-600">Please keep the app open...</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm text-teal-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {downloadedSize} MB / {estimatedSize}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Wifi className="w-3 h-3" />
                  <span>{downloadSpeed}</span>
                </div>
              </div>
            </div>

            {/* Download Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Tiles</p>
                <p className="text-sm text-gray-900">{Math.round(progress * 42)}/4200</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">POIs</p>
                <p className="text-sm text-gray-900">{Math.round(progress * 15)}/1500</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Routes</p>
                <p className="text-sm text-gray-900">{Math.round(progress * 2.5)}/250</p>
              </div>
            </div>
          </>
        )}

        {downloadStatus === 'complete' && (
          <>
            {/* Success Animation */}
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-gray-900 mb-2">Download Complete!</h4>
              <p className="text-sm text-gray-600 mb-6">
                Offline map is ready. You can now navigate without internet.
              </p>

              {/* Storage Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-green-600" />
                    <span className="text-green-900">Saved to device</span>
                  </div>
                  <span className="text-green-600">{estimatedSize}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
