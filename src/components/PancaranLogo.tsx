import React, { useState } from 'react';

interface PancaranLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: 'dark' | 'white';
}

export default function PancaranLogo({ 
  size = 40, 
  className = '', 
  showText = false,
  textColor = 'dark'
}: PancaranLogoProps) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = "https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Pancaran Official Logo Emblem */}
      <div 
        style={{ width: size, height: size }}
        className="relative shrink-0 rounded-xl overflow-hidden shadow-sm bg-white p-[1px] border border-slate-200/80 flex items-center justify-center"
      >
        {!imgError ? (
          <img 
            src={logoUrl} 
            alt="Pancaran Logo" 
            className="w-full h-full object-cover rounded-[10px]"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full rounded-[10px] overflow-hidden"
          >
            <defs>
              <linearGradient id="pancaranCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00A8FF" />
                <stop offset="100%" stopColor="#0077CC" />
              </linearGradient>
              <linearGradient id="pancaranNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#pancaranCyan)" />
            <path d="M 45 0 L 100 0 L 100 100 L 52 100 C 52 100 68 75 68 50 C 68 25 45 0 45 0 Z" fill="url(#pancaranNavy)" />
            <path d="M 15 72 C 28 55, 48 35, 70 20 C 85 12, 92 22, 84 35 C 76 48, 55 65, 38 82 C 28 92, 18 95, 15 72 Z" fill="#FFFFFF" />
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
