import React from 'react';
import { Heart, MapPin, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#132238] footer-dot-grid text-white pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1FA3A3] text-white flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block">
                  سفرنامه ایران
                </span>
                <span className="text-xs text-stone-400">
                  ایران، همیشه مقصدی تازه دارد
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              با سفرنامه ایران، مسیرها را بشناسید، فاصله‌ها را دقیق محاسبه کنید و تجربه‌های فراموش‌نشدنی از سفرهای جاده‌ای و طبیعت‌گردی بسازید.
            </p>
          </div>

          {/* Column 1: Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#1FA3A3]" />
              خدمات سفرنامه
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#route-calculator" className="hover:text-white transition">
                  نقشه و مسیریابی ایران
                </a>
              </li>
              <li>
                <a href="#multistop" className="hover:text-white transition">
                  برنامه‌ریز سفر چند مقصدی
                </a>
              </li>
              <li>
                <a href="#fuel-calculator" className="hover:text-white transition">
                  ماشین‌حساب هزینه سوخت
                </a>
              </li>
              <li>
                <a href="#game" className="hover:text-white transition">
                  بازی و سرگرمی جغرافیا
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">
              لینک‌های سریع
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#destinations" className="hover:text-white transition">
                  مقاصد گردشگری برتر
                </a>
              </li>
              <li>
                <a href="#route-calculator" className="hover:text-white transition">
                  محاسبه فاصله هوایی و زمینی
                </a>
              </li>
              <li>
                <a href="#fuel-calculator" className="hover:text-white transition">
                  تخمین مصرف بنزین
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  راهنمای سفر به استان‌ها
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Attribution */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">
              اعتبار و منابع داده
            </h4>
            <div className="space-y-2 text-xs text-stone-400 leading-relaxed">
              <p>نقشه: © OpenStreetMap contributors</p>
              <p>مسیریابی: سامانه متن‌باز OSRM</p>
              <p className="text-amber-400 font-semibold pt-1">
                ⚠️ فاصله‌ها و زمان‌ها تقریبی هستند.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © ۱۴۰۳ سفرنامه ایران — طراحی شده برای گردشگران و علاقه‌مندان به ایران‌گردی.
          </p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>سفر بهتر، زندگی زیباتر</span>
            <Heart className="w-3.5 h-3.5 text-[#F26A51] fill-current" />
          </div>
        </div>

      </div>
    </footer>
  );
};
