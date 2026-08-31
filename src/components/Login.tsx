import React, { useState } from 'react';
import { User, Role, VendorType } from '../types';
import { Lock, Mail, User as UserIcon, Eye, EyeOff, ArrowLeft, X, CheckCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export default function Login({ onLogin, isModal = false, onClose }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Registration state
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('EXTERNAL');
  const [regVendorType, setRegVendorType] = useState<VendorType>('SUPPLIER');
  const [regSuccess, setRegSuccess] = useState(false);

  // Change password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changeEmail, setChangeEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  const getStoredPassword = (userEmail: string) => {
    try {
      const passwordsMap = JSON.parse(localStorage.getItem('optima_user_passwords') || '{}');
      if (passwordsMap[userEmail.toLowerCase()]) {
        return passwordsMap[userEmail.toLowerCase()];
      }
    } catch (e) {}
    return '12345678';
  };

  const setStoredPassword = (userEmail: string, newPass: string) => {
    try {
      const passwordsMap = JSON.parse(localStorage.getItem('optima_user_passwords') || '{}');
      passwordsMap[userEmail.toLowerCase()] = newPass;
      localStorage.setItem('optima_user_passwords', JSON.stringify(passwordsMap));
    } catch (e) {}
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!changeEmail || !oldPassword || !newPassword) {
      setError('Semua kolom (Email, Password Lama, Password Baru) wajib diisi');
      return;
    }

    const correctOld = getStoredPassword(changeEmail);
    if (oldPassword !== correctOld) {
      setError('Password lama salah! Mohon masukkan password lama yang benar.');
      return;
    }

    setStoredPassword(changeEmail, newPassword);
    setChangeSuccess(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setChangeSuccess(false);
      setEmail(changeEmail);
      setPassword(newPassword);
      setChangeEmail('');
      setOldPassword('');
      setNewPassword('');
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim().toLowerCase();
    const isPancaranInternal = trimmedEmail.endsWith('@pancaran-logistic.id');

    // Verify password against stored password
    const correctPassword = getStoredPassword(email);
    if (password !== correctPassword) {
      setError('Password salah! Silakan masukkan password yang benar.');
      return;
    }

    if (trimmedEmail === 'muhamad.rizki@pancaran-logistic.id') {
      onLogin({
        id: '1',
        email: email,
        name: 'Muhamad Rizki Alfian',
        companyName: 'PT Pancaran Darat Transport',
        phone: '0812-9988-7766',
        role: 'INTERNAL',
        isInternalEmployee: true
      });
      return;
    }

    try {
      const saved = localStorage.getItem('optima_access_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = parsed.find((u: any) => u.email?.toLowerCase() === trimmedEmail);
        if (found) {
          if (found.status === 'INACTIVE') {
            setError('Akun Anda tidak aktif atau ditolak oleh administrator.');
            return;
          }
          // Allow login for testing even if pending or active
          onLogin({
            id: found.id || String(Date.now()),
            email: found.email,
            name: found.name || 'Vendor Rekanan',
            companyName: found.companyName || (found.role === 'INTERNAL' ? 'Pancaran Group' : 'PT ' + found.name),
            phone: found.phone || '0812-0000-0000',
            role: found.role || 'EXTERNAL',
            vendorType: found.vendorType || 'SUPPLIER',
            isInternalEmployee: found.role === 'INTERNAL'
          });
          return;
        }
      }
    } catch (err) {
      console.error('Error checking user status:', err);
    }

    if (isPancaranInternal) {
      onLogin({
        id: String(Date.now()),
        email: email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        companyName: 'Pancaran Group (Internal)',
        phone: '0812-9988-7766',
        role: 'INTERNAL',
        isInternalEmployee: true
      });
    } else if (trimmedEmail === 'info@sumberkaret.com' || trimmedEmail === 'sumberkaret@gmail.com') {
      onLogin({
        id: 'VEND-02',
        email: email,
        name: 'Bambang Hendrawan (CV Sumber Karet)',
        companyName: 'CV Sumber Karet Nusantara',
        phone: '0813-7721-0099',
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else if (trimmedEmail === 'sales@mandiriban.co.id' || trimmedEmail === 'mandiriban@gmail.com' || trimmedEmail === 'external@example.com' || trimmedEmail === 'external@pancaran.com') {
      onLogin({
        id: 'VEND-01',
        email: email,
        name: 'Hendro Wijaya (PT Mandiri Ban)',
        companyName: 'PT Mandiri Ban Pratama',
        phone: '0812-8899-2231',
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else if (trimmedEmail === 'spareparts@pancaransukucadang.id' || trimmedEmail === 'pancaransukucadang@gmail.com') {
      onLogin({
        id: 'VEND-04',
        email: email,
        name: 'Dedi Pratama (PT Pancaran Suku Cadang)',
        companyName: 'PT Pancaran Suku Cadang Utama',
        phone: '0815-1234-7788',
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else if (trimmedEmail === 'order@suryaaccu.co.id' || trimmedEmail === 'suryaaccu@gmail.com') {
      onLogin({
        id: 'VEND-03',
        email: email,
        name: 'Agus Dinata (PT Surya Accu)',
        companyName: 'PT Surya Accu Dinamika',
        phone: '0811-9022-4411',
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else if (trimmedEmail === 'cs@multiservisarmada.com' || trimmedEmail === 'multiservis@gmail.com') {
      onLogin({
        id: 'VEND-05',
        email: email,
        name: 'Rian Kurniawan (CV Multi Servis)',
        companyName: 'CV Multi Servis Armada',
        phone: '0821-4455-6677',
        role: 'EXTERNAL',
        vendorType: 'VENDOR_JASA',
        isInternalEmployee: false
      });
    } else if (trimmedEmail === 'vendor@gmail.com' || trimmedEmail === 'vendor@suryagemilang.com') {
      onLogin({
        id: 'VEND-06',
        email: email,
        name: 'PT Surya Gemilang (Vendor)',
        companyName: 'PT Surya Gemilang',
        phone: '0812-8899-2231',
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else if (trimmedEmail === 'info@makmurjaya.co.id') {
      onLogin({
        id: 'VEND-07',
        email: email,
        name: 'Budi Hartono (CV Makmur Jaya)',
        companyName: 'CV Makmur Jaya',
        phone: '0813-7788-9900',
        role: 'EXTERNAL',
        vendorType: 'VENDOR_JASA',
        isInternalEmployee: false
      });
    } else if (trimmedEmail === 'vendor@ptglobalgps.com' || trimmedEmail === 'ptglobalgps@gmail.com') {
      onLogin({
        id: 'VEND-GPS',
        email: email,
        name: 'PT Global GPS Telematika',
        companyName: 'PT Global GPS Telematika',
        phone: '0811-3344-5566',
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else if (trimmedEmail) {
      // Allow any external email for testing with password 12345678
      const prefix = trimmedEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      const companyName = 'PT ' + formattedName.toUpperCase();

      onLogin({
        id: 'EXT-' + Date.now(),
        email: email,
        name: formattedName + ' (Vendor)',
        companyName: companyName,
        phone: '0812-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else {
      setError('Masukkan email dan password yang valid');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setError('Semua kolom wajib diisi');
      return;
    }
    const isInternal = regRole === 'INTERNAL';

    try {
      const saved = localStorage.getItem('optima_access_users');
      const existing = saved ? JSON.parse(saved) : [
        { id: '1', name: 'Muhamad Rizki', email: 'muhamad.rizki@pancaran-logistic.id', role: 'INTERNAL', status: 'ACTIVE' },
        { id: '2', name: 'Budi Santoso', email: 'budi.s@pancaran-logistic.id', role: 'INTERNAL', status: 'ACTIVE' },
        { id: '3', name: 'PT Surya Gemilang', email: 'vendor@suryagemilang.com', role: 'EXTERNAL', vendorType: 'SUPPLIER', status: 'ACTIVE' },
        { id: '4', name: 'CV Makmur Jaya', email: 'info@makmurjaya.co.id', role: 'EXTERNAL', vendorType: 'VENDOR_JASA', status: 'PENDING' },
      ];

      if (existing.some((u: any) => u.email.toLowerCase() === regEmail.toLowerCase())) {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
        return;
      }

      const newUserRecord = {
        id: String(Date.now()),
        name: regName,
        companyName: regCompany || (isInternal ? 'Pancaran Group' : 'PT ' + regName),
        phone: regPhone || '0812-0000-0000',
        email: regEmail,
        role: regRole,
        vendorType: regRole === 'EXTERNAL' ? regVendorType : undefined,
        status: 'PENDING'
      };

      localStorage.setItem('optima_access_users', JSON.stringify([newUserRecord, ...existing]));
    } catch (err) {
      console.error('Error saving registration:', err);
    }

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setIsRegistering(false);
      setError('Registrasi berhasil! Akun Anda sedang menunggu approval dari Tim Internal.');
      setRegName('');
      setRegCompany('');
      setRegPhone('');
      setRegEmail('');
      setRegPassword('');
    }, 1500);
  };

  const setDemoAccount = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('12345678');
    setError('');
  };

  const content = (
    <div className="w-full max-w-[420px] bg-white p-8 sm:p-10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 relative">
      {isModal && onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex flex-col items-center mb-6 text-center">
        {isRegistering ? (
          <h2 className="text-[26px] sm:text-[28px] font-black text-slate-900 tracking-tight mb-1.5 leading-tight">
            Daftar Akun Baru
          </h2>
        ) : isChangingPassword ? (
          <h2 className="text-[26px] sm:text-[28px] font-black text-slate-900 tracking-tight mb-1.5 leading-tight">
            Change password
          </h2>
        ) : (
          <div className="flex justify-center mb-3">
            <img 
              src="https://lh3.googleusercontent.com/d/122sAgfSnTqphroy2r3vNvOfmAuftH_Po"
              alt="Platinum Pancaran"
              className="h-10 sm:h-11 object-contain max-w-[220px]"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-[320px]">
          {isRegistering ? 'Lengkapi data diri dan tentukan tipe akses Anda' : isChangingPassword ? 'Masukkan email, password lama, dan password baru' : 'Oriented Procurement, Targeted Integrated Management for Aligned Tender'}
        </p>
      </div>

      {regSuccess ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
          <h4 className="text-base font-bold text-slate-900">Registrasi Berhasil!</h4>
          <p className="text-xs text-slate-500">Mengarahkan Anda ke halaman utama...</p>
        </div>
      ) : isRegistering ? (
        <form className="space-y-4" onSubmit={handleRegisterSubmit}>
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="block w-full pl-11 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
                placeholder="cth: Budi Santoso"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1">
              Nama Perusahaan
            </label>
            <input
              type="text"
              required
              value={regCompany}
              onChange={(e) => setRegCompany(e.target.value)}
              className="block w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
              placeholder="cth: PT Maju Jaya Logistik"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              required
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              className="block w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
              placeholder="cth: 081234567890"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="block w-full pl-11 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
                placeholder="email@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="block w-full pl-11 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1">
              Tipe Akses
            </label>
            <select
              value={regRole}
              onChange={(e) => setRegRole(e.target.value as Role)}
              className="block w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
            >
              <option value="EXTERNAL">External (Vendor)</option>
              <option value="INTERNAL">Internal</option>
            </select>
          </div>

          {regRole === 'EXTERNAL' && (
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1">
                Kategori Vendor / Supplier
              </label>
              <select
                value={regVendorType}
                onChange={(e) => setRegVendorType(e.target.value as VendorType)}
                className="block w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
              >
                <option value="SUPPLIER">Supplier Barang</option>
                <option value="VENDOR_JASA">Vendor Jasa</option>
              </select>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-xs font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-[#5238FF] hover:bg-[#432AEE] transition-all"
            >
              Daftar Sekarang
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setError(''); }}
              className="w-full flex justify-center py-2 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Kembali ke Login
            </button>
          </div>
        </form>
      ) : isChangingPassword ? (
        <form className="space-y-4" onSubmit={handleChangePasswordSubmit}>
          <div>
            <label htmlFor="changeEmail" className="block text-[13px] font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <input
                id="changeEmail"
                type="email"
                required
                value={changeEmail}
                onChange={(e) => setChangeEmail(e.target.value)}
                className="block w-full pl-11 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors"
                placeholder="email@pancaran-logistic.id"
              />
            </div>
          </div>

          <div>
            <label htmlFor="oldPassword" className="block text-[13px] font-bold text-slate-700 mb-1.5">
              Password Lama
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <input
                id="oldPassword"
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="block w-full pl-11 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors font-medium tracking-wider"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-[13px] font-bold text-slate-700 mb-1.5">
              Password Baru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full pl-11 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors font-medium tracking-wider"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-xs font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {changeSuccess && (
            <div className="text-emerald-600 text-xs font-medium text-center bg-emerald-50 py-2 rounded-lg border border-emerald-100 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Password berhasil diubah! Mengarahkan ke login...</span>
            </div>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-[#5238FF] hover:bg-[#432AEE] transition-all"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={() => { setIsChangingPassword(false); setError(''); }}
              className="w-full flex justify-center py-2 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Kembali ke Login
            </button>
          </div>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-[13px] font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-3 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors placeholder:text-slate-400"
                placeholder="email@pancaran-logistic.id"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-[13px] font-bold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => { setIsChangingPassword(true); setError(''); }}
                className="text-[12px] font-bold text-blue-600 hover:text-blue-700 bg-transparent border-0 p-0 cursor-pointer"
              >
                Change password
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-11 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors placeholder:text-slate-400 font-medium tracking-wider"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-xs font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-[#5238FF] hover:bg-[#432AEE] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5238FF] transition-all transform active:scale-[0.98]"
            >
              Sign In to Portal
            </button>
          </div>


          


          <div className="pt-2 text-center">
            <p className="text-[13px] text-slate-500 font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegistering(true); setError(''); }}
                className="text-[#5238FF] font-bold hover:underline ml-1 cursor-pointer bg-transparent border-0 p-0"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-sans">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
        {content}
      </div>
    </div>
  );
}
