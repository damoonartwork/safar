import React, { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  type?: 'city' | 'car' | 'bus' | 'train' | 'airplane' | 'hero' | 'trip' | 'pump' | 'landmark';
  title?: string;
  subtitle?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  style,
  type = 'city',
  title,
  subtitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1FA3A3]/10 via-[#F6EFE4] to-[#F26A51]/15 text-[#132238] select-none ${className}`}
        style={{ minHeight: '120px', ...style }}
        role="img"
        aria-label={alt}
      >
        {/* Decorative backdrop shapes */}
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#1FA3A3]/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-[#F26A51]/10 blur-xl pointer-events-none" />

        {type === 'car' && (
          <svg className="w-16 h-16 text-[#F26A51] drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        )}

        {type === 'bus' && (
          <svg className="w-16 h-16 text-[#E5573C] drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6v6" />
            <path d="M15 6v6" />
            <path d="M2 12h19.6" />
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.6-.4-1-1-1H2" />
            <rect width="20" height="14" x="2" y="4" rx="2" />
            <path d="M6 18H4" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
          </svg>
        )}

        {type === 'train' && (
          <svg className="w-16 h-16 text-[#1FA3A3] drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect width="16" height="16" x="4" y="3" rx="2" />
            <path d="M4 11h16" />
            <path d="M12 3v8" />
            <path d="m8 19-2 3" />
            <path d="m16 19 2 3" />
            <circle cx="8" cy="15" r="1" />
            <circle cx="16" cy="15" r="1" />
          </svg>
        )}

        {type === 'airplane' && (
          <svg className="w-16 h-16 text-[#0D7A7A] drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
        )}

        {type === 'pump' && (
          <svg className="w-16 h-16 text-[#1FA3A3] drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 22 1.5-1.5a2 2 0 0 1 2.8 0L9 22" />
            <path d="M4 9h5" />
            <path d="M14 22V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v18" />
            <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
          </svg>
        )}

        {(type === 'city' || type === 'landmark' || type === 'trip' || type === 'hero') && (
          <svg className="w-14 h-14 text-[#1FA3A3] drop-shadow-sm mb-1.5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            <path d="M3 21h18" />
          </svg>
        )}

        {title && <span className="text-base font-bold text-[#132238]">{title}</span>}
        {subtitle && <span className="text-xs text-[#64748B] mt-0.5">{subtitle}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      style={style}
      className={`transition-opacity duration-300 ${/object-(cover|contain)/.test(className) ? '' : 'object-cover'} ${className}`}
    />
  );
};
