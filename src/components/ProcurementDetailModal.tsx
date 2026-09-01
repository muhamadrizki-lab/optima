import React from 'react';
import { X, ClipboardList, Calendar, DollarSign, Award, Users, Info, ShieldCheck, MapPin } from 'lucide-react';
import { CatalogItem, Bid } from '../types';

interface ProcurementDetailModalProps {
  item: CatalogItem | null;
  bids: Bid[];
  onClose: () => void;
}

export default function ProcurementDetailModal({ item, bids, onClose }: ProcurementDetailModalProps) {
  if (!item) return null;

  const relevantBids = bids.filter(b => b.reqId === item.id);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Kode Tender: {item.id}
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
          {/* Status & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">Anggaran / HPS (Owner Estimate)</span>
              <p className="text-2xl font-black text-emerald-700">Rp {(item.ownerEstimate || 0).toLocaleString('id-ID')}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">ESTIMASI INTERNAL</span>
              </div>
            </div>
            
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status Pengadaan</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black px-3 py-1 rounded-xl border ${
                  item.status === 'CLOSED' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {item.status === 'CLOSED' ? 'SELESAI / PO' : 'DIBUKA / OPEN'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Batas Akhir: {item.deadline || 'Tidak ditentukan'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              Deskripsi Pengadaan
            </h4>
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4">
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          </div>

          {/* Winner Section if Closed */}
          {item.status === 'CLOSED' && item.winnerVendorName && (
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Award className="w-20 h-20 text-amber-600 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-black text-amber-800 uppercase tracking-wider">Hasil Pemenang Tender</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900">{item.winnerVendorName}</p>
                    <p className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1 uppercase">
                      Pemenang Terpilih
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Nilai Kontrak / PO</p>
                    <p className="text-xl font-black text-emerald-700">Rp {(item.winnerAmount || 0).toLocaleString('id-ID')}</p>
                    <p className="text-[10px] font-medium text-slate-400 italic">Tanggal: {item.winnerDate || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bidders List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Daftar Penawaran (Bids)
              </h4>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {relevantBids.length} Vendor Terdaftar
              </span>
            </div>
            
            <div className="space-y-2">
              {relevantBids.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                  Belum ada penawaran masuk untuk tender ini.
                </p>
              ) : (
                relevantBids.map((bid, i) => (
                  <div key={bid.id} className="p-4 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between hover:border-indigo-300 transition-all shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-200">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{bid.vendorName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{bid.dateSubmitted}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-700">Rp {bid.amount.toLocaleString('id-ID')}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        bid.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 
                        bid.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {bid.status === 'ACCEPTED' ? 'Lolos' : bid.status === 'REJECTED' ? 'Gugur' : 'Proses'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <p className="text-[11px] text-slate-500 font-medium">Verifikasi Dokumen & Kualitas Vendor Selesai</p>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
