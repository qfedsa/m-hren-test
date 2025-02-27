import React from 'react';
import { Building2, Home, TrendingUp, MapPin, Plus } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onAddToPortfolio?: () => void;
  showAddButton?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onAddToPortfolio,
  showAddButton = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex">
        <div className="w-1/3">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {property.type === 'renovation' ? (
                <Home className="h-5 w-5 text-orange-500" />
              ) : (
                <Building2 className="h-5 w-5 text-blue-500" />
              )}
              <span className="ml-2 text-sm font-medium text-gray-500">
                {property.type === 'renovation'
                  ? 'Sanierungsobjekt'
                  : 'Leerstand'}
              </span>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="ml-1 font-semibold">{property.roi}% ROI</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
          <div className="mb-4">
            <div className="flex items-center text-gray-800">
              <MapPin className="h-4 w-4" />
              <span className="ml-1">
                {property.location}, {property.city}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {property.size} m² • {property.price.toLocaleString()}€
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
            {showAddButton && onAddToPortfolio && (
              <button 
                onClick={onAddToPortfolio}
                className="ml-4 flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Zum Portfolio</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
