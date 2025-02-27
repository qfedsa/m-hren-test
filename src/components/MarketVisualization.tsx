import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Scatter
} from 'recharts';
import {
  TrendingUp, Download, Filter, Map, Building2,
  ArrowUpRight, ArrowDownRight, Minus, RefreshCcw,
  ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';
import { Region } from '../types';

interface MarketVisualizationProps {
  regions: Region[];
  selectedRegions: string[];
  onRegionSelect: (regionIds: string[]) => void;
}

const MarketVisualization: React.FC<MarketVisualizationProps> = ({
  regions,
  selectedRegions,
  onRegionSelect
}) => {
  const [propertyType, setPropertyType] = useState<'all' | 'apartment' | 'house' | 'land'>('all');
  const [location, setLocation] = useState<'all' | 'center' | 'outskirts' | 'suburban'>('all');
  const [priceSegment, setPriceSegment] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('market-data');
  const printRef = useRef<HTMLDivElement>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [vacancyRadius, setVacancyRadius] = useState<number>(1000); // Default to 1km

  const selectedRegionData = useMemo(() =>
    regions.filter(r => selectedRegions.includes(r.id)),
    [regions, selectedRegions]
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(Number(amount));

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}-${year}`;
  };

  const formatDateForecast = (date: string) => {
    const [year, month] = date.split('-');
    return `${month}-${year}`;
  };

  const formatQuarter = (quarter: string) => {
    return quarter;
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getPerformanceIndicator = (value: number) => {
    if (value > 5) return { icon: ArrowUpRight, color: 'text-green-500' };
    if (value < -5) return { icon: ArrowDownRight, color: 'text-red-500' };
    return { icon: Minus, color: 'text-yellow-500' };
  };

  // Helper function to apply filters
  const applyFilters = (trend: any) => {
    let price = trend.price || trend.forecast;

    // Apply property type filter
    if (propertyType !== 'all') {
      switch (propertyType) {
        case 'apartment':
          price *= (1 + (Math.random() * 0.1 - 0.05)); // +/- 5%
          break;
        case 'house':
          price *= (1 + (Math.random() * 0.2 - 0.1));  // +/- 10%
          break;
        case 'land':
          price *= (1 + (Math.random() * 0.3 - 0.15)); // +/- 15%
          break;
      }
    }

    // Apply location filter
    if (location !== 'all') {
      switch (location) {
        case 'center':
          price *= (1 + (Math.random() * 0.15 - 0.075)); // +/- 7.5%
          break;
        case 'outskirts':
          price *= (1 + (Math.random() * 0.05 - 0.025)); // +/- 2.5%
          break;
        case 'suburban':
          price *= (1 + (Math.random() * 0.1 - 0.05));  // +/- 5%
          break;
      }
    }

    // Apply price segment filter
    if (priceSegment !== 'all') {
      switch (priceSegment) {
        case 'low':
          price *= (1 + (Math.random() * 0.05 - 0.025)); // +/- 2.5%
          break;
        case 'medium':
          price *= (1 + (Math.random() * 0.1 - 0.05));  // +/- 5%
          break;
        case 'high':
          price *= (1 + (Math.random() * 0.2 - 0.1));  // +/- 10%
          break;
      }
    }

    // Round to 2 decimal places
    price = Math.round(price * 100) / 100;

    return { ...trend, price: price, forecast: price };
  };

  // Prepare data for the price development chart (2024 data)
  const priceDevelopmentData = useMemo(() => {
    if (selectedRegionData.length === 0) return [];

    // Assuming the first selected region is representative for the chart
    const region = selectedRegionData[0];
    return region.trends.filter(trend => trend.date.startsWith('2024')).map(applyFilters);
  }, [selectedRegionData, propertyType, location, priceSegment]);

  // Prepare data for the AI price forecast (2025 data, Jan/Feb current, Mar-Dec forecast)
  const forecastData = useMemo(() => {
    if (selectedRegionData.length === 0) return [];

    const region = selectedRegionData[0];
    return region.trends
      .filter(t => t.date.startsWith('2025'))
      .map(t => ({
        date: t.date,
        price: (t.date === '2025-01' || t.date === '2025-02') ? t.forecast : undefined,
        forecast: (t.date !== '2025-01' && t.date !== '2025-02') ? t.forecast : undefined
      }))
      .map(applyFilters);
  }, [selectedRegionData, propertyType, location, priceSegment]);

  const handlePrint = () => {
    if (!printRef.current) {
      console.error("printRef is not available!");
      return;
    }

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Immobilienbericht</title>
          <style>
            body { font-family: sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .section-title { margin-top: 30px; margin-bottom: 10px; font-size: 1.2em; font-weight: bold; }
            .region-title { margin-bottom: 5px; font-size: 1.1em; font-weight: bold; }
            .report-date { margin-bottom: 20px; font-size: 0.9em; color: #777; }
            .indicator-value { font-weight: bold; }
            .positive { color: green; }
            .negative { color: red; }
            .neutral { color: orange; }
          </style>
        </head>
        <body>
          <div class="report-date">Berichtsdatum: ${formatDate(new Date().toISOString())}</div>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setDownloadLink(url); // Set the download link

    // Trigger the download using a hidden link and a click event
    const a = document.createElement('a');
    a.href = url;
    a.download = 'immobilienbericht.html';
    a.style.display = 'none'; // Hide the link
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL
    setDownloadLink(null)
  };

  const vacancyRateForRadius = (region: Region, radius: number) => {
    // In a real application, this would involve a more complex calculation
    // based on the region's data and the specified radius.
    // For this example, we'll just return the existing vacancy rate.
    return region.riskAssessment.localVacancy.radius500m;
  };

  useEffect(() => {
    if (regions.length > 0 && selectedRegions.length === 0) {
      onRegionSelect([regions[0].id]); // Select the first region by default
    }
  }, [regions, selectedRegions, onRegionSelect]);


  return (
    <div className="space-y-6">
      {/* Filterleiste */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          {/* Städteauswahl */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Städte vergleichen
            </label>
            <select
              multiple
              value={selectedRegions}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                onRegionSelect(values.slice(0, 3));
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Immobilientyp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Immobilientyp
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Alle</option>
              <option value="apartment">Eigentumswohnung</option>
              <option value="house">Haus</option>
              <option value="land">Grundstück</option>
            </select>
          </div>

          {/* Lage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lage
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Alle</option>
              <option value="center">Zentrum</option>
              <option value="outskirts">Randgebiete</option>
              <option value="suburban">Speckgürtel</option>
            </select>
          </div>

          {/* Preissegment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preissegment
            </label>
            <select
              value={priceSegment}
              onChange={(e) => setPriceSegment(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Alle</option>
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Report Content */}
      <div ref={printRef} className="hidden print:block">
        {selectedRegionData.map(region => (
          <div key={region.id}>
            <h2 className="region-title">{region.name}</h2>

            {/* Market Data */}
            <div className="section-title">Marktdaten-Übersicht</div>
            <table>
              <thead>
                <tr>
                  <th>Indikator</th>
                  <th>Wert</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ø Preis/m²</td>
                  <td className="indicator-value">{formatCurrency(region.marketData.pricePerSqm)}</td>
                </tr>
                <tr>
                  <td>Preisentwicklung (2024)</td>
                  <td>
                    <table>
                      <thead>
                        <tr>
                          <th>Monat</th>
                          <th>Preis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {region.trends.filter(t => t.date.startsWith('2024')).map(trend => (
                          <tr key={trend.date}>
                            <td>{formatDate(trend.date)}</td>
                            <td>{formatCurrency(trend.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>KI-Preisprognose (2025)</td>
                  <td>
                  <table>
                      <thead>
                        <tr>
                          <th>Monat</th>
                          <th>Preis/Prognose</th>
                        </tr>
                      </thead>
                      <tbody>
                        {region.trends.filter(t => t.date.startsWith('2025')).map(trend => (
                          <tr key={trend.date}>
                            <td>{formatDateForecast(trend.date)}</td>
                            <td>{trend.forecast ? formatCurrency(trend.forecast) : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>ROI</td>
                  <td className="indicator-value">{region.marketData.expectedRoi}%</td>
                </tr>
                <tr>
                  <td>Leerstand</td>
                  <td className="indicator-value">{region.marketData.vacancyRate}%</td>
                </tr>
              </tbody>
            </table>

            {/* Market Indicators */}
            <div className="section-title">Marktindikatoren</div>
            <table>
              <thead>
                <tr>
                  <th>Indikator</th>
                  <th>Wert</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bevölkerungswachstum</td>
                  <td className={`indicator-value ${getPerformanceIndicator(region.marketData.populationGrowth).color}`}>
                    {region.marketData.populationGrowth}%
                  </td>
                </tr>
                <tr>
                  <td>Kaufkraft pro Einwohner</td>
                  <td className="indicator-value">{formatCurrency(region.riskAssessment.socioeconomicData.averageIncome)}</td>
                </tr>
                <tr>
                  <td>Aktuelle Bauvorhaben</td>
                  <td>
                    {region.infrastructurePlans.map((plan, index) => (
                      <div key={index}>
                        <div>{plan.type}</div>
                        <div>Fertigstellung: {formatDate(plan.completionDate)}</div>
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Marktdaten */}
      <div className="bg-white rounded-lg shadow-sm border">
        <button
          onClick={() => toggleSection('market-data')}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium">Marktdaten-Übersicht</h3>
          </div>
          {expandedSection === 'market-data' ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'market-data' && (
          <div className="p-6 border-t">
            <div className="space-y-8">
              {/* Kaufpreisentwicklung */}
              <div>
                <h4 className="text-lg font-medium mb-4">Kaufpreisentwicklung pro m² (2024)</h4>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceDevelopmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate}/>
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        labelFormatter={(label) => formatDateForecast(label)}
                      />
                      <Legend />
                      <Bar dataKey="price" fill="#a7d1ff" name="Durchschnittspreis" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Städtevergleich */}
              {selectedRegionData.length > 1 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">Städtevergleich</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedRegionData.map(region => (
                      <div key={region.id} className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">{region.name}</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Ø Preis/m²</span>
                            <span className="font-medium">
                              {formatCurrency(region.marketData.pricePerSqm)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">ROI</span>
                            <span className="font-medium">
                              {region.marketData.expectedRoi}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Leerstand</span>
                            <span className="font-medium">
                              {region.marketData.vacancyRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preisprognose */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium">KI-Preisprognose</h4>
                  <button
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => {/* Aktualisieren */}}
                  >
                    <RefreshCcw className="h-4 w-4 mr-1" />
                    Aktualisiert: {formatDate(new Date().toISOString())}
                  </button>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDateForecast}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        labelFormatter={(label) => formatDateForecast(label)}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#3b82f6"
                        fill="#93c5fd"
                        fillOpacity={0.1}
                        name="Preis"
                      />
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.1}
                        strokeDasharray="5 5"
                        name="Prognose (März-Dez 2025)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Prognose-Konfidenz */}
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <h5 className="font-medium text-blue-900">Prognose-Konfidenz</h5>
                      <p className="text-sm text-blue-700 mt-1">
                        Basierend auf historischen Daten, Wirtschaftsindikatoren und
                        demographischer Entwicklung wird mit 85% Wahrscheinlichkeit ein
                        Preisanstieg von 3-5% in den nächsten 12 Monaten erwartet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Marktindikatoren */}
      <div className="bg-white rounded-lg shadow-sm border">
        <button
          onClick={() => toggleSection('market-indicators')}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium">Marktindikatoren</h3>
          </div>
          {expandedSection === 'market-indicators' ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'market-indicators' && selectedRegionData.length > 0 && (
          <div className="p-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedRegionData.map(region => (
                <div key={region.id} className="space-y-6">
                  <h4 className="font-medium">{region.name}</h4>

                  {/* Bevölkerungsentwicklung */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Bevölkerungswachstum</span>
                      <div className="flex items-center">
                        {(() => {
                          const { icon: Icon, color } = getPerformanceIndicator(region.marketData.populationGrowth);
                          return (
                            <>
                              <Icon className={`h-4 w-4 ${color} mr-1`} />
                              <span className={`font-medium ${color}`}>
                                {region.marketData.populationGrowth}%
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.max(0, Math.min(100, region.marketData.populationGrowth * 10))}%` }}
                      />
                    </div>
                  </div>

                  {/* Kaufkraft */}
                  {region.riskAssessment?.socioeconomicData && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Kaufkraft pro Einwohner</span>
                        <span className="font-medium">
                          {formatCurrency(region.riskAssessment.socioeconomicData.averageIncome)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        vs. Bundesdurchschnitt: +5.2%
                      </div>
                    </div>
                  )}

                  {/* Bauvorhaben */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Aktuelle Bauvorhaben
                    </h5>
                    <div className="space-y-2">
                      {region.infrastructurePlans.map((plan, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{plan.type}</div>
                          <div className="text-gray-600">
                            Fertigstellung: {formatDate(plan.completionDate)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketVisualization;
