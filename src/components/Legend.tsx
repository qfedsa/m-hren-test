import React from 'react';
import { Info } from 'lucide-react';

interface LegendProps {
  lastUpdate: string;
}

const Legend: React.FC<LegendProps> = ({ lastUpdate }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center mb-2">
        <h4 className="text-sm font-semibold">Investment Potential</h4>
        <div className="ml-2 text-gray-400 cursor-help group relative">
          <Info className="h-4 w-4" />
          <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded">
            Score berechnet aus: Preis (35%), Wachstum (25%), Leerstand (20%), ROI (20%)
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
          <span className="ml-2 text-xs">Hohes Potential (7.0-10.0)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
          <span className="ml-2 text-xs">Mittleres Potential (4.0-6.9)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
          <span className="ml-2 text-xs">Geringes Potential (0-3.9)</span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t text-xs text-gray-500">
        Letzte Aktualisierung: {new Date(lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Legend;
