import React from 'react';
import { TrendingUp, Layers, RefreshCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface MapControlsProps {
  showHeatmap: boolean;
  layers: {
    price: boolean;
    growth: boolean;
    vacancy: boolean;
    roi: boolean;
  };
  onToggleHeatmap: () => void;
  onToggleLayer: (key: string) => void;
  onRefresh: () => void;
  onZoom: (direction: 'in' | 'out') => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  showHeatmap,
  layers,
  onToggleHeatmap,
  onToggleLayer,
  onRefresh,
  onZoom,
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 space-y-2">
      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow space-y-1 p-1">
        <button
          onClick={() => onZoom('in')}
          className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors"
          aria-label="Vergrößern"
        >
          <ZoomIn className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={() => onZoom('out')}
          className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors"
          aria-label="Verkleinern"
        >
          <ZoomOut className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Heatmap Toggle */}
      <button
        onClick={onToggleHeatmap}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow transition-colors ${
          showHeatmap
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <TrendingUp className="h-4 w-4" />
        <span className="text-sm font-medium">Heatmap</span>
      </button>

      {/* Layer Control */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex items-center mb-2">
          <Layers className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Datenschichten</span>
        </div>
        <div className="space-y-2">
          {Object.entries(layers).map(([key, enabled]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => onToggleLayer(key)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm">
                {key === 'price' && 'Preise'}
                {key === 'growth' && 'Wachstum'}
                {key === 'vacancy' && 'Leerstand'}
                {key === 'roi' && 'ROI'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg shadow bg-white text-gray-700 hover:bg-gray-50"
      >
        <RefreshCcw className="h-4 w-4" />
        <span className="text-sm font-medium">Aktualisieren</span>
      </button>
    </div>
  );
};

export default MapControls;
