import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (base64OrUrl: string) => void;
  required?: boolean;
  helperText?: string;
}

export default function ImageUploadInput({
  label = 'Upload Foto / Gambar Produk',
  value,
  onChange,
  required = false,
  helperText = 'Format: PNG, JPG, JPEG, WEBP (Maksimal 5MB)'
}: ImageUploadInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and convert to efficient compressed base64 data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('File yang diupload harus berupa gambar (JPG, PNG, WEBP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file gambar maksimal 10MB');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize to reasonable web dimensions (max 1000px)
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
        } else {
          onChange(event.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setUploadError('Gagal memproses file gambar');
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca file gambar');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700 block text-xs">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer"
        >
          {showUrlFallback ? '← Gunakan Upload File' : 'Gunakan Link URL Gambar'}
        </button>
      </div>

      {showUrlFallback ? (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/... atau https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {value && (
            <div className="relative w-full h-28 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
              <img src={value} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            /* PREVIEW OF UPLOADED IMAGE */
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-4 group">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 shadow-2xs">
                <img
                  src={value}
                  alt="Preview Foto"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-0.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Foto Berhasil Diunggah</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Gambar siap ditampilkan di katalog produk & penawaran tender.
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-[11px] font-bold text-rose-700 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* DRAG & DROP UPLOAD BOX */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                  : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-blue-400'
              }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-xs font-bold text-slate-700">Sedang memproses gambar...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-blue-100/80 text-blue-600 rounded-2xl">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 hover:text-blue-700 underline">
                      Klik untuk memilih file
                    </span>
                    <span className="text-xs text-slate-600"> atau seret gambar ke sini</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {helperText}
                  </p>
                </div>
              )}
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
              <X className="w-3.5 h-3.5" />
              {uploadError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
