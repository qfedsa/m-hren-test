import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, BarChart, Bar } from 'recharts';
import { Region, Property } from '../types';
import { Building2, Home, TrendingUp, MapPin, Download, AlertTriangle, Activity, Users, Briefcase, Construction, ShieldAlert, Euro, Ruler, FileText } from 'lucide-react';
import PropertyCard from './PropertyCard';

interface RegionDetailsProps {
  region: Region;
  properties: Property[];
  onAddToPortfolio?: (property: Property) => void;
}

const RegionDetails: React.FC<RegionDetailsProps> = ({ 
  region, 
  properties,
  onAddToPortfolio
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'market' | 'infrastructure' | 'risk'>('overview');
  const regionProperties = properties.filter(
    (property) => property.city === region.name
  );

  const formatNumber = (num: number) => num.toFixed(2);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('de-DE');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(amount);

  const getStatusColor = (value: number, type: 'score' | 'change') => {
    if (type === 'score') {
      if (value >= 8) return 'text-green-600';
      if (value >= 6) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value > 0) return 'text-green-600';
      if (value < 0) return 'text-red-600';
      return 'text-gray-600';
    }
  };

  const getRenovationStatusColor = (status: string) => {
    switch (status) {
      case 'none': return 'bg-green-100 text-green-800';
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      case 'major': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-4 py-3 font-medium text-sm ${
                selectedTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Übersicht
            </button>
            <button
              onClick={() => setSelectedTab('market')}
              className={`px-4 py-3 font-medium text-sm ${
                selectedTab === 'market'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Marktanalyse
            </button>
            <button
              onClick={() => setSelectedTab('infrastructure')}
              className={`px-4 py-3 font-medium text-sm ${
                selectedTab === 'infrastructure'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Infrastruktur
            </button>
            <button
              onClick={() => setSelectedTab('risk')}
              className={`px-4 py-3 font-medium text-sm ${
                selectedTab === 'risk'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Risikoanalyse
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{region.name}</h2>
              
            </div>
          </div>

          {selectedTab === 'overview' && (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="text-sm text-gray-500">Leerstandsquote</div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold">
                      {formatNumber(region.marketData.vacancyRate)}%
                    </div>
                    <span className={`ml-2 text-sm ${
                      getStatusColor(region.marketData.vacancyRateChange, 'change')
                    }`}>
                      {region.marketData.vacancyRateChange > 0 ? '+' : ''}
                      {formatNumber(region.marketData.vacancyRateChange)}%
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="text-sm text-gray-500">Sanierungsstatus</div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getRenovationStatusColor(region.marketData.renovationStatus)
                    }`}>
                      {region.marketData.renovationStatus === 'none' && 'Keine erforderlich'}
                      {region.marketData.renovationStatus === 'minor' && 'Geringfügig'}
                      {region.marketData.renovationStatus === 'major' && 'Umfangreich'}
                      {region.marketData.renovationStatus === 'critical' && 'Kritisch'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="text-sm text-gray-500">Erwartete ROI</div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold">
                      {formatNumber(region.marketData.expectedRoi)}%
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="text-sm text-gray-500">Objektzustand</div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold">
                      {region.marketData.propertyCondition}/10
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Trend Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <h3 className="text-lg font-semibold mb-4">Preisentwicklung & Prognose</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={region.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('de-DE', { month: 'short' })}
                      />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        fill="#3b82f6"
                        fillOpacity={0.1}
                        name="Aktuell"
                      />
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.1}
                        strokeDasharray="5 5"
                        name="Prognose"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {selectedTab === 'market' && (
            <div className="space-y-6">
              {/* Market Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Bevölkerungswachstum</span>
                  </div>
                  <div className="mt-2 text-2xl font-semibold">
                    {formatNumber(region.marketData.populationGrowth)}%
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Beschäftigungsquote</span>
                  </div>
                  <div className="mt-2 text-2xl font-semibold">
                    {formatNumber(region.marketData.employmentRate)}%
                  </div>
                </div>
              </div>

              {/* Supply vs Demand */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Angebot vs. Nachfrage</h3>
                <p className="text-gray-600 text-sm">
                  Diese Zahl stellt das Verhältnis zwischen dem aktuellen Angebot an verfügbaren Immobilien und der Nachfrage dar.
                  Ein Wert über 1 deutet auf ein höheres Angebot hin, während ein Wert unter 1 eine höhere Nachfrage anzeigt.
                </p>
                <div className="flex items-center mt-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${Math.min(100, region.marketData.supplyDemandRatio * 100)}%` }}
                    />
                  </div>
                  <span className="ml-4 font-medium">
                    {formatNumber(region.marketData.supplyDemandRatio)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'infrastructure' && (
            <div className="space-y-6">
              {/* Infrastructure Score */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Infrastruktur Score</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Der Infrastruktur Score bewertet die Qualität und Dichte der lokalen Infrastruktur.
                  Er berücksichtigt Faktoren wie Verkehrsanbindung, Bildungseinrichtungen, Einkaufsmöglichkeiten,
                  Gesundheitsversorgung und Freizeitmöglichkeiten. Ein höherer Wert steht für eine bessere Infrastruktur.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatNumber(region.marketData.infrastructureScore)}/10
                  </span>
                </div>
              </div>

              {/* Development Plans */}
              <div className="bg-white rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold p-6 pb-4">Entwicklungsprojekte</h3>
                <div className="divide-y">
                  {region.infrastructurePlans.map((plan, index) => (
                    <div key={index} className="p-6 flex items-start gap-4">
                      <Construction className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">{plan.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            Fertigstellung: {formatDate(plan.completionDate)}
                          </span>
                          <span className="text-blue-600 font-medium">
                            Impact Score: {plan.impact}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'risk' && region.riskAssessment && (
            <div className="space-y-6">
              {/* Kriminalitätsstatistik */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
                  Kriminalitätsstatistik
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={region.riskAssessment.crimeStatistics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          const formattedValue = Number(value).toLocaleString('de-DE');
                          let displayName = name;
                          
                          // Translate category names for tooltip
                          if (name === 'categories.propertyDamage') displayName = 'Sachbeschädigung';
                          if (name === 'categories.burglary') displayName = 'Einbruch';
                          if (name === 'categories.assault') displayName = 'Gewaltdelikte';
                          if (name === 'categories.other') displayName = 'Sonstige';
                          
                          return [`${formattedValue} Fälle pro Jahr`, displayName];
                        }}
                      />
                      <Legend 
                        formatter={(value) => {
                          if (value === 'categories.propertyDamage') return 'Sachbeschädigung';
                          if (value === 'categories.burglary') return 'Einbruch';
                          if (value === 'categories.assault') return 'Gewaltdelikte';
                          if (value === 'categories.other') return 'Sonstige';
                          return value;
                        }}
                      />
                      <Bar dataKey="categories.propertyDamage" name="categories.propertyDamage" fill="#ef4444" />
                      <Bar dataKey="categories.burglary" name="categories.burglary" fill="#f97316" />
                      <Bar dataKey="categories.assault" name="categories.assault" fill="#eab308" />
                      <Bar dataKey="categories.other" name="categories.other" fill="#94a3b8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Erläuterung:</p>
                  <p>Die Zahlen repräsentieren die jährliche Anzahl der gemeldeten Fälle in der Region.</p>
                </div>
              </div>

              {/* Sozioökonomische Indikatoren */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Arbeitslosenquote</span>
                    <span className={`text-lg font-semibold ${
                      region.riskAssessment.socioeconomicData.unemploymentRate > 10
                        ? 'text-red-600'
                        : region.riskAssessment.socioeconomicData.unemploymentRate > 5
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {region.riskAssessment.socioeconomicData.unemploymentRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        region.riskAssessment.socioeconomicData.unemploymentRate > 10
                          ? 'bg-red-600'
                          : region.riskAssessment.socioeconomicData.unemploymentRate > 5
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{
                        width: `${Math.min(100, region.riskAssessment.socioeconomicData.unemploymentRate * 5)}%`
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex flex-col mb-2">
                    <span className="text-sm text-gray-500 mb-1">Durchschnittseinkommen</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(region.riskAssessment.socioeconomicData.averageIncome)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded flex items-center justify-between">
                    <div>
                      <span className="text-sm">vs. Bundesdurchschnitt:</span>
                    </div>
                    <div>
                      <span className="ml-1 text-sm font-medium text-green-600">+5.2%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Armutsquote</span>
                    <span className={`text-lg font-semibold ${
                      region.riskAssessment.socioeconomicData.povertyRate > 20
                        ? 'text-red-600'
                        : region.riskAssessment.socioeconomicData.povertyRate > 15
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {region.riskAssessment.socioeconomicData.povertyRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Leerstandsanalyse */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Leerstandsanalyse (500m Umkreis)</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">
                      {region.riskAssessment.localVacancy.radius500m}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Trend: {
                        region.riskAssessment.localVacancy.trend === 'increasing'
                          ? 'Steigend'
                          : region.riskAssessment.localVacancy.trend === 'decreasing'
                          ? 'Fallend'
                          : 'Stabil'
                      }
                    </div>
                  </div>
                  <div className={`text-sm px-3 py-1 rounded-full ${
                    region.riskAssessment.localVacancy.trend === 'increasing'
                      ? 'bg-red-100 text-red-800'
                      : region.riskAssessment.localVacancy.trend === 'decreasing'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {region.riskAssessment.localVacancy.trend === 'increasing'
                      ? '↗ Steigend'
                      : region.riskAssessment.localVacancy.trend === 'decreasing'
                      ? '↘ Fallend'
                      : '→ Stabil'}
                  </div>
                </div>
              </div>

              {/* Sanierungskosten */}
              {region.renovationAnalysis && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Euro className="h-5 w-5 text-blue-500 mr-2" />
                    Sanierungskosten
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Kostenaufstellung</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Grundsanierung</span>
                          <span className="font-medium">{formatCurrency(region.renovationAnalysis.costs.basic)}/m²</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Energetische Sanierung</span>
                          <span className="font-medium">{formatCurrency(region.renovationAnalysis.costs.energy)}/m²</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Denkmalschutz</span>
                          <span className="font-medium">{formatCurrency(region.renovationAnalysis.costs.historical)}/m²</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between items-center font-semibold">
                          <span>Gesamtkosten</span>
                          <span>{formatCurrency(region.renovationAnalysis.costs.total)}/m²</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Amortisation & ROI</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Basis-ROI</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {region.renovationAnalysis.roi.baseline}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">ROI mit Förderung</div>
                          <div className="text-2xl font-bold text-green-600">
                            {region.renovationAnalysis.roi.withSubsidies}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Amortisationszeit</div>
                          <div className="text-xl font-semibold">
                            {region.renovationAnalysis.roi.amortizationYears} Jahre
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Förderprogramme */}
              {region.renovationAnalysis?.subsidies && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-green-500 mr-2" />
                    Verfügbare Förderprogramme
                  </h3>
                  <div className="space-y-4">
                    {region.renovationAnalysis.subsidies.map((subsidy, index) => (
                      <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{subsidy.name}</h4>
                            <div className="text-sm text-gray-500 mt-1">
                              Förderquote: {subsidy.rate}% (max. {formatCurrency(subsidy.maxAmount)})
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors">
                            Details
                          </button>
                        </div>
                        <div className="mt-2">
                          <div className="text-sm font-medium mb-1">Voraussetzungen:</div>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {subsidy.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Available Properties */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Verfügbare Immobilien</h2>
        {regionProperties.length > 0 ? (
          regionProperties.map((property) => (
            <PropertyCard 
              key={property.id}
              property={property}
              showAddButton={true}
              onAddToPortfolio={() => onAddToPortfolio && onAddToPortfolio(property)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              Keine Immobilien in {region.name} verfügbar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionDetails;
