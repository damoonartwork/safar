import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { City } from '../types';
import { MapPin, Search, X, Check } from 'lucide-react';

interface CitySearchInputProps {
  label: string;
  placeholder: string;
  selectedCity: City | null;
  onSelectCity: (city: City | null) => void;
  cities: City[];
  iconColor?: string;
  className?: string;
  variant?: 'default' | 'embedded';
}

const POPULAR_CITY_NAMES = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'یزد'];

// Clean province name: strips the word "استان"
const cleanProvinceName = (province: string): string => {
  return province.replace(/^استان\s*/, '').trim();
};

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  label,
  placeholder,
  selectedCity,
  onSelectCity,
  cities,
  iconColor = 'text-[#1FA3A3]',
  className = '',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Check whether to open upward if space below is less than 320px
  const checkPlacement = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 320 && rect.top > 300);
    }
  }, []);

  // Update bottom scroll indicator
  const updateScrollFade = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      setCanScrollDown(scrollHeight - scrollTop - clientHeight > 8);
    }
  }, []);

  // Open handler
  const handleOpen = () => {
    checkPlacement();
    setIsOpen(true);
    setActiveIndex(-1);
  };

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

  // Focus search input on open & recalculate scroll indicator
  useEffect(() => {
    if (isOpen) {
      checkPlacement();
      const focusTimer = setTimeout(() => {
        searchInputRef.current?.focus();
        updateScrollFade();
      }, 50);
      return () => clearTimeout(focusTimer);
    } else {
      setQuery('');
      setActiveIndex(-1);
    }
  }, [isOpen, checkPlacement, updateScrollFade]);

  // City list partitioning: popular vs others
  const isSearching = query.trim().length > 0;
  const cleanQuery = query.trim().toLowerCase();

  const { popularCities, otherCities, filteredCities, visibleList } = useMemo(() => {
    const popular = POPULAR_CITY_NAMES.map((name) =>
      cities.find((c) => c.name === name)
    ).filter((c): c is City => Boolean(c));

    const popIds = new Set(popular.map((c) => c.id));
    const others = cities
      .filter((c) => !popIds.has(c.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'fa'));

    if (isSearching) {
      const filtered = cities.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.province.toLowerCase().includes(cleanQuery)
      );
      return {
        popularCities: [],
        otherCities: [],
        filteredCities: filtered,
        visibleList: filtered,
      };
    }

    return {
      popularCities: popular,
      otherCities: others,
      filteredCities: [],
      visibleList: [...popular, ...others],
    };
  }, [cities, isSearching, cleanQuery]);

  // Update scroll fade when lists change
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(updateScrollFade, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen, visibleList, updateScrollFade]);

  // Scroll active item into view when navigating via keyboard
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>(
        `[data-city-index="${activeIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  // Selection handler
  const handleSelect = (city: City) => {
    onSelectCity(city);
    setIsOpen(false);
    setQuery('');
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < visibleList.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : visibleList.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && visibleList[activeIndex]) {
        handleSelect(visibleList[activeIndex]);
      } else if (visibleList.length > 0) {
        handleSelect(visibleList[0]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Render city name with bold match highlighting
  const renderCityName = (cityName: string, isSelected: boolean) => {
    if (isSelected) {
      return (
        <span className="font-bold text-[#1FA3A3] text-sm truncate">
          {cityName}
        </span>
      );
    }

    const trimmed = query.trim();
    if (!trimmed) {
      return (
        <span className="font-medium text-[#132238] text-sm truncate">
          {cityName}
        </span>
      );
    }

    const idx = cityName.toLowerCase().indexOf(trimmed.toLowerCase());
    if (idx === -1) {
      return (
        <span className="font-medium text-[#132238] text-sm truncate">
          {cityName}
        </span>
      );
    }

    const before = cityName.substring(0, idx);
    const match = cityName.substring(idx, idx + trimmed.length);
    const after = cityName.substring(idx + trimmed.length);

    return (
      <span className="text-sm truncate">
        <span className="font-normal text-stone-600">{before}</span>
        <span className="font-extrabold text-[#132238]">{match}</span>
        <span className="font-normal text-stone-600">{after}</span>
      </span>
    );
  };

  const isEmbedded = variant === 'embedded';

  // Helper to render individual city option
  const renderOption = (city: City, index: number) => {
    const isSelected = selectedCity?.id === city.id;
    const isActive = activeIndex === index;

    return (
      <button
        key={city.id}
        type="button"
        data-city-index={index}
        onClick={() => handleSelect(city)}
        onMouseEnter={() => setActiveIndex(index)}
        style={
          index < 8
            ? {
                animation: 'itemCascadeFade 180ms cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: `${index * 25}ms`,
              }
            : undefined
        }
        className={`w-full h-[52px] px-3.5 flex items-center justify-between text-right rounded-[12px] transition-all duration-150 cursor-pointer select-none ${
          isActive
            ? 'bg-[#F6EFE4] -translate-x-[2px]'
            : 'bg-transparent hover:bg-[#F6EFE4] hover:-translate-x-[2px]'
        }`}
      >
        {/* Right side: 8px small pin dot + city name */}
        <div className="flex items-center gap-2.5 min-w-0 pr-0.5">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
              isSelected ? 'bg-[#1FA3A3]' : 'bg-stone-300'
            }`}
          />
          {renderCityName(city.name, isSelected)}
        </div>

        {/* Left side: small faded province without "استان" + optional checkmark */}
        <div className="flex items-center gap-2 flex-shrink-0 pl-1">
          <span className="text-[11px] text-stone-400 font-normal">
            {cleanProvinceName(city.province)}
          </span>
          {isSelected && (
            <Check className="w-4 h-4 text-[#1FA3A3] flex-shrink-0" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="block text-[11px] font-semibold text-stone-500 mb-1 mr-1">
        {label}
      </label>

      {/* Field Trigger Button */}
      <div
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center justify-between w-full min-h-[52px] px-3.5 py-2.5 transition duration-150 cursor-pointer focus:outline-none ${
          isEmbedded
            ? `bg-stone-50/90 hover:bg-stone-100 rounded-2xl border ${
                isOpen
                  ? 'border-[#1FA3A3] ring-2 ring-[#1FA3A3]/20 bg-white'
                  : 'border-stone-200/80 focus:border-[#1FA3A3]/40'
              }`
            : `bg-stone-50 hover:bg-stone-100/80 border ${
                isOpen
                  ? 'border-[#1FA3A3] ring-2 ring-[#1FA3A3]/20'
                  : 'border-stone-200'
              } rounded-xl`
        }`}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <MapPin className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
          {selectedCity ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-[#132238] text-sm md:text-base">
                {selectedCity.name}
              </span>
              <span className="text-xs text-stone-400 bg-stone-200/60 px-2 py-0.5 rounded-md">
                {cleanProvinceName(selectedCity.province)}
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
              onSelectCity(null);
              setQuery('');
            }}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200/50"
            aria-label="پاک کردن انتخاب"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Menu (z-index: 60, opens upwards if spaceBelow < 320px) */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute right-0 min-w-[280px] w-full bg-white rounded-[20px] shadow-[0_20px_50px_rgba(19,34,56,0.12)] border border-[rgba(19,34,56,0.06)] z-[60] overflow-hidden ${
            openUpward
              ? 'bottom-full mb-2 animate-menuDropdownUp'
              : 'top-full mt-2 animate-menuDropdownDown'
          }`}
        >
          {/* Internal Search Input */}
          <div className="p-2.5 pb-2 border-b border-stone-100/80 bg-white">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="جست‌وجوی شهر یا استان..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full pr-9 pl-8 py-2.5 text-xs sm:text-sm bg-[#FAF6EF] text-[#132238] placeholder-stone-400 rounded-[14px] border-0 focus:outline-none focus:ring-2 focus:ring-[#1FA3A3]/25 transition-all duration-150"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveIndex(0);
                    searchInputRef.current?.focus();
                  }}
                  className="absolute left-2.5 p-1 text-stone-400 hover:text-stone-600 rounded-full"
                  aria-label="پاک کردن جست‌وجو"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List Container: max 5 items visible (~260px), thin scrollbar */}
          <div
            ref={listRef}
            onScroll={updateScrollFade}
            className="max-h-[260px] overflow-y-auto city-dropdown-scroll p-1.5 space-y-1 relative"
          >
            {isSearching ? (
              // Search Results Mode
              filteredCities.length > 0 ? (
                filteredCities.map((city, idx) => renderOption(city, idx))
              ) : (
                <div className="py-8 text-center text-xs text-stone-400 font-medium select-none">
                  شهری پیدا نشد
                </div>
              )
            ) : (
              // Default Grouped Mode: Popular (6) + Other Cities (Alphabetical)
              <>
                {/* Popular Cities Header */}
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 select-none">
                  شهرهای پرطرفدار
                </div>
                {popularCities.map((city, idx) => renderOption(city, idx))}

                {/* Other Cities Header */}
                <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-stone-400 border-t border-stone-100 select-none mt-1">
                  سایر شهرها
                </div>
                {otherCities.map((city, idx) =>
                  renderOption(city, popularCities.length + idx)
                )}
              </>
            )}
          </div>

          {/* Bottom Fade Gradient for Scrollable List */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-white via-white/80 to-transparent rounded-b-[20px] transition-opacity duration-200"
            style={{ opacity: canScrollDown ? 1 : 0 }}
          />
        </div>
      )}
    </div>
  );
};
