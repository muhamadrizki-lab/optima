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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isPancaranInternal = email.toLowerCase().endsWith('@pancaran-logistic.id');

    if (email === 'muhamad.rizki@pancaran-logistic.id' && password === '12345678') {
      onLogin({
        id: '1',
        email: email,
        name: 'Muhamad Rizki Alfian',
        companyName: 'PT Pancaran Darat Transport',
        phone: '0812-9988-7766',
        role: 'INTERNAL',
        isInternalEmployee: true
      });
    } else if (isPancaranInternal) {
      onLogin({
        id: String(Date.now()),
        email: email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        companyName: 'Pancaran Group (Internal)',
        phone: '0812-9988-7766',
        role: 'INTERNAL',
        isInternalEmployee: true
      });
    } else if (email === 'vendor@gmail.com' && password === '12345678') {
      onLogin({
        id: 'VEND-01',
        email: 'vendor@gmail.com',
        name: 'PT Surya Gemilang (Vendor)',
        companyName: 'PT Surya Gemilang',
        phone: '0812-8899-2231',
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else if (email === 'external@example.com' && password === '12345678') {
      onLogin({
        id: '2',
        email: email,
        name: 'Vendor Mitra Logistics',
        companyName: 'PT Mandiri Ban Pratama',
        phone: '0812-8899-2231',
        role: 'EXTERNAL',
        vendorType: 'SUPPLIER',
        isInternalEmployee: false
      });
    } else if (email.trim() && password.trim()) {
      // External vendor partner login
      onLogin({
        id: '3',
        email: email,
        name: email.split('@')[0].toUpperCase() || 'Vendor Partner',
        companyName: 'PT ' + (email.split('@')[0].toUpperCase() || 'Vendor Mitra'),
        phone: '0812-3456-7890',
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
    setRegSuccess(true);
    setTimeout(() => {
      onLogin({
        id: String(Date.now()),
        email: regEmail,
        name: regName,
        companyName: regCompany,
        phone: regPhone,
        role: regRole,
        vendorType: regRole === 'EXTERNAL' ? regVendorType : undefined,
        isInternalEmployee: isInternal
      });
    }, 1200);
  };

  const setDemoAccount = (type: 'INTERNAL' | 'EXTERNAL') => {
    if (type === 'INTERNAL') {
      setEmail('muhamad.rizki@pancaran-logistic.id');
      setPassword('12345678');
    } else {
      setEmail('external@example.com');
      setPassword('12345678');
    }
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
        <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center p-1 mb-4 overflow-hidden">
          <img src="https://lh3.googleusercontent.com/d/1LmpjB5qAX8ev5_JRzYQDwjM58RxHl18X=w1000" referrerPolicy="no-referrer" alt="Pancaran Logo" className="w-full h-full object-contain" />
        </div>
        
        <h2 className="text-[26px] sm:text-[28px] font-black text-slate-900 tracking-tight mb-1.5 leading-tight">
          {isRegistering ? 'Daftar Akun Baru' : 'OPTIMA Portal'}
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-[320px]">
          {isRegistering ? 'Lengkapi data diri dan tentukan tipe akses Anda' : 'Oriented Procurement, Targeted Integrated Management for Aligned Tender'}
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
              <a href="#" className="text-[12px] font-bold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </a>
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
