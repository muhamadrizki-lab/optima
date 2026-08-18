import React, { useState } from 'react';
import { VendorCatalogItem, ItemCategory, VendorType, User } from '../types';
import SafeImage from '../components/SafeImage';
import ImageUploadInput from '../components/ImageUploadInput';
import { 
  Search, 
  Filter, 
  Tag, 
  Package, 
  Wrench, 
  Zap, 
  Disc, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink,
  SlidersHorizontal,
  X,
  AlertCircle
} from 'lucide-react';

interface CatalogVendorProps {
  user: User | null;
  items: VendorCatalogItem[];
  onAddItem?: (item: VendorCatalogItem) => void;
  onUpdateItem?: (item: VendorCatalogItem) => void;
  onDeleteItem?: (id: string) => void;
  onNavigateToMyCatalog?: () => void;
}

export default function CatalogVendor({
  user,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onNavigateToMyCatalog
}: CatalogVendorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL'); // ALL, SUPPLIER, VENDOR_JASA
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL'); // ALL, BAN, AKI, SPARE_PART, JASA
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL'); // ALL, AVAILABLE, PRE_ORDER
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'STOCK_HIGH'>('NEWEST');

  const [selectedItemDetail, setSelectedItemDetail] = useState<VendorCatalogItem | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactVendor, setContactVendor] = useState<VendorCatalogItem | null>(null);
  const [rfqSuccess, setRfqSuccess] = useState(false);
  const [rfqQty, setRfqQty] = useState(1);
  const [rfqBidAmount, setRfqBidAmount] = useState(0);
  const [rfqNote, setRfqNote] = useState('');

  // Add / Edit item modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorCatalogItem | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    category: ItemCategory;
    vendorType: VendorType;
    brand: string;
    partNumber: string;
    price: number;
    unit: string;
    stock: number;
    minOrder: number;
    condition: 'BARU' | 'REKONDISI' | 'LAYANAN';
    description: string;
    specifications: string;
    warranty: string;
    deliveryInfo: string;
    location: string;
    imageUrl: string;
    status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'PRE_ORDER';
  }>({
    title: '',
    category: 'SPARE_PART',
    vendorType: 'SUPPLIER',
    brand: '',
    partNumber: '',
    price: 0,
    unit: 'Pcs',
    stock: 10,
    minOrder: 1,
    condition: 'BARU',
    description: '',
    specifications: '',
    warranty: 'Garansi 6 Bulan',
    deliveryInfo: 'Pengiriman 1-2 hari kerja',
    location: 'Jabodetabek',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE'
  });

  const categories = [
    { id: 'ALL', label: 'Semua Produk & Jasa', icon: SlidersHorizontal },
    { id: 'BAN', label: 'Ban Truk & Mobil', icon: Disc },
    { id: 'AKI', label: 'Aki & Kelistrikan', icon: Zap },
    { id: 'SPARE_PART', label: 'Spare Part & Mesin', icon: Package },
    { id: 'JASA', label: 'Jasa & Maintenance', icon: Wrench },
  ];

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredItems = items
    .filter(item => {
      // Type filter
      if (selectedType !== 'ALL' && item.vendorType !== selectedType) return false;
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesPart = (item.partNumber || '').toLowerCase().includes(q);
        const matchesVendor = item.vendorName.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesTitle || matchesBrand || matchesPart || matchesVendor || matchesDesc;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'STOCK_HIGH') return b.stock - a.stock;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });

  const handleOpenFormModal = (item?: VendorCatalogItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        vendorType: item.vendorType,
        brand: item.brand,
        partNumber: item.partNumber || '',
        price: item.price,
        unit: item.unit,
        stock: item.stock,
        minOrder: item.minOrder,
        condition: item.condition,
        description: item.description,
        specifications: item.specifications.join('\n'),
        warranty: item.warranty || '',
        deliveryInfo: item.deliveryInfo || '',
        location: item.location || '',
        imageUrl: item.imageUrl,
        status: item.status
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        category: 'SPARE_PART',
        vendorType: user?.vendorType || 'SUPPLIER',
        brand: '',
        partNumber: '',
        price: 0,
        unit: 'Pcs',
        stock: 10,
        minOrder: 1,
        condition: 'BARU',
        description: '',
        specifications: 'Spesifikasi item...\nKesesuaian tipe kendaraan...',
        warranty: 'Garansi 6 Bulan',
        deliveryInfo: 'Siap kirim 1-2 hari kerja area Jabodetabek',
        location: 'Jakarta',
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        status: 'AVAILABLE'
      });
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.price <= 0) return;

    const specsArray = formData.specifications
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const getCategoryLabel = (cat: ItemCategory) => {
      switch (cat) {
        case 'BAN': return 'Ban Truk & Kendaraan';
        case 'AKI': return 'Aki & Kelistrikan';
        case 'SPARE_PART': return 'Spare Part & Komponen';
        case 'JASA': return 'Jasa & Perawatan Armada';
        default: return 'Lainnya';
      }
    };

    if (editingItem && onUpdateItem) {
      const updated: VendorCatalogItem = {
        ...editingItem,
        title: formData.title,
        category: formData.category,
        categoryLabel: getCategoryLabel(formData.category),
        vendorType: formData.vendorType,
        brand: formData.brand,
        partNumber: formData.partNumber,
        price: Number(formData.price),
        unit: formData.unit,
        stock: Number(formData.stock),
        minOrder: Number(formData.minOrder),
        condition: formData.condition,
        description: formData.description,
        specifications: specsArray.length > 0 ? specsArray : ['Spesifikasi standar vendor'],
        warranty: formData.warranty,
        deliveryInfo: formData.deliveryInfo,
        location: formData.location,
        imageUrl: formData.imageUrl,
        status: formData.status,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onUpdateItem(updated);
    } else if (onAddItem) {
      const newItem: VendorCatalogItem = {
        id: `VC-${Date.now().toString().slice(-4)}`,
        vendorId: user?.id || 'VEND-USER',
        vendorName: user?.companyName || user?.name || 'Vendor Terdaftar',
        companyName: user?.companyName || user?.name || 'PT Vendor Mitra Logistics',
        vendorPhone: user?.phone || '0812-3456-7890',
        vendorEmail: user?.email || 'vendor@example.com',
        vendorType: formData.vendorType,
        category: formData.category,
        categoryLabel: getCategoryLabel(formData.category),
        title: formData.title,
        partNumber: formData.partNumber,
        brand: formData.brand,
        price: Number(formData.price),
        unit: formData.unit,
        stock: Number(formData.stock),
        minOrder: Number(formData.minOrder),
        condition: formData.condition,
        description: formData.description,
        specifications: specsArray.length > 0 ? specsArray : ['Spesifikasi standar vendor'],
        warranty: formData.warranty,
        deliveryInfo: formData.deliveryInfo,
        location: formData.location,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        status: formData.status,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onAddItem(newItem);
    }

    setIsFormModalOpen(false);
  };

  const handleOpenContact = (item: VendorCatalogItem) => {
    setContactVendor(item);
    setRfqQty(item.minOrder || 1);
    setRfqBidAmount(item.price * (item.minOrder || 1));
    setRfqNote(`Halo ${item.companyName}, kami dari Pancaran Logistics tertarik dengan ${item.title}. Mohon informasi ketersediaan ${item.minOrder || 1} ${item.unit}.`);
    setRfqSuccess(false);
    setIsContactModalOpen(true);
  };

  const handleSendRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSuccess(true);
    setTimeout(() => {
      setIsContactModalOpen(false);
      setRfqSuccess(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner & Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {user?.role === 'INTERNAL' ? 'Pangkalan Data Pengadaan' : 'Eksplorasi Katalog & Penawaran'}
            </span>
            <span className="text-xs text-slate-500 font-medium">• Total <strong className="text-slate-800">{items.length} Jenis Barang</strong> (SKU) Terdaftar</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Katalog Vendor & Supplier
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Daftar stok produk suku cadang, ban, aki mobil/truk, dan layanan jasa perawatan armada dari mitra vendor resmi ({items.length} jenis produk/jasa unik).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {user?.role === 'EXTERNAL' && (
            <button
              onClick={() => handleOpenFormModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Posting Produk / Jasa
            </button>
          )}

          {user?.role === 'EXTERNAL' && onNavigateToMyCatalog && (
            <button
              onClick={onNavigateToMyCatalog}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold transition-colors"
            >
              <Package className="w-4 h-4 text-slate-600" />
              Kelola Stok Saya
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'ALL' 
            ? items.length 
            : items.filter(i => i.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold truncate">{cat.label}</div>
                <div className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {count} Jenis
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama barang, ban, aki, part number, brand (Bridgestone, GS Astra, Hino), atau vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter: Supplier vs Jasa */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Jenis
            </button>
            <button
              onClick={() => setSelectedType('SUPPLIER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'SUPPLIER' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Supplier Barang
            </button>
            <button
              onClick={() => setSelectedType('VENDOR_JASA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'VENDOR_JASA' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Vendor Jasa
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden lg:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="NEWEST">Terbaru Diperbarui</option>
              <option value="PRICE_LOW">Harga Terendah</option>
              <option value="PRICE_HIGH">Harga Tertinggi</option>
              <option value="STOCK_HIGH">Stok Terbanyak</option>
            </select>
          </div>
        </div>

        {/* Filter tags bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Filter Cepat:</span>
          
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'BAN' ? 'ALL' : 'BAN')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              selectedCategory === 'BAN' ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🚚 Contoh Ban Truk (Ring 20 / 22.5)
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'AKI' ? 'ALL' : 'AKI')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              selectedCategory === 'AKI' ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            ⚡ Contoh Aki Mobil & Truk (GS Astra / Incoe / Yuasa)
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'SPARE_PART' ? 'ALL' : 'SPARE_PART')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              selectedCategory === 'SPARE_PART' ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            ⚙️ Contoh Spare Part (Rem, Filter, Plat Kopling)
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'JASA' ? 'ALL' : 'JASA')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              selectedCategory === 'JASA' ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🛠️ Jasa Spooring, Kalibrasi & Vulkanisir
          </button>

          {(selectedCategory !== 'ALL' || selectedType !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedType('ALL');
                setSearchQuery('');
              }}
              className="text-red-600 hover:text-red-700 font-semibold ml-auto flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada produk atau jasa yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Coba ubah kata kunci pencarian atau sesuaikan filter jenis/kategori produk.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedType('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            Tampilkan Semua Katalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isMyPost = user?.id === item.vendorId || (user?.email && item.vendorEmail === user.email);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Product Image & Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden shrink-0">
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.title}
                    category={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    iconSize={32}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md ${
                      item.vendorType === 'SUPPLIER'
                        ? 'bg-blue-600/90 text-white'
                        : 'bg-indigo-600/90 text-white'
                    }`}>
                      {item.vendorType === 'SUPPLIER' ? '📦 Supplier Barang' : '🔧 Vendor Jasa'}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
                      {item.category === 'BAN' && 'Ban Truk'}
                      {item.category === 'AKI' && 'Aki & Baterai'}
                      {item.category === 'SPARE_PART' && 'Spare Part'}
                      {item.category === 'JASA' && 'Jasa Armada'}
                      {item.category === 'LAINNYA' && 'Lainnya'}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                    <div className="flex items-center gap-1 drop-shadow">
                      <Building2 className="w-3.5 h-3.5 text-blue-300" />
                      <span className="truncate max-w-[180px]">{item.brand}</span>
                    </div>
                    {item.partNumber && (
                      <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded text-slate-200 font-mono">
                        {item.partNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Vendor Name */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700 truncate">{item.companyName}</span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Terverifikasi
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => setSelectedItemDetail(item)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 line-clamp-2 cursor-pointer leading-snug"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Short specs preview */}
                    <ul className="mt-2 space-y-1 text-[11px] text-slate-500">
                      {item.specifications.slice(0, 2).map((spec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 truncate">
                          <span className="text-blue-500 font-bold">•</span>
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stock & Delivery Info */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Ketersediaan</span>
                      <span className={`font-bold ${item.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {item.vendorType === 'VENDOR_JASA' ? `Kapasitas: ${item.stock} unit` : `Stok: ${item.stock} ${item.unit}`}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Min. Order / Garansi</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        Min. {item.minOrder} {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Harga Satuan / Jasa:</span>
                      <div className="text-base font-black text-blue-600">
                        {formatIDR(item.price)}
                        <span className="text-[11px] font-normal text-slate-500 ml-1">/{item.unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isMyPost ? (
                        <>
                          <button
                            onClick={() => handleOpenFormModal(item)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                            title="Edit Postingan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {onDeleteItem && (
                            <button
                              onClick={() => {
                                if (confirm(`Hapus katalog ${item.title}?`)) {
                                  onDeleteItem(item.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenContact(item)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Hubungi / PO
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedItemDetail(item)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                        title="Lihat Spesifikasi Lengkap"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-8">
            <div className="relative h-60 w-full bg-slate-900 overflow-hidden">
              <SafeImage
                src={selectedItemDetail.imageUrl}
                alt={selectedItemDetail.title}
                category={selectedItemDetail.category}
                className="w-full h-full object-cover opacity-80"
                iconSize={48}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedItemDetail.vendorType === 'SUPPLIER' ? 'bg-blue-500 text-white' : 'bg-indigo-500 text-white'
                  }`}>
                    {selectedItemDetail.vendorType === 'SUPPLIER' ? 'Supplier Barang' : 'Vendor Jasa'}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                    {selectedItemDetail.categoryLabel}
                  </span>
                </div>
                <h2 className="text-xl font-bold leading-tight">{selectedItemDetail.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Price & Stock Overview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Harga Penawaran Vendor:</div>
                  <div className="text-2xl font-black text-blue-600">
                    {formatIDR(selectedItemDetail.price)}
                    <span className="text-xs font-normal text-slate-500 ml-1">/{selectedItemDetail.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Stok Tersedia</span>
                    <span className="text-emerald-600 font-bold">{selectedItemDetail.stock} {selectedItemDetail.unit}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Min. Pemesanan</span>
                    <span className="text-slate-800">{selectedItemDetail.minOrder} {selectedItemDetail.unit}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Kondisi</span>
                    <span className="text-blue-600">{selectedItemDetail.condition}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Deskripsi Produk & Layanan</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 p-3.5 rounded-xl">
                  {selectedItemDetail.description}
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Spesifikasi Detail Teknis</h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                  {selectedItemDetail.specifications.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery & Warranty info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Garansi & Sertifikasi</span>
                    <span className="text-slate-500">{selectedItemDetail.warranty || 'Garansi standar vendor'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Pengiriman & Logistik</span>
                    <span className="text-slate-500">{selectedItemDetail.deliveryInfo || 'Pengiriman langsung ke pool/gudang'}</span>
                  </div>
                </div>
              </div>

              {/* Vendor Contact Box */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="text-xs font-bold text-blue-900 uppercase">Informasi Vendor & Supplier</div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">{selectedItemDetail.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>{selectedItemDetail.vendorPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{selectedItemDetail.vendorEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{selectedItemDetail.location || 'Indonesia'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const item = selectedItemDetail;
                  setSelectedItemDetail(null);
                  handleOpenContact(item);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Kirim Permintaan PO / RFQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ / Contact Vendor Modal */}
      {isContactModalOpen && contactVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Request for Quotation (RFQ) / PO</h3>
                <p className="text-xs text-slate-500 mt-0.5">Kirim permintaan penawaran langsung ke {contactVendor.companyName}</p>
              </div>
              <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {rfqSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Permintaan Berhasil Dikirim!</h4>
                <p className="text-xs text-slate-500">
                  Notifikasi dan dokumen PO/RFQ telah diteruskan ke email vendor ({contactVendor.vendorEmail}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendRFQ} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <img src={contactVendor.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <div className="font-bold text-slate-900">{contactVendor.title}</div>
                    <div className="text-blue-600 font-bold">{formatIDR(contactVendor.price)} / {contactVendor.unit}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jumlah Pemesanan ({contactVendor.unit})</label>
                    <input
                      type="number"
                      min={contactVendor.minOrder || 1}
                      value={rfqQty}
                      onChange={(e) => setRfqQty(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estimasi Penawaran / Bids (Rp)</label>
                    <input
                      type="number"
                      value={rfqBidAmount}
                      onChange={(e) => setRfqBidAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-blue-600 bg-white"
                      placeholder="Ketik estimasi penawaran..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan / Kebutuhan Tambahan</label>
                  <textarea
                    rows={3}
                    value={rfqNote}
                    onChange={(e) => setRfqNote(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="Contoh: Jadwal pengiriman, alamat pool armada, syarat faktur pajak..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm"
                  >
                    Kirim ke Vendor
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden my-8">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? 'Edit Postingan Katalog' : 'Posting Produk / Jasa ke Katalog'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Internal procurement dapat melihat stok & memesan barang/jasa ini.
                </p>
              </div>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Produk / Layanan Jasa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ban Truk Bridgestone 11R22.5 / Aki GS Astra N100 / Jasa Spooring"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Produk</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ItemCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white"
                  >
                    <option value="BAN">🚚 Ban Truk & Kendaraan</option>
                    <option value="AKI">⚡ Aki & Kelistrikan</option>
                    <option value="SPARE_PART">⚙️ Spare Part & Mesin</option>
                    <option value="JASA">🔧 Jasa & Perawatan Armada</option>
                    <option value="LAINNYA">📦 Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Mitra</label>
                  <select
                    value={formData.vendorType}
                    onChange={(e) => setFormData({ ...formData, vendorType: e.target.value as VendorType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white"
                  >
                    <option value="SUPPLIER">📦 Supplier Barang</option>
                    <option value="VENDOR_JASA">🔧 Vendor Jasa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Merk / Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bridgestone, GS Astra, Hino, Denso"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Part Number / Kode Item</label>
                  <input
                    type="text"
                    placeholder="Contoh: BRDG-11R22.5 / GSA-N100"
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Satuan (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    placeholder="1500000"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Satuan</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Unit">Unit</option>
                    <option value="Set">Set</option>
                    <option value="Paket">Paket</option>
                    <option value="Ban">Ban</option>
                    <option value="Liter">Liter</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Stok / Kapasitas</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Foto / Gambar Produk"
                value={formData.imageUrl}
                onChange={(newImg) => setFormData({ ...formData, imageUrl: newImg })}
                helperText="Upload foto asli produk suku cadang, ban, aki, atau dokumen layanan"
              />

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  placeholder="Jelaskan kegunaan, keunggulan, kompatibilitas armada..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Spesifikasi Detail (1 baris per spesifikasi)</label>
                <textarea
                  rows={3}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                  placeholder="Ukuran: 11R22.5 16PR&#10;Tipe: All-Position Radial&#10;SNI & ISO Terdaftar"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Garansi</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    placeholder="Contoh: Garansi Resmi 12 Bulan"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Informasi Pengiriman / Lokasi</label>
                  <input
                    type="text"
                    value={formData.deliveryInfo}
                    onChange={(e) => setFormData({ ...formData, deliveryInfo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    placeholder="Contoh: Ready stock Gudang Cakung"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-sm"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Posting ke Katalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
