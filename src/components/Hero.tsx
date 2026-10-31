import React, { useState } from 'react';
import { ArrowLeftRight, Search, AlertCircle, Compass, MapPin, Layers, Navigation, Sparkles, ChevronDown, Car } from 'lucide-react';
import { City } from '../types';
import { CitySearchInput } from './CitySearchInput';
import { calculateHaversineDistance, calculateHeroMapPinCoords, formatPersianNumber, formatDurationPersian } from '../utils/distance';

interface HeroProps {
  cities: City[];
  originCity: City | null;
  destinationCity: City | null;
  onSelectOrigin: (city: City | null) => void;
  onSelectDestination: (city: City | null) => void;
  onCalculateRoute?: () => void;
  onQuickRoute?: (origin: City, destination: City) => void;
  isLoading?: boolean;
  validationError?: string | null;
}

export const Hero: React.FC<HeroProps> = ({
  cities,
  originCity,
  destinationCity,
  onSelectOrigin,
  onSelectDestination,
  onQuickRoute,
}) => {
  const [isRotated, setIsRotated] = useState(false);

  const handleSwap = () => {
    setIsRotated((prev) => !prev);
    const temp = originCity;
    onSelectOrigin(destinationCity);
    onSelectDestination(temp);
  };

  // Live preview calculation when both cities are selected
  let liveAerialKm: number | null = null;
  let liveRoadDurationMinutes: number | null = null;
  if (originCity && destinationCity && originCity.id !== destinationCity.id) {
    liveAerialKm = calculateHaversineDistance(
      originCity.lat,
      originCity.lng,
      destinationCity.lat,
      destinationCity.lng
    );
    // Estimated road distance (aerial * 1.3) at average 80 km/h
    const approxRoadKm = liveAerialKm * 1.3;
    liveRoadDurationMinutes = Math.round((approxRoadKm / 80) * 60);
  }

  // Live pin coordinates projected onto Hero map image
  const originPin = originCity ? calculateHeroMapPinCoords(originCity.lat, originCity.lng) : null;
  const destPin = destinationCity ? calculateHeroMapPinCoords(destinationCity.lat, destinationCity.lng) : null;

  // Compute smooth quadratic bezier curve between origin and destination
  let controlPoint = { x: 50, y: 50 };
  if (originPin && destPin) {
    const mx = (originPin.x + destPin.x) / 2;
    const my = (originPin.y + destPin.y) / 2;
    const dx = destPin.x - originPin.x;
    const dy = destPin.y - originPin.y;
    controlPoint = {
      x: Number((mx - dy * 0.16).toFixed(2)),
      y: Number((my + dx * 0.16).toFixed(2)),
    };
  }

  // Popular routes with icons
  const popularRoutes = [
    { from: 'tehran', to: 'isfahan', label: 'تهران به اصفهان', icon: Sparkles },
    { from: 'tehran', to: 'shiraz', label: 'تهران به شیراز', icon: Compass },
    { from: 'tehran', to: 'mashhad', label: 'تهران به مشهد', icon: Navigation },
    { from: 'tabriz', to: 'rasht', label: 'تبریز به رشت', icon: MapPin },
  ];

  const handleQuickRouteClick = (fromId: string, toId: string) => {
    const c1 = cities.find((c) => c.id === fromId);
    const c2 = cities.find((c) => c.id === toId);
    if (c1 && c2) {
      if (onQuickRoute) {
        onQuickRoute(c1, c2);
      } else {
        onSelectOrigin(c1);
        onSelectDestination(c2);
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden pt-4 pb-8 lg:py-10">
      
      {/* Soft Ambient Color Glows (Hero only) */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#1FA3A3]/15 via-[#1FA3A3]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-[#F26A51]/15 via-[#F26A51]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Mobile Image: Shown on screens < 1024px, 24px border-radius */}
          <div className="lg:hidden w-full flex justify-center -mb-2">
            <div className="relative w-full max-w-md h-[210px] overflow-hidden rounded-[24px] shadow-lg border border-white/80 bg-stone-100">
              <img
                src="/images/hero.png"
                alt="نقشه سه‌بعدی ایران"
                loading="eager"
                // @ts-expect-error fetchpriority attribute
                fetchpriority="high"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column (in RTL): Text & Search Form (at least 50% width on desktop) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 z-20">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 text-[#0D7A7A] text-xs font-bold border border-[#1FA3A3]/25 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#1FA3A3] animate-pingSlow"></span>
              ایران، به وسعت یک ماجراجویی
            </div>

            {/* Main Headline: Line 1 navy, Line 2 coral with hand-drawn curved underline */}
            <h1 className="text-[clamp(2.2rem,4vw,3.6rem)] font-black text-[#132238] leading-[1.3] tracking-tight">
              محاسبه دقیق مسافت
              <br />
              و{' '}
              <span className="relative inline-block text-[#F26A51]">
                هزینه سوخت
                {/* Coral Curved Underline SVG */}
                <svg
                  className="absolute -bottom-2.5 right-0 w-full h-3.5 text-[#F26A51] pointer-events-none overflow-visible"
                  viewBox="0 0 140 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 13C40 4 100 3 137 11C108 7 48 8 12 14"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Concise Subtitle */}
            <p className="text-sm sm:text-base text-stone-600 max-w-lg leading-relaxed font-normal">
              فاصله، زمان و هزینه سفر بین شهرهای ایران را در یک نگاه ببین.
            </p>

            {/* ===================== Search Form (3 parts only, auto-calculating) ===================== */}
            <div
              id="route-calculator"
              className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl shadow-stone-300/60 border border-stone-200/80 transition-all duration-300 relative z-30"
            >
              {/* Grid: [Origin] [Swap Button] [Destination] */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 w-full">
                
                {/* Origin Field */}
                <div className="min-w-0 w-full">
                  <CitySearchInput
                    label="مبدأ"
                    placeholder="انتخاب مبدأ..."
                    selectedCity={originCity}
                    onSelectCity={onSelectOrigin}
                    cities={cities}
                    iconColor="text-[#10B981]"
                    variant="embedded"
                  />
                </div>

                {/* Circular Swap Button */}
                <div className="flex-shrink-0 pt-4 -mx-1 z-10 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="جابه‌جایی مبدأ و مقصد"
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 shadow-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer ${
                      isRotated ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1FA3A3]" />
                  </button>
                </div>

                {/* Destination Field */}
                <div className="min-w-0 w-full">
                  <CitySearchInput
                    label="مقصد"
                    placeholder="انتخاب مقصد..."
                    selectedCity={destinationCity}
                    onSelectCity={onSelectDestination}
                    cities={cities}
                    iconColor="text-[#F26A51]"
                    variant="embedded"
                  />
                </div>

              </div>

              {/* Info Line Under Form */}
              {originCity && destinationCity && originCity.id !== destinationCity.id && liveAerialKm !== null && liveRoadDurationMinutes !== null ? (
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 animate-fadeIn px-1 gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-stone-700 font-medium truncate">
                    <span className="w-2 h-2 rounded-full bg-[#1FA3A3] flex-shrink-0"></span>
                    <span className="font-bold text-[#132238] whitespace-nowrap text-[11px] sm:text-xs">
                      ≈ {formatPersianNumber(liveAerialKm)} کیلومتر هوایی
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="flex items-center gap-1 font-bold text-[#F26A51] whitespace-nowrap text-[11px] sm:text-xs">
                      <Car className="w-3.5 h-3.5 inline text-[#F26A51] flex-shrink-0" />
                      حدود {formatDurationPersian(liveRoadDurationMinutes)} با ماشین
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal hidden sm:inline">
                      (تخمین)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('route-result-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 text-[#1FA3A3] hover:text-[#178585] font-bold text-xs hover:underline flex-shrink-0 cursor-pointer transition-colors mr-1 sm:mr-2"
                  >
                    <span>مشاهده جزئیات</span>
                    <span className="text-sm leading-none">↓</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3.5 pt-3 border-t border-stone-100 text-center sm:text-right px-1">
                  <span className="text-xs text-stone-400 font-normal">
                    مبدأ و مقصد را انتخاب کنید
                  </span>
                </div>
              )}
            </div>

            {/* Popular Routes */}
            <div className="pt-1">
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="font-bold text-stone-700">مسیرهای پرطرفدار:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {popularRoutes.map((r) => {
                  const RouteIcon = r.icon;
                  return (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => handleQuickRouteClick(r.from, r.to)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/85 hover:bg-white text-stone-700 hover:text-[#1FA3A3] text-xs font-semibold rounded-xl border border-stone-200/90 shadow-sm hover:shadow hover:border-[#1FA3A3]/40 transition-all duration-200 group active:scale-95 cursor-pointer"
                    >
                      <RouteIcon className="w-3.5 h-3.5 text-[#1FA3A3] group-hover:scale-110 transition-transform" />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Left Column (in RTL): Hero Visual on Desktop (50% width) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 justify-center items-center relative">
            
            {/* Glowing Soft Backdrop */}
            <div className="absolute inset-0 max-w-lg mx-auto bg-gradient-to-tr from-[#1FA3A3]/20 via-[#F6EFE4]/30 to-[#F26A51]/20 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Outer Wrapper Hosting Floating Cards so they are NOT clipped */}
            <div className="relative w-full max-w-2xl select-none">
              
              {/* Clipped Map Container: rounded 32px with overflow-hidden */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-stone-400/35 border border-white/60 bg-stone-100 animate-floatSlow">
                
                <img
                  src="/images/hero.png"
                  alt="نقشه سه‌بعدی تعاملی ایران"
                  loading="eager"
                  // @ts-expect-error fetchpriority attribute
                  fetchpriority="high"
                  className="w-full h-auto object-cover block pointer-events-none"
                />

                {/* Animated Curved SVG Route connecting Live Origin and Destination */}
                {originCity && destinationCity && originPin && destPin && originCity.id !== destinationCity.id && (
                  <svg
                    key={`route-${originCity.id}-${destinationCity.id}`}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={`M ${originPin.x} ${originPin.y} Q ${controlPoint.x} ${controlPoint.y}, ${destPin.x} ${destPin.y}`}
                      fill="none"
                      stroke="#F26A51"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      className="animate-drawCurve drop-shadow-md"
                    />
                  </svg>
                )}

                {/* Live Origin Pin (Green) */}
                {originCity && originPin && (
                  <div
                    className="absolute z-20 group cursor-default transition-all duration-500 ease-out"
                    style={{
                      top: `${originPin.y}%`,
                      left: `${originPin.x}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`${originCity.name} (مبدأ)`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-6 h-6 rounded-full bg-[#10B981] animate-pingSlow opacity-75"></span>
                      <div className="relative w-4 h-4 rounded-full bg-[#10B981] border-2 border-white shadow-md flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </div>
                    </div>
                    {/* City Name Label */}
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#132238]/90 text-white text-[10px] font-bold shadow-md whitespace-nowrap pointer-events-none">
                      {originCity.name}
                    </span>
                  </div>
                )}

                {/* Live Destination Pin (Coral) */}
                {destinationCity && destPin && (
                  <div
                    className="absolute z-20 group cursor-default transition-all duration-500 ease-out"
                    style={{
                      top: `${destPin.y}%`,
                      left: `${destPin.x}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`${destinationCity.name} (مقصد)`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-6 h-6 rounded-full bg-[#F26A51] animate-pingSlow opacity-75"></span>
                      <div className="relative w-4 h-4 rounded-full bg-[#F26A51] border-2 border-white shadow-md flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </div>
                    </div>
                    {/* City Name Label */}
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#F26A51] text-white text-[10px] font-bold shadow-md whitespace-nowrap pointer-events-none">
                      {destinationCity.name}
                    </span>
                  </div>
                )}

              </div>

              {/* Floating Card 1: ۳۱ استان (OUTSIDE clipped container) */}
              <div className="absolute -top-4 -right-4 backdrop-blur-md bg-white/85 border border-white/80 shadow-xl px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-[#132238] animate-floatSlow z-30 hover:scale-105 transition-transform duration-300">
                <div className="w-7 h-7 rounded-xl bg-teal-100/90 text-[#0D7A7A] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="block text-[#132238]">۳۱ استان</span>
                  <span className="text-[10px] text-stone-500 font-normal">پوشش سراسری</span>
                </div>
              </div>

              {/* Floating Card 2: +۵۰ شهر (OUTSIDE clipped container) */}
              <div className="absolute top-[60%] -right-6 backdrop-blur-md bg-white/85 border border-white/80 shadow-xl px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-[#132238] animate-floatSlow-delayed-1 z-30 hover:scale-105 transition-transform duration-300">
                <div className="w-7 h-7 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="block text-[#132238]">+۵۰ شهر</span>
                  <span className="text-[10px] text-stone-500 font-normal">جاذبه‌ها و سوغات</span>
                </div>
              </div>

              {/* Floating Card 3: ۴ روش سفر (OUTSIDE clipped container) */}
              <div className="absolute -bottom-4 left-6 backdrop-blur-md bg-white/85 border border-white/80 shadow-xl px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-[#132238] animate-floatSlow-delayed-2 z-30 hover:scale-105 transition-transform duration-300">
                <div className="w-7 h-7 rounded-xl bg-orange-100/90 text-[#F26A51] flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="block text-[#132238]">۴ روش سفر</span>
                  <span className="text-[10px] text-stone-500 font-normal">ماشین، قطار، پرواز...</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Bottom Scroll Down Arrow */}
      <div className="flex justify-center pt-4 pb-1">
        <a
          href="#route-calculator"
          className="inline-flex flex-col items-center gap-0.5 text-stone-400 hover:text-[#1FA3A3] text-[11px] font-medium transition animate-bounce-short cursor-pointer group"
          aria-label="اسکرول به بخش پایین"
        >
          <span>مشاهده و محاسبه</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>

    </section>
  );
};
