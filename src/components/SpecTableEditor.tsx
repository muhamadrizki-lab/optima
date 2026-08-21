import React from 'react';
import { SpecTableItem } from '../types';
import { Plus, Trash2, List, Sparkles } from 'lucide-react';

interface SpecTableEditorProps {
  items: SpecTableItem[];
  onChange: (items: SpecTableItem[]) => void;
  title?: string;
  subtitle?: string;
}

export const createDefaultSpecTableRows = (): SpecTableItem[] => [
  {
    no: 1,
    nama: '',
    brand: '',
    qty: 1,
    uom: 'unit',
    ket: ''
  },
  {
    no: 2,
    nama: '',
    brand: '',
    qty: 1,
    uom: 'pcs',
    ket: ''
  }
];

export const SpecTableEditor: React.FC<SpecTableEditorProps> = ({
  items,
  onChange,
  title = 'Spesifikasi Detail (Rincian Item)',
  subtitle = 'Masukkan rincian kebutuhan atau produk per baris tabel di bawah ini (minimal 2 baris).'
}) => {
  // Ensure we have at least 2 rows if items are empty
  const activeItems = items && items.length > 0 ? items : createDefaultSpecTableRows();

  const handleRowChange = (index: number, field: keyof SpecTableItem, value: any) => {
    const updated = activeItems.map((row, idx) => {
      if (idx === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    onChange(updated);
  };

  const handleAddRow = () => {
    const newRow: SpecTableItem = {
      no: activeItems.length + 1,
      nama: '',
      brand: '',
      qty: 1,
      uom: 'pcs',
      ket: ''
    };
    onChange([...activeItems, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    if (activeItems.length <= 1) {
      alert('Minimal harus memiliki 1 baris rincian item.');
      return;
    }
    const filtered = activeItems.filter((_, idx) => idx !== index);
    const reindexed = filtered.map((row, idx) => ({ ...row, no: idx + 1 }));
    onChange(reindexed);
  };

  return (
    <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-3.5 sm:p-4 space-y-3">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-blue-600 shrink-0" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {title}
            </h4>
            <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
              {activeItems.length} Baris
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Baris
        </button>
      </div>

      {/* Table Editor */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-2.5 text-center w-10 border-r border-slate-200/70">NO.</th>
              <th className="py-2.5 px-3 min-w-[150px] border-r border-slate-200/70">NAMA ITEM / DESKRIPSI *</th>
              <th className="py-2.5 px-3 min-w-[140px] border-r border-slate-200/70">TYPE / BRAND *</th>
              <th className="py-2.5 px-2.5 text-center w-20 border-r border-slate-200/70">QTY</th>
              <th className="py-2.5 px-2.5 text-center w-24 border-r border-slate-200/70">UOM / SATUAN</th>
              <th className="py-2.5 px-3 min-w-[150px] border-r border-slate-200/70">KETERANGAN / SPESIFIKASI</th>
              <th className="py-2.5 px-2 text-center w-12">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {activeItems.map((row, idx) => (
              <tr key={row.no || idx} className="hover:bg-blue-50/30 transition-colors">
                {/* 1. NO. */}
                <td className="py-2 px-2 text-center font-bold text-slate-600 bg-slate-50/60 border-r border-slate-100 text-xs">
                  {idx + 1}
                </td>

                {/* 2. NAMA ITEM */}
                <td className="p-1.5 border-r border-slate-100">
                  <input
                    type="text"
                    required
                    value={row.nama}
                    onChange={(e) => handleRowChange(idx, 'nama', e.target.value)}
                    placeholder={idx === 0 ? 'Contoh: Laptop Workstation' : 'Contoh: Monitor 24 Inci'}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/40 focus:bg-white"
                  />
                </td>

                {/* 3. TYPE / BRAND */}
                <td className="p-1.5 border-r border-slate-100">
                  <input
                    type="text"
                    required
                    value={row.brand}
                    onChange={(e) => handleRowChange(idx, 'brand', e.target.value)}
                    placeholder={idx === 0 ? 'ThinkPad P14s (i7/16GB)' : 'LG 24MP400 Full HD'}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/40 focus:bg-white"
                  />
                </td>

                {/* 4. QTY */}
                <td className="p-1.5 border-r border-slate-100">
                  <input
                    type="number"
                    min={1}
                    required
                    value={row.qty || ''}
                    onChange={(e) => handleRowChange(idx, 'qty', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-center text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50/30 focus:bg-white"
                  />
                </td>

                {/* 5. UOM */}
                <td className="p-1.5 border-r border-slate-100">
                  <select
                    value={row.uom?.toLowerCase() || 'unit'}
                    onChange={(e) => handleRowChange(idx, 'uom', e.target.value)}
                    className="w-full px-1.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="unit">UNIT</option>
                    <option value="pcs">PCS</option>
                    <option value="set">SET</option>
                    <option value="paket">PAKET</option>
                    <option value="ban">BAN</option>
                    <option value="buah">BUAH</option>
                    <option value="liter">LITER</option>
                    <option value="box">BOX</option>
                    <option value="roll">ROLL</option>
                    <option value="jam">JAM</option>
                  </select>
                </td>

                {/* 6. KETERANGAN */}
                <td className="p-1.5 border-r border-slate-100">
                  <input
                    type="text"
                    value={row.ket}
                    onChange={(e) => handleRowChange(idx, 'ket', e.target.value)}
                    placeholder={idx === 0 ? 'Garansi resmi 3 thn, Win 11' : 'Garansi 1 tahun resmi'}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/40 focus:bg-white"
                  />
                </td>

                {/* 7. AKSI */}
                <td className="p-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus baris ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Add Row Helper */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400">
          * Klik tombol <strong>+ Tambah Baris</strong> untuk menambah data sebanyak yang dibutuhkan.
        </span>
        <button
          type="button"
          onClick={handleAddRow}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Baris Baru
        </button>
      </div>
    </div>
  );
};

export default SpecTableEditor;
