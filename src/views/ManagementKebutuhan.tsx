import React, { useState } from 'react';
import { Truck, Store, Search, Filter, ShieldCheck, Star, Phone, Mail, MapPin, CheckCircle2, Eye, Building2, Package, Wrench, Zap, Disc } from 'lucide-react';
import PancaranLogo from '../components/PancaranLogo';

interface SupplierVendorRecord {
  id: string;
  name: string;
  type: 'SUPPLIER' | 'VENDOR';
  category: string;
  specialty: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  rating: number;
  completedTenders: number;
  status: 'VERIFIED' | 'ACTIVE' | 'AUDITED';
  joinedYear: string;
}

const DUMMY_DIRECTORY: SupplierVendorRecord[] = [
  {
    id: 'SUP-001',
    name: 'PT Mandiri Ban Pratama',
    type: 'SUPPLIER',
    category: 'Ban & Velg Truk',
    specialty: 'Distributor Resmi Bridgestone & Gajah Tunggal',
    contactPerson: 'Bambang Sudiro',
    email: 'sales@mandiriban.co.id',
    phone: '0812-8899-2341',
    city: 'Jakarta Timur (Cakung)',
    rating: 4.9,
    completedTenders: 24,
    status: 'VERIFIED',
    joinedYear: '2021'
  },
  {
    id: 'SUP-002',
    name: 'PT Daya Sel Elektrika',
    type: 'SUPPLIER',
    category: 'Aki & Elektrikal Armada',
    specialty: 'Aki GS Astra, Incoe Heavy Duty, Battery Tester Digital',
    contactPerson: 'Dewi Anggraeni',
    email: 'b2b@dayaselelektrika.co.id',
    phone: '0811-9876-5432',
    city: 'Jakarta Utara (Marunda)',
    rating: 4.8,
    completedTenders: 18,
    status: 'VERIFIED',
    joinedYear: '2022'
  },
  {
    id: 'SUP-003',
    name: 'PT Pancaran Suku Cadang Utama',
    type: 'SUPPLIER',
    category: 'Spare Part & Komponen',
    specialty: 'Brake Shoe Hino, Filter Fleetguard, Kampas Kopling OEM',
    contactPerson: 'Hendra Gunawan',
    email: 'spareparts@pancaransukucadang.id',
    phone: '0815-1234-7788',
    city: 'Bekasi & Cikarang',
    rating: 4.9,
    completedTenders: 42,
    status: 'VERIFIED',
    joinedYear: '2020'
  },
  {
    id: 'VND-001',
    name: 'CV Multi Servis Armada',
    type: 'VENDOR',
    category: 'Jasa Overhaul & Kalibrasi Mesin',
    specialty: 'Overhaul Common Rail, Kalibrasi Injector & Pompa Injeksi',
    contactPerson: 'Ir. Agus Wijaya',
    email: 'cs@multiservisarmada.com',
    phone: '0821-4455-6677',
    city: 'Jakarta Timur (Pulogadung)',
    rating: 4.8,
    completedTenders: 15,
    status: 'VERIFIED',
    joinedYear: '2022'
  },
  {
    id: 'VND-002',
    name: 'PT Sentosa Karoseri & Bubut',
    type: 'VENDOR',
    category: 'Jasa Karoseri & Bubut',
    specialty: 'Fabrikasi Box Trailer, Pengelasan Sasis & Bubut Tromol',
    contactPerson: 'Rudi Hartono',
    email: 'tender@sentosakaroseri.com',
    phone: '0813-7788-9900',
    city: 'Tangerang & Serang',
    rating: 4.7,
    completedTenders: 12,
    status: 'AUDITED',
    joinedYear: '2023'
  },
  {
    id: 'VND-003',
    name: 'PT Trans Cold Teknik',
    type: 'VENDOR',
    category: 'Jasa AC & Reefer Trailer',
    specialty: 'Maintenance Thermo King & Carrier Reefer Kontainer',
    contactPerson: 'Wahyu Prasetyo',
    email: 'support@transcoldteknik.com',
    phone: '0819-3344-5566',
    city: 'Tanjung Priok, Jakarta',
    rating: 4.9,
    completedTenders: 20,
    status: 'VERIFIED',
    joinedYear: '2021'
  }
];

export default function ManagementKebutuhan() {
  const [activeTab, setActiveTab] = useState<'SUPPLIER' | 'VENDOR'>('SUPPLIER');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SupplierVendorRecord | null>(null);

  const filteredList = DUMMY_DIRECTORY.filter(item => {
    const matchType = item.type === activeTab;
    const matchSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const supplierCount = DUMMY_DIRECTORY.filter(i => i.type === 'SUPPLIER').length;
  const vendorCount = DUMMY_DIRECTORY.filter(i => i.type === 'VENDOR').length;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner with Pancaran Logo */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <PancaranLogo size={48} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Direktori Rekanan Resmi
              </span>
              <span className="text-xs text-slate-400 font-medium">OPTIMA Pancaran Group</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Management Kebutuhan & Rekanan
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Direktori resmi Supplier (Penyedia Material / Suku Cadang) dan Vendor Jasa (Layanan Armada Logistik) terpilih.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Official Top Tabs with Logos & Icons */}
        <div className="border-b border-slate-200 bg-slate-50/70 p-2">
          <nav className="grid grid-cols-2 gap-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('SUPPLIER')}
              className={`flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'SUPPLIER'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activeTab === 'SUPPLIER' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                <Store className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Supplier (Penyedia Barang / Spare Part)</div>
                <div className={`text-[11px] font-normal mt-0.5 ${activeTab === 'SUPPLIER' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {supplierCount} Rekanan Terdaftar (Ban, Aki, Suku Cadang)
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('VENDOR')}
              className={`flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'VENDOR'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activeTab === 'VENDOR' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Vendor Jasa (Layanan & Maintenance)</div>
                <div className={`text-[11px] font-normal mt-0.5 ${activeTab === 'VENDOR' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {vendorCount} Rekanan Jasa (Overhaul, Bubut, AC Reefer)
                </div>
              </div>
            </button>
          </nav>
        </div>

        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder={`Cari nama, kategori, spesialisasi ${activeTab.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Total:</span> {filteredList.length} entitas ditampilkan
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <th className="px-6 py-4">ID & Nama Rekanan</th>
                <th className="px-6 py-4">Kategori & Spesialisasi</th>
                <th className="px-6 py-4">Kontak & Lokasi</th>
                <th className="px-6 py-4 text-center">Rating & Tender</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      {item.name}
                      <CheckCircle2 className="w-4 h-4 text-blue-600 inline" />
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {item.id} • Bergabung {item.joinedYear}
                    </div>
                  </td>

                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-bold text-slate-800 text-xs">{item.category}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.specialty}</div>
                  </td>

                  <td className="px-6 py-4 text-xs">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {item.phone}
                    </div>
                    <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.city}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800 border border-amber-200">
                      <span>★ {item.rating}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.completedTenders} Tender Selesai</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSelectedRecord(item)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200/60 inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Profil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profil Rekanan Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6">
              <div className="flex items-center justify-between">
                <PancaranLogo size={36} />
                <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase">
                  {selectedRecord.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-3">{selectedRecord.name}</h3>
              <p className="text-xs text-blue-200 mt-0.5">{selectedRecord.category} • {selectedRecord.id}</p>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-sm">Spesialisasi Produk / Jasa</div>
                <p className="text-slate-600">{selectedRecord.specialty}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Kontak Person</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedRecord.contactPerson}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Telepon</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedRecord.phone}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Email Resmi</div>
                <div className="font-bold text-slate-800 mt-0.5">{selectedRecord.email}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Lokasi Depo / Workshop</div>
                <div className="font-bold text-slate-800 mt-0.5">{selectedRecord.city}</div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
