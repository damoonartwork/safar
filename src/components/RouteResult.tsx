import React, { useState } from 'react';
import { RouteData } from '../types';
import { IranMap } from './IranMap';
import { toPersianDigits, formatPersianNumber, formatDurationPersian } from '../utils/distance';
import { Share2, Check, Car, Compass, Clock, MapPin } from 'lucide-react';

interface RouteResultProps {
  routeData: RouteData;
  onSelectOrigin?: (city: RouteData['origin']) => void;
  onSelectDestination?: (city: RouteData['destination']) => void;
}

export const RouteResult: React.FC<RouteResultProps> = ({
  routeData,
  onSelectOrigin,
  onSelectDestination,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('from', routeData.origin.id);
      url.searchParams.set('to', routeData.destination.id);
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="route-result-section" className="pt-1 pb-8 sm:pt-2 sm:pb-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Route Header & Copy Link */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-stone-200/80 mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1FA3A3] mb-1">
                <span className="w-2 h-2 rounded-full bg-[#1FA3A3]"></span>
                مسیر انتخابی
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#132238] flex items-center gap-3">
                <span>{routeData.origin.name}</span>
                <span className="text-stone-300 font-light text-2xl">←</span>
                <span>{routeData.destination.name}</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition duration-200 self-start md:self-auto ${
                copied
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                  : 'bg-stone-50 hover:bg-stone-100 text-[#132238] border-stone-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>لینک مسیر کپی شد!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#1FA3A3]" />
                  <span>کپی لینک این مسیر</span>
                </>
              )}
            </button>
          </div>

          {/* Three Large Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            
            {/* Road Distance */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200/70 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#1FA3A3]" />
                  مسافت زمینی
                </span>
                {routeData.isApproximateRoad && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                    تقریبی
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#132238]">
                  {formatPersianNumber(routeData.roadDistanceKm)}
                </span>
                <span className="text-sm font-bold text-stone-500">کیلومتر</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                {routeData.isApproximateRoad
                  ? 'بر مبنای ضریب مستقیم جاده‌ای'
                  : 'مسیر واقعی ثبت شده در شبکه بزرگراهی'}
              </p>
            </div>

            {/* Aerial Distance */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200/70 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#0D7A7A]" />
                  مسافت هوایی
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                  مستقیم
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#0D7A7A]">
                  {formatPersianNumber(routeData.aerialDistanceKm)}
                </span>
                <span className="text-sm font-bold text-stone-500">کیلومتر</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                محاسبه شده با فرمول ژئودزیک هوِرسین
              </p>
            </div>

            {/* Road Duration */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200/70 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F26A51]" />
                  زمان تقریبی سفر
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold border border-orange-200">
                  ماشین
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#132238]">
                  {formatDurationPersian(routeData.roadDurationMinutes)}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-2">
                سرعت استاندارد رانندگی بدون توقف طولانی
              </p>
            </div>

          </div>

          {/* Interactive Route Map */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3 text-xs text-stone-600">
              <span className="font-bold flex items-center gap-1.5 text-stone-800">
                <MapPin className="w-4 h-4 text-[#1FA3A3]" />
                نقشه مسیر جاده‌ای و موقعیت شهرها:
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                  مبدأ ({routeData.origin.name})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F26A51]"></span>
                  مقصد ({routeData.destination.name})
                </span>
              </div>
            </div>

            <IranMap
              cities={[routeData.origin, routeData.destination]}
              originCity={routeData.origin}
              destinationCity={routeData.destination}
              routeCoordinates={routeData.coordinates}
              isApproximateRoute={routeData.isApproximateRoad}
              height="460px"
              onSelectOrigin={onSelectOrigin}
              onSelectDestination={onSelectDestination}
            />
          </div>

        </div>

      </div>
    </section>
  );
};
