import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Clock, AlertTriangle, Building2, Euro, Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import type { SearchFilters, FilterPreset } from '../types';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  onSearch: (query: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange, initialFilters, onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {
    population: {},
    price: {},
    propertyType: [],
    investmentScore: {},
    vacancyDuration: {},
    state: []
  });

  const [recentPresets, setRecentPresets] = useState<FilterPreset[]>(() => {
    const saved = localStorage.getItem('recentFilterPresets');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['location']);
  const filtersRef = useRef<SearchFilters>(filters);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const saveFilters = () => {
      const preset: FilterPreset = {
        id: Date.now().toString(),
        name: 'Letzte Suche',
        filters: filtersRef.current,
        lastUsed: new Date()
      };

      const updatedPresets = [preset, ...recentPresets.slice(0, 4)];
      setRecentPresets(updatedPresets);
      localStorage.setItem('recentFilterPresets', JSON.stringify(updatedPresets));
    };

    if (Object.keys(filtersRef.current).length > 0) {
      saveFilters();
    }
  }, []);

  const handleFilterChange = (changes: Partial<SearchFilters>) => {
    setIsLoading(true);
    const newFilters = { ...filters, ...changes };
    setFilters(newFilters);

    // Simulate caching by reducing the timeout if filters haven't changed
    const timeoutDuration = areFiltersEqual(filtersRef.current, newFilters) ? 0 : Math.random() * 300 + 100;

    setTimeout(() => {
      onFiltersChange(newFilters);
      setIsLoading(false);
    }, timeoutDuration);
  };

  const areFiltersEqual = (prevFilters: SearchFilters, newFilters: SearchFilters): boolean => {
    // Simple comparison - you might need a more robust solution
    return JSON.stringify(prevFilters) === JSON.stringify(newFilters);
  };

  const toggleExpanded = (section: string) => {
    setExpanded(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    handleFilterChange(newFilters);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };

  const handlePropertyTypeChange = (type: string) => {
    const newTypes = filters.propertyType?.includes(type as any)
      ? filters.propertyType.filter(t => t !== type)
      : [...(filters.propertyType || []), type as any];
    handleFilterChange({ propertyType: newTypes });
  };

  const handleRiskLevelChange = (risk: string) => {
    handleFilterChange(filters.riskLevel === risk ? { riskLevel: undefined } : { riskLevel: risk as any });
  };

  return (
    <div className="h-full flex flex-col bg-white" title="Hier können Sie Suchfilter einstellen.">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Suchleiste */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Stadt oder Region suchen..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Suchen
            </button>
          </div>

          {/* Filtergruppen */}
          <div className="space-y-4">
            {/* Standort & Größe */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded('location')}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Standort & Größe</span>
                </div>
                {expanded.includes('location') ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expanded.includes('location') && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Einwohnerzahl
                    </label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const newPopulation = { ...filters.population };
                          if (value) {
                            newPopulation.min = value;
                          } else {
                            delete newPopulation.min;
                          }
                          handleFilterChange({ population: newPopulation });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const newPopulation = { ...filters.population };
                          if (value) {
                            newPopulation.max = value;
                          } else {
                            delete newPopulation.max;
                          }
                          handleFilterChange({ population: newPopulation });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Investitionskriterien */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded('investment')}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Investitionskriterien</span>
                </div>
                {expanded.includes('investment') ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expanded.includes('investment') && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objekttyp
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['renovation', 'vacant', 'foreclosure'].map((type) => (
                        <button
                          key={type}
                          onClick={() => handlePropertyTypeChange(type)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filters.propertyType?.includes(type as any)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type === 'renovation' ? 'Sanierung' : type === 'vacant' ? 'Leerstand' : 'Zwangsversteigerung'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Score
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-full"
                      value={filters.investmentScore?.min?.toString() || '0'}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        handleFilterChange({
                          investmentScore: { min: value }
                        });
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Risikoanalyse */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded('risk')}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Risikoanalyse</span>
                </div>
                {expanded.includes('risk') ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expanded.includes('risk') && (
                <div className="p-4">
                  <div className="space-y-2">
                    {['low', 'medium', 'high'].map((risk) => (
                      <button
                        key={risk}
                        onClick={() => handleRiskLevelChange(risk)}
                        className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                          filters.riskLevel === risk
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {risk === 'low' ? 'Niedriges Risiko' : risk === 'medium' ? 'Mittleres Risiko' : 'Hohes Risiko'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
