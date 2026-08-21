import React from 'react';
import { SpecTableItem } from '../types';
import { List } from 'lucide-react';

interface SpecTableViewProps {
  items?: SpecTableItem[];
  fallbackSpecs?: string[];
  title?: string;
  className?: string;
}

export function parseFallbackSpecsToTable(specs?: string[]): SpecTableItem[] {
  if (!specs || specs.length === 0) return [];
  return specs.map((spec, idx) => {
    let qty = 1;
    let uom = 'pcs';
    let nama = spec;
    let brand = 'Spesifikasi Standar';
    let ket = 'Kebutuhan & spesifikasi standar';

    const matchNum = spec.match(/^(\d+)\s*(unit|pcs|set|paket|buah|pasang|ban|liter|box|roll)?\s+(.*)/i);
    if (matchNum) {
      qty = parseInt(matchNum[1], 10);
      uom = matchNum[2] || 'pcs';
      nama = matchNum[3];
    } else if (spec.includes(':')) {
      const parts = spec.split(':');
      nama = parts[0].trim();
      brand = parts.slice(1).join(':').trim();
    }

    return {
      no: idx + 1,
      nama,
      brand,
      qty,
      uom,
      ket
    };
  });
}

export const SpecTableView: React.FC<SpecTableViewProps> = ({
  items,
  fallbackSpecs,
  title = 'SPESIFIKASI DETAIL (RINCIAN ITEM KEBUTUHAN)',
  className = ''
}) => {
  const displayItems = (items && items.length > 0) 
    ? items 
    : parseFallbackSpecsToTable(fallbackSpecs);

  if (displayItems.length === 0) return null;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
          {displayItems.length} Item
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[550px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 text-center w-12 border-r border-slate-200/70">NO.</th>
              <th className="py-2.5 px-3.5 min-w-[150px] border-r border-slate-200/70">NAMA</th>
              <th className="py-2.5 px-3.5 min-w-[160px] border-r border-slate-200/70">TYPE/BRAND</th>
              <th className="py-2.5 px-3 text-center w-16 border-r border-slate-200/70">QTY</th>
              <th className="py-2.5 px-3 text-center w-16 border-r border-slate-200/70">UOM</th>
              <th className="py-2.5 px-3.5 min-w-[160px]">KET</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 bg-white">
            {displayItems.map((row, idx) => (
              <tr key={row.no || idx} className="hover:bg-blue-50/40 transition-colors">
                <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-100 text-[11px] bg-slate-50/50">
                  {row.no || idx + 1}
                </td>
                <td className="py-2.5 px-3.5 font-bold text-slate-900 border-r border-slate-100">
                  {row.nama}
                </td>
                <td className="py-2.5 px-3.5 text-slate-700 border-r border-slate-100 font-medium">
                  {row.brand}
                </td>
                <td className="py-2.5 px-3 text-center font-black text-blue-700 border-r border-slate-100 bg-blue-50/30">
                  {row.qty}
                </td>
                <td className="py-2.5 px-3 text-center font-bold text-slate-600 uppercase border-r border-slate-100 text-[10px]">
                  {row.uom}
                </td>
                <td className="py-2.5 px-3.5 text-slate-600 text-[11px]">
                  {row.ket || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecTableView;
