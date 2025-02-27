import { Region, Property } from '../types';

// Gewichtung der Faktoren für den Investment Score
export const WEIGHTS = {
  price: 0.35,
  growth: 0.25,
  vacancy: 0.20,
  roi: 0.20
};

export const calculateInvestmentScore = (region: Region, settings: any) => {
  const { marketData } = region;

  // Normalisierte Werte (0-1)
  const priceScore = 1 - (marketData.averagePrice / 10000); // Annahme: Max 10.000€/m²
  const growthScore = marketData.priceGrowth / 10; // Annahme: Max 10% Wachstum
  const vacancyScore = 1 - (marketData.vacancyRate / 10); // Annahme: Max 10% Leerstand
  const roiScore = marketData.expectedRoi / 20; // Annahme: Max 20% ROI

  // Gewichteter Score
  const score = (
    priceScore * settings.weights.price +
    growthScore * settings.weights.growth +
    vacancyScore * settings.weights.vacancy +
    roiScore * settings.weights.roi
  ) * 10; // Skalierung auf 0-10

  return score;
};

export const getScoreColor = (score: number): string => {
  if (score < 4) return '#ef4444'; // Rot
  if (score < 7) return '#eab308'; // Gelb
  return '#22c55e'; // Grün
};

export const filterProperties = (region: Region, allProperties: Property[]): Property => {
  const renovationProperties = allProperties.filter(
    (property) => property.city === region.name && property.type === 'renovation'
  );

  if (renovationProperties.length > 0) {
    const randomIndex = Math.floor(Math.random() * renovationProperties.length);
    return renovationProperties[randomIndex];
  }

  // Default property, but still try to make it relevant
  return {
    id: `default-${region.id}`,
    type: 'renovation', // Ensure default is also renovation type
    title: `${region.name}`,
    location: region.name,
    city: region.name,
    size: 100 + Math.floor(Math.random() * 200), // Random size between 100 and 300
    price: region.marketData.averagePrice * (80 + Math.floor(Math.random() * 40)), // Price based on average, +/- 20%
    roi: Math.max(0, region.marketData.expectedRoi + (Math.random() * 4 - 2)), // ROI around expected, +/- 2%
    population: region.population,
    vacancyRate: region.marketData.vacancyRate,
    renovationNeed: Math.floor(Math.random() * 5) + 3, // Renovation need between 3 and 7
    imageUrl: 'https://via.placeholder.com/150',
    description: `Ein Standard Sanierungsobjekt für ${region.name}`,
    riskProfile: {
      socialHotspotLevel: Math.floor(Math.random() * 3) + 1, // Random hotspot level
      renovationUrgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      defaultRisk: Math.floor(Math.random() * 5) + 1,
      structuralIssues: [],
      environmentalRisks: []
    },
    renovationDetails: {
      estimatedCosts: {
        basic: Math.floor(Math.random() * 100000) + 20000,
        energy: Math.floor(Math.random() * 50000) + 10000,
        historical: Math.floor(Math.random() * 80000),
        total: Math.floor(Math.random() * 200000) + 50000
      },
      timeline: Math.floor(Math.random() * 12) + 3, // Timeline between 3 and 14 months
      requiredPermits: [],
      energyEfficiency: {
        current: ['E', 'F', 'G', 'H'][Math.floor(Math.random() * 4)],
        potential: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        savingsPotential: Math.floor(Math.random() * 50) + 20 // Savings between 20% and 70%
      }
    },
    monthlyRent: region.marketData.averagePrice * (0.4 + Math.random() * 0.2), // Rent around 40-60% of price/sqm
    operatingCosts: {
      maintenance: Math.floor(Math.random() * 200) + 50,
      management: Math.floor(Math.random() * 150) + 50,
      insurance: Math.floor(Math.random() * 100) + 20,
      tax: Math.floor(Math.random() * 150) + 50,
      utilities: Math.floor(Math.random() * 300) + 100
    },
    postalCode: '12345', // Placeholder
    propertyType: 'residential',
    constructionYear: 2000 - Math.floor(Math.random() * 50), // Construction year between 1950 and 2000
    pricePerSqm: region.marketData.averagePrice
  };
};
