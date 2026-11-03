import React, { useState } from 'react';
import { Menu, X, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: 'خانه', href: '#' },
    { label: 'محاسبه مسیر', href: '#route-calculator' },
    { label: 'ماشین‌حساب سوخت', href: '#fuel-calculator' },
    { label: 'سفر چندمقصدی', href: '#multistop' },
    { label: 'مقاصد گردشگری', href: '#destinations' },
    { label: 'بازی فاصله', href: '#game' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F6EFE4]/90 dark:bg-[#0F1A24]/90 backdrop-blur-md border-b border-stone-200/60 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Right: Brand & Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#1FA3A3] dark:bg-[#2EC4C1] text-white dark:text-[#0F1A24] flex items-center justify-center shadow-md shadow-[#1FA3A3]/25 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#132238] dark:text-[#F1EADF] transition-colors duration-300">
                سفرنامه ایران
              </span>
              <span className="text-[10px] text-stone-500 dark:text-[#9FB0BF] font-medium -mt-1 hidden sm:inline transition-colors duration-300">
                ایران، همیشه مقصدی تازه دارد
              </span>
            </div>
          </a>

          {/* Middle: Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-stone-700 dark:text-[#9FB0BF]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#1FA3A3] dark:hover:text-[#2EC4C1] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#1FA3A3] dark:after:bg-[#2EC4C1] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Left: Action CTA, Dark Mode Toggle, and Mobile Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button (40px round button with 300ms rotation & fade) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
              title={theme === 'dark' ? 'حالت روز' : 'حالت شب'}
              className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden bg-white/80 dark:bg-[#172634] text-stone-700 dark:text-[#F1EADF] border border-stone-200/80 dark:border-white/10 shadow-sm hover:shadow hover:bg-stone-100 dark:hover:bg-[#1E3142] transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0"
            >
              {/* Sun icon (visible in dark mode) */}
              <Sun
                className={`w-5 h-5 text-amber-400 absolute transition-all duration-300 transform ${
                  theme === 'dark'
                    ? 'rotate-0 scale-100 opacity-100'
                    : '-rotate-90 scale-0 opacity-0 pointer-events-none'
                }`}
              />
              {/* Moon icon (visible in light mode) */}
              <Moon
                className={`w-5 h-5 text-stone-700 absolute transition-all duration-300 transform ${
                  theme === 'light'
                    ? 'rotate-0 scale-100 opacity-100'
                    : 'rotate-90 scale-0 opacity-0 pointer-events-none'
                }`}
              />
            </button>

            {/* Desktop CTA Button */}
            <a
              href="#route-calculator"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#F26A51] hover:bg-[#e0563d] dark:bg-[#FF7A5C] dark:hover:bg-[#f26545] text-white text-sm font-bold rounded-2xl shadow-md shadow-[#F26A51]/25 hover:shadow-lg transition-all duration-200 active:scale-95 coral-cta-glow"
            >
              <span>شروع سفر</span>
              <ArrowLeft className="w-4 h-4" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-stone-700 dark:text-[#F1EADF] hover:text-[#1FA3A3] dark:hover:text-[#2EC4C1] hover:bg-stone-200/50 dark:hover:bg-[#1E3142] rounded-xl transition cursor-pointer"
              aria-label="منوی سایت"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#172634]/95 backdrop-blur-lg border-b border-stone-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-stone-800 dark:text-[#F1EADF] hover:bg-stone-100 dark:hover:bg-[#1E3142] hover:text-[#1FA3A3] dark:hover:text-[#2EC4C1] transition"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#route-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#F26A51] hover:bg-[#e0563d] dark:bg-[#FF7A5C] dark:hover:bg-[#f26545] text-white font-bold rounded-xl text-center shadow-md coral-cta-glow"
            >
              <span>شروع سفر</span>
              <ArrowLeft className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
