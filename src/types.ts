export type Region = {
  id: string;
  name: string;
  state: string;
  population: number;
  coordinates: [number, number];
  marketData: {
    vacancyRate: number;
    vacancyRateChange: number;
    renovationNeed: number;
    averagePrice: number;
    priceGrowth: number;
    investmentScore: number;
    lastUpdate: string;
    propertyCondition: number;
    renovationStatus: 'none' | 'minor' | 'major' | 'critical';
    expectedRoi: number;
    pricePerSqm: number;
    cityAveragePrice: number;
    supplyDemandRatio: number;
    populationGrowth: number;
    employmentRate: number;
    infrastructureScore: number;
  };
  trends: {
    date: string;
    price: number;
    forecast?: number;
  }[];
  quarterlyTrends: {
    quarter: string;
    price: number;
    transactions: number;
  }[];
  infrastructurePlans: {
    type: string;
    description: string;
    completionDate: string;
    impact: number;
  }[];
  riskAssessment: {
    socialIndex: number;
    crimeRate: number;
    economicStability: number;
    crimeStatistics: {
      year: number;
      total: number;
      categories: {
        propertyDamage: number;
        burglary: number;
        assault: number;
        other: number;
      };
    }[];
    socioeconomicData: {
      unemploymentRate: number;
      averageIncome: number;
      povertyRate: number;
    };
    localVacancy: {
      radius500m: number;
      trend: 'increasing' | 'stable' | 'decreasing';
    };
    developmentZone: {
      status: 'active' | 'planned' | 'none';
      projectCount: number;
      totalInvestment: number;
    };
  };
  renovationAnalysis?: {
    costs: {
      basic: number;
      energy: number;
      historical: number;
      total: number;
    };
    subsidies: {
      name: string;
      rate: number;
      maxAmount: number;
      requirements: string[];
    }[];
    roi: {
      baseline: number;
      withSubsidies: number;
      amortizationYears: number;
    };
  };
};

export type Property = {
  id: string;
  type: 'renovation' | 'vacant' | 'foreclosure';
  title: string;
  location: string;
  city: string;
  size: number;
  price: number;
  roi: number;
  population: number;
  vacancyRate: number;
  renovationNeed: number;
  imageUrl: string;
  description: string;
  vacancyDuration?: number;
  district?: string;
  lastRenovation?: number;
  riskProfile?: {
    socialHotspotLevel: 1 | 2 | 3;
    renovationUrgency: 'low' | 'medium' | 'high';
    defaultRisk: number;
    structuralIssues: string[];
    environmentalRisks: string[];
  };
  renovationDetails?: {
    estimatedCosts: {
      basic: number;
      energy: number;
      historical: number;
      total: number;
    };
    timeline: number;
    requiredPermits: string[];
    energyEfficiency: {
      current: string;
      potential: string;
      savingsPotential: number;
    };
  };
  monthlyRent?: number;
  operatingCosts?: {
    maintenance: number;
    management: number;
    insurance: number;
    tax: number;
    utilities: number;
  };
  postalCode: string;
  propertyType: 'residential' | 'commercial' | 'mixed';
  constructionYear?: number;
};

export type SearchFilters = {
  population: {
    min?: number;
    max?: number;
    max?: number;
  };
  price: {
    min?: number;
    max?: number;
  };
  propertyType: ('renovation' | 'vacant' | 'foreclosure')[];
  investmentScore: {
    min?: number;
  };
  vacancyDuration: {
    min?: number;
  };
  riskLevel?: 'low' | 'medium' | 'high';
  state?: string[];
  riskFilters?: {
    socialHotspot?: 1 | 2 | 3;
    renovationUrgency?: 'low' | 'medium' | 'high';
    maxDefaultRisk?: number;
    maxCrimeRate?: number;
    minSocialIndex?: number;
  };
};

export type FilterPreset = {
  id: string;
  name: string;
  filters: SearchFilters;
  lastUsed: Date;
};

export type PortfolioProperty = Property & {
  addedAt: Date;
  notes?: string;
  status: 'watchlist' | 'active' | 'archived';
};

export type PortfolioAnalysisData = {
  totalInvestment: number;
  averageRoi: number;
  monthlyIncome: number;
  operatingCosts: number;
  diversification: {
    geographic: {
      postalCode: string;
      count: number;
      percentage: number;
    }[];
    propertyTypes: {
      type: string;
      count: number;
      percentage: number;
    }[];
    priceSegments: {
      segment: string;
      count: number;
      percentage: number;
    }[];
  };
  riskAssessment: {
    vacancyRisk: 'low' | 'medium' | 'high';
    marketSaturation: number;
    priceOutlook: 'positive' | 'neutral' | 'negative';
  };
  synergies: {
    managementSavings: number;
    maintenanceEfficiency: number;
    rentingOptimization: number;
  };
};
