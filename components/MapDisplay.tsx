import React from 'react';
import { TrackingResult } from '../types';
import { WorldIcon } from './icons/WorldIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface MapDisplayProps {
  result: TrackingResult;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ result }) => {
  // These are approximations for a flat map projection
  const left = (result.lon + 180) / 360 * 100;
  const top = (-result.lat + 90) / 180 * 100;

  return (
    <div className="bg-gray-800 border border-green-700 rounded-lg p-4">
      <h2 className="text-xl text-center text-white mb-4">TARGET LOCATION ACQUIRED</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden border border-green-900">
          <WorldIcon className="w-full h-full text-green-800" />
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <MapPinIcon className="w-6 h-6 text-red-500" />
            <div className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 rounded-full bg-red-500 opacity-25 animate-ping"></div>
          </div>
        </div>
        <div className="font-mono text-sm space-y-2">
            <p><span className="text-green-600 w-24 inline-block">Address:</span> <span className="text-white">{result.address}</span></p>
            <p><span className="text-green-600 w-24 inline-block">City:</span> <span className="text-white">{result.city}</span></p>
            <p><span className="text-green-600 w-24 inline-block">Country:</span> <span className="text-white">{result.country}</span></p>
            <p><span className="text-green-600 w-24 inline-block">Coordinates:</span> <span className="text-white">{result.lat.toFixed(4)}, {result.lon.toFixed(4)}</span></p>
            <p><span className="text-green-600 w-24 inline-block">Est. IP:</span> <span className="text-white">{result.ip}</span></p>
            <p><span className="text-green-600 w-24 inline-block">Carrier:</span> <span className="text-white">{result.carrier}</span></p>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;