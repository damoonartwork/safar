import React from 'react';
import { ArrowLeftRight, Search, AlertCircle } from 'lucide-react';
import { City } from '../types';
import { CitySearchInput } from './CitySearchInput';
import { SmartImage } from './SmartImage';

interface HeroProps {
  cities: City[];
  originCity: City | null;
  destinationCity: City | null;
  onSelectOrigin: (city: City | null) => void;
  onSelectDestination: (city: City | null) => void;
  onCalculateRoute: () => void;
  isLoading: boolean;
  validationError: string | null;
}

export const Hero: React.FC<HeroProps> = ({
  cities,
  originCity,
  destinationCity,
  onSelectOrigin,
  onSelectDestination,
  onCalculateRoute,
  isLoading,
  validationError,
}) => {
  const handleSwap = () => {
    const temp = originCity;
    onSelectOrigin(destinationCity);
    onSelectDestination(temp);
  };

  return (
    <section className="relative pt-6 pb-14 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right column in RTL: Headline, search card & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1FA3A3]/10 text-[#0D7A7A] text-xs font-bold border border-[#1FA3A3]/20">
              <span className="w-2 h-2 rounded-full bg-[#1FA3A3] animate-pulse"></span>
              ایران، به وسعت یک ماجراجویی
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#132238] leading-[1.35] tracking-tight">
              مسیرها را کشف کن
              <br />
              <span className="text-[#1FA3A3]">سفرها را نزدیک‌تر کن</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              ایران را کیلومتر به کیلومتر بشناس؛ محاسبه دقیق فاصله بین شهرهای ایران، مقایسه زمان سفر جاده‌ای، ریلی، هوایی و محاسبه‌گر برخط هزینه بنزین.
            </p>

            {/* Route Planning Card */}
            <div
              id="route-calculator"
              className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-stone-200/50 border border-stone-200/80 transition-all duration-300 hover:shadow-2xl hover:shadow-stone-200/60"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 sm:gap-2 items-center">
                {/* Origin */}
                <CitySearchInput
                  label="مبدأ سفر"
                  placeholder="مثلاً تهران"
                  selectedCity={originCity}
                  onSelectCity={onSelectOrigin}
                  cities={cities}
                  iconColor="text-[#10B981]"
                />

                {/* Swap button */}
                <div className="flex justify-center -my-1 sm:my-0 sm:pt-6">
                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="جابه‌جایی مبدأ و مقصد"
                    className="w-11 h-11 rounded-2xl bg-stone-100 hover:bg-[#1FA3A3]/10 hover:text-[#1FA3A3] text-stone-600 border border-stone-200 flex items-center justify-center transition-all duration-200 active:rotate-180"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination */}
                <CitySearchInput
                  label="مقصد سفر"
                  placeholder="مثلاً شیراز"
                  selectedCity={destinationCity}
                  onSelectCity={onSelectDestination}
                  cities={cities}
                  iconColor="text-[#F26A51]"
                />
              </div>

              {/* Validation Warning Alert */}
              {validationError && (
                <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Calculate Button */}
              <button
                type="button"
                onClick={onCalculateRoute}
                disabled={isLoading}
                className="mt-5 w-full py-3.5 sm:py-4 px-6 bg-[#1FA3A3] hover:bg-[#178585] disabled:bg-stone-300 text-white text-base font-bold rounded-2xl shadow-lg shadow-[#1FA3A3]/30 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>محاسبه مسیر و جزئیات سفر</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick popular routes */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">مسیرهای پرطرفدار:</span>
              {[
                { from: 'tehran', to: 'isfahan', label: 'تهران به اصفهان' },
                { from: 'tehran', to: 'mashhad', label: 'تهران به مشهد' },
                { from: 'tehran', to: 'shiraz', label: 'تهران به شیراز' },
                { from: 'tabriz', to: 'rasht', label: 'تبریز به رشت' },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => {
                    const c1 = cities.find((c) => c.id === r.from);
                    const c2 = cities.find((c) => c.id === r.to);
                    if (c1 && c2) {
                      onSelectOrigin(c1);
                      onSelectDestination(c2);
                    }
                  }}
                  className="px-2.5 py-1 bg-white/70 hover:bg-[#1FA3A3]/10 hover:text-[#1FA3A3] rounded-lg border border-stone-200/80 transition"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Left column in RTL: Visual Graphic (3D Relief of Iran) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/60 border-4 border-white/80 bg-white group">
                <SmartImage
                  src="/images/hero.png"
                  alt="نقشه سه‌بعدی و جاذبه‌های ایران"
                  type="hero"
                  title="ایرانگردی هوشمند"
                  subtitle="تمام جاده‌ها، راه‌آهن‌ها و پروازها در یک نگاه"
                  className="w-full h-auto max-h-[460px] object-cover group-hover:scale-102 transition duration-500"
                />
              </div>

              {/* Floating decorative tags */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-stone-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  ۳۱
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#132238]">مرکز استان ایران</div>
                  <div className="text-[10px] text-stone-500">پوشش کامل تمام راه‌های کشور</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
