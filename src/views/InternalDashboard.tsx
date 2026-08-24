import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  Wallet,
  TrendingUp,
  CreditCard,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { VendorCatalogItem } from '../types';
import CompanyDetailModal from '../components/CompanyDetailModal';
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
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<string | null>(null);
  
  const [totalKebutuhan, setTotalKebutuhan] = useState(5);
  const [kebutuhanList, setKebutuhanList] = useState<any[]>([]);
  const [totalBids, setTotalBids] = useState(INITIAL_BIDS_DATA.length);
  const [bidsList, setBidsList] = useState<any[]>(INITIAL_BIDS_DATA);
  const [totalInternalUsers, setTotalInternalUsers] = useState(2);
  const [internalUsersList, setInternalUsersList] = useState<any[]>([]);
  const [totalExternalUsers, setTotalExternalUsers] = useState(2);
  const [totalSuppliers, setTotalSuppliers] = useState(1);
  const [totalVendorJasa, setTotalVendorJasa] = useState(1);
  const [externalUsersList, setExternalUsersList] = useState<any[]>([]);

  useEffect(() => {
    // Load Kebutuhan
    try {
      const savedCatalog = localStorage.getItem('optima_catalog_kebutuhan');
      if (savedCatalog) {
        const parsed = JSON.parse(savedCatalog);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTotalKebutuhan(parsed.length);
          setKebutuhanList(parsed);
        }
      } else {
        // Fallback default list with 1 won tender (REQ-003) for initial display
        const defaultList = [
          { id: 'REQ-001', title: 'Pembaruan Perangkat IT 2024', description: 'Pengadaan 50 Laptop & Aksesoris', status: 'OPEN', ownerEstimate: 750000000 },
          { id: 'REQ-002', title: 'Pemeliharaan AC Tahunan (Service AC)', description: 'Kontrak tahunan service AC', status: 'OPEN', ownerEstimate: 120000000 },
          { 
            id: 'REQ-003', 
            title: 'Pengadaan Ban Radial Truk Tronton 11R22.5 (200 Unit)', 
            description: 'Pengadaan paket ban radial heavy duty tubeless', 
            status: 'CLOSED', 
            winnerVendorName: 'PT Mandiri Ban Pratama', 
            winnerAmount: 790000000, 
            winnerDate: '2026-08-16',
            ownerEstimate: 850000000,
            winnerNotes: 'Penawaran terbaik dengan rekam jejak terpercaya. PO terbit.'
          },
          { id: 'REQ-004', title: 'Pengadaan Aki Truk Heavy Duty 12V 100Ah N100', description: 'Penyediaan baterai aki basah & kering', status: 'OPEN', ownerEstimate: 267000000 },
          { id: 'REQ-005', title: 'Pengadaan Suku Cadang Kampas Rem & Filter Armada', description: 'Paket suku cadang fast-moving', status: 'OPEN', ownerEstimate: 420000000 }
        ];
        setTotalKebutuhan(defaultList.length);
        setKebutuhanList(defaultList);
      }
    } catch (e) {}

    // Load Bids
    try {
      const savedBids = localStorage.getItem('optima_bids_history');
      if (savedBids) {
        const parsed = JSON.parse(savedBids);
        if (Array.isArray(parsed)) {
          setTotalBids(parsed.length);
          setBidsList(parsed);
        }
      }
    } catch (e) {}

    // Load Users
    try {
      const savedUsers = localStorage.getItem('optima_access_users');
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed)) {
          const internals = parsed.filter((u: any) => u.role === 'INTERNAL');
          setTotalInternalUsers(internals.length);
          setInternalUsersList(internals);
          
          const externals = parsed.filter((u: any) => u.role === 'EXTERNAL');
          setTotalExternalUsers(externals.length);
          setExternalUsersList(externals);
          setTotalSuppliers(externals.filter((u: any) => u.vendorType === 'SUPPLIER').length);
          setTotalVendorJasa(externals.filter((u: any) => u.vendorType === 'VENDOR_JASA').length);
        }
      } else {
        // Initial defaults based on ManagementAkses state
        const initialInternals = [
          { id: '1', name: 'Muhamad Rizki Alfian', email: 'muhamad.rizki@pancaran-logistic.id', role: 'INTERNAL', vendorType: 'ADMIN', status: 'ACTIVE' },
          { id: '2', name: 'Budi Santoso', email: 'budi.s@pancaran-logistic.id', role: 'INTERNAL', vendorType: 'PROCUREMENT', status: 'ACTIVE' },
        ];
        setInternalUsersList(initialInternals);
        
        const initialExternals = [
          { id: '3', name: 'PT Surya Gemilang', email: 'vendor@suryagemilang.com', role: 'EXTERNAL', vendorType: 'SUPPLIER', status: 'ACTIVE' },
          { id: '4', name: 'CV Makmur Jaya', email: 'info@makmurjaya.co.id', role: 'EXTERNAL', vendorType: 'VENDOR_JASA', status: 'PENDING' },
        ];
        setExternalUsersList(initialExternals);
      }
    } catch (e) {}
  }, []);

  // Compute won internal procurements (pengeluaran belanja aktif)
  const wonItems = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      vendorName: string;
      amount: number;
      ownerEstimate: number;
      date: string;
      notes?: string;
    }> = [];

    // From kebutuhanList (tenders that have a winner or closed with winnerAmount)
    kebutuhanList.forEach((item: any) => {
      if (item.winnerAmount && Number(item.winnerAmount) > 0) {
        list.push({
          id: item.id,
          title: item.title,
          vendorName: item.winnerVendorName || 'Vendor Terpilih',
          amount: Number(item.winnerAmount),
          ownerEstimate: Number(item.ownerEstimate) || Number(item.winnerAmount),
          date: item.winnerDate || item.datePosted || '2026-08-16',
          notes: item.winnerNotes || 'Tender selesai, BAST & PO telah diterbitkan.'
        });
      }
    });

    // From accepted bids in bidsList
    bidsList.forEach((bid: any) => {
      if (bid.status === 'ACCEPTED') {
        const price = Number(bid.price || bid.amount || 0);
        if (price > 0 && !list.some(l => l.id === bid.reqId || l.title === bid.reqTitle)) {
          list.push({
            id: bid.reqId || `REQ-WIN-${bid.id}`,
            title: bid.reqTitle || 'Pengadaan Logistik Internal',
            vendorName: bid.vendorName,
            amount: price,
            ownerEstimate: price,
            date: bid.dateSubmitted || 'Terbaru',
            notes: bid.notes || 'Penawaran disetujui internal.'
          });
        }
      }
    });

    return list;
  }, [kebutuhanList, bidsList]);

  // Total Nominal Pengeluaran
  const totalPengeluaran = useMemo(() => {
    return wonItems.reduce((acc, curr) => acc + curr.amount, 0);
  }, [wonItems]);

  const totalOwnerEstimateWon = useMemo(() => {
    return wonItems.reduce((acc, curr) => acc + (curr.ownerEstimate || curr.amount), 0);
  }, [wonItems]);

  const totalPenghematan = useMemo(() => {
    return Math.max(0, totalOwnerEstimateWon - totalPengeluaran);
  }, [totalOwnerEstimateWon, totalPengeluaran]);

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

  // Dapatkan daftar rekanan vendor & supplier unik dari katalog
  const uniqueVendorList = useMemo(() => {
    const seen = new Set<string>();
    const list: typeof items = [];
    for (const item of items) {
      if (!seen.has(item.companyName)) {
        seen.add(item.companyName);
        list.push(item);
      }
    }
    return list;
  }, [items]);

  const stats = [
    { 
      name: 'Total Pengadaan', 
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
      name: 'Total Pengeluaran Belanja', 
      value: totalPengeluaran > 0 ? `Rp ${(totalPengeluaran / 1000000).toLocaleString('id-ID')} Jt` : 'Rp 0',
      fullValue: `Rp ${totalPengeluaran.toLocaleString('id-ID')}`,
      detail: `${wonItems.length} Pengadaan Menang/PO`,
      highlight: true,
      icon: Wallet, 
      color: 'text-emerald-700', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-300 ring-2 ring-emerald-500/15 shadow-xs',
      actionView: 'catalog'
    },
    { 
      name: 'Jenis Barang External', 
      value: `${totalJenisBarangExternal} Jenis`, 
      detail: 'Ragam SKU katalog (Bukan Qty)',
      icon: Layers, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      border: 'border-indigo-100',
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
    { label: 'Spare Part', count: jenisSparePart, icon: Package, color: 'bg-blue-600', textColor: 'text-blue-700', bgSoft: 'bg-blue-50' },
    { label: 'Ban Truk', count: jenisBan, icon: Disc, color: 'bg-amber-600', textColor: 'text-amber-700', bgSoft: 'bg-amber-50' },
    { label: 'Aki', count: jenisAki, icon: Zap, color: 'bg-emerald-600', textColor: 'text-emerald-700', bgSoft: 'bg-emerald-50' },
    { label: 'Jasa', count: jenisJasa, icon: Wrench, color: 'bg-purple-600', textColor: 'text-purple-700', bgSoft: 'bg-purple-50' },
    ...(jenisLainnya > 0 ? [{ label: 'IT', count: jenisLainnya, icon: Boxes, color: 'bg-slate-600', textColor: 'text-slate-700', bgSoft: 'bg-slate-50' }] : []),
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

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              onClick={() => setSelectedStat(stat)}
              className={`bg-white rounded-2xl shadow-sm border ${stat.border} p-4 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer hover:border-slate-300`}
            >
              <div className="flex items-start justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-500 line-clamp-1">{stat.name}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 truncate">{stat.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated Section: Dashboard & Tracker Pengeluaran Belanja Internal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">Dashboard Realisasi Pengeluaran Belanja Internal</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Otomatis Terkalkulasi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Akumulasi belanja pengadaan barang & jasa internal yang telah menetapkan vendor pemenang dan menerbitkan PO.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div 
              onClick={() => setSelectedStat({
                name: 'Total Realisasi Belanja (PO)',
                value: `Rp ${totalPengeluaran.toLocaleString('id-ID')}`,
                detail: `Dari ${wonItems.length} tender menang aktif yang diterbitkan PO`,
                icon: CreditCard,
                color: 'text-emerald-700',
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                actionView: 'catalog'
              })}
              className="bg-slate-50 hover:bg-emerald-50/60 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 text-right cursor-pointer transition-all hover:shadow-xs group"
              title="Klik untuk melihat rincian realisasi pengeluaran"
            >
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 uppercase block">Total Pengeluaran Realisasi</span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Detail</span>
              </div>
              <span className="text-lg font-black text-emerald-700">Rp {totalPengeluaran.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* 3 Summary Financial Metric Pill Boxes (Clickable with rich detail pop-up) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setSelectedStat({
              name: 'Total Realisasi Belanja (PO)',
              value: `Rp ${totalPengeluaran.toLocaleString('id-ID')}`,
              detail: `Dari ${wonItems.length} tender menang aktif yang diterbitkan PO`,
              icon: CreditCard,
              color: 'text-emerald-700',
              bg: 'bg-emerald-50',
              border: 'border-emerald-100',
              actionView: 'catalog'
            })}
            className="bg-emerald-50/60 hover:bg-emerald-50 p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] group"
            title="Klik untuk melihat rincian realisasi belanja (PO)"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-emerald-800 uppercase group-hover:text-emerald-900 transition-colors">
                  Total Realisasi Belanja (PO)
                </p>
                <p className="text-lg font-black text-slate-900 truncate">
                  Rp {totalPengeluaran.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-emerald-700 font-medium truncate">
                  Dari {wonItems.length} tender menang aktif
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              Lihat Detail
            </span>
          </div>

          <div 
            onClick={() => setSelectedStat({
              name: 'Estimasi OE Internal',
              value: `Rp ${totalOwnerEstimateWon.toLocaleString('id-ID')}`,
              detail: `Total pagu anggaran Owner Estimate (OE) untuk ${wonItems.length} pengadaan`,
              icon: DollarSign,
              color: 'text-blue-700',
              bg: 'bg-blue-50',
              border: 'border-blue-100',
              actionView: 'catalog'
            })}
            className="bg-blue-50/60 hover:bg-blue-50 p-4 rounded-xl border border-blue-100 hover:border-blue-300 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] group"
            title="Klik untuk melihat rincian pagu estimasi OE internal"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-blue-800 uppercase group-hover:text-blue-900 transition-colors">
                  Estimasi OE Internal
                </p>
                <p className="text-lg font-black text-slate-900 truncate">
                  Rp {totalOwnerEstimateWon.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-blue-700 font-medium truncate">
                  Pagu anggaran internal disiapkan
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              Lihat Detail
            </span>
          </div>

          <div 
            onClick={() => setSelectedStat({
              name: 'Efisiensi / Penghematan Anggaran',
              value: `Rp ${totalPenghematan.toLocaleString('id-ID')}`,
              detail: `${totalOwnerEstimateWon > 0 ? Math.round((totalPenghematan / totalOwnerEstimateWon) * 100) : 0}% efisiensi penghematan dari pagu OE`,
              icon: TrendingUp,
              color: 'text-amber-700',
              bg: 'bg-amber-50',
              border: 'border-amber-100',
              actionView: 'catalog'
            })}
            className="bg-amber-50/60 hover:bg-amber-50 p-4 rounded-xl border border-amber-100 hover:border-amber-300 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] group"
            title="Klik untuk melihat rincian efisiensi & penghematan anggaran"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-amber-800 uppercase group-hover:text-amber-900 transition-colors">
                  Efisiensi / Penghematan Anggaran
                </p>
                <p className="text-lg font-black text-amber-900 truncate">
                  Rp {totalPenghematan.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-amber-700 font-medium truncate">
                  {totalOwnerEstimateWon > 0 ? `${Math.round((totalPenghematan / totalOwnerEstimateWon) * 100)}% hemat dari OE` : '0% penghematan'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              Lihat Detail
            </span>
          </div>
        </div>

        {/* List Table of Won Procurement Items */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Rincian Pengadaan Aktif Terkontrak (Selesai Bidding)
            </h3>
            {onNavigate && (
              <button 
                onClick={() => onNavigate('catalog')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Katalog Pengadaan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {wonItems.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs font-semibold text-slate-500">Belum ada tender yang dimenangkan / disetujui PO.</p>
              <p className="text-[11px] text-slate-400 mt-1">Pilih pemenang tender di halaman Katalog Pengadaan untuk mengkalkulasi pengeluaran otomatis.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-3 px-3.5">ID & Nama Pengadaan</th>
                    <th className="py-3 px-3.5">Vendor / Rekanan Menang</th>
                    <th className="py-3 px-3.5 text-right">Penawaran Menang</th>
                    <th className="py-3 px-3.5 text-right">Pagu OE Internal</th>
                    <th className="py-3 px-3.5 text-center">Status PO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 bg-white">
                  {wonItems.map((won, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900">{won.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{won.id} • Tanggal: {won.date}</div>
                      </td>
                      <td className="py-3 px-3.5">
                        <div 
                          onClick={() => setSelectedCompanyModal(won.vendorName)}
                          className="font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                          title="Klik untuk lihat profil PT"
                        >
                          <span>{won.vendorName}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{won.notes}</div>
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-emerald-700 text-sm">
                        Rp {won.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3.5 text-right font-medium text-slate-500">
                        {won.ownerEstimate > 0 ? `Rp ${won.ownerEstimate.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          <span>TERBIT PO / MENANG</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
                  <p className="text-3xl font-black text-slate-900 mt-0.5">
                    {selectedStat.fullValue || selectedStat.value}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold">Keterangan Status</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{selectedStat.detail}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Rincian Informasi & Data Terkait:</h4>
                <div className="space-y-2.5">
                  {(selectedStat.name === 'Total Pengeluaran Belanja' || selectedStat.name === 'Total Realisasi Belanja (PO)') && (
                    <div className="space-y-3">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                            Akumulasi Realisasi Belanja (PO Diterbitkan)
                          </span>
                          <span className="text-2xl font-black text-emerald-700 mt-0.5 block">
                            Rp {totalPengeluaran.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-xs">
                          {wonItems.length} Kontrak Aktif
                        </span>
                      </div>

                      {wonItems.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">Belum ada pengadaan menang terdata.</p>
                      ) : (
                        wonItems.map((won, idx) => (
                          <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                {won.id}
                              </span>
                              <p className="text-xs font-bold text-slate-800 mt-1">{won.title}</p>
                              <p 
                                onClick={() => {
                                  setSelectedStat(null);
                                  setSelectedCompanyModal(won.vendorName);
                                }}
                                className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
                                title={`Klik untuk profil ${won.vendorName}`}
                              >
                                <span>Rekanan: {won.vendorName}</span>
                                <ExternalLink className="w-3 h-3 text-blue-500" />
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Tanggal: {won.date}</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Nominal Realisasi PO</span>
                              <p className="text-sm font-black text-emerald-700">Rp {won.amount.toLocaleString('id-ID')}</p>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                                RESMI DITERBITKAN PO
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {selectedStat.name === 'Estimasi OE Internal' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                            Total Pagu Anggaran Owner Estimate (OE)
                          </span>
                          <span className="text-2xl font-black text-blue-700 mt-0.5 block">
                            Rp {totalOwnerEstimateWon.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-xl shadow-xs">
                          {wonItems.length} Paket Pengadaan
                        </span>
                      </div>

                      {wonItems.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">Belum ada data pagu OE internal aktif.</p>
                      ) : (
                        wonItems.map((won, idx) => (
                          <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                {won.id}
                              </span>
                              <p className="text-xs font-bold text-slate-800 mt-1">{won.title}</p>
                              <p 
                                onClick={() => {
                                  setSelectedStat(null);
                                  setSelectedCompanyModal(won.vendorName);
                                }}
                                className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
                              >
                                <span>Pemenang: {won.vendorName}</span>
                                <ExternalLink className="w-3 h-3 text-blue-500" />
                              </p>
                            </div>
                            <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                              <div className="flex items-center sm:justify-end gap-3 text-xs">
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-semibold">Pagu OE Internal:</span>
                                  <span className="font-bold text-slate-700">Rp {(won.ownerEstimate || won.amount).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="border-l border-slate-200 pl-3">
                                  <span className="text-[10px] text-emerald-600 block font-semibold">Nilai Menang PO:</span>
                                  <span className="font-black text-emerald-700">Rp {won.amount.toLocaleString('id-ID')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {selectedStat.name === 'Efisiensi / Penghematan Anggaran' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                            Total Efisiensi Anggaran (Saving)
                          </span>
                          <span className="text-2xl font-black text-amber-800 mt-0.5 block">
                            Rp {totalPenghematan.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-amber-600 text-white px-3 py-1.5 rounded-xl shadow-xs">
                          {totalOwnerEstimateWon > 0 ? `${Math.round((totalPenghematan / totalOwnerEstimateWon) * 100)}% Hemat dari OE` : '0%'}
                        </span>
                      </div>

                      {wonItems.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">Belum ada kalkulasi penghematan tender aktif.</p>
                      ) : (
                        wonItems.map((won, idx) => {
                          const oe = won.ownerEstimate || won.amount;
                          const saving = Math.max(0, oe - won.amount);
                          const savingPercent = oe > 0 ? Math.round((saving / oe) * 100) : 0;
                          return (
                            <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200/80 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                  {won.id}
                                </span>
                                <p className="text-xs font-bold text-slate-800 mt-1">{won.title}</p>
                                <p 
                                  onClick={() => {
                                    setSelectedStat(null);
                                    setSelectedCompanyModal(won.vendorName);
                                  }}
                                  className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
                                >
                                  <span>Rekanan Pemenang: {won.vendorName}</span>
                                  <ExternalLink className="w-3 h-3 text-blue-500" />
                                </p>
                                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                                  <span>OE: <strong className="text-slate-700">Rp {oe.toLocaleString('id-ID')}</strong></span>
                                  <span>•</span>
                                  <span>PO: <strong className="text-emerald-700">Rp {won.amount.toLocaleString('id-ID')}</strong></span>
                                </div>
                              </div>
                              <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Nominal Penghematan</span>
                                <p className="text-sm font-black text-amber-700">
                                  {saving > 0 ? `+ Rp ${saving.toLocaleString('id-ID')}` : 'Rp 0'}
                                </p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-1 ${
                                  saving > 0 
                                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                  {saving > 0 ? `Hemat ${savingPercent}%` : 'Sesuai Pagu OE'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {selectedStat.name === 'Total Pengadaan' && (
                    <>
                      {kebutuhanList.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.title}</p>
                            <p className="text-[11px] text-slate-500">{item.id} • {item.description || item.title}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${item.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : item.status === 'CLOSED' ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {item.status === 'OPEN' ? 'DIBUKA' : item.status === 'CLOSED' ? 'SELESAI' : 'DRAFT/SEGERA'}
                          </span>
                        </div>
                      ))}
                    </>
                  )}

                  {selectedStat.name === 'Total Penawaran' && (
                    <>
                      {bidsList.map((bid, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                          <div>
                            <p 
                              onClick={() => setSelectedCompanyModal(bid.vendorName)}
                              className="text-xs font-bold text-slate-800 hover:text-blue-600 hover:underline cursor-pointer"
                              title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                            >
                              {bid.vendorName}
                            </p>
                            <p className="text-[11px] text-slate-500">{bid.reqTitle}: Rp {bid.price?.toLocaleString('id-ID')}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${bid.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : bid.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' : bid.status === 'NEGOTIATION' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                            {bid.status === 'ACCEPTED' ? 'DITERIMA' : bid.status === 'REJECTED' ? 'DITOLAK' : bid.status === 'NEGOTIATION' ? 'NEGO' : 'TERKIRIM'}
                          </span>
                        </div>
                      ))}
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
                      {internalUsersList.map((u, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{u.name}</p>
                            <p className="text-[11px] text-slate-500">{u.email} • {u.vendorType || 'Karyawan'}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {u.status === 'ACTIVE' ? 'AKTIF' : 'NONAKTIF'}
                          </span>
                        </div>
                      ))}
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
            <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>

      </div>

      {/* Pop Up Detail Company Modal */}
      <CompanyDetailModal
        companyName={selectedCompanyModal}
        isOpen={Boolean(selectedCompanyModal)}
        onClose={() => setSelectedCompanyModal(null)}
      />
    </div>
  );
}

