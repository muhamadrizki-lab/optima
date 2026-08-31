import React, { useState } from 'react';
import { AccessDetail, Role, VendorType } from '../types';
import CompanyDetailModal from '../components/CompanyDetailModal';
import { Users, UserPlus, Shield, CheckCircle, XCircle, X } from 'lucide-react';

export default function ManagementAkses() {
  const [activeTab, setActiveTab] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<string | null>(null);

  const [users, setUsers] = useState<AccessDetail[]>(() => {
    try {
      const saved = localStorage.getItem('optima_access_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading users:', e);
    }
    return [];
  });

  React.useEffect(() => {
    const handleSync = (e: any) => {
      if (!e.detail || e.detail.key === 'optima_access_users') {
        const saved = localStorage.getItem('optima_access_users');
        if (saved) {
          try {
            setUsers(JSON.parse(saved));
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    window.addEventListener('optima-db-updated', handleSync);
    return () => window.removeEventListener('optima-db-updated', handleSync);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    role: 'INTERNAL' as Role,
    vendorType: 'SUPPLIER' as VendorType,
  });

  const handleStatusChange = (id: string, newStatus: 'ACTIVE' | 'PENDING' | 'INACTIVE') => {
    const updated = users.map(u => u.id === id ? { ...u, status: newStatus } : u);
    setUsers(updated);
    try {
      localStorage.setItem('optima_access_users', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving users status:', e);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser: AccessDetail = {
      id: String(Date.now()),
      name: formData.name,
      companyName: formData.companyName,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
      vendorType: formData.role === 'EXTERNAL' ? formData.vendorType : undefined,
      status: 'PENDING',
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    try {
      localStorage.setItem('optima_access_users', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving new user:', e);
    }
    setFormData({ name: '', companyName: '', phone: '', email: '', role: 'INTERNAL', vendorType: 'SUPPLIER' });
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => u.role === activeTab);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Management Akses</h1>
          <p className="text-gray-500 text-sm mt-1">Database detail akses Internal & External serta persetujuan akun</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Pendaftaran & Tambah Akses
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('INTERNAL')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'INTERNAL'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <Shield className="w-4 h-4 mr-2" />
                Akses Internal
              </div>
            </button>
            <button
              onClick={() => setActiveTab('EXTERNAL')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'EXTERNAL'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <Users className="w-4 h-4 mr-2" />
                Akses External
              </div>
            </button>
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama / Perusahaan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                {activeTab === 'EXTERNAL' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Vendor</th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi (Approve / Reject)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      onClick={() => setSelectedCompanyModal(user.name)}
                      className="text-sm font-bold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer"
                      title="Klik untuk melihat Detail Pop-Up Data Perusahaan / PT"
                    >
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  {activeTab === 'EXTERNAL' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 inline-flex text-xs leading-4 font-semibold rounded bg-indigo-50 text-indigo-700">
                        {user.vendorType === 'SUPPLIER' ? 'Supplier Barang' : user.vendorType === 'VENDOR_JASA' ? 'Vendor Jasa' : '-'}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                        disabled={user.status === 'ACTIVE'}
                        title="Approve Akses"
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                          user.status === 'ACTIVE'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.id, 'INACTIVE')}
                        disabled={user.status === 'INACTIVE'}
                        title="Reject Akses"
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                          user.status === 'INACTIVE'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                 <tr>
                    <td colSpan={activeTab === 'EXTERNAL' ? 5 : 4} className="px-6 py-10 text-center text-gray-500 text-sm">
                      Belum ada data akses.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pendaftaran */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Formulir Pendaftaran Akses</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: PT Maju Jaya Logistik"
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="Contoh: user@domain.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Akses</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as Role})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="INTERNAL">Internal</option>
                  <option value="EXTERNAL">External</option>
                </select>
              </div>

              {formData.role === 'EXTERNAL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Vendor / Supplier</label>
                  <select 
                    value={formData.vendorType}
                    onChange={e => setFormData({...formData, vendorType: e.target.value as VendorType})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="SUPPLIER">Supplier Barang</option>
                    <option value="VENDOR_JASA">Vendor Jasa</option>
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                  Daftar / Simpan
                </button>
              </div>
            </form>
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
