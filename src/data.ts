import { Region, Property } from './types';

export const regions: Region[] = [
  {
    id: 'berlin',
    name: 'Berlin',
    state: 'Berlin',
    population: 3669495,
    coordinates: [13.404954, 52.520008],
    marketData: {
      vacancyRate: 1.8,
      vacancyRateChange: -0.3,
      renovationNeed: 7.5,
      averagePrice: 4500,
      priceGrowth: 8.2,
      investmentScore: 8.5,
      lastUpdate: '2024-03-15',
      propertyCondition: 7.2,
      renovationStatus: 'minor',
      expectedRoi: 12.5,
      pricePerSqm: 4500,
      cityAveragePrice: 4200,
      supplyDemandRatio: 0.85,
      populationGrowth: 1.2,
      employmentRate: 94.5,
      infrastructureScore: 8.5
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 4200 + Math.random() * 600,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 4800 + Math.random() * 800
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 4100, transactions: 2500 },
      { quarter: '2023Q2', price: 4200, transactions: 2700 },
      { quarter: '2023Q3', price: 4350, transactions: 2400 },
      { quarter: '2023Q4', price: 4500, transactions: 2600 }
    ],
    infrastructurePlans: [
      {
        type: 'U-Bahn Erweiterung',
        description: 'Verlängerung der U5 zum Hauptbahnhof',
        completionDate: '2025-12-31',
        impact: 9
      },
      // Removed the Schulneubau entry
    ],
    riskAssessment: {
      socialIndex: 7.5,
      crimeRate: 12500,
      economicStability: 8.2,
      crimeStatistics: [
        {
          year: 2021,
          total: 12800,
          categories: {
            propertyDamage: 4200,
            burglary: 2800,
            assault: 3100,
            other: 2700
          }
        },
        {
          year: 2022,
          total: 12500,
          categories: {
            propertyDamage: 4100,
            burglary: 2600,
            assault: 3000,
            other: 2800
          }
        },
        {
          year: 2023,
          total: 12200,
          categories: {
            propertyDamage: 4000,
            burglary: 2500,
            assault: 2900,
            other: 2800
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 8.2,
        averageIncome: 42000,
        povertyRate: 16.8
      },
      localVacancy: {
        radius500m: 2.4,
        trend: 'decreasing'
      }
    }
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    state: 'Hamburg',
    population: 1841179,
    coordinates: [10.000654, 53.550341],
    marketData: {
      vacancyRate: 2.1,
      vacancyRateChange: -0.2,
      renovationNeed: 6.8,
      averagePrice: 4800,
      priceGrowth: 7.5,
      investmentScore: 7.8,
      lastUpdate: '2024-03-15',
      propertyCondition: 7.8,
      renovationStatus: 'minor',
      expectedRoi: 11.2,
      pricePerSqm: 4800,
      cityAveragePrice: 4500,
      supplyDemandRatio: 0.92,
      populationGrowth: 0.9,
      employmentRate: 93.8,
      infrastructureScore: 8.2
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 4500 + Math.random() * 600,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 5100 + Math.random() * 700
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 4300, transactions: 1800 },
      { quarter: '2023Q2', price: 4500, transactions: 1900 },
      { quarter: '2023Q3', price: 4650, transactions: 1750 },
      { quarter: '2023Q4', price: 4800, transactions: 1850 }
    ],
    infrastructurePlans: [
      {
        type: 'Hafencity Ausbau',
        description: 'Erschließung neuer Wohngebiete',
        completionDate: '2026-06-30',
        impact: 8
      }
    ],
    riskAssessment: {
      socialIndex: 7.8,
      crimeRate: 11200,
      economicStability: 8.5,
      crimeStatistics: [
        {
          year: 2021,
          total: 11500,
          categories: {
            propertyDamage: 3800,
            burglary: 2500,
            assault: 2800,
            other: 2400
          }
        },
        {
          year: 2022,
          total: 11200,
          categories: {
            propertyDamage: 3700,
            burglary: 2400,
            assault: 2700,
            other: 2400
          }
        },
        {
          year: 2023,
          total: 11000,
          categories: {
            propertyDamage: 3600,
            burglary: 2300,
            assault: 2600,
            other: 2500
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 7.5,
        averageIncome: 45000,
        povertyRate: 15.2
      },
      localVacancy: {
        radius500m: 2.8,
        trend: 'stable'
      }
    }
  },
  {
    id: 'munich',
    name: 'München',
    state: 'Bayern',
    population: 1471508,
    coordinates: [11.581981, 48.135125],
    marketData: {
      vacancyRate: 1.2,
      vacancyRateChange: -0.4,
      renovationNeed: 5.5,
      averagePrice: 8500,
      priceGrowth: 9.8,
      investmentScore: 9.2,
      lastUpdate: '2024-03-15',
      propertyCondition: 8.5,
      renovationStatus: 'none',
      expectedRoi: 10.8,
      pricePerSqm: 8500,
      cityAveragePrice: 8200,
      supplyDemandRatio: 0.95,
      populationGrowth: 1.5,
      employmentRate: 96.2,
      infrastructureScore: 9.0
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 8000 + Math.random() * 1000,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 8800 + Math.random() * 1200
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 8000, transactions: 1500 },
      { quarter: '2023Q2', price: 8200, transactions: 1600 },
      { quarter: '2023Q3', price: 8400, transactions: 1450 },
      { quarter: '2023Q4', price: 8500, transactions: 1550 }
    ],
    infrastructurePlans: [
      {
        type: 'S-Bahn Ring',
        description: 'Ausbau des S-Bahn Rings',
        completionDate: '2026-12-31',
        impact: 9
      }
    ],
    riskAssessment: {
      socialIndex: 8.5,
      crimeRate: 9800,
      economicStability: 9.0,
      crimeStatistics: [
        {
          year: 2021,
          total: 10200,
          categories: {
            propertyDamage: 3200,
            burglary: 2100,
            assault: 2600,
            other: 2300
          }
        },
        {
          year: 2022,
          total: 9800,
          categories: {
            propertyDamage: 3000,
            burglary: 2000,
            assault: 2500,
            other: 2300
          }
        },
        {
          year: 2023,
          total: 9500,
          categories: {
            propertyDamage: 2900,
            burglary: 1900,
            assault: 2400,
            other: 2300
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 4.8,
        averageIncome: 52000,
        povertyRate: 12.5
      },
      localVacancy: {
        radius500m: 1.8,
        trend: 'decreasing'
      }
    }
  },
  {
    id: 'cologne',
    name: 'Köln',
    state: 'Nordrhein-Westfalen',
    population: 1085664,
    coordinates: [6.960279, 50.937531],
    marketData: {
      vacancyRate: 2.4,
      vacancyRateChange: -0.1,
      renovationNeed: 6.2,
      averagePrice: 4200,
      priceGrowth: 6.8,
      investmentScore: 7.5,
      lastUpdate: '2024-03-15',
      propertyCondition: 7.0,
      renovationStatus: 'minor',
      expectedRoi: 9.8,
      pricePerSqm: 4200,
      cityAveragePrice: 4000,
      supplyDemandRatio: 0.88,
      populationGrowth: 0.8,
      employmentRate: 92.5,
      infrastructureScore: 7.8
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 4000 + Math.random() * 400,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 4400 + Math.random() * 500
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 3900, transactions: 1200 },
      { quarter: '2023Q2', price: 4000, transactions: 1300 },
      { quarter: '2023Q3', price: 4100, transactions: 1250 },
      { quarter: '2023Q4', price: 4200, transactions: 1280 }
    ],
    infrastructurePlans: [
      {
        type: 'Stadtbahn-Ausbau',
        description: 'Erweiterung des Stadtbahnnetzes',
        completionDate: '2025-09-30',
        impact: 8
      }
    ],
    riskAssessment: {
      socialIndex: 7.2,
      crimeRate: 10800,
      economicStability: 7.8,
      crimeStatistics: [
        {
          year: 2021,
          total: 11000,
          categories: {
            propertyDamage: 3600,
            burglary: 2400,
            assault: 2700,
            other: 2300
          }
        },
        {
          year: 2022,
          total: 10800,
          categories: {
            propertyDamage: 3500,
            burglary: 2300,
            assault: 2600,            other: 2400
          }
        },
        {
          year: 2023,
          total: 10500,
          categories: {
            propertyDamage: 3400,
            burglary: 2200,
            assault: 2500,
            other: 2400
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 6.8,
        averageIncome: 43000,
        povertyRate: 15.5
      },
      localVacancy: {
        radius500m: 2.6,
        trend: 'stable'
      }
    }
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    state: 'Hessen',
    population: 753056,
    coordinates: [8.682127, 50.110924],
    marketData: {
      vacancyRate: 1.8,
      vacancyRateChange: -0.3,
      renovationNeed: 5.8,
      averagePrice: 6800,
      priceGrowth: 8.5,
      investmentScore: 8.8,
      lastUpdate: '2024-03-15',
      propertyCondition: 8.2,
      renovationStatus: 'minor',
      expectedRoi: 11.5,
      pricePerSqm: 6800,
      cityAveragePrice: 6500,
      supplyDemandRatio: 0.90,
      populationGrowth: 1.1,
      employmentRate: 95.2,
      infrastructureScore: 8.8
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 6500 + Math.random() * 600,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 7100 + Math.random() * 800
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 6300, transactions: 900 },
      { quarter: '2023Q2', price: 6500, transactions: 950 },
      { quarter: '2023Q3', price: 6650, transactions: 920 },
      { quarter: '2023Q4', price: 6800, transactions: 980 }
    ],
    infrastructurePlans: [
      {
        type: 'Europaviertel',
        description: 'Entwicklung neuer Geschäftsflächen',
        completionDate: '2026-03-31',
        impact: 9
      }
    ],
    riskAssessment: {
      socialIndex: 8.2,
      crimeRate: 10200,
      economicStability: 8.8,
      crimeStatistics: [
        {
          year: 2021,
          total: 10500,
          categories: {
            propertyDamage: 3400,
            burglary: 2200,
            assault: 2600,
            other: 2300
          }
        },
        {
          year: 2022,
          total: 10200,
          categories: {
            propertyDamage: 3300,
            burglary: 2100,
            assault: 2500,
            other: 2300
          }
        },
        {
          year: 2023,
          total: 9900,
          categories: {
            propertyDamage: 3200,
            burglary: 2000,
            assault: 2400,
            other: 2300
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 5.2,
        averageIncome: 48000,
        povertyRate: 13.8
      },
      localVacancy: {
        radius500m: 2.0,
        trend: 'decreasing'
      }
    }
  },
  {
    id: 'stuttgart',
    name: 'Stuttgart',
    state: 'Baden-Württemberg',
    population: 634830,
    coordinates: [9.181332, 48.775846],
    marketData: {
      vacancyRate: 1.5,
      vacancyRateChange: -0.2,
      renovationNeed: 5.5,
      averagePrice: 5800,
      priceGrowth: 7.8,
      investmentScore: 8.2,
      lastUpdate: '2024-03-15',
      propertyCondition: 8.0,
      renovationStatus: 'minor',
      expectedRoi: 10.2,
      pricePerSqm: 5800,
      cityAveragePrice: 5500,
      supplyDemandRatio: 0.92,
      populationGrowth: 0.9,
      employmentRate: 94.8,
      infrastructureScore: 8.5
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 5500 + Math.random() * 600,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 6100 + Math.random() * 700
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 5400, transactions: 800 },
      { quarter: '2023Q2', price: 5500, transactions: 850 },
      { quarter: '2023Q3', price: 5650, transactions: 820 },
      { quarter: '2023Q4', price: 5800, transactions: 880 }
    ],
    infrastructurePlans: [
      {
        type: 'Stuttgart 21',
        description: 'Bahnhofsumbau und Stadtentwicklung',
        completionDate: '2025-12-31',
        impact: 9
      }
    ],
    riskAssessment: {
      socialIndex: 8.0,
      crimeRate: 9500,
      economicStability: 8.5,
      crimeStatistics: [
        {
          year: 2021,
          total: 9800,
          categories: {
            propertyDamage: 3200,
            burglary: 2000,
            assault: 2400,
            other: 2200
          }
        },
        {
          year: 2022,
          total: 9500,
          categories: {
            propertyDamage: 3100,
            burglary: 1900,
            assault: 2300,
            other: 2200
          }
        },
        {
          year: 2023,
          total: 9200,
          categories: {
            propertyDamage: 3000,
            burglary: 1800,
            assault: 2200,
            other: 2200
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 4.5,
        averageIncome: 46000,
        povertyRate: 12.8
      },
      localVacancy: {
        radius500m: 1.8,
        trend: 'stable'
      }
    }
  },
  {
    id: 'leipzig',
    name: 'Leipzig',
    state: 'Sachsen',
    population: 587857,
    coordinates: [12.387772, 51.343479],
    marketData: {
      vacancyRate: 3.2,
      vacancyRateChange: -0.5,
      renovationNeed: 7.2,
      averagePrice: 3200,
      priceGrowth: 9.2,
      investmentScore: 8.5,
      lastUpdate: '2024-03-15',
      propertyCondition: 6.8,
      renovationStatus: 'major',
      expectedRoi: 13.5,
      pricePerSqm: 3200,
      cityAveragePrice: 3000,
      supplyDemandRatio: 0.85,
      populationGrowth: 1.8,
      employmentRate: 91.5,
      infrastructureScore: 7.8
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 3000 + Math.random() * 400,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 3400 + Math.random() * 500
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 2900, transactions: 700 },
      { quarter: '2023Q2', price: 3000, transactions: 750 },
      { quarter: '2023Q3', price: 3100, transactions: 720 },
      { quarter: '2023Q4', price: 3200, transactions: 780 }
    ],
    infrastructurePlans: [
      {
        type: 'Kulturquartier',
        description: 'Entwicklung des Kreativviertels',
        completionDate: '2025-06-30',
        impact: 8
      }
    ],
    riskAssessment: {
      socialIndex: 7.0,
      crimeRate: 10500,
      economicStability: 7.5,
      crimeStatistics: [
        {
          year: 2021,
          total: 10800,
          categories: {
            propertyDamage: 3500,
            burglary: 2300,
            assault: 2600,
            other: 2400
          }
        },
        {
          year: 2022,
          total: 10500,
          categories: {
            propertyDamage: 3400,
            burglary: 2200,
            assault: 2500,
            other: 2400
          }
        },
        {
          year: 2023,
          total: 10200,
          categories: {
            propertyDamage: 3300,
            burglary: 2100,
            assault: 2400,
            other: 2400
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 7.2,
        averageIncome: 38000,
        povertyRate: 17.5
      },
      localVacancy: {
        radius500m: 3.5,
        trend: 'decreasing'
      }
    }
  },
  {
    id: 'dusseldorf',
    name: 'Düsseldorf',
    state: 'Nordrhein-Westfalen',
    population: 619294,
    coordinates: [6.773456, 51.227741],
    marketData: {
      vacancyRate: 2.0,
      vacancyRateChange: -0.2,
      renovationNeed: 6.0,
      averagePrice: 5200,
      priceGrowth: 7.2,
      investmentScore: 8.0,
      lastUpdate: '2024-03-15',
      propertyCondition: 7.8,
      renovationStatus: 'minor',
      expectedRoi: 10.5,
      pricePerSqm: 5200,
      cityAveragePrice: 5000,
      supplyDemandRatio: 0.89,
      populationGrowth: 0.8,
      employmentRate: 93.8,
      infrastructureScore: 8.2
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 5000 + Math.random() * 400,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 5400 + Math.random() * 500
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 4900, transactions: 750 },
      { quarter: '2023Q2', price: 5000, transactions: 800 },
      { quarter: '2023Q3', price: 5100, transactions: 780 },
      { quarter: '2023Q4', price: 5200, transactions: 820 }
    ],
    infrastructurePlans: [
      {
        type: 'Medienhafen',
        description: 'Erweiterung des Medienhafens',
        completionDate: '2025-09-30',
        impact: 8
      }
    ],
    riskAssessment: {
      socialIndex: 7.8,
      crimeRate: 10000,
      economicStability: 8.2,
      crimeStatistics: [
        {
          year: 2021,
          total: 10300,
          categories: {
            propertyDamage: 3300,
            burglary: 2100,
            assault: 2500,
            other: 2400
          }
        },
        {
          year: 2022,
          total: 10000,
          categories: {
            propertyDamage: 3200,
            burglary: 2000,
            assault: 2400,
            other: 2400
          }
        },
        {
          year: 2023,
          total: 9700,
          categories: {
            propertyDamage: 3100,
            burglary: 1900,
            assault: 2300,
                        other: 2400
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 5.8,
        averageIncome: 45000,
        povertyRate: 14.2
      },
      localVacancy: {
        radius500m: 2.2,
        trend: 'stable'
      }
    }
  },
  {
    id: 'dortmund',
    name: 'Dortmund',
    state: 'Nordrhein-Westfalen',
    population: 588250,
    coordinates: [7.465298, 51.513587],
    marketData: {
      vacancyRate: 3.5,
      vacancyRateChange: -0.3,
      renovationNeed: 7.0,
      averagePrice: 2800,
      priceGrowth: 6.5,
      investmentScore: 7.2,
      lastUpdate: '2024-03-15',
      propertyCondition: 6.5,
      renovationStatus: 'major',
      expectedRoi: 12.2,
      pricePerSqm: 2800,
      cityAveragePrice: 2600,
      supplyDemandRatio: 0.82,
      populationGrowth: 0.5,
      employmentRate: 90.5,
      infrastructureScore: 7.5
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 2600 + Math.random() * 400,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 3000 + Math.random() * 500
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 2500, transactions: 600 },
      { quarter: '2023Q2', price: 2600, transactions: 650 },
      { quarter: '2023Q3', price: 2700, transactions: 620 },
      { quarter: '2023Q4', price: 2800, transactions: 680 }
    ],
    infrastructurePlans: [
      {
        type: 'Smart City',
        description: 'Digitalisierung der Infrastruktur',
        completionDate: '2025-12-31',
        impact: 7
      }
    ],
    riskAssessment: {
      socialIndex: 6.8,
      crimeRate: 11000,
      economicStability: 7.0,
      crimeStatistics: [
        {
          year: 2021,
          total: 11300,
          categories: {
            propertyDamage: 3700,
            burglary: 2500,
            assault: 2700,
            other: 2400
          }
        },
        {
          year: 2022,
          total: 11000,
          categories: {
            propertyDamage: 3600,
            burglary: 2400,
            assault: 2600,
            other: 2400
          }
        },
        {
          year: 2023,
          total: 10700,
          categories: {
            propertyDamage: 3500,
            burglary: 2300,
            assault: 2500,
            other: 2400
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 8.5,
        averageIncome: 36000,
        povertyRate: 18.5
      },
      localVacancy: {
        radius500m: 3.8,
        trend: 'decreasing'
      }
    }
  },
  {
    id: 'essen',
    name: 'Essen',
    state: 'Nordrhein-Westfalen',
    population: 582760,
    coordinates: [7.011555, 51.455643],
    marketData: {
      vacancyRate: 3.8,
      vacancyRateChange: -0.2,
      renovationNeed: 7.2,
      averagePrice: 2600,
      priceGrowth: 5.8,
      investmentScore: 7.0,
      lastUpdate: '2024-03-15',
      propertyCondition: 6.2,
      renovationStatus: 'major',
      expectedRoi: 11.8,
      pricePerSqm: 2600,
      cityAveragePrice: 2400,
      supplyDemandRatio: 0.80,
      populationGrowth: 0.3,
      employmentRate: 89.8,
      infrastructureScore: 7.2
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${(i + 1).toString().padStart(2, '0')}`,
        price: 2400 + Math.random() * 400,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2025-${(i + 3).toString().padStart(2, '0')}`, // Start from March 2025
        forecast: 2800 + Math.random() * 500
      }))
    ],
    quarterlyTrends: [
      { quarter: '2023Q1', price: 2300, transactions: 550 },
      { quarter: '2023Q2', price: 2400, transactions: 600 },
      { quarter: '2023Q3', price: 2500, transactions: 580 },
      { quarter: '2023Q4', price: 2600, transactions: 620 }
    ],
    infrastructurePlans: [
      {
        type: 'Grüne Stadt',
        description: 'Nachhaltige Stadtentwicklung',
        completionDate: '2025-12-31',
        impact: 7
      }
    ],
    riskAssessment: {
      socialIndex: 6.5,
      crimeRate: 11200,
      economicStability: 6.8,
      crimeStatistics: [
        {
          year: 2021,
          total: 11500,
          categories: {
            propertyDamage: 3800,
            burglary: 2600,
            assault: 2700,
            other: 2400
          }
        },
        {
          year: 2022,
          total: 11200,
          categories: {
            propertyDamage: 3700,
            burglary: 2500,
            assault: 2600,
            other: 2400
          }
        },
        {
          year: 2023,
          total: 10900,
          categories: {
            propertyDamage: 3600,
            burglary: 2400,
            assault: 2500,
            other: 2400
          }
        }
      ],
      socioeconomicData: {
        unemploymentRate: 9.2,
        averageIncome: 35000,
        povertyRate: 19.2
      },
      localVacancy: {
        radius500m: 4.2,
        trend: 'stable'
      }
    }
  }
];

export const properties: Property[] = [
  {
    id: '1',
    type: 'renovation',
    title: 'Historisches Stadthaus',
    location: 'Prenzlauer Berg',
    city: 'Berlin',
    size: 450,
    price: 1200000,
    roi: 12.5,
    population: 3700000,
    vacancyRate: 2,
    renovationNeed: 8,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    description: 'Denkmalgeschütztes Gebäude mit großem Potenzial in beliebter Lage',
    riskProfile: {
      socialHotspotLevel: 1,
      renovationUrgency: 'high',
      defaultRisk: 5.2,
      structuralIssues: ['Dachsanierung erforderlich', 'Historische Substanz'],
      environmentalRisks: ['Keine bekannten Risiken']
    },
    renovationDetails: {
      estimatedCosts: {
        basic: 380000,
        energy: 180000,
        historical: 240000,
        total: 800000
      },
      timeline: 18,
      requiredPermits: [
        'Denkmalschutz',
        'Bauantrag',
        'Energetische Sanierung'
      ],
      energyEfficiency: {
        current: 'H',
        potential: 'C',
        savingsPotential: 65
      }
    },
    monthlyRent: 8500,
    operatingCosts: {
      maintenance: 1200,
      management: 800,
      insurance: 400,
      tax: 600,
      utilities: 1500
    },
    postalCode: '10405',
    propertyType: 'residential',
    constructionYear: 1900
  },
  {
    id: '2',
    type: 'vacant',
    title: 'Modernes Bürogebäude',
    location: 'HafenCity',
    city: 'Hamburg',
    size: 800,
    price: 2800000,
    roi: 15.2,
    population: 1800000,
    vacancyRate: 7,
    renovationNeed: 4,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    description: 'Flexibel nutzbares Bürogebäude in Hamburgs innovativstem Stadtteil',
    riskProfile: {
      socialHotspotLevel: 1,
      renovationUrgency: 'low',
      defaultRisk: 3.5,
      structuralIssues: ['Keine bekannten Probleme'],
      environmentalRisks: ['Hochwasserschutz beachten']
    },
    renovationDetails: {
      estimatedCosts: {
        basic: 120000,
        energy: 80000,
        historical: 0,
        total: 200000
      },
      timeline: 6,
      requiredPermits: [
        'Nutzungsänderung',
        'Brandschutz'
      ],
      energyEfficiency: {
        current: 'C',
        potential: 'A',
        savingsPotential: 25
      }
    },
    monthlyRent: 18000,
    operatingCosts: {
      maintenance: 2200,
      management: 1500,
      insurance: 800,
      tax: 1200,
      utilities: 3500
    },
    postalCode: '20457',
    propertyType: 'commercial',
    constructionYear: 2015
  },
  {
    id: '3',
    type: 'renovation',
    title: 'Altbauwohnung mit Potenzial',
    location: 'Schwabing',
    city: 'München',
    size: 120,
    price: 980000,
    roi: 9.8,
    population: 1500000,
    vacancyRate: 1.5,
    renovationNeed: 7,
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    description: 'Charmante Altbauwohnung mit hohen Decken und Stuck',
    riskProfile: {
      socialHotspotLevel: 1,
      renovationUrgency: 'medium',
      defaultRisk: 4.2,
      structuralIssues: ['Elektrik veraltet', 'Fenster undicht'],
      environmentalRisks: ['Keine bekannten Risiken']
    },
    renovationDetails: {
      estimatedCosts: {
        basic: 85000,
        energy: 45000,
        historical: 35000,
        total: 165000
      },
      timeline: 8,
      requiredPermits: [
        'Bauantrag',
        'Energetische Sanierung'
      ],
      energyEfficiency: {
        current: 'F',
        potential: 'B',
        savingsPotential: 55
      }
    },
    monthlyRent: 2800,
    operatingCosts: {
      maintenance: 450,
      management: 300,
      insurance: 150,
      tax: 200,
      utilities: 600
    },
    postalCode: '80802',
    propertyType: 'residential',
    constructionYear: 1910
  }
];
