import React from 'react';
import { Property } from '../types';

interface PropertyInfoWindowProps {
  property: Property;
  investmentScore: number;
  scoreColor: string;
  onAddToPortfolio: () => void;
}

const PropertyInfoWindow: React.FC<PropertyInfoWindowProps> = ({
  property,
  investmentScore,
  scoreColor,
  onAddToPortfolio
}) => {
  const formattedRoi = typeof property.roi === 'number' ? property.roi.toFixed(2) : 'N/A';
  const formattedPricePerSqm = typeof property.pricePerSqm === 'number'
    ? property.pricePerSqm.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'N/A';

  return `
    <div class="p-4 min-w-[300px]">
      <h3 class="text-lg font-semibold mb-2">${property.title}</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Investment Score:</span>
          <span class="font-medium" style="color: ${scoreColor}">${investmentScore.toFixed(1)}/10</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Kaufpreis pro m²:</span>
          <span class="font-medium">${formattedPricePerSqm}€/m²</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Renditepotenzial:</span>
          <span class="font-medium text-green-600">${formattedRoi}%</span>
        </div>
        <div class="mt-2 pt-2 border-t">
          <div class="text-sm font-medium">ROI</div>
          <div class="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              style="width: ${Number(formattedRoi) * 5}%; background-color: ${scoreColor}"
            ></div>
          </div>
          <div class="mt-1 text-xs text-right text-gray-500">
            ${formattedRoi}%
          </div>
        </div>
        <div class="mt-4 pt-2 border-t">
          <button
            id="add-to-portfolio-btn"
            class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Zum Portfolio hinzufügen
          </button>
        </div>
      </div>
    </div>
  `;
};

export default PropertyInfoWindow;
