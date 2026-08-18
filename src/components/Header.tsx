import React from 'react';
import { User } from '../types';
import PancaranLogo from './PancaranLogo';
import { BellRing, Globe, Shield, LogOut, LogIn } from 'lucide-react';

interface HeaderProps {
  user?: User | null;
  onLoginClick?: () => void;
  onLogout: () => void;
  onChangeRole?: (role: 'INTERNAL' | 'EXTERNAL') => void;
}

export default function Header({ user, onLoginClick, onLogout, onChangeRole }: HeaderProps) {
  const isInternal = user?.role === 'INTERNAL';

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 w-full shrink-0 shadow-xs relative">
      {/* Left side: Logo */}
      <PancaranLogo size={42} showText={true} />

      {/* Right side: Actions & Profile */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {user && user.isInternalEmployee && (
          <div className="flex items-center h-[72px]" title="Mode Pratinjau Role (Khusus Tim Internal)">
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

        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60">
          <button className="px-3 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-sm transition-all">ID</button>
          <button className="px-3 py-1 text-xs font-bold rounded-md text-slate-500 hover:text-slate-800 transition-all">EN</button>
        </div>

        <button className="relative text-amber-500 hover:text-amber-600 transition-colors mx-1">
          <BellRing className="w-[24px] h-[24px] fill-amber-500/20 stroke-2" />
        </button>

        {user ? (
          <>
            <div className="flex items-center space-x-3 pl-3 sm:pl-4 border-l border-slate-200">
              <div className="flex flex-col items-end justify-center h-full">
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className="text-sm font-bold text-slate-800 hidden sm:inline">{user.name}</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
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
  );
}
