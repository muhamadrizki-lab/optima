import React, { useState } from 'react';

interface PancaranLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: 'dark' | 'white';
}

export default function PancaranLogo({ 
  size = 38, 
  className = '', 
  showText = false,
  textColor = 'dark'
}: PancaranLogoProps) {
  const [imgError, setImgError] = useState(false);
  
  // Official Platinum logo
  const platinumLogoUrl = "https://lh3.googleusercontent.com/d/122sAgfSnTqphroy2r3vNvOfmAuftH_Po";

  return (
    <div className={`flex flex-col justify-center items-start ${className}`}>
      {!imgError ? (
        <img 
          src={platinumLogoUrl} 
          alt="Platinum Pancaran Logo" 
          style={{ height: showText ? '32px' : `${size}px` }}
          className="w-auto max-w-[160px] sm:max-w-[200px] object-contain object-left"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex items-center gap-1 font-black text-slate-800 text-base">
          <span className="text-blue-600">P</span>
          <span>platinum</span>
        </div>
      )}

      {showText && (
        <p className={`text-[10px] sm:text-[11px] font-medium tracking-tight leading-tight mt-1 max-w-[340px] sm:max-w-none ${
          textColor === 'white' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Oriented Procurement, Targeted Integrated Management for Aligned Tender
        </p>
      )}
    </div>
  );
}


