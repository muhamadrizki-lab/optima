import React, { useState } from 'react';
import { Bid } from '../types';
import { INITIAL_BIDS_DATA } from '../data/biddingData';
import PancaranLogo from '../components/PancaranLogo';
import CompanyDetailModal from '../components/CompanyDetailModal';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Briefcase, 
  XCircle, 
  Eye, 
  X, 
  DollarSign, 
  Building2, 
  Download,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function ManagementBidding() {
  const [bids, setBids] = useState<Bid[]>(() => {
    try {
      const saved = localStorage.getItem('optima_bids_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading bids in management:', e);
    }
    return INITIAL_BIDS_DATA;
  });

  React.useEffect(() => {
    const handleSync = (e: any) => {
      if (!e.detail || e.detail.key === 'optima_bids_history') {
        const saved = localStorage.getItem('optima_bids_history');
        if (saved) {
          try {
            setBids(JSON.parse(saved));
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    window.addEventListener('optima-db-updated', handleSync);
    return () => window.removeEventListener('optima-db-updated', handleSync);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACCEPTED' | 'PENDING' | 'REVIEWED' | 'NEGOTIATION' | 'REJECTED'>('ALL');
  const [selectedBidDetail, setSelectedBidDetail] = useState<Bid | null>(null);
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<string | null>(null);

  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleUpdateStatus = (bidId: string, newStatus: Bid['status'], note?: string) => {
    const updated = bids.map(b => {
      if (b.id === bidId) {
        return {
          ...b,
          status: newStatus,
          internalNotes: note || b.internalNotes
        };
      }
      return b;
    });

    setBids(updated);
    try {
      localStorage.setItem('optima_bids_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving updated bids:', e);
    }

    if (selectedBidDetail && selectedBidDetail.id === bidId) {
      setSelectedBidDetail({
        ...selectedBidDetail,
        status: newStatus,
        internalNotes: note || selectedBidDetail.internalNotes
      });
    }
  };

  const filteredBids = bids.filter(bid => {
    const matchesSearch = 
      bid.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bid.reqTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.reqId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || bid.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Bid['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Menang / Disetujui
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Menunggu Review
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Evaluasi Teknis
          </span>
        );
      case 'NEGOTIATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            Tahap Negosiasi
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Ditolak
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100">{status}</span>;
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <PancaranLogo size={48} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Internal Procurement Management
              </span>
              <span className="text-xs text-slate-400 font-medium">OPTIMA Pancaran Group</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Management & Evaluasi Bidding Vendor
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Review surat penawaran harga masuk, evaluasi kesesuaian spesifikasi, komparasi harga, dan tentukan pemenang tender pengadaan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari vendor, ID penawaran, atau judul tender..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({bids.length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'PENDING' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('REVIEWED')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'REVIEWED' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Evaluasi
              </button>
              <button
                onClick={() => setStatusFilter('ACCEPTED')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'ACCEPTED' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Disetujui
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="px-6 py-4">ID Penawaran & Tanggal</th>
                <th className="px-6 py-4">Nama Vendor Pengaju</th>
                <th className="px-6 py-4">Paket Tender Kebutuhan</th>
                <th className="px-6 py-4 text-right">Nilai Bidding</th>
                <th className="px-6 py-4 text-center">Status Evaluasi</th>
                <th className="px-6 py-4 text-center">Aksi Tim Internal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBids.map((bid, idx) => (
                <tr key={`${bid.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-blue-600 text-xs">{bid.id}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {bid.dateSubmitted}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div 
                      onClick={() => setSelectedCompanyModal(bid.vendorName)}
                      className="font-bold text-slate-900 hover:text-blue-600 hover:underline cursor-pointer"
                      title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                    >
                      {bid.vendorName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{bid.vendorEmail || 'vendor@gmail.com'}</div>
                  </td>

                  <td className="px-6 py-4 max-w-sm">
                    <div className="font-bold text-slate-900 leading-snug line-clamp-2">{bid.reqTitle}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{bid.reqId} • {bid.quantity ? `${bid.quantity} ${bid.unit || 'unit'}` : '-'}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono">
                    <div className="font-black text-slate-900 text-sm">{formatRp(bid.amount)}</div>
                    {bid.unitPrice && (
                      <div className="text-[10px] text-slate-400">
                        @{formatRp(bid.unitPrice)}/{bid.unit || 'unit'}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(bid.status)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSelectedBidDetail(bid)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200/60"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Review Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & EVALUATION MODAL */}
      {selectedBidDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white p-6 relative">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <PancaranLogo size={40} />
                  <div>
                    <div className="text-xs font-mono text-blue-300 font-bold">{selectedBidDetail.id}</div>
                    <h3 className="text-lg font-bold text-white">Lembar Evaluasi Penawaran Vendor</h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBidDetail(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Tender:</div>
                  <div className="text-base font-bold text-slate-900">{selectedBidDetail.reqTitle}</div>
                  <div className="text-xs text-slate-500 font-mono">Ref ID: {selectedBidDetail.reqId}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold mb-1">Status:</div>
                  {getStatusBadge(selectedBidDetail.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Vendor Details</div>
                  <div 
                    onClick={() => setSelectedCompanyModal(selectedBidDetail.vendorName)}
                    className="font-bold text-slate-900 text-sm hover:text-blue-600 hover:underline cursor-pointer"
                    title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                  >
                    {selectedBidDetail.vendorName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Email: {selectedBidDetail.vendorEmail || 'vendor@gmail.com'}</div>
                  <div className="text-xs text-slate-500">Telp: {selectedBidDetail.vendorPhone || '0812-9988-7766'}</div>
                </div>

                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
                  <div className="text-xs font-bold text-blue-700 uppercase mb-1">Total Nilai Penawaran</div>
                  <div className="text-2xl font-black text-blue-700">{formatRp(selectedBidDetail.amount)}</div>
                  {selectedBidDetail.unitPrice && (
                    <div className="text-xs text-blue-600 mt-1">
                      {selectedBidDetail.quantity} {selectedBidDetail.unit || 'unit'} x {formatRp(selectedBidDetail.unitPrice)}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Payment (TOP)</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedBidDetail.paymentMethod || 'Net 30 Days'}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Garansi</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedBidDetail.warranty || '12 Bulan'}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Pengiriman</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedBidDetail.deliveryOption || 'Free Delivery'}</div>
                </div>
              </div>

              {selectedBidDetail.tncNotes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Catatan TNC Tambahan Vendor</h4>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                    {selectedBidDetail.tncNotes}
                  </div>
                </div>
              )}

              {/* Action Decision Buttons */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Keputusan Evaluasi Tim Internal Procurement
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedBidDetail.id, 'ACCEPTED', 'Disetujui sebagai pemenang tender berdasarkan komparasi teknis & harga.')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Setujui / Menangkan Tender
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedBidDetail.id, 'NEGOTIATION', 'Undang vendor untuk tahapan negosiasi diskon volume dan lead time pengiriman.')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Briefcase className="w-4 h-4" />
                    Buka Tahap Negosiasi
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedBidDetail.id, 'REVIEWED', 'Sedang dalam review verifikasi fisik sampel dan kelengkapan dokumen SNI.')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Layers className="w-4 h-4" />
                    Set Evaluasi Teknis
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedBidDetail.id, 'REJECTED', 'Harga atau syarat teknis tidak memenuhi kriteria owner estimate.')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Tolak Penawaran
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedBidDetail(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up Detail Company Modal */}
      <CompanyDetailModal
        companyName={selectedCompanyModal}
        isOpen={Boolean(selectedCompanyModal)}
        onClose={() => setSelectedCompanyModal(null)}
      />
    </div>
  );
}
