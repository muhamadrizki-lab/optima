import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, MapPin, Phone, Mail, FileText, Star, Award, CheckCircle2, X, ExternalLink, Calendar, CreditCard, Truck, Settings, Check, Save } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CompanyDetail | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && companyName) {
      setIsEditing(false);
      setSaveStatus(null);
      
      let resolved: CompanyDetail | null = null;

      // 1. Check custom profiles edited/saved in localStorage first
      try {
        const savedProfiles = localStorage.getItem('optima_companies_profiles');
        if (savedProfiles) {
          const profiles = JSON.parse(savedProfiles);
          if (profiles[companyName]) {
            resolved = profiles[companyName];
          }
        }
      } catch (e) {
        console.error('Error loading custom company profile:', e);
      }

      // 2. If not found, check if this is a registered user from pendaftaran (registration table)
      if (!resolved) {
        try {
          const savedUsers = localStorage.getItem('optima_access_users');
          if (savedUsers) {
            const users = JSON.parse(savedUsers);
            const foundUser = users.find(
              (u: any) => u.companyName && u.companyName.trim().toLowerCase() === companyName.trim().toLowerCase()
            );
            if (foundUser) {
              resolved = {
                companyName: foundUser.companyName,
                vendorType: foundUser.vendorType || 'SUPPLIER',
                category: foundUser.vendorType === 'VENDOR_JASA' ? 'Jasa Armada & Maintenance' : 'Supplier Suku Cadang & Ban',
                email: foundUser.email,
                phone: foundUser.phone || '0812-9988-7766',
                contactPerson: foundUser.name,
                address: 'Jl. Boulevard Artha Gading No. 18, Kelapa Gading',
                city: 'Jakarta Utara, DKI Jakarta',
                nib: '812000' + Math.floor(100000 + Math.random() * 900000),
                npwp: '01.' + Math.floor(100 + Math.random() * 899) + '.222.8-015.000',
                rating: 5.0,
                completedOrders: 1,
                joinedYear: new Date().getFullYear().toString(),
                top: 'Net 30 Hari',
                isVerified: true,
                specialty: 'Rekanan terdaftar resmi melalui pendaftaran akun portal mandiri.',
                bankAccount: 'BCA 8800-1122-33 (a.n. ' + foundUser.companyName + ')'
              };
            }
          }
        } catch (e) {
          console.error('Error parsing registered users for profile prefill:', e);
        }
      }

      // 3. Fallback to default predefined KNOWN_COMPANIES or dynamic generator
      if (!resolved) {
        const base = KNOWN_COMPANIES[companyName] || {
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
        resolved = { ...base, ...customData };
      }

      setFormData(resolved);
    }
  }, [isOpen, companyName, customData]);

  if (!isOpen || !companyName || !formData) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedProfiles = localStorage.getItem('optima_companies_profiles');
      const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
      
      profiles[companyName] = formData;
      localStorage.setItem('optima_companies_profiles', JSON.stringify(profiles));
      
      setSaveStatus('Sukses menyimpan perubahan!');
      setTimeout(() => {
        setSaveStatus(null);
        setIsEditing(false);
      }, 1000);
    } catch (err) {
      console.error('Error saving company profile:', err);
    }
  };

  const handleFieldChange = (field: keyof CompanyDetail, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-6 border border-slate-100 flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Gear Button to switch Edit Mode */}
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setSaveStatus(null);
              }}
              className={`p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center justify-center ${
                isEditing ? 'text-amber-400 bg-white/20 border border-amber-500/30' : ''
              }`}
              title={isEditing ? 'Kembali ke View Mode' : 'Edit Pengisian Profil (Settings)'}
            >
              <Settings className={`w-5 h-5 ${isEditing ? 'rotate-90 text-amber-300' : ''} transition-all duration-300`} />
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center justify-center"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0 border border-white/20">
              <Building2 className="w-7 h-7" />
            </div>

            <div className="min-w-0 pr-16">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Rekanan Terverifikasi
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {formData.vendorType === 'VENDOR_JASA' ? '🔧 Vendor Jasa Armada' : '📦 Supplier Barang'}
                </span>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight truncate">
                {formData.companyName}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {formData.category} • Bergabung sejak {formData.joinedYear}
              </p>
            </div>
          </div>
        </div>

        {isEditing ? (
          /* ================== EDIT FORM MODE ================== */
          <form onSubmit={handleSave} className="flex flex-col min-h-0">
            <div className="p-6 space-y-4 text-slate-700 text-xs overflow-y-auto max-h-[60vh]">
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-2.5 text-amber-800 font-medium">
                <Settings className="w-4 h-4 text-amber-600 animate-spin-slow shrink-0" />
                <span>Anda sedang mengedit detail data rekanan. Data ini akan disimpan permanen untuk profil ini.</span>
              </div>

              {/* Specialty */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Spesialisasi & Deskripsi Layanan</label>
                <textarea
                  required
                  value={formData.specialty || ''}
                  onChange={(e) => handleFieldChange('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-blue-600 transition-colors"
                  rows={2}
                  placeholder="Deskripsikan keahlian utama, komoditas, atau layanan khusus rekanan..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NIB */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">NIB (Izin Usaha)</label>
                  <input
                    type="text"
                    required
                    value={formData.nib || ''}
                    onChange={(e) => handleFieldChange('nib', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: 812000123456"
                  />
                </div>

                {/* NPWP */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">NPWP Perusahaan</label>
                  <input
                    type="text"
                    required
                    value={formData.npwp || ''}
                    onChange={(e) => handleFieldChange('npwp', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: 01.123.456.7-015.000"
                  />
                </div>

                {/* Bank Account */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold text-slate-800">Nomor Rekening Resmi B2B</label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccount || ''}
                    onChange={(e) => handleFieldChange('bankAccount', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: Mandiri 120-00-11112-22 (a.n. PT Pancaran Darat Transport)"
                  />
                </div>

                {/* Contact Person */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Nama Contact Person (PIC)</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson || ''}
                    onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Email Resmi Korespondensi</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: vendor@pancaran.id"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">No. Telepon / WhatsApp PIC</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: 0812-9988-7766"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Komoditas / Kategori</label>
                  <input
                    type="text"
                    required
                    value={formData.category || ''}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: Ban Truk & Suku Cadang"
                  />
                </div>

                {/* Term of Payment */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Term of Payment (TOP)</label>
                  <input
                    type="text"
                    required
                    value={formData.top || ''}
                    onChange={(e) => handleFieldChange('top', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: Net 30 Hari atau Net 45 Hari"
                  />
                </div>

                {/* Joined Year */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Tahun Bergabung</label>
                  <input
                    type="text"
                    required
                    value={formData.joinedYear || ''}
                    onChange={(e) => handleFieldChange('joinedYear', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                    placeholder="Contoh: 2022"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Alamat Kantor & Gudang Utama</label>
                <input
                  type="text"
                  required
                  value={formData.address || ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                  placeholder="Kawasan Industri Pulogadung No. 18, Jl. Rawa Gelam"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Kota, Provinsi & Negara</label>
                <input
                  type="text"
                  required
                  value={formData.city || ''}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                  placeholder="Jakarta Timur, DKI Jakarta, Indonesia"
                />
              </div>
            </div>

            {/* Edit Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                {saveStatus && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-xs">
                    <Check className="w-4 h-4" />
                    {saveStatus}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Profil
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ================== DISPLAY VIEW MODE ================== */
          <>
            {/* Modal Body */}
            <div className="p-6 space-y-5 text-slate-700 text-xs overflow-y-auto max-h-[60vh]">
              {/* Spesialisasi / Deskripsi */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-start gap-3">
                <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-950 block text-xs">Spesialisasi & Bidang Usaha</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{formData.specialty}</p>
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
                      <span className="font-mono font-bold text-slate-800">{formData.nib}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">NPWP Perusahaan:</span>
                      <span className="font-mono font-bold text-slate-800">{formData.npwp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Rekening Resmi B2B:</span>
                      <span className="font-semibold text-slate-700">{formData.bankAccount}</span>
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
                      <span className="font-bold text-slate-800">{formData.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Email Resmi:</span>
                      <span className="font-bold text-blue-600">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">No. Telepon / WA:</span>
                      <span className="font-bold text-slate-800">{formData.phone}</span>
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
                  {formData.address}, {formData.city}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                Verified Partner ID: <code className="font-mono text-slate-600 font-bold">VND-{formData.nib?.slice(-6)}</code>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${formData.phone?.replace(/[^0-9]/g, '')}`}
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
          </>
        )}
      </div>
    </div>
  );
}
