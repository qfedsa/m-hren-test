import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PortfolioProperty, PortfolioAnalysisData } from '../types';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import {
  Wallet, TrendingUp, Building2, MapPin, AlertTriangle,
  ChevronDown, ChevronUp, Plus, Trash2, Edit3, Star,
  ArrowUpRight, ArrowDownRight, Minus, Lightbulb
} from 'lucide-react';
import PropertyNoteModal from './PropertyNoteModal';

interface PortfolioAnalysisProps {
  properties: PortfolioProperty[];
  onRemoveProperty: (id: string) => void;
  onUpdateStatus: (id: string, status: PortfolioProperty['status']) => void;
  onAddNote: (id: string, note: string) => void;
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#6366f1'];

// Cache for analysis data
const analysisCache = new Map<string, PortfolioAnalysisData>();

const PortfolioAnalysis: React.FC<PortfolioAnalysisProps> = ({
  properties,
  onRemoveProperty,
  onUpdateStatus,
  onAddNote
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties.length > 0 ? properties[0].id : null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [propertyForNote, setPropertyForNote] = useState<PortfolioProperty | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate a cache key based on properties
  const getCacheKey = useCallback(() => {
    return properties.map(p => `${p.id}-${p.status}`).join('|');
  }, [properties]);

  const analysis = useMemo((): PortfolioAnalysisData => {
    const cacheKey = getCacheKey();
    
    // Check if we have cached data
    if (analysisCache.has(cacheKey)) {
      return analysisCache.get(cacheKey)!;
    }
    
    setIsLoading(true);
    
    // Calculate analysis data
    const totalInvestment = properties.reduce((sum, p) => sum + p.price, 0);
    const monthlyIncome = properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0);
    const operatingCosts = properties.reduce((sum, p) => sum + (
      p.operatingCosts ? Object.values(p.operatingCosts).reduce((a, b) => a + b, 0) : 0
    ), 0);

    // Geografische Diversifikation
    const postalCodeMap = new Map<string, number>();
    properties.forEach(p => {
      postalCodeMap.set(p.postalCode, (postalCodeMap.get(p.postalCode) || 0) + 1);
    });

    // Immobilientypen
    const typeMap = new Map<string, number>();
    properties.forEach(p => {
      typeMap.set(p.propertyType, (typeMap.get(p.propertyType) || 0) + 1);
    });

    // Preissegmente
    const priceSegments = [
      { range: [0, 500000], label: 'Niedrig' },
      { range: [500000, 1500000], label: 'Mittel' },
      { range: [1500000, Infinity], label: 'Hoch' }
    ];
    const segmentMap = new Map<string, number>();
    properties.forEach(p => {
      const segment = priceSegments.find(s => p.price >= s.range[0] && p.price < s.range[1])!;
      segmentMap.set(segment.label, (segmentMap.get(segment.label) || 0) + 1);
    });

    const result = {
      totalInvestment,
      averageRoi: properties.length > 0 ? properties.reduce((sum, p) => sum + p.roi, 0) / properties.length : 0,
      monthlyIncome,
      operatingCosts,
      diversification: {
        geographic: Array.from(postalCodeMap.entries()).map(([postalCode, count]) => ({
          postalCode,
          count,
          percentage: (count / properties.length) * 100
        })),
        propertyTypes: Array.from(typeMap.entries()).map(([type, count]) => ({
          type,
          count,
          percentage: (count / properties.length) * 100
        })),
        priceSegments: Array.from(segmentMap.entries()).map(([segment, count]) => ({
          segment,
          count,
          percentage: (count / properties.length) * 100
        }))
      },
      riskAssessment: {
        vacancyRisk: properties.some(p => p.vacancyRate > 10) ? 'high' :
          properties.some(p => p.vacancyRate > 5) ? 'medium' : 'low',
        marketSaturation: properties.length > 0 ? properties.reduce((acc, p) => acc + p.vacancyRate, 0) / properties.length : 0,
        priceOutlook: properties.length > 0 ? (properties.reduce((acc, p) => acc + (p.roi > 10 ? 1 : 0), 0) > properties.length / 2 ?
          'positive' : properties.reduce((acc, p) => acc + (p.roi < 5 ? 1 : 0), 0) > properties.length / 2 ?
          'negative' : 'neutral') : 'neutral'
      },
      synergies: {
        managementSavings: calculateManagementSynergies(properties),
        maintenanceEfficiency: calculateMaintenanceEfficiency(properties),
        rentingOptimization: calculateRentingOptimization(properties)
      }
    };
    
    // Cache the result
    analysisCache.set(cacheKey, result);
    
    // Simulate a delay to show loading state (remove in production)
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return result;
  }, [properties, getCacheKey]);

  // Clear loading state when analysis is ready
  useEffect(() => {
    if (analysis) {
      setIsLoading(false);
    }
  }, [analysis]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const totalPortfolioValue = properties.reduce((sum, property) => sum + property.price, 0);
  const averageReturn = properties.length > 0 ? properties.reduce((sum, property) => sum + property.roi, 0) / properties.length : 0;
  const totalExpectedAnnualRent = properties.reduce((sum, property) => sum + (property.monthlyRent || 0) * 12, 0);

  // Simulated AI Analysis
  const aiAnalysis = useMemo(() => {
    const recommendations = properties.map(property => {
      let recommendation = 'Halten';
      let reason = 'Stabile Rendite und positive Marktentwicklung erwartet.';

      // Simulate market value trends
      const marketTrend = Math.random() - 0.5; // Random value between -0.5 and 0.5
      const futurePrice = property.price * (1 + marketTrend / 10); // Simulate price change

      if (property.roi < 8) {
        recommendation = 'Verkaufen';
        reason = `Niedrige Rendite im Vergleich zum Marktdurchschnitt. Marktwerttrend: ${(marketTrend * 100).toFixed(2)}%.`;
      } else if (property.roi > 12 && analysis.riskAssessment.priceOutlook === 'negative') {
        recommendation = 'Verkaufen';
        reason = `Hohe Rendite, aber negative Preisentwicklung erwartet. Prognostizierter Preis: ${formatCurrency(futurePrice)}.`;
      } else if (property.city === 'Essen' || property.city === 'Dortmund') {
        recommendation = 'Kaufen';
        reason = 'Potenzial für Wertsteigerung in aufstrebenden Stadtteilen.';
      }

      // Simulate comparison of return potentials
      const alternativeReturn = Math.random() * 15; // Random return potential between 0 and 15
      if (alternativeReturn > property.roi + 2) {
        recommendation = 'Prüfen';
        reason = `Alternative Investition mit höherem Renditepotenzial: ${alternativeReturn.toFixed(2)}%.`;
      }

      return {
        propertyId: property.id,
        recommendation,
        reason
      };
    });

    return recommendations;
  }, [properties, analysis, formatCurrency]);

  // Simulated property performance data for the bar chart
  const propertyPerformanceData = useMemo(() => {
    if (!selectedPropertyId) return [];

    const selectedProperty = properties.find(p => p.id === selectedPropertyId);
    if (!selectedProperty) return [];

    const performanceData = [];
    const currentYear = new Date().getFullYear();
    
    // Generate data for years 2019-2024 instead of including 2025
    for (let year = 2019; year <= 2024; year++) {
      // Calculate a realistic growth pattern
      // Earlier years have lower values, with steady growth
      const yearIndex = year - 2019; // 0 for 2019, 5 for 2024
      const growthFactor = 1 + (yearIndex * 0.08); // 8% growth per year
      
      // Base value adjusted by property characteristics
      const baseValue = selectedProperty.price * 0.7; // Start at 70% of current price
      const simulatedValue = baseValue * growthFactor;
      
      // Add some randomness for realism (±5%)
      const randomFactor = 0.95 + (Math.random() * 0.1);
      
      performanceData.push({
        year: year.toString(),
        Wert: simulatedValue * randomFactor, // Use 'Wert' here
        name: selectedProperty.title
      });
    }

    return performanceData;
  }, [properties, selectedPropertyId]);

  const handlePropertySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPropertyId(event.target.value);
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    // Scroll to the risk analysis section
    const riskSection = document.getElementById('risk-analysis-section');
    if (riskSection) {
      riskSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddNoteClick = (property: PortfolioProperty) => {
    setPropertyForNote(property);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (note: string) => {
    if (propertyForNote) {
      onAddNote(propertyForNote.id, note);
      setIsNoteModalOpen(false);
      setPropertyForNote(null);
    }
  };

  const handleToggleWatchlist = (property: PortfolioProperty) => {
    const newStatus = property.status === 'watchlist' ? 'active' : 'watchlist';
    onUpdateStatus(property.id, newStatus);
  };

  const handleRemoveProperty = (id: string) => {
    setConfirmDeleteId(null);
    onRemoveProperty(id);
  };

  const selectedProperty = useMemo(() => {
    return properties.find(p => p.id === selectedPropertyId) || properties[0];
  }, [properties, selectedPropertyId]);

  const riskAssessment = useMemo(() => {
    if (!selectedProperty) return { vacancyRisk: 'low', marketSaturation: 0, priceOutlook: 'neutral' };
    
    const vacancyRisk = selectedProperty.vacancyRate > 10 ? 'high' :
      selectedProperty.vacancyRate > 5 ? 'medium' : 'low';
    const marketSaturation = selectedProperty.vacancyRate;
    const priceOutlook = selectedProperty.roi > 10 ? 'positive' : selectedProperty.roi < 5 ? 'negative' : 'neutral';

    return {
      vacancyRisk,
      marketSaturation,
      priceOutlook
    };
  }, [selectedProperty]);

  const synergies = useMemo(() => {
    if (!selectedProperty) return { managementSavings: 0, maintenanceEfficiency: 0, rentingOptimization: 0 };
    
    // Simulate synergies based on property characteristics
    const baseManagementSavings = 1000;
    const baseMaintenanceEfficiency = 500;
    const baseRentingOptimization = 750;

    // Adjust savings based on property size, location, and condition
    const managementSavings = baseManagementSavings * (1 + (selectedProperty.size / 500)) * (1 - (selectedProperty.vacancyRate / 100));
    const maintenanceEfficiency = baseMaintenanceEfficiency * (1 + (selectedProperty.size / 1000)) * (1 - (selectedProperty.renovationNeed / 10));
    const rentingOptimization = baseRentingOptimization * (1 + (selectedProperty.roi / 100)) * (1 - (selectedProperty.vacancyRate / 100));

    return {
      managementSavings,
      maintenanceEfficiency,
      rentingOptimization
    };
  }, [selectedProperty]);

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Anzahl Objekte</h3>
            </div>
            <span className="text-lg font-semibold">{properties.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Gesamtwert Portfolio</h3>
            </div>
            <span className="text-lg font-semibold">{formatCurrency(totalPortfolioValue)}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Durchschnittliche Rendite</h3>
            </div>
            <span className="text-lg font-semibold">{averageReturn.toFixed(2)}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Erwartete Jahresmiete</h3>
            </div>
            <span className="text-lg font-semibold">{formatCurrency(totalExpectedAnnualRent)}</span>
          </div>
        </div>
      </div>

      {/* AI-gestützte Analyse */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center">
          <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="font-medium">KI-gestützte Investitionsempfehlungen</h3>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {aiAnalysis.map(recommendation => {
              const property = properties.find(p => p.id === recommendation.propertyId);
              if (!property) return null;

              return (
                <li key={recommendation.propertyId} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{property.title}</h4>
                    <p className="text-sm text-gray-500">{recommendation.reason}</p>
                  </div>
                  <div className={`font-semibold ${recommendation.recommendation === 'Verkaufen' ? 'text-red-600' : recommendation.recommendation === 'Kaufen' ? 'text-green-600' : 'text-gray-600'}`}>
                    Empfehlung: {recommendation.recommendation}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Diversifikation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <button
          onClick={() => toggleSection('diversification')}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium">Diversifikationsanalyse</h3>
          </div>
          {expandedSection === 'diversification' ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'diversification' && (
          <div className="p-6 border-t relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Geografische Verteilung */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-4">Geografische Verteilung</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.diversification.geographic}
                        dataKey="percentage"
                        nameKey="postalCode"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {analysis.diversification.geographic.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Immobilientypen */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-4">Immobilientypen</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.diversification.propertyTypes}
                        dataKey="percentage"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {analysis.diversification.propertyTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === 'type') {
                            const type = (props.payload as any).type;
                            if (type === 'residential') return [`${value.toFixed(2)}%`, 'Wohnimmobilien'];
                            if (type === 'commercial') return [`${value.toFixed(2)}%`, 'Gewerbeimmobilien'];
                          }
                          return [`${value.toFixed(2)}%`, name];
                        }}
                      />
                      <Legend 
                        formatter={(value) => {
                          if (value === 'residential') return 'Wohnimmobilien';
                          if (value === 'commercial') return 'Gewerbeimmobilien';
                          return value;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Preissegmente */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-4">Preissegmente</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.diversification.priceSegments}
                        dataKey="percentage"
                        nameKey="segment"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {analysis.diversification.priceSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risikoanalyse */}
      <div id="risk-analysis-section" className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="font-medium">Risikoanalyse</h3>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">Ausgewählte Immobilie:</span>
            <select
              value={selectedPropertyId || ''}
              onChange={handlePropertySelect}
              className="p-2 border rounded"
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 border-t">
          {selectedProperty ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Leerstandsrisiko</h4>
                <div className={`text-lg font-semibold ${getRiskColor(riskAssessment.vacancyRisk)}`}>
                  {riskAssessment.vacancyRisk === 'low' ? 'Niedrig' :
                  riskAssessment.vacancyRisk === 'medium' ? 'Mittel' : 'Hoch'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Ø {riskAssessment.marketSaturation.toFixed(1)}% Leerstand
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Marktsättigung</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-lg font-semibold">
                      {riskAssessment.marketSaturation.toFixed(1)}%
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${riskAssessment.marketSaturation * 10}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Preisentwicklung</h4>
                <div className="flex items-center">
                  {riskAssessment.priceOutlook === 'positive' ? (
                    <>
                      <ArrowUpRight className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-semibold">Positiv</span>
                    </>
                  ) : riskAssessment.priceOutlook === 'negative' ? (
                    <>
                      <ArrowDownRight className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-600 font-semibold">Negativ</span>
                    </>
                  ) : (
                    <>
                      <Minus className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-yellow-600 font-semibold">Neutral</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Keine Immobilien im Portfolio vorhanden.
            </div>
          )}
        </div>
      </div>

      {/* Synergiepotenziale */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium">Synergiepotenziale</h3>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">Ausgewählte Immobilie:</span>
            <select
              value={selectedPropertyId || ''}
              onChange={handlePropertySelect}
              className="p-2 border rounded"
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 border-t">
          {selectedProperty ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Verwaltungskostenersparnis</h4>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(synergies.managementSavings)} / Jahr
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Instandhaltungseffizienz</h4>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(synergies.maintenanceEfficiency)} / Jahr
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Vermietungsoptimierung</h4>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(synergies.rentingOptimization)} / Jahr
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Keine Immobilien im Portfolio vorhanden.
            </div>
          )}
        </div>
      </div>

      {/* Property Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Wertentwicklung der Immobilien (letzte 6 Jahre)</h3>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">Ausgewählte Immobilie:</span>
            <select
              value={selectedPropertyId || ''}
              onChange={handlePropertySelect}
              className="p-2 border rounded"
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6">
          {selectedProperty ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={propertyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                {/* Hide Y-axis labels by setting hide={true} */}
                <YAxis hide={true} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} labelFormatter={(label) => `Jahr: ${label}`} />
                <Legend verticalAlign="bottom" height={36} />
                <Bar dataKey="Wert" fill="#82ca9d" name="Wert" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Keine Immobilien im Portfolio vorhanden.
            </div>
          )}
        </div>
      </div>

      {/* Immobilienliste */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium">Portfolio ({properties.length} Objekte)</h3>
        </div>
        {properties.length > 0 ? (
          <div className="divide-y">
            {properties.map((property) => (
              <div 
                key={property.id} 
                className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${selectedPropertyId === property.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => handlePropertyClick(property.id)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{property.title}</h4>
                    <div className="text-sm text-gray-500">{property.location}, {property.city}</div>
                    <div className="text-sm font-medium text-blue-600">{formatCurrency(property.price)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWatchlist(property);
                    }}
                    className={`p-2 transition-colors ${
                      property.status === 'watchlist' 
                        ? 'text-yellow-500' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title={property.status === 'watchlist' ? 'Von Watchlist entfernen' : 'Zur Watchlist hinzufügen'}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNoteClick(property);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Notiz hinzufügen"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(property.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Aus Portfolio entfernen"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Keine Immobilien im Portfolio vorhanden.</p>
            <p className="mt-2 text-sm">Fügen Sie Immobilien aus der Marktanalyse hinzu.</p>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {isNoteModalOpen && propertyForNote && (
        <PropertyNoteModal
          property={propertyForNote}
          initialNote={propertyForNote.notes || ''}
          onSave={handleSaveNote}
          onClose={() => {
            setIsNoteModalOpen(false);
            setPropertyForNote(null);
          }}
        />
      )}

      {/* Confirmation Dialog for Delete */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Immobilie entfernen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie diese Immobilie aus Ihrem Portfolio entfernen möchten?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleRemoveProperty(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Entfernen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hilfsfunktionen für Synergieberechnungen
function calculateManagementSynergies(properties: PortfolioProperty[]): number {
  const baseManagementCost = 50; // Basis-Verwaltungskosten pro Einheit
  const synergiesFactor = 0.15; // 15% Einsparung pro zusätzliche Einheit
  
  return properties.reduce((total, _, index) => {
    const savings = baseManagementCost * Math.min(synergiesFactor * index, 0.5);
    return total + savings;
  }, 0) * 12; // Jährliche Einsparung
}

function calculateMaintenanceEfficiency(properties: PortfolioProperty[]): number {
  const baseMaintenanceCost = 2.5; // €/m² pro Monat
  const synergiesFactor = 0.1; // 10% Einsparung pro zusätzliche Einheit
  
  return properties.reduce((total, property, index) => {
    const savings = property.size * baseMaintenanceCost * Math.min(synergiesFactor * index, 0.4);
    return total + savings;
  }, 0) * 12; // Jährliche Einsparung
}

function calculateRentingOptimization(properties: PortfolioProperty[]): number {
  const baseRentingCost = 100; // Basis-Vermietungskosten pro Einheit
  const synergiesFactor = 0.2; // 20% Einsparung pro zusätzliche Einheit
  
  return properties.reduce((total, property, index) => {
    const savings = baseRentingCost * Math.min(synergiesFactor * index, 0.6);
    return total + (property.monthlyRent || 0) * (savings / 100);
  }, 0) * 12; // Jährliche Einsparung
}

export default PortfolioAnalysis;
