import React, { useState } from 'react';
import { User } from '../types';
import PancaranLogo from './PancaranLogo';
import CompanyDetailModal from './CompanyDetailModal';
import { BellRing, Globe, Shield, LogOut, LogIn } from 'lucide-react';

interface HeaderProps {
  user?: User | null;
  onLoginClick?: () => void;
  onLogout: () => void;
  onChangeRole?: (role: 'INTERNAL' | 'EXTERNAL') => void;
  lang?: 'ID' | 'EN';
  onLanguageChange?: (lang: 'ID' | 'EN') => void;
}

export default function Header({ user, onLoginClick, onLogout, onChangeRole, lang, onLanguageChange }: HeaderProps) {
  const isInternal = user?.role === 'INTERNAL';
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [currentLang, setCurrentLang] = useState<'ID' | 'EN'>(() => {
    if (lang) return lang;
    try {
      return (localStorage.getItem('optima_lang') as 'ID' | 'EN') || 'ID';
    } catch {
      return 'ID';
    }
  });

  const handleSelectLang = (newLang: 'ID' | 'EN') => {
    setCurrentLang(newLang);
    try {
      localStorage.setItem('optima_lang', newLang);
    } catch (e) {
      console.error(e);
    }
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  return (
    <>
      <header className="h-[76px] bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 w-full shrink-0 shadow-xs relative">
        {/* Left side: Logo */}
        <PancaranLogo size={46} showText={true} />

        {/* Right side: Actions & Profile */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {user && user.isInternalEmployee && (
            <div className="flex items-center h-[76px]" title="Mode Pratinjau Role (Khusus Tim Internal)">
              {/* Globe / External View Toggle */}
              <div 
                onClick={() => onChangeRole?.('EXTERNAL')}
                className="flex flex-col items-center justify-center relative h-full px-3 cursor-pointer group"
                title="Pratinjau Tampilan Vendor (External)"
              >
                <button 
                  title="Vendor / External View"
                  className={`${!isInternal ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}
                >
                  <Globe className="w-[22px] h-[22px]" />
                </button>
                {!isInternal && <div className="absolute bottom-0 w-8 h-[3px] bg-blue-600 rounded-t-md"></div>}
              </div>

              {/* Shield / Internal View Toggle */}
              <div 
                onClick={() => onChangeRole?.('INTERNAL')}
                className="flex flex-col items-center justify-center relative h-full px-3 cursor-pointer group"
                title="Tampilan Internal Super Admin"
              >
                <button 
                  title="Super Admin / Internal View"
                  className={`${isInternal ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}
                >
                  <Shield className="w-[22px] h-[22px]" />
                </button>
                {isInternal && <div className="absolute bottom-0 w-8 h-[3px] bg-blue-600 rounded-t-md"></div>}
              </div>
            </div>
          )}

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60 shadow-inner">
            <button 
              type="button"
              onClick={() => handleSelectLang('ID')}
              title="Bahasa Indonesia"
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 cursor-pointer ${
                currentLang === 'ID' 
                  ? 'bg-blue-600 text-white shadow-xs scale-105' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              ID
            </button>
            <button 
              type="button"
              onClick={() => handleSelectLang('EN')}
              title="English"
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 cursor-pointer ${
                currentLang === 'EN' 
                  ? 'bg-blue-600 text-white shadow-xs scale-105' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              EN
            </button>
          </div>

          <button className="relative text-amber-500 hover:text-amber-600 transition-colors mx-1">
            <BellRing className="w-[24px] h-[24px] fill-amber-500/20 stroke-2" />
          </button>

          {user ? (
            <>
              <div className="flex items-center space-x-3 pl-3 sm:pl-4 border-l border-slate-200">
                <div 
                  onClick={() => setShowCompanyModal(true)}
                  className="flex flex-col items-end justify-center h-full cursor-pointer group hover:opacity-90 transition-all"
                  title="Klik untuk melihat Detail Profil PT / Perusahaan"
                >
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className="text-sm font-bold text-slate-800 hidden sm:inline group-hover:text-blue-600 transition-colors">{user.name}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 hidden sm:inline group-hover:text-blue-600 transition-colors underline decoration-dotted">
                    {user.companyName ? `${user.companyName} • ` : ''}{user.email}
                  </span>
                </div>
              </div>

              <button onClick={onLogout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors ml-1 sm:ml-2">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex items-center space-x-1.5 bg-[#5238FF] hover:bg-[#432AEE] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all ml-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {user && (
        <CompanyDetailModal
          companyName={user.companyName || user.name}
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
          customData={{
            email: user.email,
            phone: user.phone,
            vendorType: user.vendorType
          }}
        />
      )}
    </>
  );
}
