import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Region, Property } from '../types';
import { properties as allProperties } from '../data';
import MapControls from './MapControls';
import Legend from './Legend';
import { calculateInvestmentScore, getScoreColor, filterProperties } from './MapUtils';

interface MapProps {
  width: string | number;
  height: string | number;
  regions: Region[];
  selectedRegion: string | null;
  onRegionSelect: (regionId: string) => void;
  onAddToPortfolio?: (property: Property) => void;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyBBcZasHgArIBe3pmSJ-9W0nnzSvok90to';

const GERMANY_BOUNDS = {
  north: 55.058347,
  south: 47.270111,
  west: 5.866342,
  east: 15.041896,
};

// Gewichtung der Faktoren für den Investment Score
const WEIGHTS = {
  price: 0.35,
  growth: 0.25,
  vacancy: 0.20,
  roi: 0.20
};

interface HeatmapSettings {
  showHeatmap: boolean;
  weights: typeof WEIGHTS;
  timeRange: '3m' | '6m' | '12m';
  layers: {
    price: boolean;
    growth: boolean;
    vacancy: boolean;
    roi: boolean;
  };
}

const Map: React.FC<MapProps> = ({
  width,
  height,
  regions,
  selectedRegion,
  onRegionSelect,
  onAddToPortfolio,
  mapRef
}) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [settings, setSettings] = useState<HeatmapSettings>({
    showHeatmap: true,
    weights: WEIGHTS,
    timeRange: '12m',
    layers: {
      price: true,
      growth: true,
      vacancy: true,
      roi: true
    }
  });
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());
  const [properties, setProperties] = useState<Property[]>([]); // State for filtered properties
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  const updateHeatmap = () => {
    if (!map || !heatmap) return;

    const heatmapData = regions.map((region) => {
      const score = calculateInvestmentScore(region, settings);
      return {
        location: new google.maps.LatLng(
          region.coordinates[1],
          region.coordinates[0]
        ),
        weight: score
      };
    });

    heatmap.setData(heatmapData);
  };

  const showInfoWindow = (
    marker: google.maps.Marker,
    region: Region,
    infoWindow: google.maps.InfoWindow,
    map: google.maps.Map,
    property: Property
  ) => {
    const score = calculateInvestmentScore(region, settings);
    const scoreColor = getScoreColor(score);

    const formattedRoi = typeof property.roi === 'number' ? property.roi.toFixed(2) : 'N/A';
    const formattedPricePerSqm = typeof property.pricePerSqm === 'number'
        ? property.pricePerSqm.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : 'N/A';

    const content = `
      <div class="p-4 min-w-[300px]">
        <h3 class="text-lg font-semibold mb-2">${property.title}</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Investment Score:</span>
            <span class="font-medium" style="color: ${scoreColor}">${score.toFixed(1)}/10</span>
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
        </div>
      </div>
    `;

    infoWindow.setContent(content);
    infoWindow.open(map, marker);
  };

  const handleRefresh = () => {
    setLastUpdate(new Date().toISOString());
    updateHeatmap();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map) return;
    const currentZoom = map.getZoom() || 6;
    map.setZoom(direction === 'in' ? currentZoom + 1 : currentZoom - 1);
  };

  useEffect(() => {
    if (!mapDivRef.current) return;

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['visualization'],
    });

    let mapInstance: google.maps.Map;
    let markerClusterer: MarkerClusterer;

    loader
      .load()
      .then(() => {
        mapInstance = new google.maps.Map(mapDivRef.current!, {
          center: { lat: 51.1657, lng: 10.4515 },
          zoom: 6,
          restriction: {
            latLngBounds: GERMANY_BOUNDS,
            strictBounds: true,
          },
          styles: [
            {
              featureType: 'administrative.country',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }],
            },
            {
              featureType: 'administrative.country',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.province',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.land_parcel',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }],
            },
            {
              featureType: 'road',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }],
            },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'cooperative',
          zoomControl: false, // Deaktiviere Standard-Zoom-Controls
        });

        setMap(mapInstance);
        mapRef.current = mapInstance; // Set map instance to the ref
        const infoWindowInstance = new google.maps.InfoWindow();
        setInfoWindow(infoWindowInstance);

        // Create markers
        const newMarkers = regions.map((region) => {
          const score = calculateInvestmentScore(region, settings);
          const marker = new google.maps.Marker({
            position: { lat: region.coordinates[1], lng: region.coordinates[0] },
            map: mapInstance,
            title: region.name,
            optimized: true,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: getScoreColor(score),
              fillOpacity: 0.7,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            },
          });

          marker.addListener('click', () => {
            onRegionSelect(region.id);
            // We don't add properties to portfolio directly from the map anymore
          });

          return marker;
        });

        markersRef.current = newMarkers;

        // Create MarkerClusterer
        markerClusterer = new MarkerClusterer({
          markers: newMarkers,
          map: mapInstance,
          gridSize: 50,
          maxZoom: 12,
          minimumClusterSize: 3,
          onClick: (cluster) => {
            const bounds = new google.maps.LatLngBounds();
            cluster.markers.forEach((marker) => {
              bounds.extend(marker.getPosition()!);
            });

            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            const latPadding =(ne.lat() - sw.lat()) * 0.2;
            const lngPadding = (ne.lng() - sw.lng()) * 0.2;
            bounds.extend(new google.maps.LatLng(ne.lat() + latPadding, ne.lng() + lngPadding));
            bounds.extend(new google.maps.LatLng(sw.lat() - latPadding, sw.lng() - lngPadding));

            mapInstance.fitBounds(bounds, {
              padding: 50,
              duration: 500,
            });

            return false;
          },
        });

        // Create heatmap layer
        const heatmapData = regions.map((region) => {
          const score = calculateInvestmentScore(region, settings);
          return {
            location: new google.maps.LatLng(
              region.coordinates[1],
              region.coordinates[0]
            ),
            weight: score
          };
        });

        const heatmapLayer = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: settings.showHeatmap ? mapInstance : null,
          radius: 30,
          maxIntensity: 10,
          gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)',
          ],
        });

        setHeatmap(heatmapLayer);

        // Add zoom change listener
        mapInstance.addListener('zoom_changed', () => {
          const zoom = mapInstance.getZoom();
          if (zoom) {
            heatmapLayer.setOptions({
              radius: Math.max(20, Math.min(50, zoom * 2))
            });
          }
        });
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
      });

    return () => {
      if (markerClusterer) {
        markerClusterer.clearMarkers();
      }
      if (markersRef.current) {
        markersRef.current.forEach((marker) => marker.setMap(null));
      }
      if (heatmap) {
        heatmap.setMap(null);
      }
    };
  }, []);

  useEffect(() => {
    if (heatmap && map) {
      heatmap.setMap(settings.showHeatmap ? map : null);
      updateHeatmap();
    }
  }, [settings, map, heatmap]);

  return (
    <div className="relative h-full" title="Hier sehen Sie die Karte mit den Regionen.">
      <MapControls
        showHeatmap={settings.showHeatmap}
        layers={settings.layers}
        onToggleHeatmap={() => setSettings(prev => ({ ...prev, showHeatmap: !prev.showHeatmap }))}
        onToggleLayer={(key: string) => setSettings(prev => ({
          ...prev,
          layers: {
            ...prev.layers,
            [key]: !prev.layers[key]
          }
        }))}
        onRefresh={handleRefresh}
        onZoom={handleZoom}
      />

      <Legend lastUpdate={lastUpdate} />

      <div
        ref={mapDivRef}
        style={{ width, height }}
        className="w-full h-full"
      />
    </div>
  );
};

export default Map;
