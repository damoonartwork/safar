import { City, RouteData } from '../types';

// Convert English numbers to Persian digits
export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

// Format numbers with thousand separators in Persian: ۱,۲۴۰,۰۰۰
export function formatPersianNumber(n: number): string {
  const parts = Math.round(n).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  return toPersianDigits(parts.join('.'));
}

// Format minutes into Persian hours and minutes
export function formatDurationPersian(totalMinutes: number): string {
  const mins = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(mins / 60);
  const remainingMinutes = mins % 60;

  if (hours === 0) {
    return `${toPersianDigits(remainingMinutes)} دقیقه`;
  }
  if (remainingMinutes === 0) {
    return `${toPersianDigits(hours)} ساعت`;
  }
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(remainingMinutes)} دقیقه`;
}

// Calibration settings for Hero 3D map pin projection
export const heroMapCalibration = {
  geoBounds: {
    minLng: 44.0,
    maxLng: 63.5,
    minLat: 25.0,
    maxLat: 40.0,
  },
  imageBounds: {
    minX: 12.0, // percent
    maxX: 88.0, // percent
    minY: 10.0, // percent (top)
    maxY: 90.0, // percent (bottom)
  },
};

export function calculateHeroMapPinCoords(lat: number, lng: number): { x: number; y: number } {
  const { geoBounds, imageBounds } = heroMapCalibration;

  const clampedLng = Math.max(geoBounds.minLng, Math.min(geoBounds.maxLng, lng));
  const clampedLat = Math.max(geoBounds.minLat, Math.min(geoBounds.maxLat, lat));

  const lngRatio = (clampedLng - geoBounds.minLng) / (geoBounds.maxLng - geoBounds.minLng);
  const latRatio = (geoBounds.maxLat - clampedLat) / (geoBounds.maxLat - geoBounds.minLat); // North is top

  const x = imageBounds.minX + lngRatio * (imageBounds.maxX - imageBounds.minX);
  const y = imageBounds.minY + latRatio * (imageBounds.maxY - imageBounds.minY);

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  };
}

// Great-circle Haversine distance in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(1, Math.round(R * c));
}

// In-memory cache for OSRM routes
interface CachedRoute {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][];
  isApproximate: boolean;
}

const routeCache = new Map<string, CachedRoute>();

// Fetch driving route with 6-second timeout and fallback
export async function fetchRoadRoute(
  origin: City,
  destination: City
): Promise<CachedRoute> {
  const cacheKey = `${origin.id}->${destination.id}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  const aerialDistance = calculateHaversineDistance(
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng
  );

  // Fallback data if OSRM times out or fails
  const fallbackRoute: CachedRoute = {
    distanceKm: Math.round(aerialDistance * 1.3),
    durationMinutes: Math.round(((aerialDistance * 1.3) / 80) * 60),
    coordinates: [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ],
    isApproximate: true,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OSRM responded with status ${res.status}`);
    }

    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const bestRoute = data.routes[0];
      const distanceKm = Math.round(bestRoute.distance / 1000);
      const durationMinutes = Math.round(bestRoute.duration / 60);
      // OSRM coordinates are [lng, lat], Leaflet polyline needs [lat, lng]
      const coordinates: [number, number][] = (
        bestRoute.geometry.coordinates as [number, number][]
      ).map(([lng, lat]) => [lat, lng]);

      const result: CachedRoute = {
        distanceKm: Math.max(1, distanceKm),
        durationMinutes: Math.max(5, durationMinutes),
        coordinates,
        isApproximate: false,
      };

      routeCache.set(cacheKey, result);
      return result;
    }
  } catch {
    // Graceful fallback on network timeout or OSRM error
  } finally {
    clearTimeout(timeoutId);
  }

  routeCache.set(cacheKey, fallbackRoute);
  return fallbackRoute;
}

// Compute comprehensive route details with transport modes
export async function calculateRouteData(
  origin: City,
  destination: City,
  fuelConsumptionLPer100 = 8,
  fuelPricePerLiterTomans = 3000
): Promise<RouteData> {
  const aerialDistanceKm = calculateHaversineDistance(
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng
  );

  const roadRoute = await fetchRoadRoute(origin, destination);
  const roadDistanceKm = roadRoute.distanceKm;
  const isApproximateRoad = roadRoute.isApproximate;

  // Car duration: from OSRM or fallback distance / 80 km/h
  const carDurationMinutes = isApproximateRoad
    ? Math.round((roadDistanceKm / 80) * 60)
    : roadRoute.durationMinutes;

  // Bus: roadDistance / 65 km/h
  const busDurationMinutes = Math.round((roadDistanceKm / 65) * 60);

  // Train: only if both cities have railway, roadDistance / 70 km/h
  const trainAvailable = origin.hasRailway && destination.hasRailway;
  const trainDurationMinutes = trainAvailable
    ? Math.round((roadDistanceKm / 70) * 60)
    : 0;
  let trainReasonDisabled = '';
  if (!origin.hasRailway && !destination.hasRailway) {
    trainReasonDisabled = 'هیچ‌کدام راه‌آهن ندارند';
  } else if (!origin.hasRailway) {
    trainReasonDisabled = `${origin.name} راه‌آهن ندارد`;
  } else if (!destination.hasRailway) {
    trainReasonDisabled = `${destination.name} راه‌آهن ندارد`;
  }

  // Airplane: only if both have airport, aerialDistance / 700 km/h + 30 min flight prep/takeoff
  const airplaneAvailable = origin.hasAirport && destination.hasAirport;
  const airplaneDurationMinutes = airplaneAvailable
    ? Math.round((aerialDistanceKm / 700) * 60 + 30)
    : 0;
  let airplaneReasonDisabled = '';
  if (!origin.hasAirport && !destination.hasAirport) {
    airplaneReasonDisabled = 'هیچ‌کدام فرودگاه ندارند';
  } else if (!origin.hasAirport) {
    airplaneReasonDisabled = `${origin.name} فرودگاه ندارد`;
  } else if (!destination.hasAirport) {
    airplaneReasonDisabled = `${destination.name} فرودگاه ندارد`;
  }

  // Fuel calculation
  const fuelLiters = (roadDistanceKm * fuelConsumptionLPer100) / 100;
  const estimatedFuelCostTomans = Math.round(fuelLiters * fuelPricePerLiterTomans);

  return {
    origin,
    destination,
    aerialDistanceKm,
    roadDistanceKm,
    isApproximateRoad,
    roadDurationMinutes: carDurationMinutes,
    coordinates: roadRoute.coordinates,
    travelModes: {
      car: {
        available: true,
        durationMinutes: carDurationMinutes,
        fuelConsumptionLiters: Number(fuelLiters.toFixed(1)),
        estimatedCostTomans: estimatedFuelCostTomans,
        label: 'خودرو شخصی',
        note: isApproximateRoad ? 'محاسبه شده بر مبنای سرعت متوسط ۸۰ کیلومتر بر ساعت' : 'مسیر مستقیم جاده‌ای',
      },
      bus: {
        available: true,
        durationMinutes: busDurationMinutes,
        label: 'اتوبوس بین‌شهری',
        note: 'با احتساب توقف‌های بین‌راهی و سرعت متوسط ۶۵ کیلومتر بر ساعت',
      },
      train: {
        available: trainAvailable,
        durationMinutes: trainDurationMinutes,
        label: 'قطار مسافربری',
        reasonDisabled: trainAvailable ? undefined : trainReasonDisabled,
        note: trainAvailable ? 'سرعت متوسط سیر شبکه ریلی حدود ۷۰ کیلومتر بر ساعت' : undefined,
      },
      airplane: {
        available: airplaneAvailable,
        durationMinutes: airplaneDurationMinutes,
        label: 'هواپیما',
        reasonDisabled: airplaneAvailable ? undefined : airplaneReasonDisabled,
        note: airplaneAvailable ? 'زمان پرواز خالص به همراه ۳۰ دقیقه فرود و برخاست' : undefined,
      },
    },
  };
}
