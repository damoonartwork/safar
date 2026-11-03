import React, { useState } from 'react';
import { RouteData } from '../types';
import { formatPersianNumber, toPersianDigits } from '../utils/distance';
import { Fuel, Info } from 'lucide-react';
import { SmartImage } from './SmartImage';

interface FuelCalculatorProps {
  routeData: RouteData | null;
}

export const FuelCalculator: React.FC<FuelCalculatorProps> = ({ routeData }) => {
  const [consumption, setConsumption] = useState<number>(8); // L / 100km
  const [pricePerLiter, setPricePerLiter] = useState<number>(3000); // Tomans

  // Distance to calculate against: either current route road distance or default example (925km like Tehran-Shiraz)
  const distanceKm = routeData ? routeData.roadDistanceKm : 925;
  const isCustomRoute = !!routeData;

  const totalLiters = (distanceKm * consumption) / 100;
  const totalCostTomans = Math.round(totalLiters * pricePerLiter);

  return (
    <section id="fuel-calculator" className="py-8 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#172634] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-stone-200/50 dark:shadow-black/70 border border-stone-200/80 dark:border-white/10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Side 1 (Right in RTL): Inputs and Sliders */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#1FA3A3] dark:text-[#2EC4C1] mb-1">
                  <Fuel className="w-4 h-4" />
                  برآورد هزینه بنزین
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#132238] dark:text-[#F1EADF]">
                  ماشین‌حساب هزینه سوخت
                </h3>
                <p className="text-sm text-stone-500 dark:text-[#9FB0BF] mt-1">
                  {isCustomRoute ? (
                    <>
                      محاسبه سوخت مصرفی برای مسیر{' '}
                      <span className="font-bold text-[#132238] dark:text-[#F1EADF]">
                        {routeData.origin.name} به {routeData.destination.name}
                      </span>{' '}
                      ({formatPersianNumber(distanceKm)} کیلومتر)
                    </>
                  ) : (
                    'با وارد کردن اطلاعات خودرو، هزینه سوخت مسیر را دقیق محاسبه کنید'
                  )}
                </p>
              </div>

              {/* Slider 1: Consumption */}
              <div className="bg-[#FAF7F2] dark:bg-[#1E3142] p-5 rounded-2xl border border-stone-200/70 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="fuel-consumption-slider" className="text-xs sm:text-sm font-bold text-[#132238] dark:text-[#F1EADF]">
                    مصرف سوخت خودرو (لیتر در ۱۰۰ کیلومتر)
                  </label>
                  <div className="flex items-center gap-1 bg-white dark:bg-[#172634] px-3 py-1 rounded-xl border border-stone-200 dark:border-white/10 shadow-sm">
                    <span className="text-base font-black text-[#1FA3A3] dark:text-[#2EC4C1]">
                      {toPersianDigits(consumption)}
                    </span>
                    <span className="text-[11px] text-stone-400 dark:text-[#9FB0BF]">لیتر</span>
                  </div>
                </div>

                <input
                  id="fuel-consumption-slider"
                  type="range"
                  min="4"
                  max="18"
                  step="0.5"
                  value={consumption}
                  onChange={(e) => setConsumption(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#1FA3A3] dark:accent-[#2EC4C1]"
                />

                <div className="flex justify-between text-[11px] text-stone-400 dark:text-[#9FB0BF] mt-2">
                  <span>۴ لیتر (کم‌مصرف / هیبرید)</span>
                  <span>۸ لیتر (سواری معمول)</span>
                  <span>۱۸ لیتر (شاسی‌بلند / پرمصرف)</span>
                </div>
              </div>

              {/* Slider 2: Fuel price */}
              <div className="bg-[#FAF7F2] dark:bg-[#1E3142] p-5 rounded-2xl border border-stone-200/70 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="fuel-price-slider" className="text-xs sm:text-sm font-bold text-[#132238] dark:text-[#F1EADF]">
                    قیمت هر لیتر بنزین (تومان)
                  </label>
                  <div className="flex items-center gap-1 bg-white dark:bg-[#172634] px-3 py-1 rounded-xl border border-stone-200 dark:border-white/10 shadow-sm">
                    <span className="text-base font-black text-[#1FA3A3] dark:text-[#2EC4C1]">
                      {formatPersianNumber(pricePerLiter)}
                    </span>
                    <span className="text-[11px] text-stone-400 dark:text-[#9FB0BF]">تومان</span>
                  </div>
                </div>

                <input
                  id="fuel-price-slider"
                  type="range"
                  min="1500"
                  max="60000"
                  step="500"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#1FA3A3] dark:accent-[#2EC4C1]"
                />

                {/* Preset quick buttons */}
                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-stone-200/50 dark:border-white/10">
                  <span className="text-xs text-stone-500 dark:text-[#9FB0BF] self-center">نرخ‌های رایج:</span>
                  {[
                    { label: 'سهمیه‌ای (۱,۵۰۰)', val: 1500 },
                    { label: 'آزاد (۳,۰۰۰)', val: 3000 },
                    { label: 'سوپر (۳۰,۰۰۰)', val: 30000 },
                    { label: 'آزاد نرخ روز (۶۰,۰۰۰)', val: 60000 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setPricePerLiter(preset.val)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        pricePerLiter === preset.val
                          ? 'bg-[#1FA3A3] dark:bg-[#2EC4C1] text-white dark:text-[#0F1A24] border-[#1FA3A3] dark:border-[#2EC4C1] font-bold'
                          : 'bg-white dark:bg-[#172634] text-stone-600 dark:text-[#F1EADF] border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-[#253d52]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
                <Info className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <span>قیمت بنزین را با نرخ روز به‌روز کنید.</span>
              </div>
            </div>

            {/* Side 2 (Left in RTL): Gas pump visual & Large total cost */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gradient-to-br from-[#1FA3A3]/5 via-[#F6EFE4] to-[#F26A51]/10 dark:from-[#1E3142] dark:via-[#172634] dark:to-[#1E3142] rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-white/10 text-center order-1 lg:order-2">
              
              <div className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] mb-4 rounded-3xl overflow-hidden">
                <SmartImage
                  src="/images/pump.png"
                  alt="پمپ بنزین"
                  type="pump"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-sm font-semibold text-stone-500 dark:text-[#9FB0BF] mb-2">
                هزینه تقریبی سوخت
              </span>

              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#132238] dark:text-[#F1EADF] tracking-tight">
                  {formatPersianNumber(totalCostTomans)}
                </span>
                <span className="text-base font-bold text-stone-600 dark:text-[#9FB0BF]">تومان</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#172634] text-xs font-semibold text-[#1FA3A3] dark:text-[#2EC4C1] border border-stone-200 dark:border-white/10 shadow-sm mt-3">
                <span>مصرف کل سوخت:</span>
                <span className="font-black text-sm">
                  {formatPersianNumber(Math.round(totalLiters))} لیتر
                </span>
              </div>

              <p className="text-[11px] text-stone-400 dark:text-[#9FB0BF] mt-4 max-w-xs">
                برآورد بر اساس رانندگی در جاده‌های برون‌شهری و شرایط استاندارد ترافیکی
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
