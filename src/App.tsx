import React, { useState, useRef, useEffect } from 'react';
import { Building2, Menu, X, HelpCircle } from 'lucide-react';
import Map from './components/Map';
import RegionDetails from './components/RegionDetails';
import SearchFilters from './components/SearchFilters';
import PortfolioAnalysis from './components/PortfolioAnalysis';
import MarketVisualization from './components/MarketVisualization';
import { regions, properties } from './data';
import type { SearchFilters as SearchFiltersType, PortfolioProperty, Property } from './types';
import FAQ from './components/FAQ';
import Onboarding from './components/Onboarding';

function App() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'portfolio' | 'market'>('map');
  const [filters, setFilters] = useState<SearchFiltersType>({
    population: {},
    price: {},
    propertyType: [],
    investmentScore: {},
    vacancyDuration: {}
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Portfolio State
  const [portfolioProperties, setPortfolioProperties] = useState<PortfolioProperty[]>([
    {
      ...properties[0],
      addedAt: new Date(),
      status: 'active',
      postalCode: '10405',
      propertyType: 'residential'
    },
    {
      ...properties[1],
      addedAt: new Date(),
      status: 'watchlist',
      postalCode: '20457',
      propertyType: 'commercial'
    }
  ]);

  // Check if it's the user's first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId === selectedRegion ? null : regionId);
  };

  const handleRegionsSelect = (regionIds: string[]) => {
    setSelectedRegions(regionIds);
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  const handleRemoveProperty = (id: string) => {
    setPortfolioProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateStatus = (id: string, status: PortfolioProperty['status']) => {
    setPortfolioProperties(prev =>
      prev.map(p => p.id === id ? { ...p, status } : p)
    );
  };

  const handleAddNote = (id: string, note: string) => {
    setPortfolioProperties(prev =>
      prev.map(p => p.id === id ? { ...p, notes: note } : p)
    );
  };

  const handleAddToPortfolio = (property: Property) => {
    // Check if property already exists in portfolio
    const exists = portfolioProperties.some(p => p.id === property.id);
    if (!exists) {
      const portfolioProperty: PortfolioProperty = {
        ...property,
        addedAt: new Date(),
        status: 'active'
      };
      setPortfolioProperties(prev => [...prev, portfolioProperty]);
    } else {
      console.log(`Property ${property.title} already in portfolio`);
    }
  };

  const handleViewPortfolio = () => {
    setActiveView('portfolio');
  };

  const selectedRegionData = regions.find((r) => r.id === selectedRegion);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const foundRegion = regions.find(region =>
      region.name.toLowerCase().includes(query.toLowerCase())
    );

    if (foundRegion) {
      // Center the map on the found region
      mapRef.current?.setCenter({
        lat: foundRegion.coordinates[1],
        lng: foundRegion.coordinates[0]
      });
      mapRef.current?.setZoom(10); // Adjust zoom level as needed
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Onboarding */}
      <Onboarding
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">FAQ - Häufig gestellte Fragen</h2>
              <button onClick={() => setIsHelpOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>
            <FAQ />
            <p className="mt-4 text-sm text-gray-500">
              Hinweis: Die in dieser Demo angezeigten Daten sind simuliert. In der
              praktischen Anwendung werden die Daten über eine API von realen
              Datenquellen bezogen.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
        <div className="max-w-[2000px] mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-black p-1 rounded">
                <img
                  src="https://maehren.ag/wp-content/uploads/2023/06/logo_MAEHREN_white.png"
                  alt="Mähren AG Logo"
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => setActiveView('map')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === 'map'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Marktanalyse
                </button>
                <button
                  onClick={() => setActiveView('market')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === 'market'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Marktdaten
                </button>
                <button
                  onClick={() => setActiveView('portfolio')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === 'portfolio'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Portfolio
                </button>
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                {isFilterOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center justify-center p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                aria-label="Hilfe"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {activeView === 'map' ? (
          <div className="relative flex h-[calc(100vh-4rem)]">
            {/* Filter Panel - Mobile */}
            <div
              className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
                isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Filter Panel */}
            <div
              className={`fixed lg:static w-80 h-full bg-white z-40 transform transition-transform duration-300 ease-in-out ${
                isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="h-full overflow-y-auto">
                <SearchFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters}
                  onSearch={handleSearch}
                />
              </div>
            </div>

            {/* Map and Details Container */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Map Section */}
              <div className={`flex-1 relative ${selectedRegion ? 'lg:w-3/5' : 'w-full'}`}>
                <Map
                  width="100%"
                  height="100%"
                  regions={regions}
                  selectedRegion={selectedRegion}
                  onRegionSelect={handleRegionSelect}
                  onAddToPortfolio={handleAddToPortfolio}
                  mapRef={mapRef}
                />
              </div>

              {/* Region Details Section */}
              {selectedRegionData && (
                <div className="lg:w-2/5 h-full overflow-y-auto bg-gray-50 border-l">
                  <div className="p-6">
                    <RegionDetails
                      region={selectedRegionData}
                      properties={properties}
                      onAddToPortfolio={handleAddToPortfolio}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeView === 'market' ? (
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <MarketVisualization
              regions={regions}
              selectedRegions={selectedRegions}
              onRegionSelect={handleRegionsSelect}
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <PortfolioAnalysis
              properties={portfolioProperties}
              onRemoveProperty={handleRemoveProperty}
              onUpdateStatus={handleUpdateStatus}
              onAddNote={handleAddNote}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
