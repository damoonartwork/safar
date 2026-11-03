import React, { useState } from 'react';
import { City } from '../types';
import { SmartImage } from './SmartImage';
import { CityModal } from './CityModal';
import { MapPin, ChevronLeft, Sparkles, Compass } from 'lucide-react';

interface PopularDestinationsProps {
  cities: City[];
  onSetAsDestination: (city: City) => void;
  onSetAsOrigin: (city: City) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  cities,
  onSetAsDestination,
  onSetAsOrigin,
}) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  // The 8 cities with attached illustrations come first, followed by others
  const firstEightIds = [
    'tabriz',
    'tehran',
    'kashan',
    'mashhad',
    'kish',
    'isfahan',
    'shiraz',
    'yazd',
  ];

  const secondaryPopularIds = [
    'rasht',
    'ramsar',
    'chabahar',
    'kerman',
    'hamedan',
    'bushehr',
  ];

  const firstEightCities = firstEightIds
    .map((id) => cities.find((c) => c.id === id))
    .filter((c): c is City => Boolean(c));

  const remainingCities = cities.filter(
    (c) => !firstEightIds.includes(c.id)
  );

  const displayCities = showAll
    ? [...firstEightCities, ...remainingCities]
    : [
        ...firstEightCities,
        ...secondaryPopularIds
          .map((id) => cities.find((c) => c.id === id))
          .filter((c): c is City => Boolean(c)),
      ];

  return (
    <section id="destinations" className="py-8 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1FA3A3] dark:text-[#2EC4C1] mb-1">
              <Compass className="w-4 h-4" />
              مقاصد محبوب ایران
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#132238] dark:text-[#F1EADF]">
              مقصدت را بشناس
            </h3>
            <p className="text-sm text-stone-500 dark:text-[#9FB0BF] mt-1">
              با شهرهای دیدنی و شگفتی‌های گردشگری ایران بیشتر آشنا شوید
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1FA3A3] dark:text-[#2EC4C1] hover:text-[#188585] dark:hover:text-[#45d9d6] transition self-start sm:self-auto cursor-pointer"
          >
            <span>{showAll ? 'نمایش شهرهای منتخب' : 'مشاهده همه شهرها'}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable horizontal cards row (or grid if showAll) */}
        <div
          className={`${
            showAll
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
              : 'flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin'
          }`}
        >
          {displayCities.map((city) => (
            <div
              key={city.id}
              onClick={() => setSelectedCity(city)}
              className={`bg-white dark:bg-[#172634] rounded-3xl overflow-hidden border border-stone-200/80 dark:border-white/10 shadow-md dark:shadow-black/60 hover:shadow-xl dark:hover:shadow-black/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between flex-shrink-0 ${
                showAll ? 'w-full' : 'w-72 sm:w-80 snap-start'
              }`}
            >
              <div>
                {/* Image: Fixed 4:3 aspect ratio, fills top, rounded corners match card */}
                <div className="relative w-full aspect-[4/3] bg-stone-100 dark:bg-[#1E3142] overflow-hidden rounded-t-3xl">
                  <SmartImage
                    src={`/images/${city.id}.png`}
                    alt={city.name}
                    type="city"
                    title={city.name}
                    subtitle={city.province}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#172634]/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-stone-700 dark:text-[#F1EADF] shadow-sm flex items-center gap-1 z-10 border border-stone-100/40 dark:border-white/10">
                    <MapPin className="w-3 h-3 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                    <span>{city.province}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2.5">
                  <h4 className="font-black text-xl text-[#132238] dark:text-[#F1EADF]">
                    {city.name}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-[#9FB0BF] line-clamp-2 leading-relaxed">
                    {city.description}
                  </p>

                  {/* Souvenirs tags */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-stone-400 dark:text-[#9FB0BF] block mb-1">
                      سوغات مشهور:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {city.souvenirs.slice(0, 2).map((souv, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[11px] font-medium rounded-lg border border-amber-200/80 dark:border-amber-800/40"
                        >
                          {souv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-4 pt-2 border-t border-stone-100 dark:border-white/10 flex items-center justify-between text-xs font-bold">
                <span className="text-[#1FA3A3] dark:text-[#2EC4C1] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  مشاهده جاذبه‌ها
                </span>
                <span className="text-stone-400 dark:text-[#9FB0BF]">اطلاعات بیشتر ←</span>
              </div>
            </div>
          ))}
        </div>

        {/* City Detail Modal */}
        <CityModal
          city={selectedCity}
          onClose={() => setSelectedCity(null)}
          onSetAsDestination={onSetAsDestination}
          onSetAsOrigin={onSetAsOrigin}
        />

      </div>
    </section>
  );
};
