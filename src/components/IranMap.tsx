import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { City } from '../types';
import { toPersianDigits } from '../utils/distance';

interface IranMapProps {
  cities?: City[];
  originCity?: City | null;
  destinationCity?: City | null;
  routeCoordinates?: [number, number][];
  isApproximateRoute?: boolean;
  stops?: City[]; // For multi-stop
  onSelectOrigin?: (city: City) => void;
  onSelectDestination?: (city: City) => void;
  className?: string;
  zoomControl?: boolean;
  height?: string;
  interactive?: boolean;
}

export const IranMap: React.FC<IranMapProps> = ({
  cities = [],
  originCity,
  destinationCity,
  routeCoordinates,
  isApproximateRoute = false,
  stops,
  onSelectOrigin,
  onSelectDestination,
  className = '',
  zoomControl = true,
  height = '480px',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Iran geographical bounds
  const iranBounds = L.latLngBounds(
    [24.0, 43.5], // South-West (Persian Gulf/Oman)
    [40.2, 64.0]  // North-East (Caspian/Khorasan)
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [32.4279, 53.6880], // Center of Iran
        zoom: 5.5,
        minZoom: 4.8,
        maxZoom: 18,
        maxBounds: iranBounds,
        maxBoundsViscosity: 0.9,
        zoomControl: zoomControl,
        attributionControl: true,
        dragging: interactive,
        scrollWheelZoom: interactive ? 'center' : false,
        touchZoom: interactive,
        doubleClickZoom: interactive,
      });

      // Primary OpenStreetMap tile layer
      const osmTileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      const osmHotTileUrl = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

      const osmLayer = L.tileLayer(osmTileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
        maxZoom: 19,
        minZoom: 4,
      });

      let hasFallenBack = false;
      osmLayer.on('tileerror', () => {
        if (!hasFallenBack && mapRef.current) {
          hasFallenBack = true;
          mapRef.current.removeLayer(osmLayer);
          const hotLayer = L.tileLayer(osmHotTileUrl, {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
            subdomains: 'abc',
            maxZoom: 19,
            minZoom: 4,
          });
          hotLayer.addTo(mapRef.current);
        }
      });

      osmLayer.addTo(map);

      // Group for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers and Route Polyline
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Helper to create custom divIcon
    const createPinIcon = (
      type: 'origin' | 'destination' | 'stop' | 'default',
      numberLabel?: number | string
    ) => {
      let bgClass = 'bg-[#1FA3A3] text-white shadow-md';
      let ringClass = 'ring-2 ring-white';
      let sizeClass = 'w-5 h-5';

      if (type === 'origin') {
        bgClass = 'bg-[#10B981] text-white shadow-lg animate-bounce-short';
        ringClass = 'ring-4 ring-[#10B981]/30 border-2 border-white';
        sizeClass = 'w-7 h-7';
      } else if (type === 'destination') {
        bgClass = 'bg-[#F26A51] text-white shadow-lg animate-pulse';
        ringClass = 'ring-4 ring-[#F26A51]/30 border-2 border-white';
        sizeClass = 'w-7 h-7';
      } else if (type === 'stop') {
        bgClass = 'bg-[#0D7A7A] text-white shadow-md';
        ringClass = 'ring-2 ring-white border border-[#0D7A7A]';
        sizeClass = 'w-7 h-7';
      }

      const html = `
        <div class="flex items-center justify-center rounded-full ${sizeClass} ${bgClass} ${ringClass} font-bold text-xs cursor-pointer select-none transition-transform hover:scale-125" style="box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
          ${numberLabel !== undefined ? numberLabel : ''}
        </div>
      `;

      const size = type === 'default' ? 20 : 28;
      return L.divIcon({
        className: 'custom-div-pin',
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    };

    // If multi-stop list is provided
    if (stops && stops.length > 0) {
      stops.forEach((stop, index) => {
        let type: 'origin' | 'destination' | 'stop' = 'stop';
        if (index === 0) type = 'origin';
        else if (index === stops.length - 1) type = 'destination';

        const marker = L.marker([stop.lat, stop.lng], {
          icon: createPinIcon(type, toPersianDigits(index + 1)),
        });

        marker.bindPopup(`
          <div dir="rtl" class="text-right font-sans p-1 min-w-[160px]">
            <div class="font-bold text-sm text-[#132238]">${stop.name}</div>
            <div class="text-xs text-stone-500 mb-2">ایستگاه شماره ${toPersianDigits(index + 1)}</div>
            <div class="text-xs text-stone-600">${stop.province}</div>
          </div>
        `);

        marker.addTo(markersLayer);
      });
    } else {
      // Single route: render all cities or prominent ones
      cities.forEach((city) => {
        const isOrigin = originCity?.id === city.id;
        const isDest = destinationCity?.id === city.id;

        let iconType: 'origin' | 'destination' | 'default' = 'default';
        if (isOrigin) iconType = 'origin';
        else if (isDest) iconType = 'destination';

        // Only show if selected or if not cluttered
        const marker = L.marker([city.lat, city.lng], {
          icon: createPinIcon(iconType),
          zIndexOffset: isOrigin || isDest ? 1000 : 10,
        });

        const popupContent = document.createElement('div');
        popupContent.dir = 'rtl';
        popupContent.className = 'text-right font-sans p-1 min-w-[180px]';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between border-b pb-1.5 mb-2">
            <span class="font-bold text-sm text-[#132238]">${city.name}</span>
            <span class="text-[11px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">${city.province}</span>
          </div>
          <p class="text-xs text-stone-600 mb-3 leading-relaxed">${city.description}</p>
          <div class="flex flex-col gap-1.5">
            <button id="btn-orig-${city.id}" class="w-full py-1.5 px-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold rounded-lg transition active:scale-95 text-center">
              انتخاب به‌عنوان مبدأ
            </button>
            <button id="btn-dest-${city.id}" class="w-full py-1.5 px-2 bg-[#F26A51] hover:bg-[#e0563d] text-white text-xs font-semibold rounded-lg transition active:scale-95 text-center">
              انتخاب به‌عنوان مقصد
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btnOrig = document.getElementById(`btn-orig-${city.id}`);
          const btnDest = document.getElementById(`btn-dest-${city.id}`);
          if (btnOrig && onSelectOrigin) {
            btnOrig.onclick = () => {
              onSelectOrigin(city);
              map.closePopup();
            };
          }
          if (btnDest && onSelectDestination) {
            btnDest.onclick = () => {
              onSelectDestination(city);
              map.closePopup();
            };
          }
        });

        marker.addTo(markersLayer);
      });
    }

    // Polyline for Route
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (routeCoordinates && routeCoordinates.length > 1) {
      const polyline = L.polyline(routeCoordinates, {
        color: isApproximateRoute ? '#F26A51' : '#1FA3A3',
        weight: 5,
        opacity: 0.9,
        dashArray: isApproximateRoute ? '8, 8' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      polylineRef.current = polyline;

      // Fit map bounds to show full route comfortably
      try {
        const bounds = polyline.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 10,
            animate: true,
            duration: 0.8,
          });
        }
      } catch {
        // Fallback bounds
      }
    } else if (stops && stops.length > 1) {
      const latlngs: [number, number][] = stops.map((s) => [s.lat, s.lng]);
      const bounds = L.latLngBounds(latlngs);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });
      }
    }
  }, [
    cities,
    originCity,
    destinationCity,
    routeCoordinates,
    isApproximateRoute,
    stops,
    onSelectOrigin,
    onSelectDestination,
  ]);

  return (
    <div
      dir="ltr"
      className={`relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border border-stone-200/70 bg-[#eef2f5] z-0 ${className}`}
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
