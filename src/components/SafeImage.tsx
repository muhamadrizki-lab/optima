import React, { useState } from 'react';
import { Disc, BatteryCharging, Wrench, Laptop, Wind, Package, Layers, Truck } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt?: string;
  className?: string;
  category?: string;
  iconSize?: number;
}

export default function SafeImage({
  src,
  alt = 'Product image',
  className = 'w-full h-full object-cover',
  category = 'GENERAL',
  iconSize = 28,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const getCategoryInfo = () => {
    const cat = (category || '').toUpperCase();
    if (cat.includes('BAN') || cat.includes('TIRE') || cat.includes('WHEEL')) {
      return {
        icon: Disc,
        label: 'Ban & Roda',
        bg: 'from-amber-600/20 to-orange-700/20',
        text: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-800'
      };
    }
    if (cat.includes('AKI') || cat.includes('BATTERY') || cat.includes('BATERAI')) {
      return {
        icon: BatteryCharging,
        label: 'Aki & Elektrikal',
        bg: 'from-emerald-600/20 to-teal-700/20',
        text: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-800'
      };
    }
    if (cat.includes('SPARE') || cat.includes('REM') || cat.includes('FILTER') || cat.includes('MESIN')) {
      return {
        icon: Layers,
        label: 'Spare Part',
        bg: 'from-blue-600/20 to-indigo-700/20',
        text: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800'
      };
    }
    if (cat.includes('JASA') || cat.includes('SERVICE') || cat.includes('SPOORING') || cat.includes('MAINTENANCE')) {
      return {
        icon: Wrench,
        label: 'Jasa & Bengkel',
        bg: 'from-purple-600/20 to-violet-700/20',
        text: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800'
      };
    }
    if (cat.includes('IT') || cat.includes('LAPTOP') || cat.includes('KOMPUTER')) {
      return {
        icon: Laptop,
        label: 'Perangkat IT',
        bg: 'from-sky-600/20 to-blue-700/20',
        text: 'text-sky-600',
        badge: 'bg-sky-100 text-sky-800'
      };
    }
    if (cat.includes('AC') || cat.includes('PENDINGIN')) {
      return {
        icon: Wind,
        label: 'HVAC / AC',
        bg: 'from-cyan-600/20 to-blue-700/20',
        text: 'text-cyan-600',
        badge: 'bg-cyan-100 text-cyan-800'
      };
    }
    return {
      icon: Truck,
      label: 'Logistik & Armada',
      bg: 'from-slate-600/20 to-gray-700/20',
      text: 'text-slate-600',
      badge: 'bg-slate-100 text-slate-800'
    };
  };

  const catInfo = getCategoryInfo();
  const IconComponent = catInfo.icon;

  if (!src || hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br ${catInfo.bg} bg-slate-50 border border-slate-100 select-none relative`}>
        <div className={`p-3 rounded-full bg-white shadow-sm mb-2 ${catInfo.text}`}>
          <IconComponent size={iconSize} />
        </div>
        <span className="text-[11px] font-semibold text-slate-700 text-center line-clamp-1 px-1">
          {alt || catInfo.label}
        </span>
        <span className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${catInfo.badge}`}>
          {catInfo.label}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
          <IconComponent size={iconSize} className="text-slate-400 opacity-60" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        referrerPolicy="no-referrer"
        crossOrigin={src.startsWith('http') ? 'anonymous' : undefined}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
