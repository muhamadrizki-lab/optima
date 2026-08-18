import React, { useState, useEffect } from 'react';
import { 
  Package, 
  FileText, 
  Users, 
  Globe, 
  Layers, 
  Disc, 
  Zap, 
  Wrench, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  CheckCircle2,
  Info,
  ExternalLink,
  Boxes,
  X
} from 'lucide-react';
import { VendorCatalogItem } from '../types';
import { INITIAL_VENDOR_CATALOG } from '../data/vendorCatalogData';
import { INITIAL_BIDS_DATA } from '../data/biddingData';

interface InternalDashboardProps {
  vendorCatalogItems?: VendorCatalogItem[];
  onNavigate?: (view: string) => void;
}

export default function InternalDashboard({ 
  vendorCatalogItems = INITIAL_VENDOR_CATALOG,
  onNavigate 
}: InternalDashboardProps) {
  const [selectedStat, setSelectedStat] = useState<any>(null);
  
  const [totalKebutuhan, setTotalKebutuhan] = useState(5);
  const [totalBids, setTotalBids] = useState(INITIAL_BIDS_DATA.length);
  const [totalInternalUsers, setTotalInternalUsers] = useState(2);
  const [totalExternalUsers, setTotalExternalUsers] = useState(2);
  const [totalSuppliers, setTotalSuppliers] = useState(1);
  const [totalVendorJasa, setTotalVendorJasa] = useState(1);
  const [externalUsersList, setExternalUsersList] = useState<any[]>([]);

  useEffect(() => {
    // Load Kebutuhan Assets
    try {
      const savedCatalog = localStorage.getItem('optima_catalog_kebutuhan');
      if (savedCatalog) {
        const parsed = JSON.parse(savedCatalog);
        if (Array.isArray(parsed)) setTotalKebutuhan(parsed.length);
      }
    } catch (e) {}

    // Load Bids
    try {
      const savedBids = localStorage.getItem('optima_bids_history');
      if (savedBids) {
        const parsed = JSON.parse(savedBids);
        if (Array.isArray(parsed)) setTotalBids(parsed.length);
      }
    } catch (e) {}

    // Load Users
    try {
      const savedUsers = localStorage.getItem('optima_access_users');
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed)) {
          setTotalInternalUsers(parsed.filter((u: any) => u.role === 'INTERNAL').length);
          const externals = parsed.filter((u: any) => u.role === 'EXTERNAL');
          setTotalExternalUsers(externals.length);
          setExternalUsersList(externals);
          setTotalSuppliers(externals.filter((u: any) => u.vendorType === 'SUPPLIER').length);
          setTotalVendorJasa(externals.filter((u: any) => u.vendorType === 'VENDOR_JASA').length);
        }
      } else {
        // Initial defaults based on ManagementAkses state
        const initialExternals = [
          { id: '3', name: 'PT Surya Gemilang', email: 'vendor@suryagemilang.com', role: 'EXTERNAL', vendorType: 'SUPPLIER', status: 'ACTIVE' },
          { id: '4', name: 'CV Makmur Jaya', email: 'info@makmurjaya.co.id', role: 'EXTERNAL', vendorType: 'VENDOR_JASA', status: 'PENDING' },
        ];
        setExternalUsersList(initialExternals);
      }
    } catch (e) {}
  }, []);

  // Hitung jumlah jenis barang external (SKU / Ragam item unik, bukan total qty unit)
  const items = vendorCatalogItems && vendorCatalogItems.length > 0 ? vendorCatalogItems : INITIAL_VENDOR_CATALOG;
  const totalJenisBarangExternal = items.length;

  // Breakdown jumlah jenis per kategori
  const jenisBan = items.filter(i => i.category === 'BAN').length;
  const jenisAki = items.filter(i => i.category === 'AKI').length;
  const jenisSparePart = items.filter(i => i.category === 'SPARE_PART').length;
  const jenisJasa = items.filter(i => i.category === 'JASA').length;
  const jenisLainnya = items.filter(i => i.category !== 'BAN' && i.category !== 'AKI' && i.category !== 'SPARE_PART' && i.category !== 'JASA').length;

  // Rekanan & Brand unik
  const uniqueVendors = new Set(items.map(i => i.vendorName)).size;
  const uniqueBrands = new Set(items.map(i => i.brand).filter(Boolean)).size;

  const stats = [
    { 
      name: 'Total Kebutuhan Assets', 
      value: totalKebutuhan.toString(), 
      detail: 'Pengadaan aktif internal',
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-100',
      actionView: 'catalog'
    },
    { 
      name: 'Total Penawaran', 
      value: totalBids.toString(), 
      detail: 'Quotation bidding masuk',
      icon: FileText, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      actionView: 'catalog'
    },
    { 
      name: 'Jenis Barang External', 
      value: `${totalJenisBarangExternal} Jenis`, 
      detail: 'Ragam SKU katalog (Bukan Qty)',
      highlight: true,
      icon: Layers, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      border: 'border-indigo-200 ring-2 ring-indigo-500/10',
      actionView: 'catalog-vendor'
    },
    { 
      name: 'Total Akses Internal', 
      value: totalInternalUsers.toString(), 
      detail: 'User karyawan terdaftar',
      icon: Users, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      border: 'border-amber-100',
      actionView: 'access'
    },
    { 
      name: 'Total Akses External', 
      value: totalExternalUsers.toString(), 
      detail: 'Rekanan & vendor aktif',
      icon: Globe, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50', 
      border: 'border-rose-100',
      actionView: 'access'
    },
  ];

  const categoryBreakdown = [
    { label: 'Spare Part & Suku Cadang', count: jenisSparePart, icon: Package, color: 'bg-blue-600', textColor: 'text-blue-700', bgSoft: 'bg-blue-50' },
    { label: 'Ban Truk & Kendaraan', count: jenisBan, icon: Disc, color: 'bg-amber-600', textColor: 'text-amber-700', bgSoft: 'bg-amber-50' },
    { label: 'Aki & Kelistrikan Armada', count: jenisAki, icon: Zap, color: 'bg-emerald-600', textColor: 'text-emerald-700', bgSoft: 'bg-emerald-50' },
    { label: 'Jasa & Perawatan Armada', count: jenisJasa, icon: Wrench, color: 'bg-purple-600', textColor: 'text-purple-700', bgSoft: 'bg-purple-50' },
    ...(jenisLainnya > 0 ? [{ label: 'IT & Kebutuhan Lainnya', count: jenisLainnya, icon: Boxes, color: 'bg-slate-600', textColor: 'text-slate-700', bgSoft: 'bg-slate-50' }] : []),
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Procurement & Catalog Control Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Pengadaan</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Ringkasan visibilitas pengadaan internal, penawaran bidding, dan ragam jenis barang di katalog rekanan external.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('catalog-vendor')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
          >
            <Layers className="w-4 h-4" />
            Buka Katalog Vendor ({totalJenisBarangExternal} Jenis)
          </button>
        )}
      </div>

      {/* 5 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              onClick={() => setSelectedStat(stat)}
              className={`bg-white rounded-2xl shadow-sm border ${stat.border} p-5 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer hover:border-slate-300`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 line-clamp-1">{stat.name}</span>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">{stat.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stat Detail Modal Popup */}
      {selectedStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-scaleUp">
            <div className={`p-6 ${selectedStat.bg} border-b ${selectedStat.border} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl bg-white shadow-sm ${selectedStat.color}`}>
                  <selectedStat.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Detail Metrik Dashboard</span>
                  <h3 className="text-xl font-black text-slate-900">{selectedStat.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStat(null)}
                className="p-2 bg-white/80 hover:bg-white text-slate-600 rounded-full transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Total Nilai / Kuantitas Terdata</p>
                  <p className="text-3xl font-black text-slate-900 mt-0.5">{selectedStat.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold">Keterangan Status</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{selectedStat.detail}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Rincian Informasi & Data Terkait:</h4>
                <div className="space-y-2.5">
                  {selectedStat.name === 'Total Kebutuhan Assets' && (
                    <>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Pembaruan Perangkat IT 2024</p>
                          <p className="text-[11px] text-slate-500">REQ-001 • Pengadaan 50 Laptop & Aksesoris</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">DIBUKA</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Pengadaan Ban Truk Hino & Fuso</p>
                          <p className="text-[11px] text-slate-500">REQ-002 • Radial Tubeless 11.00R20</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">DIBUKA</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Maintenance & Oli Mesin Shell Rimula</p>
                          <p className="text-[11px] text-slate-500">REQ-003 • Pelumas Armada Long-Haul</p>
                        </div>
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-lg">SEGERA</span>
                      </div>
                    </>
                  )}

                  {selectedStat.name === 'Total Penawaran' && (
                    <>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">PT Surya Gemilang (Supplier)</p>
                          <p className="text-[11px] text-slate-500">Penawaran Paket IT: Rp 680.000.000</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg">Terkirim</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">PT Mandiri Ban Pratama</p>
                          <p className="text-[11px] text-slate-500">Penawaran Ban Truk: Rp 215.000.000</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg">Terkirim</span>
                      </div>
                    </>
                  )}

                  {selectedStat.name === 'Jenis Barang External' && (
                    <div className="space-y-2">
                      {items.map((item, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.title}</p>
                            <p className="text-[11px] text-slate-500">{item.brand} • {item.vendorName}</p>
                          </div>
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-md">
                            {item.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedStat.name === 'Total Akses Internal' && (
                    <>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Muhamad Rizki Alfian</p>
                          <p className="text-[11px] text-slate-500">muhamad.rizki@pancaran-logistic.id • Admin Internal</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">AKTIF</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Budi Santoso</p>
                          <p className="text-[11px] text-slate-500">budi.s@pancaran-logistic.id • Procurement Manager</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">AKTIF</span>
                      </div>
                    </>
                  )}

                  {(selectedStat.name === 'Total Akses External' || selectedStat.name === 'Total Supplier' || selectedStat.name === 'Total Vendor') && (
                    <>
                      {externalUsersList
                        .filter(u => 
                          selectedStat.name === 'Total Akses External' ? true :
                          selectedStat.name === 'Total Supplier' ? u.vendorType === 'SUPPLIER' :
                          u.vendorType === 'VENDOR_JASA'
                        )
                        .map(u => (
                          <div key={u.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-800">{u.name}</p>
                              <p className="text-[11px] text-slate-500">{u.email} • {u.vendorType === 'SUPPLIER' ? 'Supplier' : 'Vendor Jasa'}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              {u.status === 'ACTIVE' ? 'VERIFIED' : 'PENDING'}
                            </span>
                          </div>
                      ))}
                    </>
                  )}
                  
                  <div className="pt-3 pb-1 text-center">
                    <p className="text-[11px] font-medium text-slate-400 italic">
                      Scroll ke bawah untuk melihat lebih banyak data...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedStat(null)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>
              {selectedStat.actionView && onNavigate && (
                <button
                  onClick={() => {
                    const view = selectedStat.actionView;
                    setSelectedStat(null);
                    onNavigate(view);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <span>Buka Halaman Terkait</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Jenis Barang Breakdown & Supplier/Vendor Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ragam Jenis Barang External di Katalog (Bukan Qty) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Ragam Jenis Barang External di Katalog</h2>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
                    Non-Qty (SKU Count)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jumlah variasi jenis produk/jasa yang terdaftar di katalog external rekanan Pancaran Group.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-indigo-700">{totalJenisBarangExternal}</span>
                <span className="text-xs text-slate-500 font-semibold ml-1">Jenis</span>
              </div>
            </div>

            {/* Note box clarifying non-qty calculation */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-5 flex items-start gap-2.5 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Penjelasan Parameter:</span> Angka di atas merepresentasikan <strong>{totalJenisBarangExternal} ragam/jenis produk unik (SKU)</strong> yang disediakan oleh vendor, <em>bukan total kuantitas unit fisik stok</em> yang ada di gudang.
              </div>
            </div>

            {/* Category breakdown bars */}
            <div className="space-y-3.5">
              {categoryBreakdown.map((cat, idx) => {
                const Icon = cat.icon;
                const percentage = totalJenisBarangExternal > 0 ? Math.round((cat.count / totalJenisBarangExternal) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md ${cat.bgSoft} ${cat.textColor}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-700">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{cat.count} Jenis</span>
                        <span className="text-slate-400 text-[11px]">({percentage}%)</span>
                      </div>
                    </div>
                    {/* Visual Progress bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-500 font-semibold">Brand / Pabrikan Terdaftar</p>
              <p className="text-base font-bold text-slate-800">{uniqueBrands} Brand Ternama</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-500 font-semibold">Vendor & Supplier Aktif</p>
              <p className="text-base font-bold text-slate-800">{uniqueVendors} Mitra Pengisi Katalog</p>
            </div>
          </div>
        </div>

        {/* Right Column: Total Supplier & Vendor & Catalog Preview */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Total Supplier & Vendor</h2>
                <p className="text-xs text-slate-500 mt-0.5">Status kemitraan resmi pengadaan barang & jasa.</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            {/* Supplier & Vendor Big KPI Cards */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div 
                onClick={() => setSelectedStat({
                  name: 'Total Supplier',
                  value: totalSuppliers.toString(),
                  detail: 'Active Partners',
                  icon: Building2,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  border: 'border-blue-100',
                  actionView: 'access'
                })}
                className="bg-blue-50/70 hover:bg-blue-100/60 cursor-pointer p-4 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-sm"
              >
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Total Supplier</span>
                <span className="text-3xl font-black text-blue-900">{totalSuppliers}</span>
                <span className="text-[11px] text-blue-600 font-medium mt-1 bg-blue-100/70 px-2 py-0.5 rounded-full">
                  Active Partners
                </span>
              </div>
              <div 
                onClick={() => setSelectedStat({
                  name: 'Total Vendor',
                  value: totalVendorJasa.toString(),
                  detail: 'Verified Vendors',
                  icon: Wrench,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                  border: 'border-emerald-100',
                  actionView: 'access'
                })}
                className="bg-emerald-50/70 hover:bg-emerald-100/60 cursor-pointer p-4 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-sm"
              >
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Vendor</span>
                <span className="text-3xl font-black text-emerald-900">{totalVendorJasa}</span>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Verified Vendors
                </span>
              </div>
            </div>

            {/* Catalog Items Highlight */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-700">Contoh Jenis Barang di Katalog:</span>
                <span className="text-[11px] font-semibold text-slate-500">{totalJenisBarangExternal} SKU Terdata</span>
              </div>
              <div className="space-y-2">
                {items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200/70 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.brand} • {item.companyName}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 shrink-0">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action to explore full catalog */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('catalog-vendor')}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <span>Eksplorasi Seluruh {totalJenisBarangExternal} Jenis Barang Rekanan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

