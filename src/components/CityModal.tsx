import React from 'react';
import { City } from '../types';
import { SmartImage } from './SmartImage';
import { X, MapPin, Plane, Train, Sparkles, Compass } from 'lucide-react';
import { formatPersianNumber } from '../utils/distance';

interface CityModalProps {
  city: City | null;
  onClose: () => void;
  onSetAsDestination: (city: City) => void;
  onSetAsOrigin: (city: City) => void;
}

export const CityModal: React.FC<CityModalProps> = ({
  city,
  onClose,
  onSetAsDestination,
  onSetAsOrigin,
}) => {
  if (!city) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#172634] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl dark:shadow-black/80 border border-stone-200 dark:border-white/10 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header Image - Larger view in detail modal */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[220px] bg-stone-100 dark:bg-[#1E3142] overflow-hidden rounded-t-3xl">
          <SmartImage
            src={`/images/${city.id}.png`}
            alt={city.name}
            type="city"
            title={city.name}
            subtitle={city.province}
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-stone-900/50 hover:bg-stone-900/80 text-white rounded-full transition shadow-md cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 right-4 bg-white/90 dark:bg-[#172634]/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-sm text-xs font-bold text-[#132238] dark:text-[#F1EADF] flex items-center gap-1.5 border border-white/40 dark:border-white/10">
            <MapPin className="w-3.5 h-3.5 text-[#1FA3A3] dark:text-[#2EC4C1]" />
            <span>استان {city.province}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-black text-[#132238] dark:text-[#F1EADF] mb-1">
              {city.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-[#9FB0BF] leading-relaxed">
              {city.description}
            </p>
          </div>

          {/* Quick info row */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#1E3142] px-3 py-1 rounded-xl text-stone-700 dark:text-[#F1EADF]">
              <span className="font-semibold">جمعیت:</span>
              <span>حدود {formatPersianNumber(city.population)} نفر</span>
            </div>

            <div className={`flex items-center gap-1 px-3 py-1 rounded-xl font-medium ${
              city.hasAirport
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-[#2EC4C1]'
                : 'bg-stone-100 dark:bg-[#1E3142] text-stone-400 dark:text-[#9FB0BF]'
            }`}>
              <Plane className="w-3.5 h-3.5" />
              <span>{city.hasAirport ? 'دارای فرودگاه' : 'بدون فرودگاه'}</span>
            </div>

            <div className={`flex items-center gap-1 px-3 py-1 rounded-xl font-medium ${
              city.hasRailway
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                : 'bg-stone-100 dark:bg-[#1E3142] text-stone-400 dark:text-[#9FB0BF]'
            }`}>
              <Train className="w-3.5 h-3.5" />
              <span>{city.hasRailway ? 'دارای راه‌آهن' : 'بدون راه‌آهن'}</span>
            </div>
          </div>

          {/* Attractions */}
          <div>
            <h4 className="text-xs font-bold text-stone-500 dark:text-[#9FB0BF] flex items-center gap-1.5 mb-2">
              <Compass className="w-4 h-4 text-[#1FA3A3] dark:text-[#2EC4C1]" />
              جاذبه‌های معروف گردشگری:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {city.attractions.map((att, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#1FA3A3]/10 dark:bg-[#2EC4C1]/15 text-[#0D7A7A] dark:text-[#2EC4C1] text-xs font-semibold rounded-xl border border-[#1FA3A3]/20 dark:border-[#2EC4C1]/30"
                >
                  {att}
                </span>
              ))}
            </div>
          </div>

          {/* Souvenirs */}
          <div>
            <h4 className="text-xs font-bold text-stone-500 dark:text-[#9FB0BF] flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              سوغاتی‌ها و صنایع‌دستی:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {city.souvenirs.map((souv, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-xl border border-amber-200 dark:border-amber-800/40"
                >
                  {souv}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                onSetAsDestination(city);
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-[#F26A51] hover:bg-[#e0563d] dark:bg-[#FF7A5C] dark:hover:bg-[#f26545] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition active:scale-95 cursor-pointer"
            >
              این شهر را مقصد کن
            </button>
            <button
              type="button"
              onClick={() => {
                onSetAsOrigin(city);
                onClose();
              }}
              className="py-3 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-[#1E3142] dark:hover:bg-[#253d52] text-[#132238] dark:text-[#F1EADF] text-xs sm:text-sm font-bold rounded-2xl transition active:scale-95 border border-stone-200 dark:border-white/10 cursor-pointer"
            >
              انتخاب به عنوان مبدأ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
