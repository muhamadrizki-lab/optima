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
  ArrowUpDown,
  MessageSquare,
  Image as ImageIcon,
  Eye,
  ShieldAlert,
  FileSpreadsheet,
  HelpCircle,
  AlertTriangle,
  Camera
} from 'lucide-react';
import SafeImage from '../components/SafeImage';
import PancaranLogo from '../components/PancaranLogo';
import CompanyDetailModal from '../components/CompanyDetailModal';
import ImageLightboxModal from '../components/ImageLightboxModal';
import SpecTableEditor, { createDefaultSpecTableRows } from '../components/SpecTableEditor';
import { INITIAL_BIDS_DATA } from '../data/biddingData';
import { PRESET_EVIDENCE_PROOFS } from '../data/chatData';
import { logUserActivity } from '../data/activityLogData';

interface CatalogProps {
  user?: User | null;
  onBiddingClick?: (reqId?: string) => void;
  onOpenChat?: (vendorName?: string, tenderId?: string) => void;
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

export const DEFAULT_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'REQ-001',
    title: 'Pengadaan Ban Truk Heavy Duty 11R22.5 Radial Tubeless',
    category: 'Pengadaan Ban & Velg Truk',
    quantity: 50,
    unit: 'Pcs',
    oe: 192500000,
    ownerEstimate: 192500000,
    description: 'Pengadaan 50 unit Ban Radial Tubeless ukuran 11R22.5 16PR untuk armada truk trailer Hino & Scania rute distribusi Jawa-Bali PT Pancaran Logistics.',
    status: 'OPEN',
    deadline: '2026-09-10T17:00:00',
    datePosted: '2026-08-20',
    warranty: 'Garansi Resmi Pabrikan 12 Bulan / 50.000 KM',
    specifications: [
      '40 Pcs Ban Radial 11R22.5 16PR (Bridgestone R156 / Gajah Tunggal GT Radial)',
      '50 Pcs Pentil Ban Tubeless Heavy Duty High Pressure Metal Core',
      '10 Paket Jasa Pasang, Spooring & Balancing Roda Truk Trailer'
    ],
    specTable: [
      { no: 1, nama: 'Ban Radial 11R22.5 16PR (Bridgestone/GT Radial)', brand: 'Bridgestone / GT Radial', qty: 40, uom: 'Pcs', ket: 'Kondisi 100% Baru Tahun 2026' },
      { no: 2, nama: 'Pentil Ban Tubeless Heavy Duty High Pressure', brand: 'Standard OEM', qty: 50, uom: 'Pcs', ket: 'Bahan Kuningan Lapis Krom' },
      { no: 3, nama: 'Jasa Pasang & Balancing Roda Truk Trailer', brand: 'Jasa Workshop', qty: 10, uom: 'Paket', ket: 'Area Cakung & Marunda' }
    ],
    termsAndConditions: 'Pengiriman bertahap 2 gelombang. Sertakan Certificate of Origin (COO) dan Certificate of Analysis (COA) asli distributor.',
    tnc: 'Pengiriman bertahap 2 gelombang. Sertakan Certificate of Origin (COO) dan Certificate of Analysis (COA) asli distributor.',
    topPayment: 'TOP 30 Hari setelah BAST & Invoice diterima lengkap',
    top: 'TOP 30 Hari setelah BAST & Invoice diterima lengkap',
    locationDelivery: 'Depo Pancaran Cakung, Jl. Raya Bekasi KM 24, Jakarta Timur',
    delivery: 'Depo Pancaran Cakung, Jl. Raya Bekasi KM 24, Jakarta Timur',
    taxTerm: 'Include PPH',
    tax: 'Include PPH',
    bidsCount: 1
  },
  {
    id: 'REQ-002',
    title: 'Pengadaan Aki Heavy Duty GS Astra N100 (100 Ah 12V)',
    category: 'Aki & Elektrikal Armada',
    quantity: 30,
    unit: 'Pcs',
    oe: 58500000,
    ownerEstimate: 58500000,
    description: 'Pengadaan Aki Basah Heavy Duty GS Astra N100 / 95E41R untuk peremajaan sistem starter armada truk wingbox & prime mover.',
    status: 'OPEN',
    deadline: '2026-09-05T17:00:00',
    datePosted: '2026-08-22',
    warranty: 'Garansi Resmi Distributor 12 Bulan (One to One Replacement)',
    specifications: [
      '30 Pcs Aki GS Astra Hybrid N100 (100 Ah 12V Heavy Duty)',
      '30 Set Kabel Skun Aki & Terminal Tembaga M10 Heavy Duty'
    ],
    specTable: [
      { no: 1, nama: 'Aki GS Astra Hybrid N100 (100 Ah 12V)', brand: 'GS Astra Genuine', qty: 30, uom: 'Pcs', ket: 'Siap Pakai Lengkap Air Zuur' },
      { no: 2, nama: 'Kabel Skun Aki & Terminal Tembaga M10', brand: 'Heavy Duty OEM', qty: 30, uom: 'Set', ket: 'Bahan Tembaga Lapis Timah' }
    ],
    termsAndConditions: 'Barang 100% baru buatan tahun berjalan. Klaim garansi ganti baru langsung dalam kurun waktu 12 bulan.',
    tnc: 'Barang 100% baru buatan tahun berjalan. Klaim garansi ganti baru langsung dalam kurun waktu 12 bulan.',
    topPayment: 'TOP 14 Hari setelah Invoice Diterima',
    top: 'TOP 14 Hari setelah Invoice Diterima',
    locationDelivery: 'Depo Pancaran Marunda, Kawasan Industri Marunda Center, Jakarta Utara',
    delivery: 'Depo Pancaran Marunda, Kawasan Industri Marunda Center, Jakarta Utara',
    taxTerm: 'Include PPH',
    tax: 'Include PPH',
    bidsCount: 1
  },
  {
    id: 'REQ-003',
    title: 'Pengadaan Suku Cadang Sistem Pengereman & Kopling Hino 500',
    category: 'Pengadaan Suku Cadang Truck',
    quantity: 20,
    unit: 'Set',
    oe: 84000000,
    ownerEstimate: 84000000,
    description: 'Paket pengadaan suku cadang pengereman (Brake Shoe lining) dan Disc Clutch Assy Genuine/OEM Hino FM260TI.',
    status: 'OPEN',
    deadline: '2026-09-15T17:00:00',
    datePosted: '2026-08-24',
    warranty: 'Garansi Orisinalitas OEM Hino 6 Bulan',
    specifications: [
      '20 Set Kampas Rem / Brake Lining Set Hino 500 FM260TI OEM',
      '10 Pcs Plat Kopling / Clutch Disc Assy OEM Hino',
      '20 Pcs Filter Oli Fleetguard LF16015 Heavy Duty'
    ],
    specTable: [
      { no: 1, nama: 'Kampas Rem / Brake Lining Set Hino 500 FM260TI', brand: 'Hino Genuine Parts', qty: 20, uom: 'Set', ket: 'Kemasan Dus Segel Hino' },
      { no: 2, nama: 'Plat Kopling / Clutch Disc Assy OEM Hino', brand: 'Exedy / Hino Genuine', qty: 10, uom: 'Pcs', ket: 'Diameter 430mm Heavy Duty' },
      { no: 3, nama: 'Filter Oli Fleetguard LF16015', brand: 'Fleetguard', qty: 20, uom: 'Pcs', ket: 'Filter Oli Mesin Hino 500' }
    ],
    termsAndConditions: 'Wajib suku cadang Genuine/OEM Hino Indonesia. Fisik item akan diuji tim QC saat serah terima di gudang.',
    tnc: 'Wajib suku cadang Genuine/OEM Hino Indonesia. Fisik item akan diuji tim QC saat serah terima di gudang.',
    topPayment: 'TOP 30 Hari',
    top: 'TOP 30 Hari',
    locationDelivery: 'Gudang Utama Dadap, Pergudangan Nusa Indah, Dadap, Tangerang',
    delivery: 'Gudang Utama Dadap, Pergudangan Nusa Indah, Dadap, Tangerang',
    taxTerm: 'Include PPH',
    tax: 'Include PPH',
    bidsCount: 1
  },
  {
    id: 'REQ-004',
    title: 'Pengadaan Pelumas & Oli Mesin Heavy Duty SAE 15W-40 (Drum 200L)',
    category: 'Pengadaan Oli & Pelumas Heavy Duty',
    quantity: 15,
    unit: 'Drum',
    oe: 127500000,
    ownerEstimate: 127500000,
    description: 'Pengadaan Oli Mesin Diesel Heavy Duty SAE 15W-40 API CK-4/CI-4 kemasan Drum 200 Liter untuk servis berkala armada truk logistik.',
    status: 'OPEN',
    deadline: '2026-09-12T17:00:00',
    datePosted: '2026-08-25',
    warranty: 'Garansi Sertifikasi Keaslian Shell / Mobil Delvac / Pertamina',
    specifications: [
      '15 Drum Oli Mesin Heavy Duty Diesel SAE 15W-40 (Drum 200L)',
      '10 Pail Gemuk / Grease Heavy Duty Lithium EP2 (Pail 18Kg)'
    ],
    specTable: [
      { no: 1, nama: 'Oli Mesin Diesel SAE 15W-40 API CI-4/CK-4 (Drum 200L)', brand: 'Shell Rimula R4X / Mobil Delvac', qty: 15, uom: 'Drum', ket: 'Kemasan Drum Bersegel 200 Litres' },
      { no: 2, nama: 'Grease Heavy Duty Lithium EP2 (Pail 18Kg)', brand: 'Pertamina / Shell', qty: 10, uom: 'Pail', ket: 'Gemuk Pelumas Chasis & Bearing' }
    ],
    termsAndConditions: 'Wajib menyertakan Certificate of Analysis (COA) per batch pengiriman. Drum harus dalam keadaan tersegel pabrikan utuh.',
    tnc: 'Wajib menyertakan Certificate of Analysis (COA) per batch pengiriman. Drum harus dalam keadaan tersegel pabrikan utuh.',
    topPayment: 'TOP 45 Hari',
    top: 'TOP 45 Hari',
    locationDelivery: 'Depo Pancaran Surabaya, Kawasan Industri Rungkut, Surabaya, Jawa Timur',
    delivery: 'Depo Pancaran Surabaya, Kawasan Industri Rungkut, Surabaya, Jawa Timur',
    taxTerm: 'Include PPH',
    tax: 'Include PPH',
    bidsCount: 1
  },
  {
    id: 'REQ-005',
    title: 'Pengadaan Perangkat Laptop Workstation IT & Scanner Barcode Gudang',
    category: 'Perangkat IT & Peralatan Kantor',
    quantity: 10,
    unit: 'Unit',
    oe: 145000000,
    ownerEstimate: 145000000,
    description: 'Peremajaan fasilitas perangkat IT operasional berupa 5 unit Laptop Core i7 16GB RAM & 5 unit Industrial Wireless Barcode Scanner Gudang.',
    status: 'OPEN',
    deadline: '2026-09-20T17:00:00',
    datePosted: '2026-08-26',
    warranty: 'Garansi Resmi Onsite Brand 24 Bulan',
    specifications: [
      '5 Unit Laptop Business Workstation Intel Core i7 16GB 512GB SSD 14 inch',
      '5 Unit Industrial Wireless Barcode Scanner 2D Heavy Duty IP65'
    ],
    specTable: [
      { no: 1, nama: 'Laptop Business Workstation Intel Core i7 16GB RAM 512GB SSD', brand: 'Lenovo ThinkPad / HP ProBook', qty: 5, uom: 'Unit', ket: 'Garansi Onsite 2 Tahun Resmi' },
      { no: 2, nama: 'Industrial Wireless Barcode Scanner 2D IP65 Waterproof', brand: 'Honeywell / Zebra', qty: 5, uom: 'Unit', ket: 'Lengkap Cradle Charge & USB Dongle' }
    ],
    termsAndConditions: 'Unit garansi resmi Indonesia. Pengiriman mencakup pengujian unit dan instalasi awal tim IT Pancaran.',
    tnc: 'Unit garansi resmi Indonesia. Pengiriman mencakup pengujian unit dan instalasi awal tim IT Pancaran.',
    topPayment: 'TOP 30 Hari',
    top: 'TOP 30 Hari',
    locationDelivery: 'Head Office PT Pancaran Darma Transport, Sunter Agung, Jakarta Utara',
    delivery: 'Head Office PT Pancaran Darma Transport, Sunter Agung, Jakarta Utara',
    taxTerm: 'Include PPH',
    tax: 'Include PPH',
    bidsCount: 1
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

const sanitizeAndDeduplicateItems = (rawItems: any[]): CatalogItem[] => {
  const seenIds = new Set<string>();
  const result: CatalogItem[] = [];
  if (!Array.isArray(rawItems)) return [];
  for (const item of rawItems) {
    if (!item || !item.id) continue;
    let uniqueId = item.id;
    if (seenIds.has(uniqueId)) {
      let counter = 1;
      while (seenIds.has(`${item.id}_${counter}`)) {
        counter++;
      }
      uniqueId = `${item.id}_${counter}`;
    }
    seenIds.add(uniqueId);
    const match = DEFAULT_CATALOG_ITEMS.find(d => d.id === item.id);
    const tnc = item.tnc || item.termsAndConditions || match?.tnc || match?.termsAndConditions || 'Sertakan garansi & kelengkapan resmi.';
    const top = item.top || item.topPayment || match?.top || match?.topPayment || 'TOP 30 Hari setelah BAST & Invoice';
    const delivery = item.delivery || item.locationDelivery || match?.delivery || match?.locationDelivery || 'Depo PT Pancaran Logistics';
    const tax = item.tax || item.taxTerm || match?.tax || match?.taxTerm || 'Include PPH';
    const ownerEstimate = item.ownerEstimate || item.oe || match?.ownerEstimate || match?.oe || 0;

    result.push({
      ...item,
      id: uniqueId,
      tnc,
      termsAndConditions: tnc,
      top,
      topPayment: top,
      delivery,
      locationDelivery: delivery,
      tax,
      taxTerm: tax,
      ownerEstimate,
      oe: ownerEstimate,
      specTable: (item.specTable && item.specTable.length > 0) ? item.specTable : (match?.specTable || []),
      deadline: item.deadline || match?.deadline || '2026-08-31T17:00:00',
      datePosted: item.datePosted || match?.datePosted || '2026-08-15',
      warranty: item.warranty || match?.warranty || 'Garansi Resmi Distributor',
      lowestBid: item.lowestBid || Math.round(ownerEstimate * 0.95)
    });
  }
  return result;
};

export default function CatalogKebutuhan({ user, onBiddingClick, onOpenChat }: CatalogProps) {
  const isInternal = user?.role === 'INTERNAL';
  
  const [items, setItems] = useState<CatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('optima_catalog_kebutuhan');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeAndDeduplicateItems(parsed);
          if (sanitized.length > 0) return sanitized;
        }
      }
    } catch (e) {
      console.error('Error loading catalog items:', e);
    }
    // Store defaults in localStorage so Firebase syncs them
    try {
      localStorage.setItem('optima_catalog_kebutuhan', JSON.stringify(DEFAULT_CATALOG_ITEMS));
    } catch {}
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
              if (parsed.length === 0) {
                setItems(DEFAULT_CATALOG_ITEMS);
                localStorage.setItem('optima_catalog_kebutuhan', JSON.stringify(DEFAULT_CATALOG_ITEMS));
              } else {
                setItems(sanitizeAndDeduplicateItems(parsed));
              }
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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED' | 'WON'>('ALL');
  const [sortBy, setSortBy] = useState<'TERBARU' | 'TERLAMA' | 'DEADLINE' | 'ANGGARAN_TINGGI' | 'ANGGARAN_RENDAH'>('TERBARU');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTender, setEditingTender] = useState<CatalogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [selectedTenderForBids, setSelectedTenderForBids] = useState<CatalogItem | null>(null);
  const [settingWinnerTender, setSettingWinnerTender] = useState<CatalogItem | null>(null);
  const [companyModalName, setCompanyModalName] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; title?: string; subtitle?: string } | null>(null);

  // Justification / Override Modal State (for Juara 2 / non-Juara 1 winner selection)
  const [justificationModalData, setJustificationModalData] = useState<{
    tender: CatalogItem;
    selectedBidder: BidderItem;
    rank: number;
    rank1Bidder: BidderItem;
  } | null>(null);
  const [winnerReasonCategory, setWinnerReasonCategory] = useState<'STOCK_KOSONG' | 'LEAD_TIME' | 'SPESIFIKASI_TIDAK_LOLOS' | 'TOP_TIDAK_SESUAI' | 'LAINNYA'>('STOCK_KOSONG');
  const [winnerReasonNotes, setWinnerReasonNotes] = useState('');
  const [winnerEvidencePhoto, setWinnerEvidencePhoto] = useState<string | null>(null);

  // Winner Form State
  const [winnerFormTab, setWinnerFormTab] = useState<'LIST' | 'MANUAL'>('LIST');
  const [manualWinnerName, setManualWinnerName] = useState('');
  const [manualWinnerAmount, setManualWinnerAmount] = useState<number>(0);
  const [manualWinnerTOP, setManualWinnerTOP] = useState('Net 30 Hari');
  const [manualWinnerNotes, setManualWinnerNotes] = useState('');
  const [manualReasonCategory, setManualReasonCategory] = useState<'STOCK_KOSONG' | 'LEAD_TIME' | 'SPESIFIKASI_TIDAK_LOLOS' | 'TOP_TIDAK_SESUAI' | 'LAINNYA'>('STOCK_KOSONG');
  const [manualEvidencePhoto, setManualEvidencePhoto] = useState<string | null>(null);
  const [targetTenderStatus, setTargetTenderStatus] = useState<'OPEN' | 'CLOSED'>('CLOSED');

  // New Post Form
  const [newPost, setNewPost] = useState<Partial<CatalogItem>>({
    status: 'OPEN',
    title: '',
    description: '',
    imageUrl: '',
    warranty: 'Garansi Resmi Distributor 12-36 Bulan',
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
  const [tenderToDelete, setTenderToDelete] = useState<CatalogItem | null>(null);

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
    const existingNums = items.map(i => {
      const match = i.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(0, ...existingNums);
    const id = `REQ-${String(maxNum + 1).padStart(3, '0')}`;
    const datePosted = new Date().toISOString().split('T')[0];

    const validTable = createSpecTable.filter(r => r.nama.trim() || r.brand.trim());
    const finalTable = validTable.length > 0 ? validTable.map((r, i) => ({ ...r, no: i + 1 })) : createSpecTable;

    const generatedSpecs = finalTable.map(r => `${r.nama}${r.brand ? ' - ' + r.brand : ''} (${r.qty} ${r.uom})${r.ket ? ' - ' + r.ket : ''}`);

    const item: CatalogItem = {
      ...newPost,
      id,
      datePosted,
      deadline: newPost.deadline || '2026-08-31T17:00:00',
      warranty: newPost.warranty || 'Garansi Resmi Distributor & Garansi Purna Jual',
      specifications: generatedSpecs.length > 0 ? generatedSpecs : specList.filter(s => s.trim() !== ''),
      specTable: finalTable,
      ownerEstimate: Number(newPost.ownerEstimate) || 0,
      bidsCount: 0,
      lowestBid: 0,
      highestBid: 0
    } as CatalogItem;
    
    setItems([item, ...items]);
    setIsCreating(false);
    setNewPost({ status: 'OPEN', title: '', description: '', imageUrl: '', warranty: 'Garansi Resmi Distributor 12-36 Bulan', tnc: '', top: '', delivery: '', tax: 'Include PPH', ownerEstimate: 0, deadline: '2026-08-31T17:00' });
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
    setManualReasonCategory(item.winnerReasonCategory || 'STOCK_KOSONG');
    setManualEvidencePhoto(item.winnerEvidencePhoto || null);
    setTargetTenderStatus(item.status);
  };

  // Set Winner function with extra override details and user activity logging
  const handleAssignWinner = (
    tenderId: string, 
    vendorName: string, 
    amount: number, 
    topInfo: string, 
    notes: string,
    vendorId?: string,
    extra?: {
      rank?: number;
      reasonCategory?: 'STOCK_KOSONG' | 'LEAD_TIME' | 'SPESIFIKASI_TIDAK_LOLOS' | 'TOP_TIDAK_SESUAI' | 'LAINNYA';
      evidencePhoto?: string;
      evidenceDescription?: string;
      originalRank1VendorName?: string;
      originalRank1Amount?: number;
    }
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
          winnerNotes: notes,
          winnerRank: extra?.rank || 1,
          winnerReasonCategory: extra?.reasonCategory,
          winnerEvidencePhoto: extra?.evidencePhoto,
          winnerEvidenceDescription: extra?.evidenceDescription,
          winnerOriginalRank1VendorName: extra?.originalRank1VendorName,
          winnerOriginalRank1Amount: extra?.originalRank1Amount
        };
      }
      return item;
    });

    setItems(updated);
    try {
      localStorage.setItem('optima_catalog_kebutuhan', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving catalog:', e);
    }

    // Log Activity in Audit Trail
    try {
      logUserActivity({
        userId: user?.id || 'USR-INT',
        userName: user?.name || 'Tim Internal Procurement',
        userEmail: user?.email || 'muhamad.rizki@pancaran-logistic.id',
        companyName: 'PT Pancaran Darat Transport (Internal)',
        role: 'INTERNAL',
        vendorType: 'PROCUREMENT',
        actionType: 'WINNER_ASSIGNED',
        actionTitle: `Penetapan Pemenang Tender ${tenderId}`,
        actionDetail: `${vendorName} resmi ditetapkan sebagai Pemenang Tender ${tenderId} dengan nilai penawaran Rp ${amount.toLocaleString('id-ID')}${extra?.rank && extra.rank > 1 ? ` (Juara ${extra.rank} - Berita Acara Alasan: ${extra.reasonCategory || 'Stok Juara 1 Kosong'})` : ''}.`,
        status: 'SUCCESS',
        evidencePhoto: extra?.evidencePhoto,
        targetId: tenderId
      });
    } catch (e) {
      console.error('Error logging user activity:', e);
    }

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

    setJustificationModalData(null);
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
          winnerPaymentMethod: undefined,
          winnerRank: undefined,
          winnerReasonCategory: undefined,
          winnerEvidencePhoto: undefined,
          winnerOriginalRank1VendorName: undefined,
          winnerOriginalRank1Amount: undefined
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
    const targetItem = items.find(i => i.id === tenderId);
    if (targetItem) {
      setTenderToDelete(targetItem);
    } else {
      performDeleteTender(tenderId);
    }
  };

  const performDeleteTender = (tenderId: string) => {
    const updated = items.filter(item => item.id !== tenderId);
    setItems(updated);
    try {
      localStorage.setItem('optima_catalog_kebutuhan', JSON.stringify(updated));
      
      // Clean up related bids in optima_bids_history
      const savedBids = localStorage.getItem('optima_bids_history');
      if (savedBids) {
        try {
          const parsedBids = JSON.parse(savedBids);
          if (Array.isArray(parsedBids)) {
            const updatedBids = parsedBids.filter((bid: any) => bid.tenderId !== tenderId && bid.reqId !== tenderId);
            localStorage.setItem('optima_bids_history', JSON.stringify(updatedBids));
            window.dispatchEvent(new CustomEvent('optima-db-updated', { detail: { key: 'optima_bids_history' } }));
          }
        } catch (err) {
          console.error('Error removing related bids:', err);
        }
      }

      window.dispatchEvent(new CustomEvent('optima-db-updated', { detail: { key: 'optima_catalog_kebutuhan' } }));
    } catch (e) {
      console.error('Error deleting tender:', e);
    }
    showToast(`Tender ${tenderId} berhasil dihapus.`);
  };

  const handleConfirmDeleteTender = () => {
    if (!tenderToDelete) return;
    performDeleteTender(tenderToDelete.id);
    setTenderToDelete(null);
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

  // Generate Bidders list for a given tender matching bidsCount
  const getBiddersForTender = (tender: CatalogItem): BidderItem[] => {
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

    // Target count is strictly based on tender.bidsCount or real bids
    // If tender.bidsCount is 0, targetCount is 0 (no mock bidders generated)
    const targetCount = tender.bidsCount !== undefined ? tender.bidsCount : realMapped.length;

    const vendorPool = [
      { name: 'PT Tesvendor', email: 'sales@tesvendor.co.id', phone: '0812-3344-5566', ratio: 0.95, notes: 'Penawaran kompetitif & garansi resmi.' }
    ];

    const result: BidderItem[] = [...realMapped];

    // Add generated bidders until reaching targetCount ONLY if targetCount > 0
    let poolIndex = 0;
    while (targetCount > 0 && result.length < targetCount && poolIndex < vendorPool.length) {
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

    // Sort all bidders ascending by price (Juara 1 is always the lowest bidder)
    result.sort((a, b) => a.amount - b.amount);

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
    const matchStatus = statusFilter === 'ALL' || 
      (statusFilter === 'WON' ? Boolean(item.winnerVendorName || (item.winnerAmount && Number(item.winnerAmount) > 0)) : item.status === statusFilter);
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ketentuan Garansi / Warranty</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Garansi Resmi Distributor 12-36 Bulan" 
                    value={editingTender.warranty || ''} 
                    onChange={e => setEditingTender({...editingTender, warranty: e.target.value})} 
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ketentuan Garansi / Warranty</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Garansi Resmi Distributor 12-36 Bulan" 
                    value={newPost.warranty} 
                    onChange={e => setNewPost({...newPost, warranty: e.target.value})} 
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
                <button
                  onClick={() => setStatusFilter('WON')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'WON' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🏆 Tender Menang ({items.filter(i => i.winnerVendorName || (i.winnerAmount && Number(i.winnerAmount) > 0)).length})
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
              filteredItems.map((item, idx) => {
                const hasWinner = Boolean(item.winnerVendorName);
                const isClosed = item.status === 'CLOSED';

                return (
                  <div 
                    key={`${item.id}-${idx}`} 
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

                        {/* Terms & Conditions Bar (Including Warranty Display) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                          <div className="bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/80">
                            <span className="text-[9px] font-black text-indigo-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <ShieldCheck className="w-3 h-3 mr-1 text-indigo-600" />
                              Terms & Conditions
                            </span>
                            <p className="text-[11px] font-semibold text-slate-800 leading-snug">{item.tnc || item.termsAndConditions || 'Barang 100% Original & Bergaransi Resmi.'}</p>
                          </div>
                          <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/80">
                            <span className="text-[9px] font-black text-purple-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <Award className="w-3 h-3 mr-1 text-purple-600" />
                              Ketentuan Garansi
                            </span>
                            <p className="text-[11px] font-bold text-purple-950 leading-snug">
                              🛡️ {item.warranty || 'Garansi Resmi Distributor'}
                            </p>
                          </div>
                          <div className="bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/80">
                            <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <CreditCard className="w-3 h-3 mr-1 text-blue-600" />
                              TOP (Term of Payment)
                            </span>
                            <p className="text-[11px] font-semibold text-slate-800 leading-snug">{item.top || item.topPayment || 'TOP 30 Hari'}</p>
                          </div>
                          <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/80">
                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <Truck className="w-3 h-3 mr-1 text-emerald-600" />
                              Pengiriman / Lokasi
                            </span>
                            <p className="text-[11px] font-semibold text-slate-800 leading-snug">{item.delivery || item.locationDelivery || 'Depo PT Pancaran Logistics'}</p>
                          </div>
                          <div className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/80">
                            <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block mb-0.5 flex items-center">
                              <DollarSign className="w-3 h-3 mr-1 text-amber-600" />
                              Ketentuan Pajak
                            </span>
                            <p className="text-[11px] font-semibold text-slate-800 leading-snug">{item.tax || item.taxTerm || 'Include PPH'}</p>
                          </div>
                        </div>

                        {/* WINNER OFFICIAL BANNER (IF ASSIGNED) */}
                        {item.winnerVendorName && (
                          <div className="mb-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-4 rounded-2xl border border-emerald-500/40 shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-black text-lg shrink-0 shadow-xs">
                                  {item.winnerRank && item.winnerRank > 1 ? `🥈 #2` : `🥇 #1`}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                      Pemenang Resmi {item.winnerRank && item.winnerRank > 1 ? `Juara ${item.winnerRank}` : `Juara 1`}
                                    </span>
                                    {item.winnerRank && item.winnerRank > 1 && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                        ⚠️ Pengalihan: {item.winnerReasonCategory === 'STOCK_KOSONG' ? 'Stok Juara 1 Kosong' : item.winnerReasonCategory || 'Stok Kosong'}
                                      </span>
                                    )}
                                  </div>
                                  <h4 
                                    onClick={() => setCompanyModalName(item.winnerVendorName!)}
                                    className="text-base font-black text-white mt-1 hover:text-amber-300 hover:underline cursor-pointer flex items-center gap-1.5"
                                  >
                                    {item.winnerVendorName}
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  </h4>
                                  <p className="text-xs text-slate-300 mt-0.5">
                                    Nilai Kesepakatan: <strong className="text-amber-300 font-mono">{formatRp(item.winnerAmount || 0)}</strong> • {item.winnerPaymentMethod}
                                  </p>
                                  {item.winnerNotes && (
                                    <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-1">
                                      "{item.winnerNotes}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 shrink-0">
                                {item.winnerEvidencePhoto && (
                                  <button
                                    onClick={() => setLightboxPhoto({
                                      url: item.winnerEvidencePhoto!,
                                      title: `Bukti Lampiran Chat / Dokumen Penetapan Juara ${item.winnerRank || 2}`,
                                      subtitle: `${item.title} • Alasan: ${item.winnerReasonCategory || 'Stok Kosong'}`
                                    })}
                                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                                    Lihat Bukti Foto Chat
                                  </button>
                                )}
                                <button
                                  onClick={() => onOpenChat?.(item.winnerVendorName!, item.id)}
                                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                                  Chat Vendor
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Footer Actions & OE Stats */}
                        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="flex flex-row items-center gap-x-5 sm:gap-x-6 flex-wrap sm:flex-nowrap">
                            <div>
                              <p className="text-xs text-slate-500 font-medium mb-0.5 flex items-center">
                                <Target className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                                Estimasi Nilai (OE)
                              </p>
                              <p className="text-lg font-black text-emerald-600">
                                {(item.ownerEstimate || item.oe) ? formatRp(item.ownerEstimate || item.oe || 0) : 'Tidak Ditampilkan'}
                              </p>
                            </div>
                            
                            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                            <div 
                              onClick={() => setSelectedTenderForBids(item)}
                              className="cursor-pointer group p-1.5 rounded-xl hover:bg-blue-50/80 transition-all border border-transparent hover:border-blue-100"
                              title="Klik untuk melihat siapa saja vendor yang bidding"
                            >
                              <p className="text-xs text-slate-500 font-medium mb-0.5 flex items-center group-hover:text-blue-600 transition-colors">
                                <Users className="w-3.5 h-3.5 mr-1 text-slate-500 group-hover:text-blue-600" />
                                Total Bidding <span className="text-[10px] text-blue-600 font-bold ml-1 bg-blue-100 px-1 rounded-md group-hover:bg-blue-200">(Detail)</span>
                              </p>
                              <p className="text-lg font-black text-slate-800 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                                <span>{getBiddersForTender(item).length} Bidders</span>
                                <span className="text-[10px] text-blue-600 underline font-semibold">Lihat</span>
                              </p>
                            </div>

                            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                            <div 
                              onClick={() => setSelectedTenderForBids(item)}
                              className="cursor-pointer group p-1.5 rounded-xl hover:bg-emerald-50/80 transition-all border border-transparent hover:border-emerald-100"
                              title="Tracking Penawaran Terendah"
                            >
                              <p className="text-xs text-slate-500 font-medium mb-0.5 flex items-center group-hover:text-emerald-600 transition-colors">
                                <TrendingDown className="w-3.5 h-3.5 mr-1 text-emerald-500 group-hover:text-emerald-600" />
                                Penawaran Terendah
                              </p>
                              <p className="text-lg font-black text-emerald-600 group-hover:text-emerald-700 transition-colors">
                                {(() => {
                                  const bidders = getBiddersForTender(item);
                                  if (bidders.length === 0) return '-';
                                  const lowest = Math.min(...bidders.map(b => b.amount));
                                  return formatRp(lowest);
                                })()}
                              </p>
                            </div>
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
                                  {hasWinner ? 'Kelola Pemenang' : 'Pilih Pemenang'}
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
                  <p className="text-sm font-bold text-slate-800">{getBiddersForTender(settingWinnerTender).length} Vendor</p>
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
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        Pilih vendor penawar di bawah ini untuk menetapkannya sebagai pemenang resmi.
                      </p>
                      <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg font-bold">
                        ⚠️ Memilih Juara 2 ke atas wajib melampirkan Alasan & Bukti Foto Chat
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      <table className="w-full text-left text-xs text-slate-600 border-collapse">
                        <thead className="bg-slate-100/80 text-slate-700 font-extrabold uppercase text-[11px] border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 text-center w-16">Peringkat</th>
                            <th className="px-4 py-3">Nama Vendor Rekanan</th>
                            <th className="px-4 py-3 text-right">Nilai Penawaran</th>
                            <th className="px-4 py-3">Term of Payment (TOP) & Garansi</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {(() => {
                            const sortedBidders = getBiddersForTender(settingWinnerTender);
                            if (sortedBidders.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                      <Users className="w-7 h-7 text-slate-300 mx-auto" />
                                      <p className="font-bold text-slate-600 text-xs">Belum Ada Penawaran Vendor Masuk</p>
                                      <p className="text-xs text-slate-400">Gunakan tab "Input Penetapan Pemenang Kustom" jika ingin menentukan pemenang secara manual.</p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                            const rank1Bidder = sortedBidders[0];

                            return sortedBidders.map((bidder, idx) => {
                              const rank = idx + 1;
                              const isCurrentWinner = settingWinnerTender.winnerVendorName === bidder.vendorName;
                              const oe = settingWinnerTender.ownerEstimate || bidder.amount;
                              const diffPercent = Math.round(((oe - bidder.amount) / oe) * 100);

                              return (
                                <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isCurrentWinner ? 'bg-emerald-50/50' : rank === 1 ? 'bg-amber-50/20' : ''}`}>
                                  <td className="px-4 py-3.5 text-center">
                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs shadow-2xs ${
                                      rank === 1 
                                        ? 'bg-amber-400 text-slate-900 border border-amber-500/40' 
                                        : rank === 2 
                                          ? 'bg-slate-300 text-slate-900 border border-slate-400' 
                                          : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      #{rank}
                                    </span>
                                  </td>

                                  <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                      <div 
                                        onClick={() => setCompanyModalName(bidder.vendorName)}
                                        className="font-bold text-slate-900 text-sm flex items-center gap-1.5 cursor-pointer hover:text-blue-600 hover:underline"
                                        title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                                      >
                                        {bidder.vendorName}
                                        {isCurrentWinner && <Award className="w-4 h-4 text-emerald-600" />}
                                      </div>
                                      <button
                                        onClick={() => onOpenChat?.(bidder.vendorName, settingWinnerTender.id)}
                                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                        title="Chat Vendor Ini"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                      </button>
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
                                    <div className="text-[11px] text-purple-700 font-semibold mt-0.5">🛡️ {bidder.warranty}</div>
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
                                    ) : rank === 1 ? (
                                      <button
                                        onClick={() => handleAssignWinner(
                                          settingWinnerTender.id,
                                          bidder.vendorName,
                                          bidder.amount,
                                          `${bidder.top} • ${bidder.warranty}`,
                                          bidder.notes || 'Penetapan pemenang otomatis berdasarkan harga penawaran terendah Juara 1.',
                                          bidder.vendorId,
                                          { rank: 1 }
                                        )}
                                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 mx-auto cursor-pointer"
                                      >
                                        <Trophy className="w-3.5 h-3.5 text-amber-300" />
                                        Pilih Juara 1
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setJustificationModalData({
                                            tender: settingWinnerTender,
                                            selectedBidder: bidder,
                                            rank: rank,
                                            rank1Bidder: rank1Bidder
                                          });
                                          setWinnerReasonCategory('STOCK_KOSONG');
                                          setWinnerReasonNotes(`Berdasarkan konfirmasi tertulis & chat resmi dari vendor Juara 1 (${rank1Bidder.vendorName}), stok barang saat ini kosong/habis. Maka sesuai hasil evaluasi pengadaan, pemenang dialihkan ke Juara ${rank} (${bidder.vendorName}) yang memiliki stok ready dan siap kirim.`);
                                          setWinnerEvidencePhoto(PRESET_EVIDENCE_PROOFS[0].imageUrl);
                                        }}
                                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 mx-auto cursor-pointer"
                                        title={`Tetapkan Juara ${rank} (Wajib Berita Acara & Bukti Foto Chat)`}
                                      >
                                        <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
                                        Pilih Juara {rank}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            });
                          })()}
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
                        manualWinnerNotes,
                        undefined,
                        {
                          rank: 2,
                          reasonCategory: manualReasonCategory,
                          evidencePhoto: manualEvidencePhoto || undefined,
                          evidenceDescription: manualWinnerNotes
                        }
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kategori Alasan Penetapan</label>
                        <select
                          value={manualReasonCategory}
                          onChange={e => setManualReasonCategory(e.target.value as any)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="STOCK_KOSONG">Stok Juara 1 Kosong / Habis (Ready di Vendor Ini)</option>
                          <option value="LEAD_TIME">Lead Time Pengiriman Lebih Cepat</option>
                          <option value="SPESIFIKASI_TIDAK_LOLOS">Spesifikasi & Garansi Lebih Terjamin</option>
                          <option value="TOP_TIDAK_SESUAI">Term of Payment Lebih Sesuai Kebijakan</option>
                          <option value="LAINNYA">Alasan Teknis Khusus / Evaluasi Internal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lampiran Bukti Foto Chat / Dokumen</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setManualEvidencePhoto(PRESET_EVIDENCE_PROOFS[0].imageUrl)}
                            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            Gunakan Bukti Chat Preset
                          </button>
                          {manualEvidencePhoto && (
                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Terlampir
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Catatan Berita Acara / Alasan Penetapan Pemenang (Wajib)</label>
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
      {/* ⚠️ MODAL: JUSTIFIKASI & BERITA ACARA PEMENANG JUARA 2 / OVERRIDE JUARA 1  */}
      {/* ========================================================================= */}
      {justificationModalData && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-amber-200 my-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-amber-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-amber-100 uppercase">BERITA ACARA PENGALIHAN PEMENANG</div>
                  <h3 className="text-lg font-black text-white">
                    Form Penetapan Juara {justificationModalData.rank} Sebagai Pemenang
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setJustificationModalData(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Comparison Notice */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  Anda sedang menetapkan Vendor dengan penawaran bukan Juara 1 (Terendah):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">❌ Juara 1 (Terendah - Dibatalkan)</div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{justificationModalData.rank1Bidder.vendorName}</div>
                    <div className="font-mono font-bold text-slate-600 text-xs">{formatRp(justificationModalData.rank1Bidder.amount)}</div>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase">🎯 Pilihan Pemenang (Juara {justificationModalData.rank})</div>
                    <div className="font-bold text-emerald-950 text-sm mt-0.5">{justificationModalData.selectedBidder.vendorName}</div>
                    <div className="font-mono font-bold text-emerald-700 text-xs">{formatRp(justificationModalData.selectedBidder.amount)}</div>
                  </div>
                </div>

                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  Sesuai SOP Procurement Pancaran, pengalihan pemenang ke Juara {justificationModalData.rank} wajib mencantumkan <strong>Kategori Alasan</strong>, <strong>Catatan Berita Acara</strong>, dan <strong>Bukti Foto Chat/Dokumen Resmi</strong> (misalnya karena stok kosong/lead time).
                </p>
              </div>

              {/* 1. Kategori Alasan (Wajib) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                  1. Kategori Alasan Pengalihan Pemenang <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'STOCK_KOSONG', label: '📦 Stok Juara 1 Kosong / Habis di Pabrik', desc: 'Vendor Juara 1 mengonfirmasi stok habis/kosong.' },
                    { id: 'LEAD_TIME', label: '⏳ Lead Time Juara 1 Terlalu Lama', desc: 'Waktu inden tidak memenuhi target operasional.' },
                    { id: 'SPESIFIKASI_TIDAK_LOLOS', label: '🛡️ Spesifikasi / Garansi Tidak Memenuhi TOR', desc: 'Uji teknis atau masa garansi tidak sesuai standar.' },
                    { id: 'TOP_TIDAK_SESUAI', label: '💳 Term of Payment Tidak Sesuai', desc: 'Ketentuan termin pembayaran Juara 1 tidak disetujui.' },
                    { id: 'LAINNYA', label: '📝 Alasan Khusus Lainnya', desc: 'Evaluasi khusus tim manajemen procurement.' }
                  ].map((cat) => (
                    <label 
                      key={cat.id} 
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        winnerReasonCategory === cat.id 
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reasonCategory"
                        value={cat.id}
                        checked={winnerReasonCategory === cat.id}
                        onChange={() => setWinnerReasonCategory(cat.id as any)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-xs font-bold leading-tight">{cat.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Catatan Noted Berita Acara (Wajib) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  2. Catatan / Noted Detail Berita Acara <span className="text-rose-600">* (Wajib)</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={winnerReasonNotes}
                  onChange={e => setWinnerReasonNotes(e.target.value)}
                  placeholder="Jelaskan alasan pengalihan, hasil koordinasi chat dengan vendor Juara 1, dan persetujuan manager..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* 3. Bukti Foto Chat / Dokumen (Wajib) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase">
                    3. Lampiran Bukti Foto Chat / Screenshot Konfirmasi <span className="text-rose-600">* (Wajib)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Format: JPG, PNG, WebP</span>
                </div>

                {/* Preset Quick Buttons */}
                <div className="mb-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600">Pilih Cepat Template Screenshot Bukti Chat Resmi:</div>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_EVIDENCE_PROOFS.map((proof, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setWinnerEvidencePhoto(proof.imageUrl);
                          setWinnerReasonNotes(proof.description);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                          winnerEvidencePhoto === proof.imageUrl 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        {proof.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Evidence Photo Preview or Upload Box */}
                {winnerEvidencePhoto ? (
                  <div className="relative border-2 border-emerald-400 rounded-2xl p-3 bg-emerald-50/40 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={winnerEvidencePhoto} 
                        alt="Bukti Foto Chat" 
                        className="w-20 h-16 object-cover rounded-xl border border-slate-300 shadow-xs cursor-pointer"
                        onClick={() => setLightboxPhoto({
                          url: winnerEvidencePhoto,
                          title: 'Bukti Foto Chat / Konfirmasi Vendor',
                          subtitle: winnerReasonNotes
                        })}
                      />
                      <div>
                        <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Bukti Foto Berhasil Dilampirkan
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Klik gambar untuk memperbesar (Lightbox Zoom)
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setWinnerEvidencePhoto(null)}
                      className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                      title="Hapus Bukti Foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-4 text-center bg-slate-50/60 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      id="evidence-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setWinnerEvidencePhoto(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="evidence-upload" className="cursor-pointer block">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs font-bold text-blue-600 hover:underline block">
                        Upload Bukti Foto Chat / Screenshot Notulen
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Tarik & lepaskan file di sini atau klik salah satu template di atas
                      </span>
                    </label>
                  </div>
                )}

                {!winnerEvidencePhoto && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Wajib melampirkan bukti foto chat konfirmasi sebelum menyimpan keputusan.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setJustificationModalData(null)}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={!winnerEvidencePhoto || winnerReasonNotes.trim().length < 5}
                onClick={() => {
                  handleAssignWinner(
                    justificationModalData.tender.id,
                    justificationModalData.selectedBidder.vendorName,
                    justificationModalData.selectedBidder.amount,
                    `${justificationModalData.selectedBidder.top} • ${justificationModalData.selectedBidder.warranty}`,
                    winnerReasonNotes,
                    justificationModalData.selectedBidder.vendorId,
                    {
                      rank: justificationModalData.rank,
                      reasonCategory: winnerReasonCategory,
                      evidencePhoto: winnerEvidencePhoto!,
                      evidenceDescription: winnerReasonNotes,
                      originalRank1VendorName: justificationModalData.rank1Bidder.vendorName,
                      originalRank1Amount: justificationModalData.rank1Bidder.amount
                    }
                  );
                }}
                className={`px-6 py-2.5 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  !winnerEvidencePhoto || winnerReasonNotes.trim().length < 5
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                Sahkan & Tetapkan Juara {justificationModalData.rank} Sebagai Pemenang
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
                      <th className="px-4 py-3 text-center w-14">Rank</th>
                      <th className="px-4 py-3">Nama Vendor</th>
                      <th className="px-4 py-3 text-right">Nilai Penawaran</th>
                      <th className="px-4 py-3 text-center">Tanggal & Waktu</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      {isInternal && <th className="px-4 py-3 text-center">Aksi Tim Internal</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-medium">
                    {(() => {
                      const sortedBidders = getBiddersForTender(selectedTenderForBids);
                      const rank1Bidder = sortedBidders[0];

                      return sortedBidders.map((bidder, idx) => {
                        const rank = idx + 1;
                        const isWinner = selectedTenderForBids.winnerVendorName === bidder.vendorName;

                        return (
                          <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isWinner ? 'bg-emerald-50/60' : ''}`}>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-bold text-[11px] ${
                                rank === 1 ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'
                              }`}>
                                #{rank}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <div 
                                  onClick={() => setCompanyModalName(bidder.vendorName)}
                                  className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 hover:underline"
                                  title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                                >
                                  {bidder.vendorName}
                                  {isWinner && <Award className="w-4 h-4 text-emerald-600" />}
                                </div>
                                <button
                                  onClick={() => onOpenChat?.(bidder.vendorName, selectedTenderForBids.id)}
                                  className="p-1 text-slate-400 hover:text-blue-600 rounded-md transition-colors cursor-pointer"
                                  title="Chat Vendor"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
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
                                ) : rank === 1 ? (
                                  <button
                                    onClick={() => handleAssignWinner(
                                      selectedTenderForBids.id,
                                      bidder.vendorName,
                                      bidder.amount,
                                      `${bidder.top} • ${bidder.warranty}`,
                                      bidder.notes || 'Penetapan pemenang berdasarkan hasil evaluasi tender.',
                                      bidder.vendorId,
                                      { rank: 1 }
                                    )}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trophy className="w-3 h-3 text-amber-300" />
                                    Pilih Menang
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      const currentTender = selectedTenderForBids;
                                      setSelectedTenderForBids(null);
                                      setJustificationModalData({
                                        tender: currentTender,
                                        selectedBidder: bidder,
                                        rank: rank,
                                        rank1Bidder: rank1Bidder
                                      });
                                      setWinnerReasonCategory('STOCK_KOSONG');
                                      setWinnerReasonNotes(`Berdasarkan konfirmasi tertulis & chat resmi dari vendor Juara 1 (${rank1Bidder.vendorName}), stok barang saat ini kosong/habis. Maka sesuai hasil evaluasi pengadaan, pemenang dialihkan ke Juara ${rank} (${bidder.vendorName}) yang memiliki stok ready.`);
                                      setWinnerEvidencePhoto(PRESET_EVIDENCE_PROOFS[0].imageUrl);
                                    }}
                                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[11px] font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <AlertTriangle className="w-3 h-3 text-slate-950" />
                                    Pilih Juara {rank}
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      });
                    })()}
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

      {/* Image Lightbox Modal for Photo Evidence */}
      <ImageLightboxModal
        imageUrl={lightboxPhoto?.url || null}
        title={lightboxPhoto?.title}
        subtitle={lightboxPhoto?.subtitle}
        isOpen={Boolean(lightboxPhoto)}
        onClose={() => setLightboxPhoto(null)}
      />

      {/* Modal Konfirmasi Hapus Tender */}
      {tenderToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 font-black">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Hapus Tender Kebutuhan?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus tender <strong className="text-slate-900">{tenderToDelete.title}</strong> (<span className="font-mono text-blue-700 font-bold">{tenderToDelete.id}</span>)?
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-medium mb-6">
              ⚠️ Tender dan seluruh data penawaran (bidding) terkait akan dihapus secara permanen dari aplikasi dan database Firebase.
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setTenderToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTender}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Ya, Hapus Tender
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
