import React, { useState, useEffect } from 'react';
import { City, MultiStopLeg } from '../types';
import { IranMap } from './IranMap';
import { fetchRoadRoute, formatPersianNumber, formatDurationPersian, toPersianDigits } from '../utils/distance';
import { Plus, Trash2, ArrowUp, ArrowDown, MapPin, Navigation, Clock } from 'lucide-react';

interface MultiStopPlannerProps {
  cities: City[];
}

export const MultiStopPlanner: React.FC<MultiStopPlannerProps> = ({ cities }) => {
  // Default default initial route matching the mockup: Tabriz -> Tehran -> Isfahan -> Shiraz
  const [stops, setStops] = useState<City[]>([]);
  const [legs, setLegs] = useState<MultiStopLeg[]>([]);
  const [allCoordinates, setAllCoordinates] = useState<[number, number][]>([]);
  const [selectedCityToAdd, setSelectedCityToAdd] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Initialize with Tabriz, Tehran, Isfahan, Shiraz once cities are loaded
  useEffect(() => {
    if (cities.length > 0 && stops.length === 0) {
      const defaultIds = ['tabriz', 'tehran', 'isfahan', 'shiraz'];
      const defaultStops = defaultIds
        .map((id) => cities.find((c) => c.id === id))
        .filter((c): c is City => Boolean(c));
      setStops(defaultStops);
    }
  }, [cities]);

  // Recalculate legs whenever stops change
  useEffect(() => {
    let isCancelled = false;

    async function calculateLegs() {
      if (stops.length < 2) {
        setLegs([]);
        setAllCoordinates([]);
        return;
      }

      setIsCalculating(true);
      const computedLegs: MultiStopLeg[] = [];
      const coords: [number, number][] = [];

      for (let i = 0; i < stops.length - 1; i++) {
        const from = stops[i];
        const to = stops[i + 1];
        const route = await fetchRoadRoute(from, to);

        computedLegs.push({
          from,
          to,
          roadDistanceKm: route.distanceKm,
          durationMinutes: route.durationMinutes,
          isApproximate: route.isApproximate,
          coordinates: route.coordinates,
        });

        coords.push(...route.coordinates);
      }

      if (!isCancelled) {
        setLegs(computedLegs);
        setAllCoordinates(coords);
        setIsCalculating(false);
      }
    }

    calculateLegs();

    return () => {
      isCancelled = true;
    };
  }, [stops]);

  const handleAddStop = () => {
    if (!selectedCityToAdd || stops.length >= 8) return;
    const city = cities.find((c) => c.id === selectedCityToAdd);
    if (city) {
      setStops([...stops, city]);
      setSelectedCityToAdd('');
    }
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) return;
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newStops = [...stops];
    const temp = newStops[index];
    newStops[index] = newStops[index - 1];
    newStops[index - 1] = temp;
    setStops(newStops);
  };

  const handleMoveDown = (index: number) => {
    if (index === stops.length - 1) return;
    const newStops = [...stops];
    const temp = newStops[index];
    newStops[index] = newStops[index + 1];
    newStops[index + 1] = temp;
    setStops(newStops);
  };

  const totalDistanceKm = legs.reduce((acc, leg) => acc + leg.roadDistanceKm, 0);
  const totalDurationMinutes = legs.reduce((acc, leg) => acc + leg.durationMinutes, 0);

  // Available cities to add (exclude current stops)
  const availableCities = cities.filter((c) => !stops.some((s) => s.id === c.id));

  return (
    <section id="multistop" className="py-8 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-stone-200/50 border border-stone-200/80">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1FA3A3] mb-1">
              <Navigation className="w-4 h-4" />
              برنامه‌ریزی چندمرحله‌ای
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#132238]">
              برنامه‌ریز سفر چند مقصدی
            </h3>
            <p className="text-sm text-stone-500 mt-1">
              چند شهر را انتخاب کنید و برنامه سفر رؤیایی خود را با ترتیب دلخواه بسازید (حداکثر ۸ توقف).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Map Column (On mobile above stops, on desktop side-by-side) */}
            <div className="lg:col-span-6 order-1 lg:order-1">
              <div className="sticky top-28">
                <IranMap
                  stops={stops}
                  routeCoordinates={allCoordinates}
                  height="450px"
                  zoomControl={true}
                />
              </div>
            </div>

            {/* Stops Column */}
            <div className="lg:col-span-6 space-y-4 order-2 lg:order-2">
              
              <div className="space-y-2.5">
                {stops.map((stop, index) => (
                  <div
                    key={`${stop.id}-${index}`}
                    className="flex items-center justify-between p-3.5 bg-stone-50 hover:bg-stone-100/80 rounded-2xl border border-stone-200 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#1FA3A3] text-white flex items-center justify-center text-xs font-black shadow-sm">
                        {toPersianDigits(index + 1)}
                      </div>
                      <div>
                        <span className="font-bold text-[#132238] text-sm md:text-base">
                          {stop.name}
                        </span>
                        <span className="text-xs text-stone-400 mr-2">
                          ({stop.province})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400 rounded-lg hover:bg-stone-200/60"
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Move down */}
                      <button
                        type="button"
                        disabled={index === stops.length - 1}
                        onClick={() => handleMoveDown(index)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400 rounded-lg hover:bg-stone-200/60"
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        disabled={stops.length <= 2}
                        onClick={() => handleRemoveStop(index)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-rose-400 rounded-lg hover:bg-rose-50 mr-1"
                        title="حذف توقف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add City Form */}
              {stops.length < 8 && (
                <div className="pt-2 flex gap-2">
                  <select
                    value={selectedCityToAdd}
                    onChange={(e) => setSelectedCityToAdd(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-700 focus:outline-none focus:border-[#1FA3A3]"
                  >
                    <option value="">یک شهر برای افزودن انتخاب کنید...</option>
                    {availableCities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.province})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddStop}
                    disabled={!selectedCityToAdd}
                    className="px-4 py-2.5 bg-[#1FA3A3] hover:bg-[#188585] disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن</span>
                  </button>
                </div>
              )}

              {/* Total Summary Footer Box */}
              <div className="mt-6 p-5 bg-[#FAF7F2] rounded-2xl border border-stone-200/80">
                <div className="grid grid-cols-2 gap-4 text-center divide-x divide-x-reverse divide-stone-200">
                  
                  <div>
                    <div className="text-xs text-stone-500 mb-1 flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1FA3A3]" />
                      مجموع مسافت کل
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#132238]">
                      {isCalculating ? (
                        <span className="text-stone-400 text-sm">در حال محاسبه...</span>
                      ) : (
                        `${formatPersianNumber(totalDistanceKm)} کیلومتر`
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-stone-500 mb-1 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F26A51]" />
                      مجموع زمان رانندگی
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#132238]">
                      {isCalculating ? (
                        <span className="text-stone-400 text-sm">در حال محاسبه...</span>
                      ) : (
                        formatDurationPersian(totalDurationMinutes)
                      )}
                    </div>
                  </div>

                </div>

                {/* Per-leg mini breakdown */}
                {legs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-200/60 space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      جزئیات مراحل سفر:
                    </span>
                    {legs.map((leg, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs text-stone-600 bg-white/70 px-2.5 py-1.5 rounded-lg"
                      >
                        <span className="font-medium">
                          {toPersianDigits(i + 1)}. {leg.from.name} به {leg.to.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1FA3A3]">
                            {formatPersianNumber(leg.roadDistanceKm)} کم
                          </span>
                          <span className="text-[10px] text-stone-400">
                            ({formatDurationPersian(leg.durationMinutes)})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
