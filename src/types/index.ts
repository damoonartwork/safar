export interface City {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  population: number;
  hasAirport: boolean;
  hasRailway: boolean;
  souvenirs: string[];
  attractions: string[];
  description: string;
}

export interface RouteData {
  origin: City;
  destination: City;
  aerialDistanceKm: number;
  roadDistanceKm: number;
  isApproximateRoad: boolean;
  roadDurationMinutes: number;
  coordinates: [number, number][]; // [lat, lng] for Leaflet polyline
  travelModes: {
    car: {
      available: boolean;
      durationMinutes: number;
      fuelConsumptionLiters: number;
      estimatedCostTomans: number;
      label: string;
      note?: string;
    };
    bus: {
      available: boolean;
      durationMinutes: number;
      label: string;
      note?: string;
    };
    train: {
      available: boolean;
      durationMinutes: number;
      label: string;
      reasonDisabled?: string;
      note?: string;
    };
    airplane: {
      available: boolean;
      durationMinutes: number;
      label: string;
      reasonDisabled?: string;
      note?: string;
    };
  };
}

export interface MultiStopLeg {
  from: City;
  to: City;
  roadDistanceKm: number;
  durationMinutes: number;
  isApproximate: boolean;
  coordinates: [number, number][];
}

export interface MultiStopPlan {
  stops: City[];
  legs: MultiStopLeg[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  allCoordinates: [number, number][];
}

export interface GameRound {
  cityA: City;
  cityB: City;
  actualDistanceKm: number;
  userGuessKm?: number;
  score?: number;
}
