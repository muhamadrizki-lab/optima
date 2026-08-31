import React, { useState, useEffect } from 'react';
import { CatalogItem, User, Bid, SpecTableItem } from '../types';
import { 
  Search, 
  Filter, 
  Calendar, 
  List, 
  FileText, 
  Truck, 
  DollarSign, 
  Upload, 
  X, 
  Target, 
  Users, 
  TrendingDown, 
  ShieldCheck, 
  CreditCard, 
  Trophy, 
  Settings, 
  CheckCircle2, 
  Award, 
  AlertCircle, 
  Edit3, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Clock,
  Trash2,
  ArrowUpDown
} from 'lucide-react';
import SafeImage from '../components/SafeImage';
import PancaranLogo from '../components/PancaranLogo';
import CompanyDetailModal from '../components/CompanyDetailModal';
import SpecTableEditor, { createDefaultSpecTableRows } from '../components/SpecTableEditor';
import { INITIAL_BIDS_DATA } from '../data/biddingData';

interface CatalogProps {
  user?: User | null;
  onBiddingClick?: (reqId?: string) => void;
}

interface BidderItem {
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  amount: number;
  dateSubmitted: string;
  warranty: string;
  top: string;
  delivery: string;
  status: 'ACCEPTED' | 'REVIEWED' | 'PENDING' | 'REJECTED' | 'NEGOTIATION';
  notes?: string;
  availabilityType?: 'READY' | 'INDENT';
  indentDuration?: string;
}

const DEFAULT_CATALOG_ITEMS: CatalogItem[] = [
  { 
    id: 'REQ-001', 
    title: 'Pembaruan Perangkat IT 2024', 
    description: 'Pengadaan 50 laptop baru dan aksesoris untuk tim engineering & operasional logistik.', 
    datePosted: '2026-08-15', 
    deadline: '2026-08-31T17:00:00',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    specifications: ['Intel Core i7 Gen 13', '16GB RAM DDR5', '512GB NVMe SSD', '14-inch IPS Display', 'Garansi Resmi 3 Tahun'],
    specTable: [
      { no: 1, nama: 'Laptop Workstation Engineering', brand: 'Lenovo ThinkPad P14s Gen 4 (i7-13700H, 16GB, 512GB SSD)', qty: 35, uom: 'unit', ket: 'Garansi resmi 3 tahun, include OS Win 11 Pro' },
      { no: 2, nama: 'Laptop Operasional Logistik', brand: 'Lenovo ThinkBook 14 Gen 6 (i5-1335U, 16GB, 512GB SSD)', qty: 15, uom: 'unit', ket: 'Garansi resmi 3 tahun, tas backpack' },
      { no: 3, nama: 'Docking Station USB-C', brand: 'ThinkPad Universal USB-C Dock', qty: 50, uom: 'pcs', ket: 'Dual 4K Display Support' },
      { no: 4, nama: 'Wireless Mouse & Keyboard', brand: 'Logitech MK270 Combo', qty: 50, uom: 'set', ket: 'Baterai termasuk, garansi 1 tahun' },
      { no: 5, nama: 'Monitor 24 inci IPS', brand: 'LG 24MP400-B 75Hz Full HD', qty: 20, uom: 'unit', ket: 'Garansi 3 tahun resmi LG Indonesia' }
    ],
    tnc: 'Barang harus original dan bergaransi resmi dari distributor Indonesia.',
    top: 'Net 30 Hari setelah barang diterima dan invoice lengkap.',
    delivery: 'Gratis Pengiriman ke Head Office Jakarta',
    tax: 'Termasuk PPH',
    ownerEstimate: 750000000,
    bidsCount: 12,
    lowestBid: 680000000,
    highestBid: 785000000
  },
  { 
    id: 'REQ-002', 
    title: 'Pemeliharaan AC Tahunan (Service AC)', 
    description: 'Kontrak tahunan untuk pemeliharaan rutin dan perbaikan AC di seluruh area kantor pusat.', 
    datePosted: '2026-08-18', 
    deadline: '2026-08-28T23:59:59',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    specifications: ['Cuci AC rutin per 3 bulan', 'Pengecekan freon dan kompresor', 'Respon perbaikan darurat 1x24 jam', 'Termasuk perbaikan minor', 'Total 45 unit AC Split & Cassette'],
    specTable: [
      { no: 1, nama: 'Cuci & Maintenance AC Split 1-2 PK', brand: 'Daikin / Panasonic / Sharp', qty: 35, uom: 'pcs', ket: 'Cuci rutin per 3 bulan (4x kunjungan setahun)' },
      { no: 2, nama: 'Cuci & Maintenance AC Cassette 3-5 PK', brand: 'Daikin Inverter Heavy Duty', qty: 10, uom: 'pcs', ket: 'Pembersihan filter, kompresor & evaporator' },
      { no: 3, nama: 'Pengecekan Freon R32/R410A & Oli Kompresor', brand: 'Standard Pressure Gauge Test', qty: 45, uom: 'pcs', ket: 'Termasuk penambahan freon minor & kelistrikan' },
      { no: 4, nama: 'Perbaikan Minor & Response Emergency', brand: 'On-Call Service 1x24 Jam', qty: 1, uom: 'pcs', ket: 'Garansi pengerjaan minimal 14 hari' }
    ],
    tnc: 'Teknisi wajib memiliki sertifikasi K3. Garansi pekerjaan service minimal 14 hari.',
    top: 'Tagihan bulanan, Net 14 Hari setelah BAST.',
    delivery: 'Service langsung di lokasi Head Office',
    tax: 'Termasuk PPN & PPH',
    ownerEstimate: 120000000,
    bidsCount: 4,
    lowestBid: 105000000,
    highestBid: 130000000
  },
  {
    id: 'REQ-003',
    title: 'Pengadaan Ban Radial Truk Tronton 11R22.5 (200 Unit)',
    description: 'Pengadaan paket ban radial heavy duty tubeless untuk peremajaan roda 40 unit armada trailer logistik rute Jawa-Sumatera.',
    datePosted: '2026-08-10',
    deadline: '2026-08-16T17:00:00',
    status: 'CLOSED',
    winnerVendorName: 'PT Mandiri Ban Pratama',
    winnerVendorId: 'VEND-01',
    winnerAmount: 790000000,
    winnerDate: '2026-08-16',
    winnerNotes: 'Penawaran terbaik dengan harga kompetitif dan rekam jejak distribusi terpercaya. BAST & PO telah diterbitkan.',
    winnerPaymentMethod: 'Net 45 Days • Garansi 12 Bulan / 60.000 KM',
    imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    specifications: [
      'Ukuran: 11R22.5 16PR / 18PR Tubeless',
      'Merk yang direkomendasikan: Bridgestone / Michelin / Gajah Tunggal',
      'Tahun produksi minimal minggu ke-20 tahun 2026',
      'Garansi aus pabrik minimal 50.000 KM',
      'Total pengadaan: 200 Pcs'
    ],
    specTable: [
      { no: 1, nama: 'Ban Radial Tubeless Heavy Duty (Drive Axle)', brand: 'Bridgestone R156 / GT Radial GTR926', qty: 120, uom: 'pcs', ket: 'Ukuran 11R22.5 16PR, Tahun Produksi 2026' },
      { no: 2, nama: 'Ban Radial Tubeless Steering Axle', brand: 'Michelin X Multi Z2 / Bridgestone', qty: 80, uom: 'pcs', ket: 'Ukuran 11R22.5 18PR, Garansi 50.000 KM' },
      { no: 3, nama: 'Pentil Ban Tubeless Heavy Duty Brass', brand: 'Alligator Germany Brass Valve', qty: 200, uom: 'pcs', ket: 'Material Kuningan Anti Leak & High Pressure' }
    ],
    tnc: 'Barang asli SNI, melampirkan sertifikat distributor resmi dan garansi pabrikan.',
    top: 'Net 45 Hari setelah BAST dan pengujian berkala.',
    delivery: 'Pengiriman bertahap ke Pool Cakung & Cikarang',
    tax: 'Termasuk PPN 11% & PPh 22/23',
    ownerEstimate: 850000000,
    bidsCount: 6,
    lowestBid: 790000000,
    highestBid: 890000000
  },
  {
    id: 'REQ-004',
    title: 'Pengadaan Aki Truk Heavy Duty 12V 100Ah N100 (150 Unit)',
    description: 'Kontrak penyediaan baterai aki basah & kering berdaya cranking tinggi untuk armada angkutan logistik Pancaran Group.',
    datePosted: '2026-08-12',
    deadline: '2026-08-30T18:00:00',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    specifications: [
      'Kapasitas: 12 Volt 100 Ah (Standard N100 / 95E41R)',
      'Merk: GS Astra / Incoe / Yuasa',
      'Cold Cranking Amps (CCA) minimal 650A',
      'Sudah termasuk air zuur pabrik (khusus tipe basah) & packing safety',
      'Jumlah: 150 Unit'
    ],
    specTable: [
      { no: 1, nama: 'Aki Basah Heavy Duty Truck 100Ah', brand: 'GS Astra Hybrid N100 (95E41R)', qty: 100, uom: 'pcs', ket: 'Terisi Air Zuur Pabrik, Cold Cranking Amps > 650A' },
      { no: 2, nama: 'Aki Kering Maintenance Free (MF)', brand: 'Incoe Gold MF N100', qty: 50, uom: 'pcs', ket: 'Bebas Perawatan, Garansi ganti baru 6 bulan' },
      { no: 3, nama: 'Terminal Kepala Aki Tembaga Heavy Duty', brand: 'Brass Clamp Bolt 12V', qty: 300, uom: 'pcs', ket: 'Material Tembaga Lapis Timah Anti Korosi' }
    ],
    tnc: 'Jaminan ganti baru (1-to-1 replacement) jika ada sel mati dalam masa garansi 6 bulan.',
    top: 'Net 30 Hari kalender.',
    delivery: 'Diantar langsung ke Pool Depo Logistik Sunter & Surabaya',
    tax: 'Termasuk PPN',
    ownerEstimate: 267000000,
    bidsCount: 5,
    lowestBid: 245000000,
    highestBid: 280000000
  },
  {
    id: 'REQ-005',
    title: 'Pengadaan Suku Cadang Kampas Rem & Filter Armada Hino/Isuzu',
    description: 'Paket pengadaan suku cadang fast-moving (Brake Shoe OEM, Filter Oli, Filter Solar Fleetguard) periode semester 2.',
    datePosted: '2026-08-15',
    deadline: '2026-09-05T17:00:00',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=800&q=80',
    specifications: [
      '300 Set Brake Shoe Hino Ranger 500 Lohan OEM Non-Asbestos',
      '400 Set Filter Combo Fleetguard LF16015 / FS19732',
      '50 Pcs Plat Kopling Clutch Disc Exedy 380mm',
      'Keaslian genuine/OEM 100% dengan garansi distributor'
    ],
    specTable: [
      { no: 1, nama: 'Kampas Rem (Brake Shoe) OEM', brand: 'Hino Genuine Parts / Ranger 500 Lohan', qty: 300, uom: 'pcs', ket: 'Non-Asbestos Heavy Duty OEM' },
      { no: 2, nama: 'Filter Oli Combo High Efficiency', brand: 'Fleetguard LF16015', qty: 200, uom: 'pcs', ket: 'Standar ISO OEM Hino/Isuzu' },
      { no: 3, nama: 'Filter Solar / Fuel Water Separator', brand: 'Fleetguard FS19732', qty: 200, uom: 'pcs', ket: 'Penyaringan air & kotoran solar B35/B40' },
      { no: 4, nama: 'Plat Kopling (Clutch Disc) 380mm', brand: 'Exedy Japan Hino 500', qty: 50, uom: 'pcs', ket: 'Asli Exedy Heavy Duty Durability' }
    ],
    tnc: 'Penyedia wajib melampirkan surat keagenan / dealer resmi spare parts.',
    top: 'Net 30 Hari.',
    delivery: 'Free delivery ke Gudang Pusat Sparepart Pancaran',
    tax: 'Termasuk PPN & PPH',
    ownerEstimate: 420000000,
    bidsCount: 8,
    lowestBid: 385000000,
    highestBid: 435000000
  }
];

export function getSpecTableForItem(item: CatalogItem): SpecTableItem[] {
  if (item.specTable && item.specTable.length > 0) {
    return item.specTable;
  }
  
  if (item.specifications && item.specifications.length > 0) {
    return item.specifications.map((spec, idx) => {
      let qty = 1;
      let uom = 'pcs';
      let nama = spec;
      let brand = 'Standard Specs';
      let ket = 'Kebutuhan operasional';

      const matchNum = spec.match(/^(\d+)\s*(unit|pcs|set|paket|buah|pasang|unit AC|Pcs)?\s+(.*)/i);
      if (matchNum) {
        qty = parseInt(matchNum[1], 10);
        uom = matchNum[2] || 'pcs';
        nama = matchNum[3];
      }

      return {
        no: idx + 1,
        nama: nama,
        brand: brand,
        qty: qty,
        uom: uom,
        ket: ket
      };
    });
  }

  return [
    { no: 1, nama: item.title, brand: 'Standard', qty: 1, uom: 'pcs', ket: item.description || 'Spesifikasi standar' }
  ];
}

export function calculateTenderTimeLeft(deadline?: string, status?: string) {
  if (status === 'CLOSED') {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
  }
  if (!deadline) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, totalSeconds: 0 };
  }

  // Handle ISO string or YYYY-MM-DD HH:mm or YYYY-MM-DD
  const targetStr = deadline.includes('T') ? deadline : deadline.replace(' ', 'T');
  const targetTime = new Date(targetStr).getTime();
  const now = new Date().getTime();
  const diff = targetTime - now;

  if (isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const totalSeconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds, isExpired: false, totalSeconds };
}

export function formatDeadlineIndo(deadlineStr?: string) {
  if (!deadlineStr) return 'Sesuai Jadwal Procurement';
  try {
    const targetStr = deadlineStr.includes('T') ? deadlineStr : deadlineStr.replace(' ', 'T');
    const d = new Date(targetStr);
    if (isNaN(d.getTime())) return deadlineStr;
    const dateFormatted = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeFormatted = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dateFormatted} • Pkl ${timeFormatted} WIB`;
  } catch {
    return deadlineStr;
  }
}

export function TenderTimeBadge({ deadline, status }: { deadline?: string; status: 'OPEN' | 'CLOSED' }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTenderTimeLeft(deadline, status));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTenderTimeLeft(deadline, status));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline, status]);

  if (status === 'CLOSED' || timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900/85 backdrop-blur-xs text-slate-200 border border-white/20 shadow-md">
        <Clock className="w-3 h-3 text-slate-400" />
        Ditutup
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-xs text-white border shadow-md ${
      timeLeft.days < 1
        ? 'bg-rose-900/90 border-rose-400/50 text-rose-100 animate-pulse'
        : timeLeft.days <= 3
        ? 'bg-amber-900/90 border-amber-400/50 text-amber-100'
        : 'bg-emerald-950/90 border-emerald-400/50 text-emerald-100'
    }`}>
      <Clock className={`w-3 h-3 ${timeLeft.days < 1 ? 'text-rose-400' : timeLeft.days <= 3 ? 'text-amber-400' : 'text-emerald-400'}`} />
      <span>{timeLeft.days}h {timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}s</span>
    </span>
  );
}

export function TenderCountdownBar({ 
  deadline, 
  status, 
  datePosted 
}: { 
  deadline?: string; 
  status: 'OPEN' | 'CLOSED'; 
  datePosted?: string;
}) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTenderTimeLeft(deadline, status));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTenderTimeLeft(deadline, status));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline, status]);

  const isClosed = status === 'CLOSED' || timeLeft.isExpired;

  return (
    <div className={`w-full p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col gap-2.5 shadow-xs ${
      isClosed
        ? 'bg-slate-50 border-slate-200 text-slate-700'
        : timeLeft.days < 1
        ? 'bg-gradient-to-b from-rose-50 to-white border-rose-200/90 text-rose-950 ring-1 ring-rose-300/40'
        : timeLeft.days <= 3
        ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200/90 text-amber-950 ring-1 ring-amber-300/40'
        : 'bg-gradient-to-b from-emerald-50/70 to-white border-emerald-200/90 text-emerald-950 ring-1 ring-emerald-300/40'
    }`}>
      {/* Top Header: Label & Status */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${
            isClosed
              ? 'text-slate-400'
              : timeLeft.days < 1
              ? 'text-rose-600 animate-pulse'
              : timeLeft.days <= 3
              ? 'text-amber-600'
              : 'text-emerald-600'
          }`} />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
            {isClosed ? 'Status Waktu Tender' : 'Hitung Mundur Sisa Waktu'}
          </span>
        </div>
        {isClosed ? (
          <span className="text-[9px] font-black uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
            Selesai
          </span>
        ) : (
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
            timeLeft.days < 1
              ? 'bg-rose-600 text-white animate-pulse'
              : timeLeft.days <= 3
              ? 'bg-amber-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}>
            {timeLeft.days < 1 ? 'Segera Berakhir' : 'Aktif'}
          </span>
        )}
      </div>

      {/* Center: Large Countdown Digits */}
      {isClosed ? (
        <div className="py-2 text-center bg-slate-100/90 rounded-xl border border-slate-200/60">
          <span className="text-xs font-black text-slate-600">🔒 Waktu Pengadaan Telah Berakhir</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {/* Hari */}
          <div className="bg-white px-1 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-sm font-black text-slate-900 font-mono block leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight block mt-1 leading-none">
              Hari
            </span>
          </div>
          {/* Jam */}
          <div className="bg-white px-1 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-sm font-black text-slate-900 font-mono block leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight block mt-1 leading-none">
              Jam
            </span>
          </div>
          {/* Menit */}
          <div className="bg-white px-1 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-sm font-black text-slate-900 font-mono block leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight block mt-1 leading-none">
              Menit
            </span>
          </div>
          {/* Detik */}
          <div className={`px-1 py-1.5 rounded-xl border shadow-2xs ${
            timeLeft.days < 1 
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <span className="text-sm font-black font-mono block leading-none">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-tight block mt-1 leading-none opacity-80">
              Detik
            </span>
          </div>
        </div>
      )}

      {/* Bottom: Deadline Date Detail */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-0.5 text-left">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          Batas Akhir (Deadline):
        </span>
        <div className="text-[11px] font-black text-blue-800 bg-blue-50/80 px-2 py-1 rounded-lg border border-blue-200/60 font-mono leading-tight">
          {formatDeadlineIndo(deadline)}
        </div>
      </div>
    </div>
  );
}

export default function CatalogKebutuhan({ user, onBiddingClick }: CatalogProps) {
  const isInternal = user?.role === 'INTERNAL';
  
  const [items, setItems] = useState<CatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('optima_catalog_kebutuhan');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => {
            const match = DEFAULT_CATALOG_ITEMS.find(d => d.id === item.id);
            return {
              ...item,
              specTable: (item.specTable && item.specTable.length > 0) ? item.specTable : (match?.specTable || []),
              deadline: item.deadline || match?.deadline || '2026-08-31T17:00:00',
              datePosted: item.datePosted || match?.datePosted || '2026-08-15'
            };
          });
        }
      }
    } catch (e) {
      console.error('Error loading catalog items:', e);
    }
    return DEFAULT_CATALOG_ITEMS;
  });

  useEffect(() => {
    const handleSync = (e: any) => {
      if (!e.detail || e.detail.key === 'optima_catalog_kebutuhan') {
        const saved = localStorage.getItem('optima_catalog_kebutuhan');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setItems(parsed.map((item: any) => {
                const match = DEFAULT_CATALOG_ITEMS.find(d => d.id === item.id);
                return {
                  ...item,
                  specTable: (item.specTable && item.specTable.length > 0) ? item.specTable : (match?.specTable || []),
                  deadline: item.deadline || match?.deadline || '2026-08-31T17:00:00',
                  datePosted: item.datePosted || match?.datePosted || '2026-08-15'
                };
              }));
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    window.addEventListener('optima-db-updated', handleSync as EventListener);
    return () => window.removeEventListener('optima-db-updated', handleSync as EventListener);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [sortBy, setSortBy] = useState<'TERBARU' | 'TERLAMA' | 'DEADLINE' | 'ANGGARAN_TINGGI' | 'ANGGARAN_RENDAH'>('TERBARU');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTender, setEditingTender] = useState<CatalogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [selectedTenderForBids, setSelectedTenderForBids] = useState<CatalogItem | null>(null);
  const [settingWinnerTender, setSettingWinnerTender] = useState<CatalogItem | null>(null);
  const [companyModalName, setCompanyModalName] = useState<string | null>(null);

  // Winner Form State
  const [winnerFormTab, setWinnerFormTab] = useState<'LIST' | 'MANUAL'>('LIST');
  const [manualWinnerName, setManualWinnerName] = useState('');
  const [manualWinnerAmount, setManualWinnerAmount] = useState<number>(0);
  const [manualWinnerTOP, setManualWinnerTOP] = useState('Net 30 Hari');
  const [manualWinnerNotes, setManualWinnerNotes] = useState('');
  const [targetTenderStatus, setTargetTenderStatus] = useState<'OPEN' | 'CLOSED'>('CLOSED');

  // New Post Form
  const [newPost, setNewPost] = useState<Partial<CatalogItem>>({
    status: 'OPEN',
    title: '',
    description: '',
    imageUrl: '',
    tnc: '',
    top: '',
    delivery: '',
    tax: 'Include PPH',
    ownerEstimate: 0,
    deadline: '2026-08-31T17:00',
  });
  const [specList, setSpecList] = useState<string[]>(['', '', '']);
  const [createSpecTable, setCreateSpecTable] = useState<SpecTableItem[]>([
    { no: 1, nama: '', brand: '', qty: 1, uom: 'pcs', ket: '' },
    { no: 2, nama: '', brand: '', qty: 1, uom: 'pcs', ket: '' }
  ]);
  const [editSpecTable, setEditSpecTable] = useState<SpecTableItem[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('optima_catalog_kebutuhan', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving catalog items:', e);
    }
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `REQ-00${items.length + 1}`;
    const datePosted = new Date().toISOString().split('T')[0];

    const validTable = createSpecTable.filter(r => r.nama.trim() || r.brand.trim());
    const finalTable = validTable.length > 0 ? validTable.map((r, i) => ({ ...r, no: i + 1 })) : createSpecTable;

    const generatedSpecs = finalTable.map(r => `${r.nama}${r.brand ? ' - ' + r.brand : ''} (${r.qty} ${r.uom})${r.ket ? ' - ' + r.ket : ''}`);

    const item: CatalogItem = {
      ...newPost,
      id,
      datePosted,
      deadline: newPost.deadline || '2026-08-31T17:00:00',
      specifications: generatedSpecs.length > 0 ? generatedSpecs : specList.filter(s => s.trim() !== ''),
      specTable: finalTable,
      ownerEstimate: Number(newPost.ownerEstimate) || 0,
      bidsCount: 0,
      lowestBid: 0,
      highestBid: 0
    } as CatalogItem;
    
    setItems([item, ...items]);
    setIsCreating(false);
    setNewPost({ status: 'OPEN', title: '', description: '', imageUrl: '', tnc: '', top: '', delivery: '', tax: 'Include PPH', ownerEstimate: 0, deadline: '2026-08-31T17:00' });
    setSpecList(['', '', '']);
    setCreateSpecTable([
      { no: 1, nama: '', brand: '', qty: 1, uom: 'pcs', ket: '' },
      { no: 2, nama: '', brand: '', qty: 1, uom: 'pcs', ket: '' }
    ]);
    showToast(`Tender kebutuhan ${id} berhasil diposting!`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Winner Setting Modal
  const openWinnerSettingModal = (item: CatalogItem) => {
    setSettingWinnerTender(item);
    setWinnerFormTab('LIST');
    setManualWinnerName(item.winnerVendorName || '');
    setManualWinnerAmount(item.winnerAmount || item.lowestBid || item.ownerEstimate || 0);
    setManualWinnerTOP(item.winnerPaymentMethod || item.top || 'Net 30 Hari');
    setManualWinnerNotes(item.winnerNotes || 'Disetujui sebagai pemenang tender berdasarkan komparasi harga & evaluasi teknis tim procurement.');
    setTargetTenderStatus(item.status);
  };

  // Set Winner function
  const handleAssignWinner = (
    tenderId: string, 
    vendorName: string, 
    amount: number, 
    topInfo: string, 
    notes: string,
    vendorId?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updated = items.map(item => {
      if (item.id === tenderId) {
        return {
          ...item,
          status: 'CLOSED' as const,
          winnerVendorName: vendorName,
          winnerVendorId: vendorId || `VEND-${Math.floor(Math.random() * 1000)}`,
          winnerAmount: amount,
          winnerDate: today,
          winnerPaymentMethod: topInfo,
          winnerNotes: notes
        };
      }
      return item;
    });

    setItems(updated);

    // Also update optima_bids_history if matching bid exists
    try {
      const savedBids = localStorage.getItem('optima_bids_history');
      const allBids: Bid[] = savedBids ? JSON.parse(savedBids) : INITIAL_BIDS_DATA;
      const updatedBids = allBids.map(b => {
        if (b.reqId === tenderId) {
          if (b.vendorName.toLowerCase() === vendorName.toLowerCase()) {
            return { ...b, status: 'ACCEPTED' as const, internalNotes: notes };
          } else {
            return { ...b, status: b.status === 'ACCEPTED' ? 'REVIEWED' as const : b.status };
          }
        }
        return b;
      });
      localStorage.setItem('optima_bids_history', JSON.stringify(updatedBids));
    } catch (e) {
      console.error('Error updating bids status:', e);
    }

    setSettingWinnerTender(null);
    setSelectedTenderForBids(null);
    showToast(`Selamat! ${vendorName} berhasil ditetapkan sebagai Pemenang Tender ${tenderId}.`);
  };

  // Reset / Cancel Winner
  const handleResetWinner = (tenderId: string) => {
    const updated = items.map(item => {
      if (item.id === tenderId) {
        return {
          ...item,
          status: 'OPEN' as const,
          winnerVendorName: undefined,
          winnerVendorId: undefined,
          winnerAmount: undefined,
          winnerDate: undefined,
          winnerNotes: undefined,
          winnerPaymentMethod: undefined
        };
      }
      return item;
    });

    setItems(updated);
    setSettingWinnerTender(null);
    showToast(`Penetapan pemenang tender ${tenderId} telah dibatalkan dan status dibuka kembali.`);
  };

  // Toggle Tender Status (OPEN / CLOSED)
  const handleToggleTenderStatus = (tenderId: string, newStatus: 'OPEN' | 'CLOSED') => {
    const updated = items.map(item => {
      if (item.id === tenderId) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setItems(updated);
    if (settingWinnerTender && settingWinnerTender.id === tenderId) {
      setSettingWinnerTender({ ...settingWinnerTender, status: newStatus });
    }
    showToast(`Status tender ${tenderId} berhasil diubah menjadi ${newStatus === 'OPEN' ? 'DIBUKA' : 'DITUTUP'}.`);
  };

  const handleDeleteTender = (tenderId: string) => {
    const updated = items.filter(item => item.id !== tenderId);
    setItems(updated);
    try {
      localStorage.setItem('optima_catalog_kebutuhan', JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting tender:', e);
    }
    showToast(`Tender ${tenderId} berhasil dihapus.`);
  };

  const handleStartEdit = (item: CatalogItem) => {
    setEditingTender(item);
    const existingTable = getSpecTableForItem(item);
    setEditSpecTable(existingTable && existingTable.length > 0 ? existingTable : createDefaultSpecTableRows());
    setSpecList(item.specifications && item.specifications.length > 0 ? [...item.specifications] : ['', '', '']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTender) return;

    const validTable = editSpecTable.filter(r => r.nama.trim() || r.brand.trim());
    const finalTable = validTable.length > 0 ? validTable.map((r, i) => ({ ...r, no: i + 1 })) : editSpecTable;
    const generatedSpecs = finalTable.map(r => `${r.nama}${r.brand ? ' - ' + r.brand : ''} (${r.qty} ${r.uom})${r.ket ? ' - ' + r.ket : ''}`);

    const updated = items.map(item => {
      if (item.id === editingTender.id) {
        return {
          ...editingTender,
          specifications: generatedSpecs.length > 0 ? generatedSpecs : specList.filter(s => s.trim() !== ''),
          specTable: finalTable,
          ownerEstimate: Number(editingTender.ownerEstimate) || 0,
        };
      }
      return item;
    });

    setItems(updated);
    setEditingTender(null);
    setSpecList(['', '', '']);
    setEditSpecTable([]);
    showToast(`Tender kebutuhan ${editingTender.id} berhasil diperbarui!`);
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingTender) {
          setEditingTender({ ...editingTender, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Bidders list for a given tender matching bidsCount exactly
  const getBiddersForTender = (tender: CatalogItem): BidderItem[] => {
    const targetCount = Math.max(1, tender.bidsCount || 6);

    // Retrieve bids including user's added bids from localStorage
    let realBidsList = INITIAL_BIDS_DATA;
    try {
      const savedBids = localStorage.getItem('optima_bids_history');
      if (savedBids) {
        realBidsList = JSON.parse(savedBids);
      }
    } catch (e) {
      console.error('Error parsing bids in getBiddersForTender:', e);
    }

    const matchingRealBids = realBidsList.filter(b => b.reqId === tender.id);
    
    const realMapped: BidderItem[] = matchingRealBids.map(b => ({
      vendorId: b.vendorId || '',
      vendorName: b.vendorName,
      vendorEmail: b.vendorEmail || 'vendor@gmail.com',
      vendorPhone: b.vendorPhone || '0812-0000-0000',
      amount: b.amount,
      dateSubmitted: b.dateSubmitted,
      warranty: b.warranty || '1 Tahun Garansi',
      top: b.paymentMethod || 'Net 30 Hari',
      delivery: b.deliveryOption || 'Free Delivery',
      status: tender.winnerVendorName === b.vendorName ? 'ACCEPTED' : b.status,
      notes: b.tncNotes || b.internalNotes,
      availabilityType: b.availabilityType,
      indentDuration: b.indentDuration
    }));

    const vendorPool = [
      { name: 'PT Teknologi Maju Bersama', email: 'sales@teknologimaju.com', phone: '0812-3344-5566', ratio: 0.91, notes: 'Penawaran kompetitif & garansi resmi.' },
      { name: 'PT Mandiri Ban Pratama', email: 'sales@mandiriban.co.id', phone: '0812-8899-2341', ratio: 0.93, notes: 'Distributor resmi Bridgestone & GT.' },
      { name: 'CV Komputer Cemerlang', email: 'tender@komputercemerlang.co.id', phone: '0813-9988-7766', ratio: 0.94, notes: 'Spesifikasi lengkap sesuai TOR.' },
      { name: 'PT Mitra Vendor Nusantara', email: 'vendor@gmail.com', phone: '0812-9988-7766', ratio: 0.96, notes: 'Vendor rekanan aktif terverifikasi.' },
      { name: 'PT Global Solusi Mandiri', email: 'info@globalsolusi.id', phone: '0821-4455-8899', ratio: 1.02, notes: 'Paket bundling dukungan penuh.' },
      { name: 'PT Daya Sel Elektrika', email: 'b2b@dayaselelektrika.co.id', phone: '0811-9876-5432', ratio: 0.95, notes: 'Suku cadang heavy duty asli.' },
      { name: 'PT Surya Accu Dinamika', email: 'sales@suryaaccu.co.id', phone: '0812-1122-3344', ratio: 0.97, notes: 'Komponen original pabrik.' },
      { name: 'CV Utama Sparepart Jaya', email: 'sales@utamasparepart.com', phone: '0813-2233-4455', ratio: 0.98, notes: 'Suku cadang OEM kualitas A.' },
      { name: 'PT Fleet Guard System', email: 'corporate@fleetguard.co.id', phone: '0815-5566-7788', ratio: 0.99, notes: 'Pelumas & filter standar ISO.' },
      { name: 'PT Trans Suku Cadang', email: 'procurement@transsukucadang.com', phone: '0817-6677-8899', ratio: 1.01, notes: 'Ready stock pengiriman cepat.' },
      { name: 'PT Sentosa Bengkel Utama', email: 'service@sentosabengkel.co.id', phone: '0818-7788-9900', ratio: 1.03, notes: 'Servis mekanik tersertifikasi.' },
      { name: 'PT Astra Otoparts Fleet', email: 'b2b@astraotoparts.co.id', phone: '0819-8899-0011', ratio: 0.92, notes: 'Garansi resmi Astra Otoparts.' },
      { name: 'PT Bridgestone Tire Distributor', email: 'sales@bridgestonedist.co.id', phone: '0821-9900-1122', ratio: 0.95, notes: 'Distributor utama ban radial.' },
      { name: 'PT Hino Parts Indonesia', email: 'fleet@hinoparts.co.id', phone: '0822-0011-2233', ratio: 0.96, notes: 'Genuine parts Hino Truck.' },
      { name: 'CV Nusantara Auto Tech', email: 'info@nusantaraauto.co.id', phone: '0823-1122-3344', ratio: 0.97, notes: 'Paket perawatan armada lengkap.' }
    ];

    const result: BidderItem[] = [...realMapped];

    // Add generated bidders until reaching targetCount
    let poolIndex = 0;
    while (result.length < targetCount && poolIndex < vendorPool.length) {
      const v = vendorPool[poolIndex];
      poolIndex++;

      // Skip if vendor already exists in realMapped
      if (result.some(item => item.vendorName === v.name || item.vendorEmail === v.email)) {
        continue;
      }

      const baseOe = tender.ownerEstimate || 500000000;
      const calculatedAmount = Math.round(baseOe * v.ratio);

      result.push({
        vendorId: `VEND-${String(result.length + 1).padStart(2, '0')}`,
        vendorName: v.name,
        vendorEmail: v.email,
        vendorPhone: v.phone,
        amount: calculatedAmount,
        dateSubmitted: '2026-08-18',
        warranty: '1 Tahun Garansi Resmi',
        top: 'Net 30 Hari',
        delivery: 'Free Delivery Pool Cakung',
        status: tender.winnerVendorName === v.name ? 'ACCEPTED' : 'REVIEWED',
        notes: v.notes
      });
    }

    // Ensure winner matches status ACCEPTED if set
    if (tender.winnerVendorName) {
      return result.map(b => {
        if (b.vendorName === tender.winnerVendorName) {
          return { ...b, status: 'ACCEPTED' };
        }
        return b;
      });
    }

    return result;
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'TERBARU') {
      const dateA = a.datePosted ? new Date(a.datePosted).getTime() : 0;
      const dateB = b.datePosted ? new Date(b.datePosted).getTime() : 0;
      return dateB - dateA;
    }
    if (sortBy === 'TERLAMA') {
      const dateA = a.datePosted ? new Date(a.datePosted).getTime() : 0;
      const dateB = b.datePosted ? new Date(b.datePosted).getTime() : 0;
      return dateA - dateB;
    }
    if (sortBy === 'DEADLINE') {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dateA - dateB;
    }
    if (sortBy === 'ANGGARAN_TINGGI') {
      return (b.ownerEstimate || 0) - (a.ownerEstimate || 0);
    }
    if (sortBy === 'ANGGARAN_RENDAH') {
      return (a.ownerEstimate || 0) - (b.ownerEstimate || 0);
    }
    return 0;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <PancaranLogo size={48} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-full ${
                isInternal ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                {isInternal ? 'Internal Procurement System' : 'Portal Rekanan Vendor & Supplier'}
              </span>
              <span className="text-xs text-slate-400 font-medium">OPTIMA Pancaran Group</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pengadaan
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {isInternal 
                ? 'Kelola postingan paket tender pengadaan, tinjau penawaran rekanan, dan tetapkan pemenang tender.' 
                : 'Daftar paket tender pengadaan resmi dari PT Pancaran Darat Transport. Ikuti bidding dengan mengajukan surat penawaran harga terbaik.'}
            </p>
          </div>
        </div>

        {isInternal && !isCreating && !editingTender && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Buat Postingan Baru
          </button>
        )}
      </div>

      {/* Edit Post Form */}
      {editingTender ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Form Edit Tender ({editingTender.id})</span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">Ubah Postingan Paket Tender Kebutuhan</h2>
            </div>
            <button 
              onClick={() => {
                setEditingTender(null);
                setSpecList(['', '', '']);
              }} 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Judul Paket Kebutuhan</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Pengadaan 50 Unit Laptop Engineering 2026"
                    value={editingTender.title} 
                    onChange={e => setEditingTender({...editingTender, title: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Deskripsi Singkat & Ruang Lingkup</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="Jelaskan kebutuhan pengadaan, volume, dan tujuan penggunaan..."
                    value={editingTender.description} 
                    onChange={e => setEditingTender({...editingTender, description: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Upload Foto / Ilustrasi Kebutuhan</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-blue-500 transition-colors relative bg-slate-50/50">
                    <div className="space-y-1 text-center w-full">
                      {editingTender.imageUrl ? (
                        <div className="relative w-full h-36 mx-auto mb-2">
                          <img src={editingTender.imageUrl} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                          <button 
                            type="button" 
                            onClick={() => setEditingTender({...editingTender, imageUrl: ''})} 
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-10 w-10 text-slate-400" />
                          <div className="flex text-sm text-slate-600 justify-center mt-2">
                            <label htmlFor="edit-file-upload" className="relative cursor-pointer font-bold text-blue-600 hover:text-blue-500">
                              <span>Pilih file gambar</span>
                              <input id="edit-file-upload" name="edit-file-upload" type="file" accept="image/*" className="sr-only" onChange={handleEditImageUpload} />
                            </label>
                            <p className="pl-1">atau drag & drop</p>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Dynamic Spec Table Editor */}
                <SpecTableEditor
                  items={editSpecTable}
                  onChange={(newTable) => setEditSpecTable(newTable)}
                  title="Tabel Rincian Spesifikasi & BOQ (Minimal 2 Baris)"
                  subtitle="Tentukan rincian komponen/item kebutuhan. Disediakan minimal 2 baris awal dan bisa ditambah baris sebanyak kebutuhan."
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Terms & Conditions (TNC)</label>
                  <textarea 
                    required 
                    rows={2} 
                    placeholder="Contoh: Barang harus original dan bergaransi resmi dari distributor Indonesia." 
                    value={editingTender.tnc || ''} 
                    onChange={e => setEditingTender({...editingTender, tnc: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Term of Payment (TOP)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Net 30 Hari setelah barang diterima dan invoice lengkap." 
                    value={editingTender.top || ''} 
                    onChange={e => setEditingTender({...editingTender, top: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Batas Akhir / Deadline Tender
                  </label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={editingTender.deadline ? (editingTender.deadline.length > 16 ? editingTender.deadline.substring(0, 16) : editingTender.deadline) : ''} 
                    onChange={e => setEditingTender({...editingTender, deadline: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-mono font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Metode & Lokasi Pengiriman</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Gratis Pengiriman ke Head Office Jakarta / Pool Cakung" 
                    value={editingTender.delivery || ''} 
                    onChange={e => setEditingTender({...editingTender, delivery: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ketentuan Pajak</label>
                    <select 
                      value={editingTender.tax || 'Include PPH'} 
                      onChange={e => setEditingTender({...editingTender, tax: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option>Include PPH</option>
                      <option>Exclude PPH</option>
                      <option>Include PPN & PPH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Owner Estimate (OE) Rp</label>
                    <input 
                      type="number" 
                      required 
                      min="0" 
                      placeholder="Contoh: 750000000" 
                      value={editingTender.ownerEstimate || ''} 
                      onChange={e => setEditingTender({...editingTender, ownerEstimate: Number(e.target.value)})} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-mono font-bold" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => {
                  setEditingTender(null);
                  setSpecList(['', '', '']);
                }} 
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-amber-600/20 cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      ) : isCreating ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Form Pengadaan Baru</span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">Buat Postingan Paket Tender Kebutuhan</h2>
            </div>
            <button 
              onClick={() => setIsCreating(false)} 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Judul Paket Kebutuhan</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Pengadaan 50 Unit Laptop Engineering 2026"
                    value={newPost.title} 
                    onChange={e => setNewPost({...newPost, title: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Deskripsi Singkat & Ruang Lingkup</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="Jelaskan kebutuhan pengadaan, volume, dan tujuan penggunaan..."
                    value={newPost.description} 
                    onChange={e => setNewPost({...newPost, description: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Upload Foto / Ilustrasi Kebutuhan</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-blue-500 transition-colors relative bg-slate-50/50">
                    <div className="space-y-1 text-center w-full">
                      {newPost.imageUrl ? (
                        <div className="relative w-full h-36 mx-auto mb-2">
                          <img src={newPost.imageUrl} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                          <button 
                            type="button" 
                            onClick={() => setNewPost({...newPost, imageUrl: ''})} 
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-10 w-10 text-slate-400" />
                          <div className="flex text-sm text-slate-600 justify-center mt-2">
                            <label htmlFor="file-upload" className="relative cursor-pointer font-bold text-blue-600 hover:text-blue-500">
                              <span>Pilih file gambar</span>
                              <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                            </label>
                            <p className="pl-1">atau drag & drop</p>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Dynamic Spec Table Editor */}
                <SpecTableEditor
                  items={createSpecTable}
                  onChange={(newTable) => setCreateSpecTable(newTable)}
                  title="Tabel Rincian Spesifikasi & BOQ (Minimal 2 Baris)"
                  subtitle="Tentukan rincian komponen/item kebutuhan. Disediakan minimal 2 baris awal dan bisa ditambah baris sebanyak kebutuhan."
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Terms & Conditions (TNC)</label>
                  <textarea 
                    required 
                    rows={2} 
                    placeholder="Contoh: Barang harus original dan bergaransi resmi dari distributor Indonesia." 
                    value={newPost.tnc} 
                    onChange={e => setNewPost({...newPost, tnc: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Term of Payment (TOP)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Net 30 Hari setelah barang diterima dan invoice lengkap." 
                    value={newPost.top} 
                    onChange={e => setNewPost({...newPost, top: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Batas Akhir / Deadline Tender
                  </label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={newPost.deadline ? (newPost.deadline.length > 16 ? newPost.deadline.substring(0, 16) : newPost.deadline) : ''} 
                    onChange={e => setNewPost({...newPost, deadline: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-mono font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Metode & Lokasi Pengiriman</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Gratis Pengiriman ke Head Office Jakarta / Pool Cakung" 
                    value={newPost.delivery} 
                    onChange={e => setNewPost({...newPost, delivery: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ketentuan Pajak</label>
                    <select 
                      value={newPost.tax} 
                      onChange={e => setNewPost({...newPost, tax: e.target.value})} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option>Include PPH</option>
                      <option>Exclude PPH</option>
                      <option>Include PPN & PPH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Owner Estimate (OE) Rp</label>
                    <input 
                      type="number" 
                      required 
                      min="0" 
                      placeholder="Contoh: 750000000" 
                      value={newPost.ownerEstimate || ''} 
                      onChange={e => setNewPost({...newPost, ownerEstimate: Number(e.target.value)})} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-mono font-bold" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)} 
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Posting Kebutuhan Sekarang
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Tender List Container */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Toolbar Search & Filters */}
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Cari kebutuhan tender, ID pengadaan, spesifikasi..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-end">
              {/* Sort Selection */}
              <div className="relative flex items-center bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-3xs w-full sm:w-auto shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <span className="text-slate-455 mr-1 font-normal">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 cursor-pointer pr-1"
                >
                  <option value="TERBARU">Tender Terbaru</option>
                  <option value="TERLAMA">Tender Terlama</option>
                  <option value="DEADLINE">Deadline Terdekat</option>
                  <option value="ANGGARAN_TINGGI">Anggaran Tertinggi</option>
                  <option value="ANGGARAN_RENDAH">Anggaran Terendah</option>
                </select>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold w-full sm:w-auto overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({items.length})
                </button>
                <button
                  onClick={() => setStatusFilter('OPEN')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'OPEN' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dibuka ({items.filter(i => i.status === 'OPEN').length})
                </button>
                <button
                  onClick={() => setStatusFilter('CLOSED')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'CLOSED' ? 'bg-slate-800 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Selesai / Ditutup ({items.filter(i => i.status === 'CLOSED').length})
                </button>
              </div>
            </div>
          </div>

          {/* Catalog Tender Cards */}
          <div className="divide-y divide-slate-100 bg-slate-50/40 p-4 sm:p-6 space-y-6">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Tidak ada paket tender yang sesuai</h3>
                <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const hasWinner = Boolean(item.winnerVendorName);
                const isClosed = item.status === 'CLOSED';

                return (
                  <div 
                    key={item.id} 
                    id={`tender-${item.id}`}
                    className={`p-6 sm:p-7 bg-white rounded-3xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                      isClosed || item.status === 'CLOSED'
                        ? 'border-slate-200/90 bg-slate-50/20' 
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Left Column: Image & Countdown/Deadline underneath */}
                      <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-3">
                        <div className="w-full h-52 rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200 shadow-2xs">
                          <SafeImage
                            src={item.imageUrl}
                            alt={item.title}
                            category={item.title}
                            className="w-full h-full object-cover"
                            iconSize={40}
                          />
                          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${
                              item.status === 'OPEN' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-slate-700 text-white'
                            }`}>
                              {item.status === 'OPEN' ? 'DIBUKA' : 'DITUTUP'}
                            </span>
                          </div>
                        </div>

                        {/* Live Countdown & Deadline Bar positioned directly under the photo */}
                        <TenderCountdownBar 
                          deadline={item.deadline} 
                          status={item.status} 
                          datePosted={item.datePosted} 
                        />
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                              {item.title}
                            </h3>
                            <div className="flex flex-wrap items-center text-xs text-slate-500 gap-3 mt-1.5">
                              <span className="font-mono font-bold bg-slate-100 text-blue-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                                {item.id}
                              </span>
                              <span className="flex items-center text-slate-400">
                                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                Diposting: {item.datePosted}
                              </span>
                            </div>
                          </div>
                          {/* Action for Internal: Delete */}
                          {isInternal && (
                            <div className="flex items-center gap-2 mt-2 sm:mt-0 shrink-0">
                              <button
                                onClick={() => handleDeleteTender(item.id)}
                                className="p-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all cursor-pointer"
                                title="Hapus Tender"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                          {item.description}
                        </p>

                        {/* Specifications Detail Table (BOQ) */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden mb-4">
                          <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <List className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                Spesifikasi Detail (Rincian Item Kebutuhan)
                              </span>
                            </div>
                            <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                              {getSpecTableForItem(item).length} Item
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold text-[11px] uppercase tracking-wider">
                                  <th className="py-2.5 px-3 text-center w-12 border-r border-slate-200/70">No.</th>
                                  <th className="py-2.5 px-3.5 min-w-[160px] border-r border-slate-200/70">Nama</th>
                                  <th className="py-2.5 px-3.5 min-w-[180px] border-r border-slate-200/70">Type/Brand</th>
                                  <th className="py-2.5 px-3 text-center w-16 border-r border-slate-200/70">QTY</th>
                                  <th className="py-2.5 px-3 text-center w-16 border-r border-slate-200/70">UOM</th>
                                  <th className="py-2.5 px-3.5 min-w-[180px]">Ket</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200/70 bg-white">
                                {getSpecTableForItem(item).map((row) => (
                                  <tr key={row.no} className="hover:bg-blue-50/40 transition-colors">
                                    <td className="py-2 px-3 text-center font-bold text-slate-600 border-r border-slate-100 text-[11px]">{row.no}</td>
                                    <td className="py-2 px-3.5 font-bold text-slate-900 border-r border-slate-100">{row.nama}</td>
                                    <td className="py-2 px-3.5 text-slate-700 border-r border-slate-100 font-medium">{row.brand}</td>
                                    <td className="py-2 px-3 text-center font-black text-blue-700 border-r border-slate-100 bg-blue-50/30">{row.qty}</td>
                                    <td className="py-2 px-3 text-center font-bold text-slate-600 uppercase border-r border-slate-100 text-[10px]">{row.uom}</td>
                                    <td className="py-2 px-3.5 text-slate-600 text-[11px]">{row.ket}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Terms & Conditions Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/80">
                            <span className="text-[9px] font-black text-indigo-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <ShieldCheck className="w-3 h-3 mr-1 text-indigo-600" />
                              Terms & Conditions
                            </span>
                            <p className="text-[11px] font-semibold text-slate-800 leading-snug">{item.tnc}</p>
                          </div>
                          <div className="bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/80">
                            <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <CreditCard className="w-3 h-3 mr-1 text-blue-600" />
                              TOP (Term of Payment)
                            </span>
                            <p className="text-[11px] font-semibold text-slate-800 leading-snug">{item.top}</p>
                          </div>
                          <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/80">
                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <Truck className="w-3 h-3 mr-1 text-emerald-600" />
                              Pengiriman / Lokasi
                            </span>
                            <p className="text-[11px] font-semibold text-slate-800 leading-snug">{item.delivery}</p>
                          </div>
                          <div className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/80">
                            <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <DollarSign className="w-3 h-3 mr-1 text-amber-600" />
                              Ketentuan Pajak
                            </span>
                            <p className="text-[11px] font-semibold text-slate-800 leading-snug">{item.tax}</p>
                          </div>
                        </div>

                        {/* Footer Actions & OE Stats */}
                        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            <div>
                              <p className="text-xs text-slate-500 font-medium mb-0.5 flex items-center">
                                <Target className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                                Estimasi Nilai (OE)
                              </p>
                              <p className="text-lg font-black text-emerald-600">
                                {item.ownerEstimate ? formatRp(item.ownerEstimate) : 'Tidak Ditampilkan'}
                              </p>
                            </div>
                            
                            {item.bidsCount !== undefined && (
                              <>
                                <div 
                                  onClick={() => setSelectedTenderForBids(item)}
                                  className="cursor-pointer group p-2 -m-2 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200"
                                  title="Klik untuk melihat detail seluruh penawaran vendor"
                                >
                                  <p className="text-xs text-slate-500 font-medium mb-0.5 flex items-center group-hover:text-blue-600 transition-colors">
                                    <Users className="w-3.5 h-3.5 mr-1 text-slate-500 group-hover:text-blue-600" />
                                    Total Penawaran <span className="text-[10px] text-blue-600 font-bold ml-1.5">(Lihat Detail)</span>
                                  </p>
                                  <p className="text-lg font-black text-slate-800 group-hover:text-blue-700 transition-colors">
                                    {item.bidsCount} Bidders
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 font-medium mb-0.5 flex items-center">
                                    <TrendingDown className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                    Penawaran Terendah
                                  </p>
                                  <p className="text-lg font-black text-blue-600">
                                    {item.lowestBid ? formatRp(item.lowestBid) : '-'}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                          
                          {/* Right Action Buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {isInternal && (
                              <>
                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className="w-full sm:w-auto px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4 text-amber-600" />
                                  Edit Tender
                                </button>
                                <button
                                  onClick={() => openWinnerSettingModal(item)}
                                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <Settings className="w-4 h-4 text-slate-300" />
                                  {hasWinner ? 'Kelola Tender' : 'Pilih Pemenang'}
                                </button>
                              </>
                            )}

                            {!isInternal && item.status === 'OPEN' && !hasWinner && (
                              <button 
                                onClick={() => onBiddingClick?.(item.id)}
                                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center shrink-0 cursor-pointer"
                              >
                                <DollarSign className="w-4 h-4 mr-1.5" />
                                Ikut Bidding Sekarang
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏆 MODAL: SETTING & PILIH PEMENANG TENDER (INTERNAL PROCUREMENT) */}
      {/* ========================================================================= */}
      {settingWinnerTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 my-6" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-2xl">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">{settingWinnerTender.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-300">Pengaturan & Penetapan Pemenang</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">{settingWinnerTender.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSettingWinnerTender(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Header (Stats & Status Toggle) */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Owner Estimate (OE)</span>
                  <p className="text-sm font-black text-emerald-700">{formatRp(settingWinnerTender.ownerEstimate || 0)}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bidders Masuk</span>
                  <p className="text-sm font-bold text-slate-800">{settingWinnerTender.bidsCount || 0} Vendor</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Status Pengadaan</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      settingWinnerTender.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {settingWinnerTender.status === 'OPEN' ? 'DIBUKA' : 'DITUTUP'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleToggleTenderStatus(settingWinnerTender.id, 'OPEN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    settingWinnerTender.status === 'OPEN' ? 'bg-green-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Buka Tender
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTenderStatus(settingWinnerTender.id, 'CLOSED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    settingWinnerTender.status === 'CLOSED' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tutup Tender
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh]">
              
              {/* CURRENT WINNER HIGHLIGHT (IF SET) */}
              {settingWinnerTender.winnerVendorName && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border-2 border-emerald-300 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                        <Award className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 uppercase">Pemenang Saat Ini:</span>
                          <span className="px-2 py-0.2 bg-emerald-200 text-emerald-900 text-[10px] font-bold rounded-md">
                            AKTIF
                          </span>
                        </div>
                        <h4 
                          onClick={() => setCompanyModalName(settingWinnerTender.winnerVendorName!)}
                          className="text-lg font-black text-slate-900 mt-0.5 hover:text-blue-600 hover:underline cursor-pointer"
                          title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                        >
                          {settingWinnerTender.winnerVendorName}
                        </h4>
                        <div className="text-xs text-slate-600 mt-0.5">
                          Nilai Kontrak: <strong className="font-mono font-bold text-emerald-700">{formatRp(settingWinnerTender.winnerAmount || 0)}</strong>
                          {settingWinnerTender.winnerDate && ` • Ditetapkan pada ${settingWinnerTender.winnerDate}`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleResetWinner(settingWinnerTender.id)}
                      className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Batalkan / Reset Pemenang
                    </button>
                  </div>
                </div>
              )}

              {/* TABS: PILIH DARI DAFTAR BIDDERS ATAU INPUT MANUAL */}
              <div className="space-y-4">
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setWinnerFormTab('LIST')}
                    className={`pb-3 px-4 text-xs font-bold transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
                      winnerFormTab === 'LIST'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Pilih Dari Daftar Penawaran Masuk ({getBiddersForTender(settingWinnerTender).length})
                  </button>
                  <button
                    onClick={() => setWinnerFormTab('MANUAL')}
                    className={`pb-3 px-4 text-xs font-bold transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
                      winnerFormTab === 'MANUAL'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    Input Penetapan Pemenang Kustom / Berita Acara
                  </button>
                </div>

                {/* TAB 1: LIST BIDDERS COMPARISON */}
                {winnerFormTab === 'LIST' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Pilih vendor penawar di bawah ini untuk langsung menetapkannya sebagai pemenang tender resmi.
                    </p>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      <table className="w-full text-left text-xs text-slate-600 border-collapse">
                        <thead className="bg-slate-100/80 text-slate-700 font-extrabold uppercase text-[11px] border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3">Nama Vendor Rekanan</th>
                            <th className="px-4 py-3 text-right">Nilai Penawaran</th>
                            <th className="px-4 py-3">Term of Payment (TOP) & Garansi</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {getBiddersForTender(settingWinnerTender).map((bidder, idx) => {
                            const isCurrentWinner = settingWinnerTender.winnerVendorName === bidder.vendorName;
                            const oe = settingWinnerTender.ownerEstimate || bidder.amount;
                            const diffPercent = Math.round(((oe - bidder.amount) / oe) * 100);

                            return (
                              <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isCurrentWinner ? 'bg-emerald-50/50' : ''}`}>
                                <td className="px-4 py-3.5">
                                  <div 
                                    onClick={() => setCompanyModalName(bidder.vendorName)}
                                    className="font-bold text-slate-900 text-sm flex items-center gap-1.5 cursor-pointer hover:text-blue-600 hover:underline"
                                    title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                                  >
                                    {bidder.vendorName}
                                    {isCurrentWinner && <Award className="w-4 h-4 text-emerald-600" />}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">{bidder.vendorEmail} • {bidder.vendorPhone}</div>
                                  {bidder.availabilityType === 'INDENT' && (
                                    <div className="mt-1">
                                      <span className="inline-flex items-center text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md gap-0.5">
                                        ⏳ Inden: {bidder.indentDuration || 'Kontak Vendor'}
                                      </span>
                                    </div>
                                  )}
                                </td>

                                <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono">
                                  <div className="font-black text-slate-900 text-sm">{formatRp(bidder.amount)}</div>
                                  {diffPercent > 0 && (
                                    <div className="text-[10px] text-emerald-600 font-bold">Hemat {diffPercent}% vs OE</div>
                                  )}
                                  {diffPercent < 0 && (
                                    <div className="text-[10px] text-rose-600 font-bold">+{Math.abs(diffPercent)}% di atas OE</div>
                                  )}
                                </td>

                                <td className="px-4 py-3.5">
                                  <div className="font-bold text-slate-800">{bidder.top}</div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">{bidder.warranty}</div>
                                </td>

                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    isCurrentWinner 
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                      : bidder.status === 'REVIEWED'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {isCurrentWinner ? '🏆 PEMENANG' : bidder.status}
                                  </span>
                                </td>

                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  {isCurrentWinner ? (
                                    <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                                      <CheckCircle2 className="w-4 h-4" /> Terpilih
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleAssignWinner(
                                        settingWinnerTender.id,
                                        bidder.vendorName,
                                        bidder.amount,
                                        `${bidder.top} • ${bidder.warranty}`,
                                        bidder.notes || 'Penetapan pemenang berdasarkan komparasi penawaran terbaik.',
                                        bidder.vendorId
                                      )}
                                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 mx-auto cursor-pointer"
                                    >
                                      <Trophy className="w-3.5 h-3.5" />
                                      Pilih Menang
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 2: MANUAL FORM */}
                {winnerFormTab === 'MANUAL' && (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAssignWinner(
                        settingWinnerTender.id,
                        manualWinnerName,
                        manualWinnerAmount,
                        manualWinnerTOP,
                        manualWinnerNotes
                      );
                    }}
                    className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Perusahaan Vendor Pemenang</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: PT. Teknologi Maju Bersama"
                          value={manualWinnerName}
                          onChange={e => setManualWinnerName(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nilai Kontrak / Kesepakatan Final (Rp)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="Contoh: 680000000"
                          value={manualWinnerAmount || ''}
                          onChange={e => setManualWinnerAmount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Term of Payment (TOP) & Ketentuan Garansi</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Net 30 Hari setelah BAST • Garansi Resmi 3 Tahun"
                        value={manualWinnerTOP}
                        onChange={e => setManualWinnerTOP(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Catatan Berita Acara / Alasan Penetapan Pemenang</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tuliskan nomor berita acara, evaluasi komparasi harga, atau catatan negosiasi internal..."
                        value={manualWinnerNotes}
                        onChange={e => setManualWinnerNotes(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                      ></textarea>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Trophy className="w-4 h-4 text-amber-300" />
                        Simpan & Tetapkan Sebagai Pemenang
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Pancaran Procurement System • Optimizing Vendor Performance
              </span>
              <button
                onClick={() => setSettingWinnerTender(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📄 MODAL: DETAIL PENAWARAN VENDOR (Daftar Bidders Detail) */}
      {/* ========================================================================= */}
      {selectedTenderForBids && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 my-6" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedTenderForBids.id}</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">Daftar Penawaran Vendor - {selectedTenderForBids.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTenderForBids(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-50/50 p-4 rounded-2xl border border-blue-100 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Total Penawaran Masuk</p>
                    <p className="text-lg font-black text-blue-900">{selectedTenderForBids.bidsCount} Vendor Terdaftar</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500 font-medium">Estimasi Nilai (OE)</p>
                  <p className="text-sm font-black text-slate-800">{selectedTenderForBids.ownerEstimate ? formatRp(selectedTenderForBids.ownerEstimate) : '-'}</p>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-100/70 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Vendor</th>
                      <th className="px-4 py-3 text-right">Nilai Penawaran</th>
                      <th className="px-4 py-3 text-center">Tanggal Submit</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      {isInternal && <th className="px-4 py-3 text-center">Aksi Tim Internal</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-medium">
                    {getBiddersForTender(selectedTenderForBids).map((bidder, idx) => {
                      const isWinner = selectedTenderForBids.winnerVendorName === bidder.vendorName;

                      return (
                        <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isWinner ? 'bg-emerald-50/60' : ''}`}>
                          <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">
                            <div 
                              onClick={() => setCompanyModalName(bidder.vendorName)}
                              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 hover:underline"
                              title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                            >
                              {bidder.vendorName}
                              {isWinner && <Award className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">{bidder.vendorEmail}</div>
                            {bidder.availabilityType === 'INDENT' && (
                              <div className="mt-1">
                                <span className="inline-flex items-center text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md gap-0.5">
                                  ⏳ Inden: {bidder.indentDuration || 'Kontak Vendor'}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-blue-600">{formatRp(bidder.amount)}</td>
                          <td className="px-4 py-3 text-center text-slate-500 text-xs">{bidder.dateSubmitted}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isWinner 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : bidder.status === 'REVIEWED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isWinner ? '🏆 PEMENANG' : bidder.status}
                            </span>
                          </td>
                          {isInternal && (
                            <td className="px-4 py-3 text-center">
                              {isWinner ? (
                                <span className="text-xs font-bold text-emerald-700">Pemenang</span>
                              ) : (
                                <button
                                  onClick={() => handleAssignWinner(
                                    selectedTenderForBids.id,
                                    bidder.vendorName,
                                    bidder.amount,
                                    `${bidder.top} • ${bidder.warranty}`,
                                    bidder.notes || 'Penetapan pemenang berdasarkan hasil evaluasi tender.',
                                    bidder.vendorId
                                  )}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Trophy className="w-3 h-3 text-amber-300" />
                                  Pilih Menang
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              {isInternal && (
                <button
                  onClick={() => {
                    const t = selectedTenderForBids;
                    setSelectedTenderForBids(null);
                    openWinnerSettingModal(t);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4" /> Buka Menu Setting & Komparasi Lengkap
                </button>
              )}
              <button
                onClick={() => setSelectedTenderForBids(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors ml-auto cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up Detail Company Modal */}
      <CompanyDetailModal
        companyName={companyModalName}
        isOpen={Boolean(companyModalName)}
        onClose={() => setCompanyModalName(null)}
      />
    </div>
  );
}
