import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, MapPin, Phone, Mail, FileText, Star, Award, 
  CheckCircle2, X, ExternalLink, Calendar, CreditCard, Truck, Settings, 
  Check, Save, TrendingUp, Coins, Briefcase, FileCheck, ShoppingCart, 
  Sparkles, ThumbsUp, AlertCircle, RefreshCw
} from 'lucide-react';
import { INITIAL_VENDOR_CATALOG } from '../data/vendorCatalogData';

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
  // Detailed evaluations/ratings
  ratingPrices?: number;
  ratingQuality?: number;
  ratingLeadTime?: number;
  ratingService?: number;
  ratingSla?: number;
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

  // Dynamic bidding, wins, and PO history states
  const [procurementBids, setProcurementBids] = useState<any[]>([]);
  const [procurementWins, setProcurementWins] = useState<any[]>([]);
  const [totalPoValue, setTotalPoValue] = useState(0);
  const [catalogItemsCount, setCatalogItemsCount] = useState(0);
  const [catalogSoldQuantity, setCatalogSoldQuantity] = useState(0);
  const [catalogRevenueTotal, setCatalogRevenueTotal] = useState(0);

  // Vendor Issues State
  const [vendorIssues, setVendorIssues] = useState<any[]>([]);
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [newIssueType, setNewIssueType] = useState('KETERLAMBATAN');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [newIssueStatus, setNewIssueStatus] = useState('PENDING');
  const [newIssueLoggedBy, setNewIssueLoggedBy] = useState('Admin Procurement');
  const [issueToast, setIssueToast] = useState<string | null>(null);

  // Helper functions for scoring and metrics
  const getPerformanceLabel = (score: number) => {
    if (score >= 4.8) return { label: 'Sangat Baik (Grade A)', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200' };
    if (score >= 4.3) return { label: 'Baik (Grade B)', color: 'text-blue-700 bg-blue-50 border border-blue-200' };
    if (score >= 3.5) return { label: 'Cukup (Grade C)', color: 'text-amber-700 bg-amber-50 border border-amber-200' };
    return { label: 'Butuh Pembinaan (Grade D)', color: 'text-rose-700 bg-rose-50 border border-rose-200' };
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) return <Star key={i} className="w-3.5 h-3.5 fill-current" />;
          if (i === fullStars && hasHalf) return <Star key={i} className="w-3.5 h-3.5 fill-current opacity-70" />;
          return <Star key={i} className="w-3.5 h-3.5 text-slate-250" />;
        })}
        <span className="ml-1.5 text-slate-900 font-bold text-xs">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const RatingProgressBar = ({ label, value, icon }: { label: string; value: number; icon: string }) => {
    const percent = (value / 5) * 100;
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px]">
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <span>{icon}</span>
            <span>{label}</span>
          </span>
          <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{value.toFixed(1)} / 5.0</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              value >= 4.5 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
              value >= 4.0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              value >= 3.0 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
              'bg-gradient-to-r from-rose-500 to-rose-600'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isOpen && companyName) {
      setIsEditing(false);
      setSaveStatus(null);
      
      const companyLower = companyName.trim().toLowerCase();
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
              (u: any) => u.companyName && u.companyName.trim().toLowerCase() === companyLower
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

      // Ensure detailed rating fields are initialized
      if (resolved) {
        if (resolved.ratingPrices === undefined) resolved.ratingPrices = 4.8;
        if (resolved.ratingQuality === undefined) resolved.ratingQuality = 4.9;
        if (resolved.ratingLeadTime === undefined) resolved.ratingLeadTime = 4.7;
        if (resolved.ratingService === undefined) resolved.ratingService = 4.8;
        if (resolved.ratingSla === undefined) resolved.ratingSla = 4.9;

        // Recalculate average rating
        const avg = (resolved.ratingPrices + resolved.ratingQuality + resolved.ratingLeadTime + resolved.ratingService + resolved.ratingSla) / 5;
        resolved.rating = Number(avg.toFixed(1));
      }

      setFormData(resolved);

      // Now calculate dynamic stats for procurement history
      let bids: any[] = [];
      let wins: any[] = [];
      let totalPo = 0;

      // A. Fetch bids history
      try {
        const savedBids = localStorage.getItem('optima_bids_history');
        if (savedBids) {
          const allBids = JSON.parse(savedBids);
          if (Array.isArray(allBids)) {
            bids = allBids.filter(b => b.vendorName && b.vendorName.trim().toLowerCase() === companyLower);
            wins = bids.filter(b => b.status === 'ACCEPTED');
            wins.forEach(w => {
              totalPo += w.amount || 0;
            });
          }
        }
      } catch (err) {
        console.error('Error computing bids history in company modal:', err);
      }

      // B. Fetch procurement requirements
      try {
        const savedCatalogKebutuhan = localStorage.getItem('optima_catalog_kebutuhan');
        if (savedCatalogKebutuhan) {
          const requirements = JSON.parse(savedCatalogKebutuhan);
          if (Array.isArray(requirements)) {
            requirements.forEach(req => {
              if (req.winnerVendorName && req.winnerVendorName.trim().toLowerCase() === companyLower) {
                const alreadyAdded = wins.some(w => w.reqId === req.id || w.id === req.id);
                if (!alreadyAdded) {
                  wins.push({
                    id: req.id,
                    reqId: req.id,
                    reqTitle: req.title,
                    amount: req.winnerAmount || req.ownerEstimate || 0,
                    status: 'ACCEPTED',
                    dateSubmitted: req.winnerDate || req.datePosted || '2026-08-16',
                    vendorName: req.winnerVendorName
                  });
                  totalPo += Number(req.winnerAmount || req.ownerEstimate || 0);
                }
              }
            });
          }
        }
      } catch (err) {
        console.error('Error computing requirements in company modal:', err);
      }

      // C. Fetch catalog items & sales of this vendor
      let catCount = 0;
      let catSoldQty = 0;
      let catRevenueVal = 0;
      try {
        const savedVendorCatalog = localStorage.getItem('optima_vendor_catalog');
        let rawCatalog: any[] = [];
        if (savedVendorCatalog) {
          rawCatalog = JSON.parse(savedVendorCatalog);
        } else {
          rawCatalog = INITIAL_VENDOR_CATALOG;
        }

        if (Array.isArray(rawCatalog)) {
          const vendorItems = rawCatalog.filter(i => i.companyName && i.companyName.trim().toLowerCase() === companyLower);
          catCount = vendorItems.length;

          // Fetch simulated sales map
          const salesMapSaved = localStorage.getItem('optima_simulated_sales_map');
          let salesMap: Record<string, { soldQty: number; revenue: number }> = {};
          if (salesMapSaved) {
            salesMap = JSON.parse(salesMapSaved);
          }

          vendorItems.forEach(i => {
            const sale = salesMap[i.id] || { soldQty: 0, revenue: 0 };
            catSoldQty += sale.soldQty;
            catRevenueVal += sale.revenue;
          });
        }
      } catch (err) {
        console.error('Error computing catalog items in company modal:', err);
      }

      // D. Apply fallback simulated past data if they don't have active database histories
      // so the modal looks fully populated as requested by the user
      if (bids.length === 0 && wins.length === 0) {
        // We can simulate some historical bids & wins based on the company name to make it look rich & realistic
        const isSurya = companyLower.includes('surya');
        const isMandiri = companyLower.includes('mandiri');
        const isDaya = companyLower.includes('daya');
        const isPancaran = companyLower.includes('pancaran');
        
        let simBidsCount = isSurya ? 14 : isMandiri ? 22 : isDaya ? 9 : isPancaran ? 35 : 12;
        let simWinsCount = isSurya ? 5 : isMandiri ? 8 : isDaya ? 3 : isPancaran ? 15 : 4;
        let simRevenue = isSurya ? 185000000 : isMandiri ? 290000000 : isDaya ? 98000000 : isPancaran ? 620000000 : 120000000;

        // Generate simulated lists
        const simBidsList: any[] = [];
        const simWinsList: any[] = [];

        const categoriesList = ['Ban Truk Radial', 'Aki GS Astra HD', 'Spare Part Hino', 'Filter Fleetguard'];
        for (let i = 0; i < simBidsCount; i++) {
          const isWon = i < simWinsCount;
          const amt = 12000000 + (i * 3500000) % 25000000;
          const bidObj = {
            id: `SIM-BID-${i}`,
            reqTitle: `Pengadaan ${categoriesList[i % categoriesList.length]} Batch ${i+1}`,
            amount: amt,
            status: isWon ? 'ACCEPTED' : 'REJECTED',
            dateSubmitted: `2026-07-${10 + (i * 3) % 20}`
          };
          simBidsList.push(bidObj);
          if (isWon) {
            simWinsList.push(bidObj);
          }
        }

        setProcurementBids(simBidsList);
        setProcurementWins(simWinsList);
        setTotalPoValue(simRevenue);
      } else {
        setProcurementBids(bids);
        setProcurementWins(wins);
        setTotalPoValue(totalPoValue || totalPo);
      }

      setCatalogItemsCount(catCount || (companyLower.includes('surya') ? 8 : companyLower.includes('mandiri') ? 12 : 5));
      setCatalogSoldQuantity(catSoldQty || (companyLower.includes('surya') ? 45 : companyLower.includes('mandiri') ? 60 : 25));
      setCatalogRevenueTotal(catRevenueVal || (companyLower.includes('surya') ? 92000000 : companyLower.includes('mandiri') ? 145000000 : 48000000));

      // E. Fetch & Sync Vendor Issues
      try {
        const savedIssues = localStorage.getItem('optima_vendor_issues');
        let issuesList: any[] = [];
        if (savedIssues) {
          issuesList = JSON.parse(savedIssues);
        } else {
          // Default pre-populated list
          issuesList = [
            {
              id: 'ISS-001',
              vendorName: 'CV Sumber Karet Nusantara',
              date: '2026-08-10',
              issueType: 'KETERLAMBATAN',
              description: 'Keterlambatan pengiriman ban radial pesanan PO-2026-04 selama 3 hari kerja tanpa pemberitahuan tertulis.',
              status: 'RESOLVED',
              severity: 'HIGH',
              loggedBy: 'Tim Gudang Cikampek'
            },
            {
              id: 'ISS-002',
              vendorName: 'CV Sumber Karet Nusantara',
              date: '2026-08-25',
              issueType: 'KUALITAS_BARANG',
              description: 'Ada 3 unit ban Gajah Tunggal mengalami keretakan rambut di dinding ban (cacat produksi pabrik). sedang diproses retur.',
              status: 'PENDING',
              severity: 'MEDIUM',
              loggedBy: 'Admin Fleet Depot C'
            },
            {
              id: 'ISS-003',
              vendorName: 'PT Mandiri Suku Cadang',
              date: '2026-08-14',
              issueType: 'KUALITAS_BARANG',
              description: 'Kesalahan spesifikasi filter oli untuk Isuzu Giga (dikirim part number FVR padahal PO untuk FVZ). Sudah ditukar barang pengganti.',
              status: 'RESOLVED',
              severity: 'LOW',
              loggedBy: 'Suryadi (Mekanik Senior)'
            },
            {
              id: 'ISS-004',
              vendorName: 'PT Daya Solar Perkasa',
              date: '2026-08-05',
              issueType: 'MISKOMUNIKASI',
              description: 'Slow response saat dihubungi untuk garansi instalasi inverter solar panel di Head Office Pancaran Group.',
              status: 'RESOLVED',
              severity: 'MEDIUM',
              loggedBy: 'Rian (IT Support)'
            }
          ];
          localStorage.setItem('optima_vendor_issues', JSON.stringify(issuesList));
        }

        const filtered = issuesList.filter(
          (issue: any) => issue.vendorName && issue.vendorName.trim().toLowerCase() === companyLower
        );
        setVendorIssues(filtered);
      } catch (err) {
        console.error('Error fetching vendor issues:', err);
      }
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

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueDesc.trim()) return;

    try {
      const savedIssues = localStorage.getItem('optima_vendor_issues');
      const allIssues = savedIssues ? JSON.parse(savedIssues) : [];

      const newObj = {
        id: `ISS-${Date.now().toString().slice(-4)}`,
        vendorName: companyName,
        date: new Date().toISOString().split('T')[0],
        issueType: newIssueType,
        description: newIssueDesc.trim(),
        status: newIssueStatus,
        severity: 'MEDIUM',
        loggedBy: newIssueLoggedBy.trim() || 'Admin Procurement'
      };

      const updated = [newObj, ...allIssues];
      localStorage.setItem('optima_vendor_issues', JSON.stringify(updated));

      // Update state for currently viewed company
      setVendorIssues(prev => [newObj, ...prev]);

      setNewIssueDesc('');
      setShowAddIssue(false);
      setIssueToast('Sukses melaporkan masalah/kendala vendor baru!');
      setTimeout(() => setIssueToast(null), 3000);
    } catch (err) {
      console.error('Error adding new vendor issue:', err);
    }
  };

  const handleResolveIssue = (issueId: string) => {
    try {
      const savedIssues = localStorage.getItem('optima_vendor_issues');
      if (savedIssues) {
        const allIssues = JSON.parse(savedIssues);
        const updated = allIssues.map((issue: any) => {
          if (issue.id === issueId) {
            return { ...issue, status: 'RESOLVED' };
          }
          return issue;
        });
        localStorage.setItem('optima_vendor_issues', JSON.stringify(updated));
        
        // Update local state
        setVendorIssues(prev => prev.map(issue => {
          if (issue.id === issueId) {
            return { ...issue, status: 'RESOLVED' };
          }
          return issue;
        }));

        setIssueToast('Kendala berhasil ditandai sebagai Selesai (Resolved)!');
        setTimeout(() => setIssueToast(null), 3000);
      }
    } catch (err) {
      console.error('Error resolving issue:', err);
    }
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

              {/* Detailed Ratings Section */}
              <div className="pt-4 border-t border-slate-200/60">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Evaluasi Kinerja Vendor (Nilai Skala 1.0 - 5.0)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
                  <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <label className="block text-[10px] font-bold text-slate-500 text-center">🏷️ Harga</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.ratingPrices || 4.8}
                      onChange={(e) => handleFieldChange('ratingPrices', parseFloat(e.target.value) || 4.8)}
                      className="w-full px-2 py-1 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white text-center font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <label className="block text-[10px] font-bold text-slate-500 text-center">🏆 Kualitas</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.ratingQuality || 4.7}
                      onChange={(e) => handleFieldChange('ratingQuality', parseFloat(e.target.value) || 4.7)}
                      className="w-full px-2 py-1 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white text-center font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <label className="block text-[10px] font-bold text-slate-500 text-center">🚚 Lead Time</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.ratingLeadTime || 4.9}
                      onChange={(e) => handleFieldChange('ratingLeadTime', parseFloat(e.target.value) || 4.9)}
                      className="w-full px-2 py-1 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white text-center font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                    <label className="block text-[10px] font-bold text-slate-500 text-center">💬 Pelayanan</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.ratingService || 4.8}
                      onChange={(e) => handleFieldChange('ratingService', parseFloat(e.target.value) || 4.8)}
                      className="w-full px-2 py-1 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white text-center font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 text-center">📑 SLA Legal</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.ratingSla || 4.9}
                      onChange={(e) => handleFieldChange('ratingSla', parseFloat(e.target.value) || 4.9)}
                      className="w-full px-2 py-1 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white text-center font-bold text-slate-800"
                    />
                  </div>
                </div>
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
            <div className="p-6 space-y-6 text-slate-700 text-xs overflow-y-auto max-h-[60vh] scrollbar-thin">
              {/* Spesialisasi / Deskripsi */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-start gap-3.5 shadow-3xs">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-blue-950 block text-sm">Spesialisasi & Bidang Usaha</span>
                  <p className="text-slate-600 leading-relaxed text-xs">{formData.specialty}</p>
                </div>
              </div>

              {/* ================== PENILAIAN & EVALUASI KINERJA (RATING) ================== */}
              <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Evaluasi & Penilaian Kinerja Vendor</span>
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    getPerformanceLabel(formData.rating || 4.8).color
                  }`}>
                    {getPerformanceLabel(formData.rating || 4.8).label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-center">
                  {/* Left: Overall Rating Circle */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-2xl border border-slate-200/40 text-center space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nilai Rata-rata</div>
                    <div className="w-20 h-20 rounded-full bg-white border-4 border-amber-400 flex flex-col items-center justify-center shadow-xs">
                      <span className="text-2xl font-black text-slate-900 leading-none">{(formData.rating || 4.8).toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-0.5">/ 5.0</span>
                    </div>
                    {renderStars(formData.rating || 4.8)}
                    <span className="text-[10px] font-semibold text-slate-500">Berdasarkan 5 Kriteria SLA</span>
                  </div>

                  {/* Right: Detailed Progress Bars */}
                  <div className="md:col-span-3 space-y-3">
                    <RatingProgressBar label="Daya Saing Harga (Price)" value={formData.ratingPrices || 4.8} icon="🏷️" />
                    <RatingProgressBar label="Kualitas Barang/Suku Cadang" value={formData.ratingQuality || 4.9} icon="🏆" />
                    <RatingProgressBar label="Ketepatan Waktu / Lead Time" value={formData.ratingLeadTime || 4.7} icon="🚚" />
                    <RatingProgressBar label="Respon & Pelayanan (Service)" value={formData.ratingService || 4.8} icon="💬" />
                    <RatingProgressBar label="Kepatuhan Administrasi (Legal)" value={formData.ratingSla || 4.9} icon="📑" />
                  </div>
                </div>
              </div>

              {/* ================== HISTORI PARTISIPASI & PEMBELIAN (STATS) ================== */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Histori Pengadaan & Pembelian (PO)</span>
                </h3>

                {/* Scorecards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Metric 1: Total Bids */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-3xs flex flex-col justify-between space-y-1.5 hover:border-blue-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Total Bids</span>
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900 leading-none">{procurementBids.length}</div>
                      <span className="text-[10px] font-medium text-slate-500">Proposal Masuk</span>
                    </div>
                  </div>

                  {/* Metric 2: Total Menang (PO) */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-3xs flex flex-col justify-between space-y-1.5 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Menang PO</span>
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900 leading-none">{procurementWins.length}</div>
                      <span className="text-[10px] font-medium text-slate-500">Paket Disetujui</span>
                    </div>
                  </div>

                  {/* Metric 3: Win Rate Ratio */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-3xs flex flex-col justify-between space-y-1.5 hover:border-violet-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Win Rate</span>
                      <div className="p-1.5 rounded-lg bg-violet-50 text-violet-600">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900 leading-none">
                        {((procurementWins.length / (procurementBids.length || 1)) * 100).toFixed(1)}%
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">Rasio Keberhasilan</span>
                    </div>
                  </div>

                  {/* Metric 4: Total Transaksi PO (Pembelian) */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-3xs flex flex-col justify-between space-y-1.5 hover:border-amber-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Total Belanja</span>
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                        <Coins className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-950 truncate leading-none mt-1">
                        {formatRupiah(totalPoValue)}
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 block truncate mt-0.5">Akumulasi Nilai PO</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Metrics: Katalog Sales & Revenue */}
                {catalogItemsCount > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/45">
                    <div className="text-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                      <span className="text-slate-400 font-bold text-[9px] uppercase block">Item Katalog Aktif</span>
                      <span className="text-sm font-black text-slate-800">{catalogItemsCount} Jenis Produk</span>
                    </div>
                    <div className="text-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                      <span className="text-slate-400 font-bold text-[9px] uppercase block">Total Unit Terjual</span>
                      <span className="text-sm font-black text-emerald-600">{catalogSoldQuantity} Unit</span>
                    </div>
                    <div className="text-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                      <span className="text-slate-400 font-bold text-[9px] uppercase block">Omset Penjualan Katalog</span>
                      <span className="text-sm font-black text-blue-600">{formatRupiah(catalogRevenueTotal)}</span>
                    </div>
                  </div>
                )}

                {/* Scrollable List of Won Bids */}
                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl overflow-hidden shadow-3xs">
                  <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Histori Kemenangan & Kontrak Kerja (PO)</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-3xs">
                      {procurementWins.length} Transaksi Selesai
                    </span>
                  </div>
                  <div className="divide-y divide-slate-150 max-h-[140px] overflow-y-auto">
                    {procurementWins.length > 0 ? (
                      procurementWins.map((win, idx) => (
                        <div key={win.id || idx} className="p-3 bg-white hover:bg-slate-50/50 flex items-center justify-between gap-3 text-xs transition-colors">
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate leading-snug">
                              {win.reqTitle || 'Pengadaan Suku Cadang'}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 block mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-450" />
                              {win.dateSubmitted || '2026-08-15'}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-black text-emerald-600 block">{formatRupiah(win.amount || 0)}</span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md mt-0.5">
                              <Check className="w-2.5 h-2.5" />
                              PO Terbit
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-400">
                        <AlertCircle className="w-6 h-6 text-slate-350 mx-auto mb-1.5" />
                        <span>Belum ada transaksi pemenang yang tercatat.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ================== HISTORI KENDALA & ISSUES VENDOR ================== */}
              <div className="p-5 rounded-3xl border border-rose-100 bg-rose-50/10 shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-rose-100/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/40">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Histori Kendala & Keluhan (Vendor Issues)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      {vendorIssues.filter(i => i.status === 'PENDING').length} Terbuka
                    </span>
                    <button
                      onClick={() => setShowAddIssue(!showAddIssue)}
                      className="text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {showAddIssue ? 'Batal' : '+ Catat Kendala'}
                    </button>
                  </div>
                </div>

                {issueToast && (
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-850 border border-emerald-200 text-[10px] font-bold text-center animate-pulse">
                    {issueToast}
                  </div>
                )}

                {/* EXPANDABLE ADD NEW ISSUE FORM */}
                {showAddIssue && (
                  <form onSubmit={handleAddIssue} className="p-4 rounded-2xl bg-white border border-rose-200/60 space-y-3 animate-fadeIn shadow-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Kategori Kendala</label>
                        <select
                          value={newIssueType}
                          onChange={(e) => setNewIssueType(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-500 bg-slate-50"
                        >
                          <option value="KETERLAMBATAN">🚚 Keterlambatan Pengiriman</option>
                          <option value="KUALITAS_BARANG">🏆 Cacat / Kualitas Suku Cadang</option>
                          <option value="SLA_LEGAL">📑 Masalah Legalitas / SLA</option>
                          <option value="MISKOMUNIKASI">💬 Respon Lambat & Komunikasi</option>
                          <option value="LAINNYA">⚙️ Kendala Operasional Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Status Laporan</label>
                        <select
                          value={newIssueStatus}
                          onChange={(e) => setNewIssueStatus(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-500 bg-slate-50"
                        >
                          <option value="PENDING">🔴 Belum Selesai (PENDING)</option>
                          <option value="RESOLVED">🟢 Sudah Selesai (RESOLVED)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Deskripsi Detail Masalah / Kendala</label>
                      <textarea
                        rows={2}
                        value={newIssueDesc}
                        onChange={(e) => setNewIssueDesc(e.target.value)}
                        placeholder="Contoh: Terjadi keterlambatan pengiriman ban radial pesanan PO-2026-004 selama 3 hari..."
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 bg-slate-50 text-slate-800"
                        required
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1.5">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400">Dilaporkan oleh:</label>
                        <input
                          type="text"
                          value={newIssueLoggedBy}
                          onChange={(e) => setNewIssueLoggedBy(e.target.value)}
                          className="px-2 py-0.5 border border-slate-200 bg-slate-50 rounded text-[10px] font-bold text-slate-700 w-32"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        Simpan Laporan
                      </button>
                    </div>
                  </form>
                )}

                {/* LIST OF ISSUES */}
                <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                  {vendorIssues.length > 0 ? (
                    vendorIssues.map((issue, idx) => (
                      <div key={issue.id || idx} className="p-3 bg-white border border-slate-200/70 rounded-2xl shadow-3xs hover:border-rose-200 transition-all flex flex-col justify-between gap-2">
                        <div className="flex justify-between items-start gap-2.5">
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono font-black text-rose-500 text-[9px] bg-rose-50 px-1 py-0.5 rounded border border-rose-100/60">{issue.id}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                issue.issueType === 'KETERLAMBATAN' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                                issue.issueType === 'KUALITAS_BARANG' ? 'bg-purple-50 text-purple-700 border border-purple-200/50' :
                                issue.issueType === 'SLA_LEGAL' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                                'bg-slate-100 text-slate-700 border border-slate-200/50'
                              }`}>
                                {issue.issueType === 'KETERLAMBATAN' ? '🚚 Delay' :
                                 issue.issueType === 'KUALITAS_BARANG' ? '🏆 Quality' :
                                 issue.issueType === 'SLA_LEGAL' ? '📑 SLA Legal' :
                                 issue.issueType === 'MISKOMUNIKASI' ? '💬 Respon' : '⚙️ Ops'}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5">
                                <Calendar className="w-2.5 h-2.5 text-slate-400" />
                                {issue.date}
                              </span>
                            </div>
                            <p className="text-slate-700 text-xs font-semibold leading-relaxed pt-1">
                              {issue.description}
                            </p>
                          </div>

                          <div className="shrink-0">
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              issue.status === 'RESOLVED' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                                : 'bg-rose-55 text-rose-700 border border-rose-200 animate-pulse'
                            }`}>
                              {issue.status === 'RESOLVED' ? (
                                <>
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  Selesai
                                </>
                              ) : (
                                '🔴 Pending'
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-[10px]">
                          <span className="text-slate-400 font-semibold">
                            Dilaporkan oleh: <span className="font-bold text-slate-600">{issue.loggedBy || 'Admin Procurement'}</span>
                          </span>
                          
                          {issue.status !== 'RESOLVED' && (
                            <button
                              onClick={() => handleResolveIssue(issue.id)}
                              className="text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer"
                              title="Tandai masalah ini sudah terselesaikan"
                            >
                              Tandai Selesai
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center bg-white border border-slate-150 rounded-2xl">
                      <div className="p-1.5 bg-emerald-50 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 border border-emerald-100">
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </div>
                      <span className="font-bold text-slate-800 block text-xs">Sempurna! Performa Maksimal</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Tidak ada catatan kendala atau keluhan operasional untuk vendor ini.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid Informasi Detail Legalitas & Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Box 1: Legalitas & Perpajakan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5 shadow-3xs">
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
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5 shadow-3xs">
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
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 shadow-3xs">
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
