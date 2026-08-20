import React from 'react';
import { Building2, ShieldCheck, MapPin, Phone, Mail, FileText, Star, Award, CheckCircle2, X, ExternalLink, Calendar, CreditCard, Truck } from 'lucide-react';

export interface CompanyDetail {
  companyName: string;
  vendorType?: string;
  category?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  address?: string;
  city?: string;
  nib?: string;
  npwp?: string;
  rating?: number;
  completedOrders?: number;
  joinedYear?: string;
  top?: string;
  isVerified?: boolean;
  specialty?: string;
  bankAccount?: string;
}

interface CompanyDetailModalProps {
  companyName: string | null;
  isOpen: boolean;
  onClose: () => void;
  customData?: Partial<CompanyDetail>;
}

export const KNOWN_COMPANIES: Record<string, CompanyDetail> = {
  'PT Surya Gemilang': {
    companyName: 'PT Surya Gemilang',
    vendorType: 'SUPPLIER',
    category: 'Ban Truk & Aki Armada',
    email: 'vendor@suryagemilang.com',
    phone: '0812-8899-2341',
    contactPerson: 'Budi Santoso (Head of B2B Sales)',
    address: 'Jl. Raya Industri Marunda No. 88, Cilincing',
    city: 'Jakarta Utara, DKI Jakarta',
    nib: '8120009218291',
    npwp: '01.345.678.9-012.000',
    rating: 4.9,
    completedOrders: 32,
    joinedYear: '2021',
    top: 'Net 30 Hari',
    isVerified: true,
    specialty: 'Distributor Resmi Ban Truk Radial Heavy Duty & Aki GS Astra',
    bankAccount: 'BCA 8820-1928-11 (a.n. PT Surya Gemilang)'
  },
  'PT Mandiri Ban Pratama': {
    companyName: 'PT Mandiri Ban Pratama',
    vendorType: 'SUPPLIER',
    category: 'Ban & Velg Truk',
    email: 'sales@mandiriban.co.id',
    phone: '0812-8899-2341',
    contactPerson: 'Bambang Sudiro (Sales Manager)',
    address: 'Kawasan Industri Terpadu Pulogadung Blok B3 No. 12',
    city: 'Jakarta Timur, DKI Jakarta',
    nib: '9120004561239',
    npwp: '02.112.456.8-015.000',
    rating: 4.9,
    completedOrders: 48,
    joinedYear: '2020',
    top: 'Net 30 Hari',
    isVerified: true,
    specialty: 'Distributor Tunggal Ban Bridgestone, Gajah Tunggal, & Michelin',
    bankAccount: 'Mandiri 125-00-98231-92 (a.n. PT Mandiri Ban Pratama)'
  },
  'PT Daya Sel Elektrika': {
    companyName: 'PT Daya Sel Elektrika',
    vendorType: 'SUPPLIER',
    category: 'Aki & Elektrikal Armada',
    email: 'b2b@dayaselelektrika.co.id',
    phone: '0811-9876-5432',
    contactPerson: 'Dewi Anggraeni (Key Account Executive)',
    address: 'Jl. Pegangsaan Dua Raya No. 45, Kelapa Gading',
    city: 'Jakarta Utara, DKI Jakarta',
    nib: '8120001122334',
    npwp: '01.987.654.3-011.000',
    rating: 4.8,
    completedOrders: 27,
    joinedYear: '2022',
    top: 'Net 14 Hari / Net 30 Hari',
    isVerified: true,
    specialty: 'Supplier Utama Aki GS Astra, Incoe Heavy Duty & Battery Charger System',
    bankAccount: 'BCA 5420-1122-88 (a.n. PT Daya Sel Elektrika)'
  },
  'PT Pancaran Suku Cadang Utama': {
    companyName: 'PT Pancaran Suku Cadang Utama',
    vendorType: 'SUPPLIER',
    category: 'Spare Part & Komponen Truk',
    email: 'spareparts@pancaransukucadang.id',
    phone: '0815-1234-7788',
    contactPerson: 'Hendra Gunawan (Operations Lead)',
    address: 'Kawasan Industri Jababeka Phase 2 Blok C7',
    city: 'Cikarang, Jawa Barat',
    nib: '8120008899112',
    npwp: '03.221.889.4-081.000',
    rating: 4.9,
    completedOrders: 64,
    joinedYear: '2019',
    top: 'Net 45 Hari',
    isVerified: true,
    specialty: 'Suku Cadang Asli OEM Hino, Isuzu, Mitsubishi Fuso, & Fleetguard Filter',
    bankAccount: 'Mandiri 156-00-11223-44 (a.n. PT Pancaran Suku Cadang Utama)'
  },
  'CV Multi Servis Armada': {
    companyName: 'CV Multi Servis Armada',
    vendorType: 'VENDOR_JASA',
    category: 'Jasa Overhaul & Maintenance',
    email: 'cs@multiservisarmada.com',
    phone: '0821-4455-6677',
    contactPerson: 'Ir. Agus Wijaya (Technical Director)',
    address: 'Jl. Raya Bekasi KM 24 No. 10, Cakung',
    city: 'Jakarta Timur, DKI Jakarta',
    nib: '8120005544332',
    npwp: '02.443.556.7-003.000',
    rating: 4.8,
    completedOrders: 19,
    joinedYear: '2022',
    top: 'Net 30 Hari',
    isVerified: true,
    specialty: 'Bengkel Spesialis Overhaul Engine Common Rail, Kalibrasi Injector & Pompa',
    bankAccount: 'BCA 2300-8899-00 (a.n. CV Multi Servis Armada)'
  },
  'Pancaran Group': {
    companyName: 'Pancaran Group (Internal Procurement)',
    vendorType: 'INTERNAL',
    category: 'Logistik & Transportasi Terpadu',
    email: 'procurement@pancaran-logistic.id',
    phone: '021-8833-2020',
    contactPerson: 'Tim Procurement & Fleet Management',
    address: 'Gedung Pancaran Tower Lt. 5, Jl. Danau Sunter Barat Block A3',
    city: 'Jakarta Utara, DKI Jakarta',
    nib: '8120001002003',
    npwp: '01.000.111.2-092.000',
    rating: 5.0,
    completedOrders: 150,
    joinedYear: '1995',
    top: 'Internal Standard',
    isVerified: true,
    specialty: 'Holding Company Logistics & Supply Chain Fleet Management',
    bankAccount: 'Mandiri 120-00-11112-22 (a.n. PT Pancaran Darat Transport)'
  }
};

export default function CompanyDetailModal({ companyName, isOpen, onClose, customData }: CompanyDetailModalProps) {
  if (!isOpen || !companyName) return null;

  // Retrieve existing or generate fallback
  const baseData = KNOWN_COMPANIES[companyName] || {
    companyName: companyName,
    vendorType: customData?.vendorType || 'SUPPLIER',
    category: customData?.category || 'Suku Cadang & Logistik',
    email: customData?.email || `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
    phone: customData?.phone || '0812-3456-7890',
    contactPerson: customData?.contactPerson || 'Tim Representative Sales B2B',
    address: customData?.address || 'Kawasan Industri Pulogadung No. 18',
    city: customData?.city || 'Jakarta, Indonesia',
    nib: customData?.nib || '812000' + Math.floor(100000 + Math.random() * 900000),
    npwp: customData?.npwp || '01.' + Math.floor(100 + Math.random() * 899) + '.456.8-015.000',
    rating: customData?.rating || 4.8,
    completedOrders: customData?.completedOrders || 15,
    joinedYear: customData?.joinedYear || '2022',
    top: customData?.top || 'Net 30 Hari',
    isVerified: true,
    specialty: customData?.specialty || 'Penyedia Barang/Jasa Terdaftar & Rekanan Resmi Procurement Pancaran Group',
    bankAccount: customData?.bankAccount || 'BCA 8800-1234-56 (a.n. ' + companyName + ')'
  };

  const data: CompanyDetail = { ...baseData, ...customData };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-6 border border-slate-100 flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0 border border-white/20">
              <Building2 className="w-7 h-7" />
            </div>

            <div className="min-w-0 pr-6">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Rekanan Terverifikasi
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {data.vendorType === 'VENDOR_JASA' ? '🔧 Vendor Jasa Armada' : '📦 Supplier Barang'}
                </span>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight truncate">
                {data.companyName}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {data.category} • Bergabung sejak {data.joinedYear}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200/80 p-3 text-center text-xs divide-x divide-slate-200/80">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Rating Vendor</span>
            <div className="font-black text-slate-800 flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{data.rating} / 5.0</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">PO Selesai</span>
            <span className="font-black text-blue-600 mt-0.5 block">{data.completedOrders} Order</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Term of Payment</span>
            <span className="font-black text-slate-800 mt-0.5 block">{data.top}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Legalitas</span>
            <span className="font-black text-emerald-600 mt-0.5 block">Lengkap & Valid</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-slate-700 text-xs overflow-y-auto max-h-[60vh]">
          {/* Spesialisasi / Deskripsi */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-950 block text-xs">Spesialisasi & Bidang Usaha</span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">{data.specialty}</p>
            </div>
          </div>

          {/* Grid Informasi Detail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: Legalitas & Perpajakan */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
              <div className="font-bold text-slate-900 border-b border-slate-200/80 pb-1.5 flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Legalitas & Perpajakan</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">NIB (Izin Usaha):</span>
                  <span className="font-mono font-bold text-slate-800">{data.nib}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">NPWP Perusahaan:</span>
                  <span className="font-mono font-bold text-slate-800">{data.npwp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Rekening Resmi B2B:</span>
                  <span className="font-semibold text-slate-700">{data.bankAccount}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Kontak Representative */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
              <div className="font-bold text-slate-900 border-b border-slate-200/80 pb-1.5 flex items-center gap-1.5 text-xs">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Kontak & PIC Account</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Contact Person:</span>
                  <span className="font-bold text-slate-800">{data.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Email Resmi:</span>
                  <span className="font-bold text-blue-600">{data.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">No. Telepon / WA:</span>
                  <span className="font-bold text-slate-800">{data.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alamat Kantor & Gudang */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Alamat Kantor & Gudang Operational</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              {data.address}, {data.city}
            </p>
          </div>

          {/* Dokumen Terlampir */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block text-xs">Dokumen Verifikasi Rekanan (Verified Badge):</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800 truncate">NIB_Usaha_Verified.pdf</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800 truncate">NPWP_Perusahaan_Aktif.pdf</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-medium">
            Verified Partner ID: <code className="font-mono text-slate-600 font-bold">VND-{data.nib?.slice(-6)}</code>
          </span>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${data.phone?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              Hubungi PIC WA
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
