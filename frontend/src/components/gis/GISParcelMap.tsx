import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GISParcel } from '../../types';
import { MapPin, Layers, Building, Eye, Compass } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface GISParcelMapProps {
  parcels: GISParcel[];
  selectedParcel?: GISParcel | null;
  onParcelSelect?: (parcel: GISParcel) => void;
  center?: [number, number];
  zoom?: number;
}

// Helper to center map smoothly
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const GISParcelMap: React.FC<GISParcelMapProps> = ({
  parcels,
  selectedParcel,
  onParcelSelect,
  center = [13.0338, 80.2676], // Default Chennai center
  zoom = 15
}) => {
  const { t } = useTranslation();
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [activeParcel, setActiveParcel] = useState<GISParcel | null>(null);

  useEffect(() => {
    if (selectedParcel) {
      setActiveParcel(selectedParcel);
    }
  }, [selectedParcel]);

  const tileLayers = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'Residential': return '#3B82F6'; // Blue
      case 'Commercial': return '#F59E0B'; // Amber
      case 'Agricultural': return '#10B981'; // Green
      case 'Industrial': return '#8B5CF6'; // Purple
      default: return '#6B7280';
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-md border border-slate-300">
      
      {/* Map Header Overlay Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-slate-200 flex items-center space-x-2 text-xs">
        <button
          onClick={() => setMapType('streets')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            mapType === 'streets' ? 'bg-gov-navy text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {t.gisCadastralViewer}
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            mapType === 'satellite' ? 'bg-gov-navy text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {t.mapLayers}
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 text-xs">
        <h5 className="font-bold text-gov-navy mb-1.5 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> {t.mapLayers}
        </h5>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
            <span>Residential Plot</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
            <span>Commercial Zone</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>Agricultural Parcel</span>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeView 
          center={activeParcel ? [activeParcel.latitude, activeParcel.longitude] : center} 
          zoom={activeParcel ? 17 : zoom} 
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Government GIS Cadastre'
          url={tileLayers[mapType]}
        />

        {parcels.map((parcel) => {
          // Convert GeoJSON polygon [lon, lat] coordinates to Leaflet [lat, lon]
          const coords = parcel.boundary_polygon_geojson.coordinates[0].map(
            ([lon, lat]) => [lat, lon] as [number, number]
          );

          const isSelected = activeParcel?.id === parcel.id;
          const color = getZoneColor(parcel.zone_type);

          return (
            <Polygon
              key={parcel.id}
              positions={coords}
              pathOptions={{
                color: isSelected ? '#DC2626' : color,
                fillColor: color,
                fillOpacity: isSelected ? 0.6 : 0.35,
                weight: isSelected ? 3 : 2
              }}
              eventHandlers={{
                click: () => {
                  setActiveParcel(parcel);
                  if (onParcelSelect) onParcelSelect(parcel);
                }
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <div className="font-bold text-gov-navy flex items-center gap-1 border-b pb-1">
                    <Building className="w-3.5 h-3.5 text-gov-gold" />
                    <span>{t.surveyNumber}: {parcel.survey_number}</span>
                  </div>
                  <p><strong>{t.pattaNumber}:</strong> {parcel.patta_number || 'N/A'}</p>
                  <p><strong>{t.selectVillage}:</strong> {parcel.village}, {parcel.district}</p>
                  <p><strong>{t.extentArea}:</strong> {parcel.area_sqft} Sq.Ft</p>
                  <p><strong>{t.landClassification}:</strong> <span className="font-semibold text-blue-700">{parcel.zone_type}</span></p>
                  <div className="pt-1 text-[10px] text-slate-500 font-mono">
                    Lat: {parcel.latitude.toFixed(5)}, Lon: {parcel.longitude.toFixed(5)}
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>

    </div>
  );
};
