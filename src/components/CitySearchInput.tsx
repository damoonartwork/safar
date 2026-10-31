import React, { useState, useRef, useEffect } from 'react';
import { City } from '../types';
import { MapPin, Search, X, Check } from 'lucide-react';

interface CitySearchInputProps {
  label: string;
  placeholder: string;
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
  cities: City[];
  iconColor?: string;
  className?: string;
}

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  label,
  placeholder,
  selectedCity,
  onSelectCity,
  cities,
  iconColor = 'text-[#1FA3A3]',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCities = cities.filter((c) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="block text-xs font-medium text-stone-500 mb-1.5 mr-1">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(true)}
        className={`flex items-center justify-between w-full min-h-[50px] px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100/80 border ${
          isOpen ? 'border-[#1FA3A3] ring-2 ring-[#1FA3A3]/20' : 'border-stone-200'
        } rounded-xl cursor-pointer transition duration-150`}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <MapPin className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
          {selectedCity ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-[#132238] text-sm md:text-base">
                {selectedCity.name}
              </span>
              <span className="text-xs text-stone-400 bg-stone-200/60 px-2 py-0.5 rounded-md">
                {selectedCity.province}
              </span>
            </div>
          ) : (
            <span className="text-stone-400 text-sm">{placeholder}</span>
          )}
        </div>

        {selectedCity && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectCity(null as unknown as City);
              setQuery('');
            }}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200/50"
            aria-label="پاک کردن انتخاب"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown with search */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 overflow-hidden animate-fadeIn">
          <div className="p-2.5 border-b border-stone-100">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="جست‌وجوی شهر یا استان..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1FA3A3] focus:ring-1 focus:ring-[#1FA3A3]"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1 divide-y divide-stone-50">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-right rounded-lg text-sm transition ${
                      isSelected
                        ? 'bg-[#1FA3A3]/10 text-[#1FA3A3] font-bold'
                        : 'hover:bg-stone-100 text-[#132238]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{city.name}</span>
                      <span className="text-xs text-stone-400 font-normal">
                        ({city.province})
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#1FA3A3]" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-stone-400">
                شهری با این مشخصات پیدا نشد
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
