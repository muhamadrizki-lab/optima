import React, { useState } from 'react';

interface PancaranLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: 'dark' | 'white';
}

const PANCARAN_LOGO_IMG = 'https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X';
const PANCARAN_LOGO_FALLBACK = 'https://drive.google.com/uc?export=view&id=1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X';

export default function PancaranLogo({ 
  size = 40, 
  className = '', 
  showText = false,
  textColor = 'dark'
}: PancaranLogoProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Pancaran Official Rounded Emblem Icon */}
      <div 
        style={{ width: size, height: size }}
        className="relative shrink-0 rounded-xl overflow-hidden shadow-sm bg-white p-[2px] border border-slate-200/80 flex items-center justify-center"
      >
        {!imgError ? (
          <img 
            src={PANCARAN_LOGO_IMG} 
            alt="Pancaran Group Logo" 
            className="w-full h-full object-contain rounded-[10px]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Try secondary fallback URL if primary fails, else fallback to SVG
              const target = e.currentTarget;
              if (target.src !== PANCARAN_LOGO_FALLBACK) {
                target.src = PANCARAN_LOGO_FALLBACK;
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full rounded-[10px] overflow-hidden"
          >
            <defs>
              <linearGradient id="pancaranCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00A8E8" />
                <stop offset="100%" stopColor="#0077B6" />
              </linearGradient>
              <linearGradient id="pancaranNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0A192F" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#pancaranCyanGrad)" />
            <path 
              d="M 45 0 L 100 0 L 100 100 L 55 100 C 55 100 70 70 70 50 C 70 30 50 15 45 0 Z" 
              fill="url(#pancaranNavyGrad)" 
            />
            <path 
              d="M 12 68 C 28 50, 48 30, 68 18 C 82 10, 92 18, 88 32 C 84 46, 68 58, 52 74 C 42 84, 32 94, 28 98 C 38 88, 52 64, 62 48 C 72 32, 78 26, 70 24 C 62 22, 46 38, 30 58 C 20 70, 14 74, 12 68 Z"
              fill="#FFFFFF"
            />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`text-[19px] sm:text-[21px] font-black tracking-tight leading-none ${
              textColor === 'white' ? 'text-white' : 'text-slate-900'
            }`}>
              OPTIMA
            </span>
            <span className="text-[10px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
              PANCARAN
            </span>
          </div>
          <span className={`text-[9px] sm:text-[10px] font-semibold tracking-tight leading-tight mt-0.5 max-w-[320px] sm:max-w-none line-clamp-1 ${
            textColor === 'white' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Oriented Procurement, Targeted Integrated Management for Aligned Tender
          </span>
        </div>
      )}
    </div>
  );
}
