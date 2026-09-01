import React from 'react';
import { X, Package, Tag, Building2, MapPin, Clock, ShieldCheck, Box, Info, ShoppingCart } from 'lucide-react';
import { VendorCatalogItem } from '../types';

interface ItemDetailModalProps {
  item: VendorCatalogItem | null;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                Detail SKU: {item.id}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">{item.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-500 rounded-full transition-all shadow-sm border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Kategori & Brand</span>
              </div>
              <p className="text-sm font-black text-slate-900">{item.categoryLabel || item.category}</p>
              <p className="text-xs font-bold text-blue-600 mt-0.5">{item.brand}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Vendor / Supplier</span>
              </div>
              <p className="text-sm font-black text-slate-900">{item.companyName}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{item.vendorType === 'SUPPLIER' ? 'Supplier Barang' : 'Vendor Jasa'}</p>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">Harga Satuan Katalog</span>
              <p className="text-2xl font-black text-emerald-700">Rp {item.price.toLocaleString('id-ID')}</p>
              <span className="text-[10px] text-emerald-600 font-medium italic">*Belum termasuk PPN & Ongkir (Estimasi)</span>
            </div>
            
            <div className="flex-1 w-full p-5 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Status Ketersediaan</span>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-blue-700">{item.stock}</p>
                <span className="text-xs font-bold text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded uppercase">{item.unit}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${
                item.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'
              }`}>
                {item.status === 'AVAILABLE' ? 'READY STOCK' : 'OUT OF STOCK'}
              </span>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Spesifikasi & Informasi Produk</h4>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4">
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
              
              {item.specifications && item.specifications.length > 0 && (
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.specifications.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Lokasi</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{item.location || 'Jabodetabek'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Inden / Lead Time</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{item.indentDuration || 'Ready Stock'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Garansi</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{item.warranty || 'No Warranty'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <p className="text-[11px] text-slate-500 font-medium italic">
              ID Produk: <span className="font-mono font-bold text-slate-700">{item.id}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95"
            >
              Tutup Detail
            </button>
            <button 
              className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              Ajukan Pengadaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
