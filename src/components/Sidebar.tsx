import React from 'react';
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
    Shield
} from 'lucide-react';

interface SidebarProps {
  user: User;
  currentView: string;
  onChangeView: (view: string) => void;
}

export default function Sidebar({ user, currentView, onChangeView }: SidebarProps) {
  const internalNav = [
    { name: 'Dashboard Pengadaan', id: 'dashboard', icon: LayoutDashboard, badge: 'Overview' },
    { name: 'Management Tender & Kebutuhan', id: 'catalog', icon: BookOpen },
    { name: 'Katalog Vendor & Supplier', id: 'catalog-vendor', icon: ShoppingBag },
    { name: 'Management Akses & Akun', id: 'access', icon: Users },
  ];

  const externalNav = [
    { name: 'Katalog Kebutuhan (Tender)', id: 'catalog-ext', icon: BookOpen },
    { name: 'Posting & Stok Katalog Saya', id: 'my-vendor-catalog', icon: PackagePlus, badge: 'Stok' },
    { name: 'Bidding Saya', id: 'bidding', icon: FileText, badge: 'Riwayat' },
  ];

  const isInternal = user.role === 'INTERNAL' && Boolean(user.isInternalEmployee);
  const navItems = isInternal ? internalNav : externalNav;

  return (
    <aside className="w-72 lg:w-80 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 shrink-0 select-none">
      {/* Top Sidebar Header / Vendor Info Card */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <PancaranLogo size={36} />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white tracking-wide truncate">
              {user.companyName || user.name}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                user.role === 'INTERNAL' 
                  ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' 
                  : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
              }`}>
                {user.role === 'INTERNAL' ? (
                  <>
                    <Shield className="w-2.5 h-2.5" /> Super Admin
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified Vendor
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {user.role === 'INTERNAL' ? 'Menu Tim Internal' : 'Vendor Portal Menu'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50 translate-x-0.5' 
                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
              }`}
            >
              <div className="flex items-center min-w-0 pr-2">
                <Icon className={`mr-3 h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-left leading-tight whitespace-normal">{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/50 text-[11px] text-slate-400 text-center">
        <div className="font-semibold text-slate-300">Pancaran Procurement System</div>
        <div className="text-[10px] text-slate-500 mt-0.5">OPTIMA v2.6 Enterprise</div>
      </div>
    </aside>
  );
}

