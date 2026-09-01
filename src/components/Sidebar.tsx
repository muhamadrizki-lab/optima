import React, { useState } from 'react';
import { User } from '../types';
import PancaranLogo from './PancaranLogo';
import { 
    LayoutDashboard, 
    BookOpen, 
    Users, 
    Store,
    FileText,
    PackagePlus,
    ShoppingBag,
    CheckCircle2,
    Shield,
    FileSpreadsheet,
    MessageSquare,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface SidebarProps {
  user: User;
  currentView: string;
  onChangeView: (view: string) => void;
  onOpenChat?: () => void;
}

export default function Sidebar({ user, currentView, onChangeView, onOpenChat }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const internalNav = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard, badge: 'Overview' },
    { name: 'Management Pengadaan', id: 'catalog', icon: BookOpen },
    { name: 'Katalog Vendor & Supplier', id: 'catalog-vendor', icon: ShoppingBag },
    { name: 'Laporan & Ekspor', id: 'reports', icon: FileSpreadsheet, badge: 'Excel' },
    { name: 'Management Akses & Akun', id: 'access', icon: Users },
  ];

  const externalNav = [
    { name: 'Lihat Pengadaan', id: 'catalog-ext', icon: BookOpen },
    { name: 'Posting & Stok Katalog Saya', id: 'my-vendor-catalog', icon: PackagePlus, badge: 'Stok' },
    { name: 'Bidding Saya', id: 'bidding', icon: FileText, badge: 'Riwayat' },
  ];

  const isInternal = user.role === 'INTERNAL' && Boolean(user.isInternalEmployee);
  const navItems = isInternal ? internalNav : externalNav;

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72 lg:w-80'} bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 shrink-0 select-none relative transition-all duration-300 ease-in-out`}>
      
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-6 z-50 bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-full p-1.5 shadow-md cursor-pointer hover:bg-slate-700 transition-colors"
        title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Nav Menu Items */}
      <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
        <div className={`px-3 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider ${isCollapsed ? 'text-center text-[10px] px-0' : ''}`}>
          {isCollapsed ? (user.role === 'INTERNAL' ? 'TIM' : 'VND') : (user.role === 'INTERNAL' ? 'Menu Tim Internal' : 'Vendor Portal Menu')}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50 ' + (isCollapsed ? '' : 'translate-x-0.5')
                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <div className={`flex items-center min-w-0 ${isCollapsed ? '' : 'pr-2'}`}>
                <Icon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="text-left leading-tight whitespace-normal">{item.name}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Direct Chat Action Button in Sidebar */}
        <div className="pt-3">
          <button
            onClick={onOpenChat}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 text-blue-200 hover:text-white border border-blue-500/30 transition-all cursor-pointer group shadow-xs`}
            title={isCollapsed ? "Chat Vendor Rekanan" : undefined}
          >
            <div className={`flex items-center min-w-0 ${isCollapsed ? '' : 'pr-2'}`}>
              <MessageSquare className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform shrink-0 relative`}>
              </MessageSquare>
              {!isCollapsed && <span className="text-left leading-tight">Chat Vendor Rekanan</span>}
            </div>
            {!isCollapsed && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
            {isCollapsed && (
              <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className={`p-3.5 border-t border-slate-800/80 bg-slate-950/50 text-slate-400 text-center ${isCollapsed ? 'text-[8px] p-2 px-1' : 'text-[11px]'}`}>
        {!isCollapsed ? (
          <>
            <div className="font-semibold text-slate-300">Pancaran Procurement System</div>
            <div className="text-[10px] text-slate-500 mt-0.5">OPTIMA v2.6 Enterprise</div>
          </>
        ) : (
          <div className="font-bold text-slate-300 tracking-tighter">OPTIMA</div>
        )}
      </div>
    </aside>
  );
}

