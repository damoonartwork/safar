import React from 'react';
import { RouteData } from '../types';
import { formatDurationPersian, formatPersianNumber } from '../utils/distance';
import { SmartImage } from './SmartImage';
import { Clock, Fuel, AlertCircle } from 'lucide-react';

interface TransportCardsProps {
  routeData: RouteData;
}

export const TransportCards: React.FC<TransportCardsProps> = ({ routeData }) => {
  const { travelModes } = routeData;

  const cards = [
    {
      id: 'car',
      name: 'خودرو شخصی',
      type: 'car' as const,
      imageSrc: '/images/car.png',
      available: true,
      duration: travelModes.car.durationMinutes,
      badge: 'انعطاف‌پذیرترین',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
      extraInfo: (
        <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-[#9FB0BF] bg-stone-100/70 dark:bg-[#1E3142] p-2 rounded-xl mt-3">
          <Fuel className="w-4 h-4 text-[#1FA3A3] dark:text-[#2EC4C1] flex-shrink-0" />
          <span>
            سوخت تخمینی: {formatPersianNumber(travelModes.car.fuelConsumptionLiters)} لیتر
          </span>
        </div>
      ),
    },
    {
      id: 'bus',
      name: 'اتوبوس بین‌شهری',
      type: 'bus' as const,
      imageSrc: '/images/bus.png',
      available: true,
      duration: travelModes.bus.durationMinutes,
      badge: 'اقتصادی و همگانی',
      badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
      extraInfo: (
        <div className="text-[11px] text-stone-500 dark:text-[#9FB0BF] bg-stone-100/70 dark:bg-[#1E3142] p-2 rounded-xl mt-3">
          با احتساب توقف در مجتمع‌های بین‌راهی
        </div>
      ),
    },
    {
      id: 'train',
      name: 'قطار مسافربری',
      type: 'train' as const,
      imageSrc: '/images/train.png',
      available: travelModes.train.available,
      duration: travelModes.train.durationMinutes,
      reasonDisabled: travelModes.train.reasonDisabled,
      badge: travelModes.train.available ? 'آرامش و امنیت' : 'فاقد شبکه ریلی مستقیم',
      badgeColor: travelModes.train.available
        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
        : 'bg-stone-200 dark:bg-[#1E3142] text-stone-500 dark:text-[#9FB0BF] border-stone-300 dark:border-white/10',
      extraInfo: travelModes.train.available ? (
        <div className="text-[11px] text-stone-500 dark:text-[#9FB0BF] bg-stone-100/70 dark:bg-[#1E3142] p-2 rounded-xl mt-3">
          حرکت روی خطوط سراسری راه‌آهن
        </div>
      ) : null,
    },
    {
      id: 'airplane',
      name: 'هواپیما',
      type: 'airplane' as const,
      imageSrc: '/images/airplane.png',
      available: travelModes.airplane.available,
      duration: travelModes.airplane.durationMinutes,
      reasonDisabled: travelModes.airplane.reasonDisabled,
      badge: travelModes.airplane.available ? 'سریع‌ترین راه' : 'فاقد فرودگاه فعال',
      badgeColor: travelModes.airplane.available
        ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0D7A7A] dark:text-[#2EC4C1] border-teal-200 dark:border-teal-800/40'
        : 'bg-stone-200 dark:bg-[#1E3142] text-stone-500 dark:text-[#9FB0BF] border-stone-300 dark:border-white/10',
      extraInfo: travelModes.airplane.available ? (
        <div className="text-[11px] text-stone-500 dark:text-[#9FB0BF] bg-stone-100/70 dark:bg-[#1E3142] p-2 rounded-xl mt-3">
          شامل زمان پرواز و ۳۰ دقیقه مانور فرودگاه
        </div>
      ) : null,
    },
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center md:text-right mb-6">
          <h3 className="text-2xl sm:text-3xl font-black text-[#132238] dark:text-[#F1EADF] mb-1">
            چطور می‌خواهید سفر کنید؟
          </h3>
          <p className="text-sm text-stone-600 dark:text-[#9FB0BF]">
            مقایسه گزینه‌های مختلف سفر بین {routeData.origin.name} و {routeData.destination.name} و زمان‌بندی هر کدام
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                card.available
                  ? 'bg-white dark:bg-[#172634] border-stone-200 dark:border-white/10 shadow-lg shadow-stone-200/50 dark:shadow-black/70 hover:shadow-xl hover:-translate-y-1'
                  : 'bg-stone-100/70 dark:bg-[#172634]/50 border-dashed border-stone-300 dark:border-white/10 opacity-75'
              }`}
            >
              <div>
                {/* Image / Illustration */}
                <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden mb-4 group">
                  <SmartImage
                    src={card.imageSrc}
                    alt={card.name}
                    type={card.type}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Badge and Title */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-black text-lg text-[#132238] dark:text-[#F1EADF]">{card.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Duration or Disabled reason */}
                {card.available ? (
                  <div className="flex items-center gap-2 text-stone-800 dark:text-[#F1EADF] font-bold text-base mt-3">
                    <Clock className="w-5 h-5 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                    <span>{formatDurationPersian(card.duration)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold mt-3 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-xl border border-rose-200 dark:border-rose-900/50">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{card.reasonDisabled || 'امکان‌پذیر نیست'}</span>
                  </div>
                )}
              </div>

              {card.extraInfo}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
