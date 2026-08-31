import React from 'react';
import { X, Download, ZoomIn, ExternalLink, ShieldCheck } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  title?: string;
  subtitle?: string;
  evidenceDescription?: string;
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  title = 'Pratinjau Bukti Lampiran / Tangkapan Layar Chat',
  subtitle,
  evidenceDescription
}: ImageLightboxModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp text-white">
        
        {/* Header */}
        <div className="p-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-base sm:text-lg truncate">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Buka di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-950/90">
          <div className="relative max-h-[60vh] rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
            <img 
              src={imageUrl} 
              alt={title}
              className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl"
              onError={(e) => {
                // Fallback placeholder if image load fails
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>

          {/* Description Card */}
          {evidenceDescription && (
            <div className="w-full max-w-2xl mt-4 p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-2xl text-xs text-slate-200">
              <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <span>📌 Catatan Keterangan Bukti:</span>
              </div>
              <p className="leading-relaxed text-slate-300">{evidenceDescription}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Verifikasi Audit Digital • Pancaran Procurement System</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>

      </div>
    </div>
  );
}
