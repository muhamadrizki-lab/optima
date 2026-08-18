import React, { useState, useEffect } from 'react';
import { User, Bid, ItemCategory } from '../types';
import PancaranLogo from '../components/PancaranLogo';
import { INITIAL_BIDS_DATA } from '../data/biddingData';
import { 
  Send, 
  FileText, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Search, 
  Filter, 
  Building2, 
  DollarSign, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Download, 
  Eye, 
  X, 
  Plus, 
  Calendar,
  Layers,
  Briefcase
} from 'lucide-react';

interface BiddingProps {
  user?: User | null;
  onBack?: () => void;
  initialReqId?: string | null;
}

interface AvailableTender {
  id: string;
  title: string;
  category: ItemCategory;
  categoryLabel: string;
  oe: number;
  quantity: number;
  unit: string;
  deadline: string;
  location: string;
  specSummary: string;
}

const AVAILABLE_TENDERS: AvailableTender[] = [
  {
    id: 'REQ-001',
    title: 'Pembaruan Perangkat IT 2024 (50 Unit Laptop)',
    category: 'LAINNYA',
    categoryLabel: 'IT & Fasilitas Kantor',
    oe: 750000000,
    quantity: 50,
    unit: 'Unit Laptop',
    deadline: '2026-08-31',
    location: 'Head Office Pancaran Jakarta',
    specSummary: 'Core i7/Ryzen 7, 16GB RAM, 512GB SSD NVMe, Garansi Resmi 3 Tahun.'
  },
  {
    id: 'REQ-002',
    title: 'Pemeliharaan AC Tahunan (Service AC & Maintenance)',
    category: 'JASA',
    categoryLabel: 'Jasa & HVAC',
    oe: 120000000,
    quantity: 45,
    unit: 'Unit AC',
    deadline: '2026-08-27',
    location: 'Head Office Jakarta',
    specSummary: 'Cuci AC rutin per 3 bulan, pengecekan freon dan kompresor 45 unit AC.'
  },
  {
    id: 'REQ-003',
    title: 'Pengadaan Ban Radial Truk Tronton 11R22.5 (200 Unit)',
    category: 'BAN',
    categoryLabel: 'Ban & Velg',
    oe: 850000000,
    quantity: 200,
    unit: 'Pcs',
    deadline: '2026-08-30',
    location: 'Depo Cakung & Cikarang',
    specSummary: 'Ban radial 11R22.5 16PR/18PR tubeless untuk armada trailer logistik rute Jawa-Sumatera.'
  },
  {
    id: 'REQ-004',
    title: 'Pengadaan Aki Truk Heavy Duty 12V 100Ah N100 (150 Unit)',
    category: 'AKI',
    categoryLabel: 'Aki & Elektrikal',
    oe: 275000000,
    quantity: 150,
    unit: 'Pcs',
    deadline: '2026-08-25',
    location: 'Pool Cakung & Marunda',
    specSummary: 'Aki basah/kering daya cranking tinggi standard N100 / 95E41R armada angkutan logistik.'
  },
  {
    id: 'REQ-005',
    title: 'Pengadaan Suku Cadang Kampas Rem & Filter Armada Hino/Isuzu',
    category: 'SPARE_PART',
    categoryLabel: 'Spare Part & Komponen',
    oe: 160000000,
    quantity: 100,
    unit: 'Set Paket',
    deadline: '2026-08-28',
    location: 'Workshop Utama Cakung',
    specSummary: 'Brake shoe Hino 500 FL/FM non-asbestos & filter oli/solar Fleetguard.'
  },
  {
    id: 'REQ-006',
    title: 'Jasa Overhaul & Kalibrasi Mesin Diesel & Pompa Injeksi Common Rail (10 Unit)',
    category: 'JASA',
    categoryLabel: 'Jasa & Perawatan Armada',
    oe: 80000000,
    quantity: 10,
    unit: 'Unit Truk',
    deadline: '2026-08-22',
    location: 'Workshop Vendor & Pool Armada',
    specSummary: 'Overhaul fuel injection pump, nozzle injector Bosch digital test bench.'
  }
];

export default function Bidding({ user, onBack, initialReqId }: BiddingProps) {
  // Dynamic list of tenders merging localStorage catalog items
  const [tenderList, setTenderList] = useState<AvailableTender[]>(() => {
    try {
      const savedCatalog = localStorage.getItem('optima_catalog_kebutuhan');
      if (savedCatalog) {
        const parsed = JSON.parse(savedCatalog);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: AvailableTender[] = parsed.map((item: any) => {
            const existing = AVAILABLE_TENDERS.find(t => t.id === item.id);
            return {
              id: item.id,
              title: item.title,
              category: existing ? existing.category : 'SPARE_PART',
              categoryLabel: existing ? existing.categoryLabel : 'Kebutuhan Logistik',
              oe: item.ownerEstimate || (existing ? existing.oe : 100000000),
              quantity: existing ? existing.quantity : 1,
              unit: existing ? existing.unit : 'Paket',
              deadline: item.datePosted || '2026-08-31',
              location: item.delivery || (existing ? existing.location : 'Jakarta'),
              specSummary: item.description || (item.specifications ? item.specifications.join(', ') : '')
            };
          });

          // Merge without duplicates
          const ids = new Set(mapped.map(m => m.id));
          const leftovers = AVAILABLE_TENDERS.filter(t => !ids.has(t.id));
          return [...mapped, ...leftovers];
        }
      }
    } catch (e) {
      console.error('Error loading tenders for bidding:', e);
    }
    return AVAILABLE_TENDERS;
  });

  // Bid History State (persisted in localStorage)
  const [bids, setBids] = useState<Bid[]>(() => {
    try {
      const saved = localStorage.getItem('optima_bids_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading bids:', e);
    }
    return INITIAL_BIDS_DATA;
  });

  // Save bids to localStorage on update
  const saveBids = (newBids: Bid[]) => {
    setBids(newBids);
    try {
      localStorage.setItem('optima_bids_history', JSON.stringify(newBids));
    } catch (e) {
      console.error('Error saving bids:', e);
    }
  };

  // Modal State for New Bid Submission (Open automatically if initialReqId is passed from "Ikut Bidding Sekarang")
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(Boolean(initialReqId));

  // Form State
  const defaultTender = tenderList.find(t => t.id === initialReqId) || tenderList[0] || AVAILABLE_TENDERS[0];
  const [selectedTenderId, setSelectedTenderId] = useState<string>(defaultTender.id);
  const selectedTender = tenderList.find(t => t.id === selectedTenderId) || tenderList[0] || AVAILABLE_TENDERS[0];

  const [unitPrice, setUnitPrice] = useState<number>(
    selectedTender ? Math.round(selectedTender.oe / selectedTender.quantity * 0.95) : 3950000
  );
  const [quantity, setQuantity] = useState<number>(selectedTender ? selectedTender.quantity : 200);
  const totalBidAmount = unitPrice * quantity;

  const [validityDays, setValidityDays] = useState<string>('30 Hari Kalender');
  const [warrantyMonths, setWarrantyMonths] = useState<string>('12');
  const [warrantyDescription, setWarrantyDescription] = useState<string>('Garansi Resmi Pabrik & Bebas Cacat Material');
  const [tncNotes, setTncNotes] = useState<string>('Pengiriman bertahap sesuai jadwal BAST. Dilengkapi surat keagenan resmi dan sertifikat SNI.');
  
  const [paymentMethod, setPaymentMethod] = useState<string>('Net 30 Days');
  const [downPayment, setDownPayment] = useState<number>(0);
  const [deliveryOption, setDeliveryOption] = useState<string>('Free Delivery');
  const [deliveryLocation, setDeliveryLocation] = useState<string>(selectedTender ? `Franco ${selectedTender.location}` : 'Franco Gudang Depo Cakung');
  const [leadTime, setLeadTime] = useState<string>('3-5 Hari Kerja');
  const [taxOption, setTaxOption] = useState<string>('Include PPH & PPN 11%');
  const [attachmentFileName, setAttachmentFileName] = useState<string>('Surat_Penawaran_Harga_Resmi_2026.pdf');

  // Submit Feedback & Detail Modal
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedBidDetail, setSelectedBidDetail] = useState<Bid | null>(null);

  // Filter & Search History
  const [searchHistory, setSearchHistory] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACCEPTED' | 'PENDING' | 'NEGOTIATION' | 'REVIEWED' | 'REJECTED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    if (initialReqId) {
      setSelectedTenderId(initialReqId);
      const tender = tenderList.find(t => t.id === initialReqId);
      if (tender) {
        setQuantity(tender.quantity);
        setUnitPrice(Math.round(tender.oe / tender.quantity * 0.95));
        setDeliveryLocation(`Franco ${tender.location}`);
      }
      setShowSubmitModal(true);
    }
  }, [initialReqId, tenderList]);

  // Currency Formatter
  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  // Handle Tender Change in Modal
  const handleSelectTender = (reqId: string) => {
    setSelectedTenderId(reqId);
    const tender = tenderList.find(t => t.id === reqId);
    if (tender) {
      setQuantity(tender.quantity);
      setUnitPrice(Math.round(tender.oe / tender.quantity * 0.95));
      setDeliveryLocation(`Franco ${tender.location}`);
    }
  };

  // Handle Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBid: Bid = {
      id: `BID-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      reqId: selectedTender.id,
      reqTitle: selectedTender.title,
      vendorId: user?.id || 'VEND-CURRENT',
      vendorName: user?.companyName || user?.name || 'PT Mitra Vendor Mandiri',
      vendorCompany: user?.companyName || 'PT Mitra Vendor Mandiri',
      vendorEmail: user?.email || 'vendor@gmail.com',
      vendorPhone: user?.phone || '0812-9988-7766',
      category: selectedTender.category,
      amount: totalBidAmount,
      unitPrice: unitPrice,
      quantity: quantity,
      unit: selectedTender.unit,
      validityDays: validityDays,
      warranty: `${warrantyMonths} Bulan - ${warrantyDescription}`,
      tncNotes: tncNotes,
      paymentMethod: paymentMethod,
      downPayment: downPayment,
      deliveryOption: deliveryOption,
      deliveryLocation: deliveryLocation,
      taxOption: taxOption,
      estimatedLeadTime: leadTime,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      internalNotes: 'Penawaran baru diterima di portal. Menunggu review kelayakan administrasi & harga oleh tim Procurement.',
      documents: [
        { name: attachmentFileName || 'Dokumen_Penawaran_Harga.pdf', size: '2.3 MB', type: 'PDF' },
        { name: 'Pakta_Integritas_Vendor.pdf', size: '950 KB', type: 'PDF' }
      ]
    };

    saveBids([newBid, ...bids]);
    setShowSubmitModal(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  // Filter History Items
  const filteredBids = bids.filter((b) => {
    const matchSearch = 
      b.id.toLowerCase().includes(searchHistory.toLowerCase()) ||
      b.reqTitle.toLowerCase().includes(searchHistory.toLowerCase()) ||
      b.reqId.toLowerCase().includes(searchHistory.toLowerCase()) ||
      (b.vendorName && b.vendorName.toLowerCase().includes(searchHistory.toLowerCase()));

    const matchStatus = 
      statusFilter === 'ALL' 
        ? true 
        : statusFilter === 'PENDING'
        ? (b.status === 'PENDING' || b.status === 'REVIEWED')
        : b.status === statusFilter;

    const matchCategory = categoryFilter === 'ALL' || b.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  // KPI calculations
  const totalBidsCount = bids.length;
  const acceptedBidsCount = bids.filter(b => b.status === 'ACCEPTED').length;
  const pendingBidsCount = bids.filter(b => b.status === 'PENDING' || b.status === 'REVIEWED').length;
  const negotiationBidsCount = bids.filter(b => b.status === 'NEGOTIATION').length;

  const getStatusBadge = (status: Bid['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Menang Tender / Disetujui
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Menunggu Review
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Sedang Evaluasi Teknis
          </span>
        );
      case 'NEGOTIATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            Tahap Negosiasi
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Belum Lolos
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <div className="font-bold text-sm">Penawaran Bidding Berhasil Dikirim!</div>
            <div className="text-xs text-emerald-100 mt-0.5">Penawaran Anda telah tercatat di sistem & tampil pada histori di bawah.</div>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="ml-2 text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Focus: Riwayat & Histori Bidding Saya (Header & Filter & KPI) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                BAGIAN 2 - REKAM JEJAK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Riwayat & Histori Bidding Saya
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-3xl">
              Daftar seluruh tender yang pernah Anda ajukan penawaran, status evaluasi tim internal, dan rincian dokumen penawaran.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Total: {bids.length} Riwayat Penawaran
            </span>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajukan Penawaran Baru
            </button>
          </div>
        </div>

        {/* 4 KPI Stat Cards matching screenshot exactly */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL PENGAJUAN
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {totalBidsCount} Bid
            </div>
          </div>

          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/80 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              MENANG / APPROVED
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
              {acceptedBidsCount} Tender
            </div>
          </div>

          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              DALAM EVALUASI
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">
              {pendingBidsCount} Bid
            </div>
          </div>

          <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-200/80 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              TAHAP NEGOSIASI
            </span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700 mt-2">
              {negotiationBidsCount} Bid
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari histori berdasarkan No. Bid, judul tender, nama vendor..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter('ACCEPTED')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'ACCEPTED' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Menang ({acceptedBidsCount})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'PENDING' ? 'bg-amber-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('NEGOTIATION')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'NEGOTIATION' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Negosiasi
              </button>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-700"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="BAN">Ban & Velg</option>
              <option value="AKI">Aki & Baterai</option>
              <option value="SPARE_PART">Spare Part</option>
              <option value="JASA">Jasa Maintenance</option>
              <option value="IT">IT & Komputer</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="px-6 py-4">NO. PENAWARAN & TANGGAL</th>
                <th className="px-6 py-4">PAKET TENDER YANG DI-BID</th>
                <th className="px-6 py-4">KATEGORI</th>
                <th className="px-6 py-4 text-right">NILAI PENAWARAN</th>
                <th className="px-6 py-4">SYARAT & TOP</th>
                <th className="px-6 py-4 text-center">STATUS EVALUASI</th>
                <th className="px-6 py-4 text-center">AKSI DETAIL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBids.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Tidak ada riwayat penawaran yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredBids.map((bid) => {
                  return (
                    <tr key={bid.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* No. Bid & Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-blue-600 text-xs">{bid.id}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {bid.dateSubmitted}
                        </div>
                      </td>

                      {/* Tender Info */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 max-w-sm">
                          {bid.reqTitle}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Ref: {bid.reqId} • {bid.quantity ? `${bid.quantity} ${bid.unit || 'Unit'}` : '-'}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {bid.category || 'PENGADAAN'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono">
                        <div className="font-black text-slate-900 text-sm">{formatRp(bid.amount)}</div>
                        {bid.unitPrice && (
                          <div className="text-[10px] text-slate-400">
                            @{formatRp(bid.unitPrice)}/{bid.unit || 'unit'}
                          </div>
                        )}
                      </td>

                      {/* Terms */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                        <div className="font-semibold text-slate-800">{bid.paymentMethod || 'Net 30 Days'}</div>
                        <div className="text-[11px] text-slate-400">{bid.deliveryOption || 'Free Delivery'}</div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(bid.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedBidDetail(bid)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200/60 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail Isi Bid
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: AJUKAN PENAWARAN BIDDING BARU (Jika tombol diklik atau dari katalog) */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <PancaranLogo size={36} />
                <div>
                  <h2 className="text-lg font-bold">Formulir Bidding Baru (Surat Penawaran Harga)</h2>
                  <p className="text-slate-300 text-xs">Pilih paket tender yang dituju dan tentukan penawaran harga resmi.</p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Pilih Tender Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Paket Kebutuhan / Tender Yang Dituju <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedTenderId}
                  onChange={(e) => handleSelectTender(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  required
                >
                  {tenderList.map((tender) => (
                    <option key={tender.id} value={tender.id}>
                      [{tender.id}] {tender.title} — Pagu OE: {formatRp(tender.oe)} ({tender.quantity} {tender.unit})
                    </option>
                  ))}
                </select>
                
                {/* Target Tender Summary Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Pagu OE Internal:</span>
                    <strong className="text-slate-900 font-bold">{formatRp(selectedTender.oe)}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Kuantiti:</span>
                    <strong className="text-blue-600 font-bold">{selectedTender.quantity} {selectedTender.unit}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Lokasi:</span>
                    <span className="text-slate-700">{selectedTender.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Deadline:</span>
                    <span className="text-rose-600 font-semibold">{selectedTender.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Harga Penawaran */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  2. Nilai & Harga Penawaran
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Harga Satuan (Rp / {selectedTender.unit}) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Jumlah Kuantiti ({selectedTender.unit}) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-xl flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase opacity-80">Total Penawaran</span>
                    <span className="text-base font-black">{formatRp(totalBidAmount)}</span>
                  </div>
                </div>
              </div>

              {/* TNC & TOP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Metode Pembayaran (TOP)
                  </h4>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                    required
                  >
                    <option value="Net 30 Days">Net 30 Days (30 Hari)</option>
                    <option value="Net 45 Days">Net 45 Days (45 Hari - Rekomendasi)</option>
                    <option value="Net 60 Days">Net 60 Days</option>
                    <option value="DP 30% + Pelunasan 70%">DP 30% + Pelunasan 70%</option>
                    <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                  </select>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Masa Berlaku Penawaran</label>
                    <input
                      type="text"
                      value={validityDays}
                      onChange={(e) => setValidityDays(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    Pengiriman & Garansi
                  </h4>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Opsi Pengiriman</label>
                    <select
                      value={deliveryOption}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                    >
                      <option value="Free Delivery">Free Delivery (Franco Gudang Pancaran)</option>
                      <option value="Loco Gudang Vendor">Biaya Kirim Ditanggung Pembeli</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Garansi Produk (Bulan)</label>
                    <input
                      type="text"
                      value={warrantyMonths}
                      onChange={(e) => setWarrantyMonths(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      placeholder="12 Bulan"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Kirim Penawaran Bidding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL: ISI LENGKAP PENAWARAN (SURAT QUOTATION) */}
      {selectedBidDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white p-6 relative">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <PancaranLogo size={40} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-300">
                        {selectedBidDetail.id}
                      </span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                        Tanggal: {selectedBidDetail.dateSubmitted}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Rincian Lengkap Penawaran Bidding (Quotation)
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBidDetail(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Status & Tender Overview */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Paket Tender yang Diikuti:</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{selectedBidDetail.reqTitle}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">Ref ID: {selectedBidDetail.reqId}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Status Pengajuan:</div>
                  {getStatusBadge(selectedBidDetail.status)}
                </div>
              </div>

              {/* Vendor & Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Informasi Vendor Pengaju
                  </div>
                  <div className="text-sm font-bold text-slate-800">{selectedBidDetail.vendorName}</div>
                  <div className="text-xs text-slate-500">Email: <span className="text-slate-700">{selectedBidDetail.vendorEmail || 'vendor@gmail.com'}</span></div>
                  <div className="text-xs text-slate-500">Telepon: <span className="text-slate-700">{selectedBidDetail.vendorPhone || '0812-9988-7766'}</span></div>
                </div>

                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-blue-700" />
                    Total Nilai Penawaran (Commercial)
                  </div>
                  <div className="text-2xl font-black text-blue-700">{formatRp(selectedBidDetail.amount)}</div>
                  {selectedBidDetail.unitPrice && (
                    <div className="text-xs text-blue-600">
                      Rincian: {selectedBidDetail.quantity} {selectedBidDetail.unit || 'unit'} x {formatRp(selectedBidDetail.unitPrice)}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms of Payment & Conditions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Term of Payment (TOP)</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedBidDetail.paymentMethod || 'Net 30 Days'}</div>
                  {selectedBidDetail.downPayment ? (
                    <div className="text-[10px] text-slate-500 mt-0.5">DP: {selectedBidDetail.downPayment}%</div>
                  ) : null}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Ketentuan Garansi</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedBidDetail.warranty || 'Garansi 12 Bulan Resmi'}</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Masa Berlaku</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedBidDetail.validityDays || '30 Hari'}</div>
                </div>
              </div>

              {/* Delivery & Tax */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Pengiriman (Delivery)</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedBidDetail.deliveryOption || 'Free Delivery'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Lokasi: {selectedBidDetail.deliveryLocation || 'Depo Cakung'}</div>
                  {selectedBidDetail.estimatedLeadTime && (
                    <div className="text-[11px] text-slate-500">Lead Time: {selectedBidDetail.estimatedLeadTime}</div>
                  )}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Pajak (PPH / PPN)</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedBidDetail.taxOption || 'Include PPH'}</div>
                </div>
              </div>

              {/* Catatan TNC */}
              {selectedBidDetail.tncNotes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Catatan TNC & Syarat Teknis Tambahan
                  </h4>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    {selectedBidDetail.tncNotes}
                  </div>
                </div>
              )}

              {/* Feedback Tim Internal Procurement */}
              {selectedBidDetail.internalNotes && (
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Catatan & Feedback Tim Procurement Internal Pancaran
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {selectedBidDetail.internalNotes}
                  </p>
                </div>
              )}

              {/* Dokumen Lampiran */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Dokumen Lampiran Penawaran
                </h4>
                <div className="space-y-2">
                  {selectedBidDetail.documents?.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800">{doc.name}</span>
                        <span className="text-slate-400 font-mono text-[10px]">({doc.size})</span>
                      </div>
                      <button 
                        onClick={() => alert(`Mengunduh dokumen: ${doc.name}`)}
                        className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  )) || (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                      Surat_Penawaran_Resmi.pdf (2.3 MB)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <button
                onClick={() => {
                  alert(`Mencetak Surat Penawaran Resmi ${selectedBidDetail.id} untuk ${selectedBidDetail.reqTitle}`);
                }}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Cetak Lembar Penawaran PDF
              </button>

              <button
                onClick={() => setSelectedBidDetail(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
