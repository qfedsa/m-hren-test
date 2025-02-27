import React from 'react';

interface PropertyInfoProps {
  title: string;
  investmentScore: number;
  pricePerSqm: number;
  roi: number;
  scoreColor: string;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({
  title,
  investmentScore,
  pricePerSqm,
  roi,
  scoreColor,
}) => {
  const formattedRoi = typeof roi === 'number' ? roi.toFixed(2) : 'N/A';
  const formattedPricePerSqm = typeof pricePerSqm === 'number'
    ? pricePerSqm.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'N/A';

  return (
    <div className="p-4 min-w-[300px]">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Investment Score:</span>
          <span className="font-medium" style={{ color: scoreColor }}>{investmentScore.toFixed(1)}/10</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Kaufpreis pro m²:</span>
          <span className="font-medium">{formattedPricePerSqm}€/m²</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Renditepotenzial:</span>
          <span className="font-medium text-green-600">{formattedRoi}%</span>
        </div>
        <div className="mt-2 pt-2 border-t">
          <div className="text-sm font-medium">ROI</div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${Number(formattedRoi) * 5}%; background-color: {scoreColor}` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-right text-gray-500">
            {formattedRoi}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
