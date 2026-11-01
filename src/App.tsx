import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RouteResult } from './components/RouteResult';
import { TransportCards } from './components/TransportCards';
import { FuelCalculator } from './components/FuelCalculator';
import { MultiStopPlanner } from './components/MultiStopPlanner';
import { PopularDestinations } from './components/PopularDestinations';
import { DistanceGame } from './components/DistanceGame';
import { Footer } from './components/Footer';
import { useCities } from './hooks/useCities';
import { City, RouteData } from './types';
import { calculateRouteData } from './utils/distance';

export const App: React.FC = () => {
  const { cities, loading: citiesLoading, error: citiesError, getCityById } = useCities();

  const [originCity, setOriginCity] = useState<City | null>(null);
  const [destinationCity, setDestinationCity] = useState<City | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize from URL parameters (e.g. ?from=tehran&to=shiraz) or defaults (Tehran -> Shiraz as mockup)
  useEffect(() => {
    if (cities.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');

    let initialOrigin = fromParam ? getCityById(fromParam) : undefined;
    let initialDest = toParam ? getCityById(toParam) : undefined;

    // Default to Tehran and Shiraz if no URL params given
    if (!initialOrigin) {
      initialOrigin = getCityById('tehran') || cities[0];
    }
    if (!initialDest) {
      initialDest = getCityById('shiraz') || cities[1];
    }

    setOriginCity(initialOrigin);
    setDestinationCity(initialDest);

    // Initial cities set
  }, [cities]);

  // Debounced auto-calculation when origin or destination changes (400ms, no auto-scroll)
  useEffect(() => {
    if (!originCity || !destinationCity) return;
    if (originCity.id === destinationCity.id) return;

    const timer = setTimeout(() => {
      calculateRoute(originCity, destinationCity, false);
    }, 400);

    return () => clearTimeout(timer);
  }, [originCity?.id, destinationCity?.id]);

  const updateUrlParams = (fromId: string, toId: string) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('from', fromId);
      url.searchParams.set('to', toId);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // URL replacement fallback
    }
  };

  const calculateRoute = async (
    origin: City,
    dest: City,
    shouldScroll = true
  ) => {
    setValidationError(null);

    if (origin.id === dest.id) {
      setValidationError('مبدأ و مقصد نمی‌توانند یکسان باشند. لطفاً دو شهر متفاوت را انتخاب کنید.');
      return;
    }

    setIsCalculating(true);
    try {
      const data = await calculateRouteData(origin, dest);
      setRouteData(data);
      updateUrlParams(origin.id, dest.id);

      if (shouldScroll) {
        setTimeout(() => {
          const resultElem = document.getElementById('route-result-section');
          if (resultElem) {
            resultElem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } catch {
      setValidationError('خطا در محاسبه مسیر. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleHeroCalculate = () => {
    if (!originCity || !destinationCity) {
      setValidationError('لطفاً هر دو فیلد مبدأ و مقصد را انتخاب نمایید.');
      return;
    }
    calculateRoute(originCity, destinationCity, true);
  };

  const handleSetAsDestination = (city: City) => {
    setDestinationCity(city);
    if (originCity && originCity.id !== city.id) {
      calculateRoute(originCity, city, true);
    } else {
      const hero = document.getElementById('route-calculator');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSetAsOrigin = (city: City) => {
    setOriginCity(city);
    if (destinationCity && destinationCity.id !== city.id) {
      calculateRoute(city, destinationCity, true);
    } else {
      const hero = document.getElementById('route-calculator');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (citiesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#1FA3A3] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-base font-bold text-[#132238]">در حال بارگذاری اطلاعات شهرهای ایران...</span>
      </div>
    );
  }

  if (citiesError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border border-stone-200">
          <p className="text-rose-600 font-bold mb-4">{citiesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#1FA3A3] text-white font-bold rounded-xl"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-[#132238] font-sans selection:bg-[#1FA3A3] selection:text-white" dir="rtl">
      {/* 1. Sticky Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          cities={cities}
          originCity={originCity}
          destinationCity={destinationCity}
          onSelectOrigin={(city) => {
            setOriginCity(city);
            setValidationError(null);
          }}
          onSelectDestination={(city) => {
            setDestinationCity(city);
            setValidationError(null);
          }}
          onQuickRoute={(c1, c2) => {
            setOriginCity(c1);
            setDestinationCity(c2);
          }}
          isLoading={isCalculating}
          validationError={validationError}
        />

        {/* 3. Route Result Section */}
        {routeData && (
          <>
            <RouteResult
              routeData={routeData}
              onSelectOrigin={handleSetAsOrigin}
              onSelectDestination={handleSetAsDestination}
            />

            {/* 4. Transport Cards */}
            <TransportCards routeData={routeData} />
          </>
        )}

        {/* 5. Fuel Cost Calculator */}
        <FuelCalculator routeData={routeData} />

        {/* 6. Multi-Stop Travel Planner */}
        <MultiStopPlanner cities={cities} />

        {/* 7. Popular Destinations */}
        <PopularDestinations
          cities={cities}
          onSetAsDestination={handleSetAsDestination}
          onSetAsOrigin={handleSetAsOrigin}
        />

        {/* 8. Distance Guessing Game */}
        <DistanceGame cities={cities} />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};
