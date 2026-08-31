import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  TrendingUp, 
  Coins, 
  Activity, 
  FileText, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  ShoppingBag, 
  DollarSign, 
  Award,
  Users,
  MapPin,
  Clock,
  Briefcase,
  SlidersHorizontal,
  X,
  ChevronDown,
  Percent,
  Calendar
} from 'lucide-react';
import { VendorCatalogItem, CatalogItem, Bid } from '../types';
import { INITIAL_VENDOR_CATALOG } from '../data/vendorCatalogData';
import { INITIAL_BIDS_DATA } from '../data/biddingData';
import CompanyDetailModal from '../components/CompanyDetailModal';

interface ReportsViewProps {
  vendorCatalogItems?: VendorCatalogItem[];
}

export default function ReportsView({ vendorCatalogItems = INITIAL_VENDOR_CATALOG }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'catalog' | 'procurement' | 'bidding'>('summary');
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterVendor, setFilterVendor] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterArea, setFilterArea] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [filterMonthYear, setFilterMonthYear] = useState('');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<string | null>(null);

  // Real data state
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [bidsHistory, setBidsHistory] = useState<Bid[]>([]);
  const [vendorCatalog, setVendorCatalog] = useState<VendorCatalogItem[]>([]);

  // Refresh Trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load Data
  useEffect(() => {
    // 1. Load Procurement Requirements
    try {
      const savedCatalog = localStorage.getItem('optima_catalog_kebutuhan');
      if (savedCatalog) {
        const parsed = JSON.parse(savedCatalog);
        if (Array.isArray(parsed)) {
          setCatalogItems(parsed);
        }
      } else {
        const defaultList: CatalogItem[] = [
          { 
            id: 'REQ-001', 
            title: 'Pembaruan Perangkat IT 2024', 
            description: 'Pengadaan 50 Laptop & Aksesoris', 
            status: 'OPEN', 
            ownerEstimate: 750000000,
            datePosted: '2026-08-15',
            deadline: '2026-08-31T17:00:00',
            bidsCount: 12,
            lowestBid: 680000000,
            highestBid: 785000000,
            imageUrl: '',
            specifications: [],
            specTable: [],
            tnc: '',
            top: '',
            delivery: '',
            tax: ''
          },
          { 
            id: 'REQ-002', 
            title: 'Pemeliharaan AC Tahunan (Service AC)', 
            description: 'Kontrak service AC berkala', 
            status: 'OPEN', 
            ownerEstimate: 120000000,
            datePosted: '2026-08-18',
            deadline: '2026-08-28T23:59:59',
            bidsCount: 4,
            lowestBid: 105000000,
            highestBid: 130000000,
            imageUrl: '',
            specifications: [],
            specTable: [],
            tnc: '',
            top: '',
            delivery: '',
            tax: ''
          },
          { 
            id: 'REQ-003', 
            title: 'Pengadaan Ban Radial Truk Tronton 11R22.5 (200 Unit)', 
            description: 'Ban radial heavy duty tubeless', 
            status: 'CLOSED', 
            winnerVendorName: 'PT Mandiri Ban Pratama', 
            winnerAmount: 790000000, 
            winnerDate: '2026-08-16',
            ownerEstimate: 850000000,
            datePosted: '2026-08-10',
            deadline: '2026-08-16T17:00:00',
            bidsCount: 6,
            lowestBid: 790000000,
            highestBid: 890000000,
            imageUrl: '',
            specifications: [],
            specTable: [],
            tnc: '',
            top: '',
            delivery: '',
            tax: ''
          },
          { 
            id: 'REQ-004', 
            title: 'Pengadaan Aki Truk Heavy Duty 12V 100Ah N100 (150 Unit)', 
            description: 'Aki GS Astra Hybrid Heavy Duty', 
            status: 'OPEN', 
            ownerEstimate: 267000000,
            datePosted: '2026-08-12',
            deadline: '2026-08-30T18:00:00',
            bidsCount: 3,
            lowestBid: 255000000,
            highestBid: 270000000,
            imageUrl: '',
            specifications: [],
            specTable: [],
            tnc: '',
            top: '',
            delivery: '',
            tax: ''
          },
          { 
            id: 'REQ-005', 
            title: 'Pengadaan Suku Cadang Kampas Rem & Filter Armada', 
            description: 'Kampas rem & filter oli Hino/Isuzu', 
            status: 'OPEN', 
            ownerEstimate: 420000000,
            datePosted: '2026-08-12',
            deadline: '2026-08-25T17:00:00',
            bidsCount: 5,
            lowestBid: 390000000,
            highestBid: 435000000,
            imageUrl: '',
            specifications: [],
            specTable: [],
            tnc: '',
            top: '',
            delivery: '',
            tax: ''
          }
        ];
        setCatalogItems(defaultList);
      }
    } catch (e) {
      console.error('Error loading procurement list for reports:', e);
    }

    // 2. Load Bidding History
    try {
      const savedBids = localStorage.getItem('optima_bids_history');
      if (savedBids) {
        const parsed = JSON.parse(savedBids);
        if (Array.isArray(parsed)) {
          setBidsHistory(parsed);
        }
      } else {
        setBidsHistory(INITIAL_BIDS_DATA);
      }
    } catch (e) {
      console.error('Error loading bidding data for reports:', e);
    }

    // 3. Load Vendor Catalog Items
    try {
      const savedCatalog = localStorage.getItem('optima_vendor_catalog');
      if (savedCatalog) {
        const parsed = JSON.parse(savedCatalog);
        if (Array.isArray(parsed)) {
          setVendorCatalog(parsed);
        }
      } else {
        setVendorCatalog(vendorCatalogItems);
      }
    } catch (e) {
      console.error('Error loading vendor catalog items for reports:', e);
    }
  }, [refreshTrigger, vendorCatalogItems]);

  // Synchronize on global event
  useEffect(() => {
    const handleSync = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    window.addEventListener('optima-db-updated', handleSync);
    return () => window.removeEventListener('optima-db-updated', handleSync);
  }, []);

  // Generate or Load Simulated Sales Data for Vendor Catalog items
  // To keep sales counts stable and interactive, we seed them deterministically by item ID or fetch from a persistent localStorage key
  const catalogSalesMap = useMemo(() => {
    const mapKey = 'optima_simulated_sales_map';
    let savedMap: Record<string, { soldQty: number; revenue: number }> = {};
    try {
      const saved = localStorage.getItem(mapKey);
      if (saved) {
        savedMap = JSON.parse(saved);
      }
    } catch {}

    const updatedMap: Record<string, { soldQty: number; revenue: number }> = { ...savedMap };
    let hasChanges = false;

    vendorCatalog.forEach(item => {
      if (!updatedMap[item.id]) {
        // Generate a realistic seed based on the item ID string
        const idSeed = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const soldQty = item.status === 'OUT_OF_STOCK' ? (idSeed % 40) + 10 : (idSeed % 90) + 15;
        const revenue = soldQty * item.price;
        updatedMap[item.id] = { soldQty, revenue };
        hasChanges = true;
      } else {
        // Keep synced with any potential price change
        const currentSales = updatedMap[item.id];
        const computedRevenue = currentSales.soldQty * item.price;
        if (currentSales.revenue !== computedRevenue) {
          updatedMap[item.id] = { ...currentSales, revenue: computedRevenue };
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      try {
        localStorage.setItem(mapKey, JSON.stringify(updatedMap));
      } catch {}
    }

    return updatedMap;
  }, [vendorCatalog]);

  // Handle Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterCategory('ALL');
    setFilterVendor('ALL');
    setFilterStatus('ALL');
    setFilterArea('ALL');
    setFilterDate('');
    setFilterMonthYear('');
  };

  // -------------------------------------------------------------
  // DATA EXTRACTIONS & LIST PROCESSING FOR TABLES & CHARTS
  // -------------------------------------------------------------

  // Unique lists for filters
  const vendorNames = useMemo(() => {
    const names = new Set<string>();
    vendorCatalog.forEach(i => { if (i.companyName) names.add(i.companyName); });
    bidsHistory.forEach(b => { if (b.vendorName) names.add(b.vendorName); });
    catalogItems.forEach(c => { if (c.winnerVendorName) names.add(c.winnerVendorName); });
    return Array.from(names).sort();
  }, [vendorCatalog, bidsHistory, catalogItems]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    vendorCatalog.forEach(i => { if (i.category) cats.add(i.category); });
    catalogItems.forEach(c => { if (c.category) cats.add(c.category); });
    return Array.from(cats).sort();
  }, [vendorCatalog, catalogItems]);

  const areas = useMemo(() => {
    const areaSet = new Set<string>();
    vendorCatalog.forEach(i => {
      if (i.location) {
        const cleaned = i.location.trim().toUpperCase();
        if (cleaned.includes('JAKARTA') || cleaned.includes('DKI')) areaSet.add('JAKARTA');
        else if (cleaned.includes('BEKASI')) areaSet.add('BEKASI');
        else if (cleaned.includes('TANGERANG')) areaSet.add('TANGERANG');
        else if (cleaned.includes('BOGOR')) areaSet.add('BOGOR');
        else if (cleaned.includes('DEPOK')) areaSet.add('DEPOK');
        else if (cleaned.includes('KARAWANG')) areaSet.add('KARAWANG');
        else if (cleaned.includes('BANTEN')) areaSet.add('BANTEN');
        else areaSet.add(cleaned);
      }
    });
    return Array.from(areaSet).sort();
  }, [vendorCatalog]);

  // Computed Summary Statistics
  const summaryStats = useMemo(() => {
    // 1. Procurement Tenders
    const totalTenders = catalogItems.length;
    const closedTenders = catalogItems.filter(i => i.status === 'CLOSED').length;
    const openTenders = catalogItems.filter(i => i.status === 'OPEN').length;

    let totalBudgetHps = 0;
    let totalPoRealisasi = 0;
    
    catalogItems.forEach(item => {
      totalBudgetHps += item.ownerEstimate || 0;
      if (item.winnerAmount && Number(item.winnerAmount) > 0) {
        totalPoRealisasi += Number(item.winnerAmount);
      }
    });

    const successRatio = totalTenders > 0 ? (closedTenders / totalTenders) * 100 : 0;
    const savings = totalBudgetHps - totalPoRealisasi;
    const savingsPercentage = totalBudgetHps > 0 ? (savings / totalBudgetHps) * 100 : 0;

    // 2. Catalog Sales & Revenues
    let totalCatalogProducts = vendorCatalog.length;
    let totalCatalogSoldQty = 0;
    let totalCatalogRevenue = 0;

    vendorCatalog.forEach(item => {
      const sales = catalogSalesMap[item.id] || { soldQty: 0, revenue: 0 };
      totalCatalogSoldQty += sales.soldQty;
      totalCatalogRevenue += sales.revenue;
    });

    // 3. Bidding Metrics
    const totalBidsCount = bidsHistory.length;
    const acceptedBids = bidsHistory.filter(b => b.status === 'ACCEPTED').length;
    const pendingBids = bidsHistory.filter(b => b.status === 'PENDING').length;

    return {
      totalTenders,
      closedTenders,
      openTenders,
      totalBudgetHps,
      totalPoRealisasi,
      successRatio,
      savings,
      savingsPercentage,
      totalCatalogProducts,
      totalCatalogSoldQty,
      totalCatalogRevenue,
      totalBidsCount,
      acceptedBids,
      pendingBids
    };
  }, [catalogItems, vendorCatalog, bidsHistory, catalogSalesMap]);

  // Filtered Catalog Report Data
  const filteredCatalogData = useMemo(() => {
    return vendorCatalog.filter(item => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.title.toLowerCase().includes(q) || 
        item.id.toLowerCase().includes(q) || 
        (item.companyName && item.companyName.toLowerCase().includes(q));

      // Category filter
      const matchCategory = filterCategory === 'ALL' || item.category === filterCategory;

      // Vendor filter
      const matchVendor = filterVendor === 'ALL' || item.companyName === filterVendor;

      // Status filter
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;

      // Area filter
      let matchArea = true;
      if (filterArea !== 'ALL') {
        if (!item.location) matchArea = false;
        else {
          const loc = item.location.toUpperCase();
          if (filterArea === 'JAKARTA') {
            matchArea = loc.includes('JAKARTA') || loc.includes('DKI') || loc.includes('UTARA') || loc.includes('TIMUR') || loc.includes('SELATAN') || loc.includes('PUSAT') || loc.includes('BARAT');
          } else {
            matchArea = loc.includes(filterArea);
          }
        }
      }

      // Date & Month-Year filter
      let matchDate = true;
      if (filterDate) {
        matchDate = item.lastUpdated === filterDate;
      }
      let matchMonthYear = true;
      if (filterMonthYear) {
        matchMonthYear = !!(item.lastUpdated && item.lastUpdated.startsWith(filterMonthYear));
      }

      return matchSearch && matchCategory && matchVendor && matchStatus && matchArea && matchDate && matchMonthYear;
    });
  }, [vendorCatalog, searchQuery, filterCategory, filterVendor, filterStatus, filterArea, filterDate, filterMonthYear]);

  // Filtered Procurement Report Data
  const filteredProcurementData = useMemo(() => {
    return catalogItems.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.title.toLowerCase().includes(q) || 
        item.id.toLowerCase().includes(q) ||
        (item.winnerVendorName && item.winnerVendorName.toLowerCase().includes(q));

      const matchCategory = filterCategory === 'ALL' || item.category === filterCategory;
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
      const matchVendor = filterVendor === 'ALL' || item.winnerVendorName === filterVendor;

      // Date & Month-Year filter
      let matchDate = true;
      if (filterDate) {
        matchDate = item.datePosted === filterDate;
      }
      let matchMonthYear = true;
      if (filterMonthYear) {
        matchMonthYear = !!(item.datePosted && item.datePosted.startsWith(filterMonthYear));
      }

      return matchSearch && matchCategory && matchStatus && matchVendor && matchDate && matchMonthYear;
    });
  }, [catalogItems, searchQuery, filterCategory, filterStatus, filterVendor, filterDate, filterMonthYear]);

  // Filtered Bids Report Data
  const filteredBidsData = useMemo(() => {
    return bidsHistory.filter(bid => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        bid.id.toLowerCase().includes(q) || 
        bid.reqId.toLowerCase().includes(q) || 
        bid.reqTitle.toLowerCase().includes(q) || 
        bid.vendorName.toLowerCase().includes(q);

      const matchCategory = filterCategory === 'ALL' || bid.category === filterCategory;
      const matchStatus = filterStatus === 'ALL' || bid.status === filterStatus;
      const matchVendor = filterVendor === 'ALL' || bid.vendorName === filterVendor;

      // Date & Month-Year filter
      let matchDate = true;
      if (filterDate) {
        matchDate = bid.dateSubmitted === filterDate;
      }
      let matchMonthYear = true;
      if (filterMonthYear) {
        matchMonthYear = !!(bid.dateSubmitted && bid.dateSubmitted.startsWith(filterMonthYear));
      }

      return matchSearch && matchCategory && matchStatus && matchVendor && matchDate && matchMonthYear;
    });
  }, [bidsHistory, searchQuery, filterCategory, filterStatus, filterVendor, filterDate, filterMonthYear]);

  // -------------------------------------------------------------
  // EXPORT TO EXCEL LOGIC (HTML EXCEL COMPLIANT FORMATTER)
  // -------------------------------------------------------------
  const handleExportExcel = (type: 'catalog' | 'procurement' | 'bidding') => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let sheetName = '';
    let fileName = '';

    if (type === 'catalog') {
      sheetName = 'Laporan Katalog & Penjualan';
      fileName = `Laporan_Katalog_Vendor_Pancaran_${new Date().toISOString().split('T')[0]}`;
      headers = [
        'No', 
        'SKU / ID Barang', 
        'Nama Produk / Layanan', 
        'Kategori', 
        'Nama Perusahaan Vendor', 
        'Wilayah Operasional', 
        'Status Ketersediaan', 
        'Durasi Inden',
        'Stok Saat Ini', 
        'Unit', 
        'Harga Satuan (IDR)', 
        'Jumlah Terjual (Qty)', 
        'Total Penjualan / Omset (IDR)'
      ];

      rows = filteredCatalogData.map((item, index) => {
        const sales = catalogSalesMap[item.id] || { soldQty: 0, revenue: 0 };
        const displayStatus = item.status === 'AVAILABLE' ? 'Ready Stock' : item.status === 'PRE_ORDER' ? 'Inden / Pre-Order' : 'Stok Habis';
        return [
          index + 1,
          item.id,
          item.title,
          item.category,
          item.companyName || '-',
          item.location || '-',
          displayStatus,
          item.indentDuration || '-',
          item.stock,
          item.unit,
          `Rp ${item.price.toLocaleString('id-ID')}`,
          sales.soldQty,
          `Rp ${sales.revenue.toLocaleString('id-ID')}`
        ];
      });
    } else if (type === 'procurement') {
      sheetName = 'Laporan Pengadaan Tender';
      fileName = `Laporan_Pengadaan_Pancaran_${new Date().toISOString().split('T')[0]}`;
      headers = [
        'No',
        'Kode Pengadaan (Req ID)',
        'Judul Paket Pengadaan',
        'Kategori',
        'Estimasi HPS Anggaran (IDR)',
        'Jumlah Proposal Bid Masuk',
        'Status Pengadaan',
        'Nama Pemenang Tender',
        'Nilai Kontrak / PO Terbit (IDR)',
        'Tanggal Penetapan Pemenang'
      ];

      rows = filteredProcurementData.map((item, index) => {
        const bidsCount = bidsHistory.filter(b => b.reqId === item.id).length;
        const dispStatus = item.status === 'CLOSED' ? 'Selesai / PO Terbit' : item.status === 'OPEN' ? 'Proses Bidding' : item.status === 'DRAFT' ? 'Draft Internal' : 'Dibatalkan';
        return [
          index + 1,
          item.id,
          item.title,
          item.category,
          `Rp ${(item.ownerEstimate || 0).toLocaleString('id-ID')}`,
          bidsCount,
          dispStatus,
          item.winnerVendorName || 'Belum Ada',
          item.winnerAmount ? `Rp ${item.winnerAmount.toLocaleString('id-ID')}` : 'Rp 0',
          item.winnerDate || '-'
        ];
      });
    } else if (type === 'bidding') {
      sheetName = 'Laporan Detail Proposal Bidding';
      fileName = `Laporan_Proposal_Bidding_Pancaran_${new Date().toISOString().split('T')[0]}`;
      headers = [
        'No',
        'ID Proposal Bid',
        'Kode Tender',
        'Judul Paket Tender',
        'Kategori Tender',
        'Nama Vendor Penawar',
        'Email Vendor',
        'Telepon Vendor',
        'Total Nilai Penawaran (IDR)',
        'Harga Satuan Penawaran (IDR)',
        'Quantity',
        'Unit',
        'Status Proposal',
        'Durasi Lead Time Pengiriman',
        'Garansi yang Ditawarkan',
        'Syarat Pembayaran (TOP)',
        'Keterangan Tambahan',
        'Tanggal Submit Proposal'
      ];

      rows = filteredBidsData.map((bid, index) => {
        return [
          index + 1,
          bid.id,
          bid.reqId,
          bid.reqTitle,
          bid.category,
          bid.vendorName,
          bid.vendorEmail || '-',
          bid.vendorPhone || '-',
          `Rp ${bid.amount.toLocaleString('id-ID')}`,
          `Rp ${(bid.unitPrice || 0).toLocaleString('id-ID')}`,
          bid.quantity || 1,
          bid.unit || 'pcs',
          bid.status,
          bid.estimatedLeadTime || '-',
          bid.warranty || '-',
          bid.paymentMethod || '-',
          bid.tncNotes || '-',
          bid.dateSubmitted
        ];
      });
    }

    if (rows.length === 0) {
      alert('Maaf, tidak ada data terpilih untuk diekspor. Silakan periksa kembali filter pencarian Anda.');
      return;
    }

    // Build perfect HTML Excel Spreadsheet with custom styles and automatic number & IDR currency formatters
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${sheetName}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 11pt; }
          th { background-color: #0f172a; color: #ffffff; font-weight: bold; border: 1px solid #94a3b8; padding: 10px; text-align: left; font-size: 11pt; }
          td { border: 1px solid #cbd5e1; padding: 8px; vertical-align: middle; }
          .title-row { font-size: 16pt; font-weight: bold; color: #0f172a; border: none; padding-bottom: 10px; }
          .meta-row { font-size: 10pt; color: #64748b; border: none; padding-bottom: 20px; }
          .number { mso-number-format:"\\#,\\#\\#0"; text-align: right; }
          .currency { mso-number-format:"\\"Rp\\"\\#,\\#\\#0"; text-align: right; }
          .badge-green { background-color: #d1fae5; color: #065f46; font-weight: bold; text-align: center; }
          .badge-yellow { background-color: #fef3c7; color: #92400e; font-weight: bold; text-align: center; }
          .badge-red { background-color: #fee2e2; color: #991b1b; font-weight: bold; text-align: center; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td colspan="${headers.length}" class="title-row" style="border:none;">LAPORAN AKUMULASI DATA OPTIMA PANCARAN GROUP</td>
          </tr>
          <tr>
            <td colspan="${headers.length}" class="meta-row" style="border:none;">
              Kategori Laporan: <b>${sheetName}</b> | Tanggal Ekspor: ${new Date().toLocaleString('id-ID')} | User: muhamad.rizki@pancaran-logistic.id
            </td>
          </tr>
          <tr><td colspan="${headers.length}" style="border:none; height:15px;"></td></tr>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, rIdx) => `
              <tr>
                ${row.map((cell, cIdx) => {
                  const cellStr = cell !== undefined && cell !== null ? String(cell) : '';
                  const isNum = typeof cell === 'number';
                  
                  // Stylings and custom formats
                  let customClass = '';
                  let rawVal = cellStr;

                  if (isNum) {
                    customClass = 'class="number"';
                  } else if (cellStr.startsWith('Rp ')) {
                    const parsedNum = parseInt(cellStr.replace(/[^0-9-]/g, ''));
                    if (!isNaN(parsedNum)) {
                      customClass = 'class="currency"';
                      rawVal = String(parsedNum);
                    }
                  } else if (cellStr === 'Ready Stock' || cellStr === 'Selesai / PO Terbit' || cellStr === 'ACCEPTED') {
                    customClass = 'class="badge-green"';
                  } else if (cellStr.startsWith('Inden') || cellStr === 'Proses Bidding' || cellStr === 'PENDING' || cellStr === 'REVIEWED' || cellStr === 'NEGOTIATION') {
                    customClass = 'class="badge-yellow"';
                  } else if (cellStr === 'Stok Habis' || cellStr === 'Dibatalkan' || cellStr === 'REJECTED') {
                    customClass = 'class="badge-red"';
                  }

                  return `<td ${customClass} ${customClass.includes('currency') ? `x:num="${rawVal}"` : ''}>${cellStr}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Procurement & Catalog Auditing Center
            </span>
            <span className="text-xs text-slate-500 font-medium">• Laporan Komprehensif Berorientasi Data</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pusat Laporan & Ekspor Excel (OPTIMA)
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Unduh laporan eksekutif realisasi belanja, kinerja penawaran proposal vendor, dan analisis omset peredaran stok katalog langsung ke format Excel.
          </p>
        </div>
        <button
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          Sinkronisasi Data Live
        </button>
      </div>

      {/* SUMMARY KPI BANNER (EXEC SUMMARY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-850 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10">
            <DollarSign className="w-20 h-20 text-white" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Realisasi Belanja (PO)</span>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            Rp {summaryStats.totalPoRealisasi.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Dari <span className="text-white font-bold">{summaryStats.closedTenders}</span> pengadaan berstatus sukses (Winner PO).
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10">
            <TrendingUp className="w-16 h-16 text-blue-600" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Penghematan Pengadaan (Savings)</span>
          <div className="text-2xl font-black mt-2 font-mono text-blue-700">
            Rp {summaryStats.savings.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
            <Percent className="w-3 h-3" />
            <span>Efisiensi anggaran sebesar {summaryStats.savingsPercentage.toFixed(1)}% HPS</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10">
            <ShoppingBag className="w-16 h-16 text-teal-600" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nilai Transaksi Katalog Vendor</span>
          <div className="text-2xl font-black mt-2 font-mono text-teal-700">
            Rp {summaryStats.totalCatalogRevenue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Akumulasi pesanan/terjual sebanyak <strong className="text-slate-800 font-bold">{summaryStats.totalCatalogSoldQty}</strong> Unit produk.
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10">
            <Activity className="w-16 h-16 text-amber-500" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rasio Tender Sukses & Penawaran</span>
          <div className="text-2xl font-black mt-2 font-mono text-amber-600">
            {summaryStats.successRatio.toFixed(0)}% Selesai
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Dengan total <strong className="text-slate-800">{summaryStats.totalBidsCount} proposal bidding</strong> yang teregistrasi.
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab('summary'); resetFilters(); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'summary' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          Ringkasan Eksekutif
        </button>
        <button
          onClick={() => { setActiveTab('catalog'); resetFilters(); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'catalog' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Katalog & Data Terjual
        </button>
        <button
          onClick={() => { setActiveTab('procurement'); resetFilters(); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'procurement' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Pengadaan (Tender)
        </button>
        <button
          onClick={() => { setActiveTab('bidding'); resetFilters(); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'bidding' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          Detail Proposal Bidding
        </button>
      </div>

      {/* FILTER CONTROLS BAR (Hidden on Summary Tab) */}
      {activeTab !== 'summary' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-3xs flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2.5 items-center flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative min-w-[200px] max-w-sm flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'catalog' ? 'Cari SKU, Nama Barang, Vendor...' :
                  activeTab === 'procurement' ? 'Cari Tender, Pemenang, Kode...' : 'Cari Bids, Vendor, No Tender...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-slate-400 text-slate-700 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="ALL">📂 Semua Kategori</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'SPARE_PART' ? '⚙️ Spare Part' :
                   c === 'BAN' ? '⭕ Ban Truk & Kendaraan' :
                   c === 'AKI' ? '🔋 Aki / Baterai' : `📦 ${c}`}
                </option>
              ))}
            </select>

            {/* Vendor Filter */}
            <select
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL">🏢 Semua Perusahaan Vendor</option>
              {vendorNames.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            {/* Tab Specific Filters */}
            {activeTab === 'catalog' && (
              <>
                {/* Area Filter */}
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="ALL">📍 Semua Area</option>
                  {areas.map(a => (
                    <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()}</option>
                  ))}
                </select>

                {/* Status Ketersediaan Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="ALL">🔋 Semua Ketersediaan</option>
                  <option value="AVAILABLE">Ready Stock</option>
                  <option value="PRE_ORDER">Inden / PO</option>
                  <option value="OUT_OF_STOCK">Habis</option>
                </select>
              </>
            )}

            {activeTab === 'procurement' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="ALL">📋 Semua Status</option>
                <option value="OPEN">Tender Sedang Buka (OPEN)</option>
                <option value="CLOSED">Selesai / PO Terbit (CLOSED)</option>
                <option value="CANCELLED">Dibatalkan (CANCELLED)</option>
              </select>
            )}

            {activeTab === 'bidding' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="ALL">📋 Semua Evaluasi</option>
                <option value="ACCEPTED">Disetujui / Menang PO (ACCEPTED)</option>
                <option value="PENDING">Menunggu Evaluasi (PENDING)</option>
                <option value="REVIEWED">Sudah Direview (REVIEWED)</option>
                <option value="NEGOTIATION">Proses Negosiasi (NEGOTIATION)</option>
                <option value="REJECTED">Ditolak / Gugur (REJECTED)</option>
              </select>
            )}

            {/* Filter Tanggal */}
            <div className="flex items-center gap-1 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 ml-0.5">Tgl:</span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none p-0 cursor-pointer w-[110px]"
              />
              {filterDate && (
                <button onClick={() => setFilterDate('')} className="p-0.5 hover:bg-slate-200 rounded text-slate-400">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Bulan & Tahun */}
            <div className="flex items-center gap-1 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 ml-0.5">Bln:</span>
              <input
                type="month"
                value={filterMonthYear}
                onChange={(e) => setFilterMonthYear(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none p-0 cursor-pointer w-[100px]"
              />
              {filterMonthYear && (
                <button onClick={() => setFilterMonthYear('')} className="p-0.5 hover:bg-slate-200 rounded text-slate-400">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || filterCategory !== 'ALL' || filterVendor !== 'ALL' || filterStatus !== 'ALL' || filterArea !== 'ALL' || filterDate || filterMonthYear) && (
              <button
                onClick={resetFilters}
                className="text-rose-600 hover:text-rose-700 font-bold text-xs hover:underline flex items-center gap-1 shrink-0"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Export Excel Button */}
          <button
            onClick={() => handleExportExcel(activeTab as 'catalog' | 'procurement' | 'bidding')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor ke Excel</span>
          </button>
        </div>
      )}

      {/* MAIN TAB CONTENT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* =======================================================
            TAB 1: EXECUTIVE SUMMARY 
            ======================================================= */}
        {activeTab === 'summary' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Kinerja Transaksi & Audit Pengadaan
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Procurement Savings Chart Mock / Status */}
              <div className="border border-slate-150 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800">Evaluasi Efisiensi Tender Pengadaan</h3>
                
                <div className="space-y-3.5 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Anggaran yang Dianggarkan (HPS)</span>
                      <span className="text-slate-800 font-mono">Rp {summaryStats.totalBudgetHps.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-slate-700 h-3 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Realisasi Pengeluaran Kontrak PO</span>
                      <span className="text-slate-800 font-mono">Rp {summaryStats.totalPoRealisasi.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${(summaryStats.totalPoRealisasi / (summaryStats.totalBudgetHps || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-emerald-600 font-bold">Total Efisiensi Finansial (Sisa Anggaran)</span>
                      <span className="text-emerald-700 font-bold font-mono">Rp {summaryStats.savings.toLocaleString('id-ID')} ({summaryStats.savingsPercentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(summaryStats.savings / (summaryStats.totalBudgetHps || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs bg-emerald-50 border border-emerald-150 rounded-xl p-3 text-emerald-800 font-medium">
                  💡 <b>Rekomendasi Audit:</b> Tim Procurement Pancaran Group berhasil melakukan negosiasi harga rata-rata sehingga menghemat sebesar <b>{summaryStats.savingsPercentage.toFixed(1)}%</b> anggaran. Disarankan untuk memprioritaskan vendor dengan jaminan garansi lead time yang ketat.
                </div>
              </div>

              {/* Right Column: Catalog Performance Summary */}
              <div className="border border-slate-150 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800">Analisis Sirkulasi Katalog Vendor</h3>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Volume Produk SKU</span>
                    <span className="text-lg font-black text-slate-800">{summaryStats.totalCatalogProducts} Items</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Suku cadang, Ban, Aki aktif</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Volume Penjualan</span>
                    <span className="text-lg font-black text-emerald-700">{summaryStats.totalCatalogSoldQty} Unit</span>
                    <span className="text-[10px] text-emerald-600 block font-semibold mt-1">Terjual & Direquest PO</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Rasio Bidder per Tender</span>
                    <span className="text-lg font-black text-slate-800">
                      {summaryStats.totalTenders > 0 ? (summaryStats.totalBidsCount / summaryStats.totalTenders).toFixed(1) : 0} Proposal
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Rata-rata persaingan vendor</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Total Omset Vendor</span>
                    <span className="text-lg font-black text-teal-700">Rp {summaryStats.totalCatalogRevenue.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] text-teal-600 block font-semibold mt-1">Perputaran finansial mitra</span>
                  </div>
                </div>

                <div className="text-xs bg-blue-50 border border-blue-150 rounded-xl p-3 text-blue-800 font-medium">
                  🚚 <b>Aktivitas Distribusi Logistik:</b> Wilayah operasional Jabodetabek masih mendominasi pengadaan barang sebesar <b>85%</b> dari total pengiriman, terutama didorong oleh pesanan ban radial berat.
                </div>
              </div>
            </div>

            {/* Quick Export Summary Checklist */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Unduh Laporan Format Microsoft Excel</h3>
                <p className="text-xs text-slate-500 mt-1">Pilih kategori laporan di samping untuk mendownload lembar kerja audit resmi perusahaan.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => handleExportExcel('catalog')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  Katalog & Terjual
                </button>
                <button
                  onClick={() => handleExportExcel('procurement')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-700" />
                  Pengadaan Tender
                </button>
                <button
                  onClick={() => handleExportExcel('bidding')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-bold border border-amber-200 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                  Proposal Bidding
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 2: LAPORAN KATALOG VENDOR & SUPPLIER 
            ======================================================= */}
        {activeTab === 'catalog' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider border-b border-slate-800 select-none">
                  <th className="py-3 px-4 text-center w-12">No</th>
                  <th className="py-3 px-3">SKU / ID</th>
                  <th className="py-3 px-3 min-w-[200px]">Nama Produk / Layanan</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Nama Vendor</th>
                  <th className="py-3 px-3">Wilayah</th>
                  <th className="py-3 px-3 text-center">Ketersediaan</th>
                  <th className="py-3 px-3 text-right">Stok</th>
                  <th className="py-3 px-3 text-right">Harga Satuan</th>
                  <th className="py-3 px-3 text-center">Jumlah Terjual</th>
                  <th className="py-3 px-3 text-right min-w-[120px]">Total Omset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredCatalogData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400 font-bold bg-slate-50">
                      ❌ Tidak ditemukan data katalog yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredCatalogData.map((item, index) => {
                    const sales = catalogSalesMap[item.id] || { soldQty: 0, revenue: 0 };
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 font-bold font-mono">{index + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-600 font-mono text-[10px] uppercase">{item.id}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block leading-tight">{item.title}</span>
                          {item.indentDuration && (
                            <span className="text-[9px] text-amber-600 font-semibold block mt-0.5">Estimasi Inden: {item.indentDuration}</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
                            {item.category === 'SPARE_PART' ? 'SPARE PART' : item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {item.companyName ? (
                            <span 
                              onClick={() => setSelectedCompanyModal(item.companyName)}
                              className="font-bold text-slate-800 hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                              title="Klik untuk melihat penilaian & histori bids vendor"
                            >
                              {item.companyName}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600 text-[11px]">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.location || 'Jabodetabek'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.status === 'AVAILABLE' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-bold text-[10px]">
                              Ready
                            </span>
                          ) : item.status === 'PRE_ORDER' ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-md font-bold text-[10px]">
                              Inden
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-md font-bold text-[10px]">
                              Habis
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-700 font-mono">
                          {item.stock} <span className="text-[10px] text-slate-400 font-normal">{item.unit}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-800 font-mono">
                          Rp {item.price.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-700 font-mono bg-emerald-50/40">
                          {sales.soldQty} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-teal-700 font-mono bg-teal-50/40">
                          Rp {sales.revenue.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* =======================================================
            TAB 3: LAPORAN PENGADAAN (TENDERS)
            ======================================================= */}
        {activeTab === 'procurement' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider border-b border-slate-800 select-none">
                  <th className="py-3 px-4 text-center w-12">No</th>
                  <th className="py-3 px-3">Kode Tender</th>
                  <th className="py-3 px-3 min-w-[200px]">Paket Pengadaan / Tender</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3 text-right">Anggaran (HPS)</th>
                  <th className="py-3 px-3 text-center">Bids Masuk</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Pemenang Tender</th>
                  <th className="py-3 px-3 text-right">Nilai Kontrak / PO</th>
                  <th className="py-3 px-3 text-center">Tgl Menang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredProcurementData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 font-bold bg-slate-50">
                      ❌ Tidak ditemukan data pengadaan tender yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredProcurementData.map((item, index) => {
                    const bidsCount = bidsHistory.filter(b => b.reqId === item.id).length;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 font-bold font-mono">{index + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-600 font-mono text-[10px] uppercase">{item.id}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block leading-tight">{item.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-1 line-clamp-1 font-normal">{item.description}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded-md uppercase">
                            {item.category === 'SPARE_PART' ? 'SPARE PART' : item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-700 font-mono">
                          Rp {(item.ownerEstimate || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md font-bold font-mono text-[11px]">
                            {bidsCount} Bidder
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.status === 'CLOSED' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-bold text-[10px] uppercase">
                              Selesai (PO)
                            </span>
                          ) : item.status === 'OPEN' ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-md font-bold text-[10px] uppercase">
                              Buka (Tender)
                            </span>
                          ) : item.status === 'DRAFT' ? (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md font-bold text-[10px] uppercase">
                              Draft
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-md font-bold text-[10px] uppercase">
                              Batal
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.winnerVendorName ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              {item.winnerVendorName}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-emerald-700 font-mono bg-emerald-50/20">
                          {item.winnerAmount ? `Rp ${item.winnerAmount.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-500 text-[10px]">
                          {item.winnerDate || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* =======================================================
            TAB 4: DETAIL PROPOSAL BIDDING
            ======================================================= */}
        {activeTab === 'bidding' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider border-b border-slate-800 select-none">
                  <th className="py-3 px-4 text-center w-12">No</th>
                  <th className="py-3 px-3">ID Proposal</th>
                  <th className="py-3 px-3">Kode Tender</th>
                  <th className="py-3 px-3 min-w-[180px]">Judul Paket Tender</th>
                  <th className="py-3 px-3">Perusahaan Vendor</th>
                  <th className="py-3 px-3 text-right">Nilai Penawaran</th>
                  <th className="py-3 px-3 text-center">Lead Time</th>
                  <th className="py-3 px-3">Top Syarat Pembayaran</th>
                  <th className="py-3 px-3 text-center">Status Evaluasi</th>
                  <th className="py-3 px-3 text-center">Tanggal Submit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredBidsData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 font-bold bg-slate-50">
                      ❌ Tidak ditemukan proposal penawaran bidding yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredBidsData.map((bid, index) => {
                    return (
                      <tr key={bid.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 font-bold font-mono">{index + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-600 font-mono text-[10px] uppercase">{bid.id}</td>
                        <td className="py-3 px-3 font-bold text-blue-700 font-mono text-[10px] uppercase">{bid.reqId}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block leading-tight">{bid.reqTitle}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span 
                            onClick={() => setSelectedCompanyModal(bid.vendorName)}
                            className="font-bold text-slate-800 hover:text-blue-600 hover:underline cursor-pointer block leading-tight transition-colors"
                            title="Klik untuk melihat penilaian & histori bids vendor"
                          >
                            {bid.vendorName}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-normal">{bid.vendorEmail}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-800 font-mono">
                          Rp {bid.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {bid.estimatedLeadTime || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-semibold">{bid.paymentMethod || 'COD'}</td>
                        <td className="py-3 px-3 text-center">
                          {bid.status === 'ACCEPTED' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-bold text-[10px]">
                              DITERIMA (PO)
                            </span>
                          ) : bid.status === 'PENDING' ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-md font-bold text-[10px]">
                              MENUNGGU
                            </span>
                          ) : bid.status === 'REVIEWED' ? (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-md font-bold text-[10px]">
                              DI-REVIEW
                            </span>
                          ) : bid.status === 'NEGOTIATION' ? (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 rounded-md font-bold text-[10px]">
                              NEGOSIASI
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-md font-bold text-[10px]">
                              GUGUR / TOLAK
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-500 text-[10px]">
                          {bid.dateSubmitted}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
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
