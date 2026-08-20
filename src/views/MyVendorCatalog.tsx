import React, { useState } from 'react';
import { VendorCatalogItem, User, ItemCategory } from '../types';
import SafeImage from '../components/SafeImage';
import ImageUploadInput from '../components/ImageUploadInput';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Zap, 
  Disc, 
  Wrench, 
  Search, 
  ArrowUpRight, 
  Eye, 
  Save, 
  RefreshCw,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface MyVendorCatalogProps {
  user: User;
  items: VendorCatalogItem[];
  onAddItem: (item: VendorCatalogItem) => void;
  onUpdateItem: (item: VendorCatalogItem) => void;
  onDeleteItem: (id: string) => void;
  onBrowseAllCatalog: () => void;
}

export default function MyVendorCatalog({
  user,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onBrowseAllCatalog
}: MyVendorCatalogProps) {
  // Filter only items belonging to this vendor or user (or show all if user is INTERNAL)
  const myItems = user?.role === 'INTERNAL'
    ? items
    : items.filter(
        (item) => item.vendorId === user.id || item.vendorEmail === user.email || (user.companyName && item.vendorName === user.companyName)
      );

  const [searchQuery, setSearchQuery] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [quickPrice, setQuickPrice] = useState<number>(0);
  const [quickStock, setQuickStock] = useState<number>(0);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorCatalogItem | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    category: ItemCategory;
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
    category: 'BAN',
    brand: '',
    partNumber: '',
    price: 0,
    unit: 'Pcs',
    stock: 10,
    minOrder: 1,
    condition: 'BARU',
    description: '',
    specifications: '',
    warranty: 'Garansi Resmi 12 Bulan',
    deliveryInfo: 'Siap kirim 1-2 hari kerja',
    location: 'Jakarta',
    imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    status: 'AVAILABLE'
  });

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'BAN',
      brand: '',
      partNumber: '',
      price: 0,
      unit: 'Pcs',
      stock: 50,
      minOrder: 2,
      condition: 'BARU',
      description: '',
      specifications: 'Spesifikasi teknis...\nKesesuaian kendaraan...',
      warranty: 'Garansi Resmi 12 Bulan',
      deliveryInfo: 'Siap kirim dari Depo / Gudang',
      location: 'Jabodetabek',
      imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
      status: 'AVAILABLE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: VendorCatalogItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
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
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.price <= 0) return;

    const specsArray = formData.specifications
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const getCatLabel = (cat: ItemCategory) => {
      switch (cat) {
        case 'BAN': return 'Ban Truk & Kendaraan';
        case 'AKI': return 'Aki & Kelistrikan';
        case 'SPARE_PART': return 'Spare Part & Komponen';
        case 'JASA': return 'Jasa & Perawatan Armada';
        default: return 'Lainnya';
      }
    };

    if (editingItem) {
      onUpdateItem({
        ...editingItem,
        title: formData.title,
        category: formData.category,
        categoryLabel: getCatLabel(formData.category),
        brand: formData.brand,
        price: Number(formData.price),
        unit: formData.unit,
        stock: Number(formData.stock),
        minOrder: 1,
        condition: formData.condition,
        availabilityType: formData.availabilityType,
        top: formData.top,
        description: formData.description,
        specifications: specsArray,
        warranty: formData.warranty,
        deliveryInfo: formData.deliveryInfo,
        location: formData.location,
        imageUrl: formData.imageUrl,
        status: formData.status,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    } else {
      const newItem: VendorCatalogItem = {
        id: `VC-MY-${Date.now().toString().slice(-4)}`,
        vendorId: user.id,
        vendorName: user.companyName || user.name || 'Vendor Saya',
        companyName: user.companyName || 'PT Vendor Mitra Logistics',
        vendorPhone: user.phone || '0812-3456-7890',
        vendorEmail: user.email,
        vendorType: user.vendorType || (formData.category === 'JASA' ? 'VENDOR_JASA' : 'SUPPLIER'),
        category: formData.category,
        categoryLabel: getCatLabel(formData.category),
        title: formData.title,
        brand: formData.brand,
        price: Number(formData.price),
        unit: formData.unit,
        stock: Number(formData.stock),
        minOrder: 1,
        condition: formData.condition,
        availabilityType: formData.availabilityType,
        top: formData.top,
        description: formData.description,
        specifications: specsArray,
        warranty: formData.warranty,
        deliveryInfo: formData.deliveryInfo,
        location: formData.location,
        imageUrl: formData.imageUrl,
        status: formData.status,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onAddItem(newItem);
    }
    setIsModalOpen(false);
  };

  const handleStartQuickEdit = (item: VendorCatalogItem) => {
    setEditingPriceId(item.id);
    setQuickPrice(item.price);
    setQuickStock(item.stock);
  };

  const handleSaveQuickEdit = (item: VendorCatalogItem) => {
    onUpdateItem({
      ...item,
      price: Number(quickPrice),
      stock: Number(quickStock),
      status: Number(quickStock) > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setEditingPriceId(null);
  };

  const filteredMyItems = myItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      (item.partNumber || '').toLowerCase().includes(q)
    );
  });

  const totalStockCount = myItems.reduce((acc, item) => acc + item.stock, 0);
  const totalValuation = myItems.reduce((acc, item) => acc + item.price * item.stock, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Vendor Inventory Portal
            </span>
            <span className="text-xs text-slate-400">• {user.companyName || user.name}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Posting & Manajemen Stok Katalog Saya
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Kelola katalog barang, update harga satuan, tambah stok ban/aki/spare part, dan publikasikan agar tim Internal dapat melihat dan melakukan PO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBrowseAllCatalog}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            Lihat Tender
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Posting Item Baru
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Item Diposting</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myItems.length} Produk/Jasa</div>
          <p className="text-[11px] text-slate-400 mt-1">Aktif tampil di katalog internal</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Unit Ready Stock</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{totalStockCount} Unit</div>
          <p className="text-[11px] text-slate-400 mt-1">Siap dikirim ke depo logistik</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Nilai Estimasi Inventaris</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{formatIDR(totalValuation)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Kalkulasi total harga x stok</p>
        </div>
      </div>

      {/* Table & Management Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Search Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari item saya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-400 font-medium">
            💡 Tips: Anda dapat langsung mengubah <b>Harga</b> & <b>Stok</b> secara cepat pada tabel di bawah.
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Produk / Layanan</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Brand / Part No</th>
                <th className="px-4 py-3.5 text-right">Harga Satuan (IDR)</th>
                <th className="px-4 py-3.5 text-center">Stok</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMyItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Belum ada postingan item di akun Anda.
                    <div className="mt-2">
                      <button
                        onClick={handleOpenAdd}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                      >
                        + Tambah Produk Pertama
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMyItems.map((item) => {
                  const isQuickEditing = editingPriceId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title & Image */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                            <SafeImage
                              src={item.imageUrl}
                              alt={item.title}
                              category={item.category}
                              className="w-full h-full object-cover"
                              iconSize={20}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate max-w-xs">{item.title}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">
                              Update: {item.lastUpdated} • Min {item.minOrder} {item.unit}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {item.category === 'BAN' && <Disc className="w-3 h-3" />}
                          {item.category === 'AKI' && <Zap className="w-3 h-3" />}
                          {item.category === 'SPARE_PART' && <Package className="w-3 h-3" />}
                          {item.category === 'JASA' && <Wrench className="w-3 h-3" />}
                          {item.categoryLabel}
                        </span>
                      </td>

                      {/* Brand & Part */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{item.brand}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item.partNumber || '-'}</div>
                      </td>

                      {/* Price (Quick Editable) */}
                      <td className="px-4 py-4 whitespace-nowrap text-right font-mono">
                        {isQuickEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={quickPrice}
                              onChange={(e) => setQuickPrice(Number(e.target.value))}
                              className="w-28 px-2 py-1 border border-blue-500 rounded text-xs font-bold text-blue-600 text-right focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveQuickEdit(item)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                              title="Simpan"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600"
                              title="Batal"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartQuickEdit(item)}
                            className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer group flex items-center justify-end gap-1"
                            title="Klik untuk ubah harga cepat"
                          >
                            <span>{formatIDR(item.price)}</span>
                            <span className="text-[10px] text-slate-400">/{item.unit}</span>
                            <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                          </div>
                        )}
                      </td>

                      {/* Stock (Quick Editable) */}
                      <td className="px-4 py-4 whitespace-nowrap text-center font-mono">
                        {isQuickEditing ? (
                          <input
                            type="number"
                            value={quickStock}
                            onChange={(e) => setQuickStock(Number(e.target.value))}
                            className="w-16 px-2 py-1 border border-blue-500 rounded text-xs text-center focus:outline-none"
                          />
                        ) : (
                          <span
                            onClick={() => handleStartQuickEdit(item)}
                            className={`font-bold cursor-pointer px-2 py-0.5 rounded ${
                              item.stock > 10 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                            }`}
                            title="Klik untuk ubah stok"
                          >
                            {item.stock} {item.unit}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.stock > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.stock > 0 ? 'Tersedia' : 'Habis'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Full Detail"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              onDeleteItem(item.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden my-8">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? 'Edit Detail Produk / Jasa' : 'Posting Produk / Jasa Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Item ini akan langsung muncul di katalog pengadaan internal.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Produk / Layanan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ban Truk Bridgestone 11R22.5 / Aki GS Astra N100"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Brand / Pabrikan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bridgestone, GS Astra, Hino"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
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
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stok Tersedia</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Min. Pemesanan</label>
                <input
                  type="number"
                  min={1}
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <ImageUploadInput
                label="Foto / Gambar Produk"
                value={formData.imageUrl}
                onChange={(newImg) => setFormData({ ...formData, imageUrl: newImg })}
                helperText="Upload foto asli produk dari galeri komputer atau HP Anda"
              />

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Spesifikasi Detail (1 baris per poin)</label>
                <textarea
                  rows={3}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
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
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Informasi Pengiriman / Lokasi</label>
                  <input
                    type="text"
                    value={formData.deliveryInfo}
                    onChange={(e) => setFormData({ ...formData, deliveryInfo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
