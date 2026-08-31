import { UserActivityLog } from '../types';

export const INITIAL_ACTIVITY_LOGS: UserActivityLog[] = [
  {
    id: 'LOG-2026-0831-01',
    userName: 'Muhamad Rizki Alfian',
    userEmail: 'muhamad.rizki@pancaran-logistic.id',
    companyName: 'PT Pancaran Darat Transport (Internal)',
    role: 'INTERNAL',
    vendorType: 'SUPER_ADMIN',
    actionType: 'LOGIN',
    actionTitle: 'Login Sesi Admin Internal',
    actionDetail: 'Otentikasi berhasil via Google SSO dengan hak akses Super Admin Procurement.',
    timestamp: 'Hari ini, 08:00 WIB',
    date: '2026-08-31',
    ipAddress: '192.168.10.12 (Pancaran HQ Jakarta)',
    deviceInfo: 'Chrome 128 / Windows 11 Enterprise',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-2026-0831-02',
    userName: 'Hendra Gunawan',
    userEmail: 'b2b@dayaselelektrika.co.id',
    companyName: 'PT Daya Sel Elektrika',
    role: 'EXTERNAL',
    vendorType: 'SUPPLIER',
    actionType: 'CHAT_SENT',
    actionTitle: 'Kirim Pesan & Bukti Surat Stok Kosong',
    actionDetail: 'Mengirim informasi konfirmasi stok aki 100Ah kosong via modul Chat Vendor REQ-004.',
    timestamp: 'Hari ini, 09:15 WIB',
    date: '2026-08-31',
    ipAddress: '182.253.110.88 (ISP Telkomsel)',
    deviceInfo: 'Safari 17 / MacOS Sonoma',
    status: 'WARNING',
    evidencePhoto: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    targetId: 'REQ-004'
  },
  {
    id: 'LOG-2026-0831-03',
    userName: 'Budi Santoso',
    userEmail: 'budi.s@pancaran-logistic.id',
    companyName: 'PT Pancaran Darat Transport (Internal)',
    role: 'INTERNAL',
    vendorType: 'PROCUREMENT',
    actionType: 'WINNER_ASSIGNED',
    actionTitle: 'Penetapan Pemenang Override Juara 2 (REQ-004)',
    actionDetail: 'Menetapkan Juara 2 sebagai pemenang tender aki karena Juara 1 stok kosong, dilengkapi bukti chat & surat konfirmasi.',
    timestamp: 'Hari ini, 09:30 WIB',
    date: '2026-08-31',
    ipAddress: '192.168.10.18 (Pancaran HQ Jakarta)',
    deviceInfo: 'Edge 127 / Windows 11',
    status: 'SUCCESS',
    evidencePhoto: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    targetId: 'REQ-004'
  },
  {
    id: 'LOG-2026-0831-04',
    userName: 'Sales Officer',
    userEmail: 'sales@mandiriban.co.id',
    companyName: 'PT Mandiri Ban Pratama',
    role: 'EXTERNAL',
    vendorType: 'SUPPLIER',
    actionType: 'PO_GENERATED',
    actionTitle: 'Konfirmasi Penerimaan PO & Pengiriman Batch 1',
    actionDetail: 'Membuka dokumen PO resmi PO-2026-08-003 pengadaan 200 unit Ban Radial Bridgestone.',
    timestamp: 'Hari ini, 08:42 WIB',
    date: '2026-08-31',
    ipAddress: '114.125.45.19 (Biznet Jakarta)',
    deviceInfo: 'Chrome 128 / Windows 10 Pro',
    status: 'SUCCESS',
    targetId: 'REQ-003'
  },
  {
    id: 'LOG-2026-0831-05',
    userName: 'Ahmad Syafii',
    userEmail: 'vendor@gmail.com',
    companyName: 'PT Mitra Vendor Nusantara',
    role: 'EXTERNAL',
    vendorType: 'SUPPLIER',
    actionType: 'BID_SUBMIT',
    actionTitle: 'Pengajuan Penawaran Bidding (REQ-003)',
    actionDetail: 'Mengirimkan penawaran harga Rp 810.000.000 dengan garansi 12 Bulan / 50.000 KM.',
    timestamp: 'Hari ini, 07:25 WIB',
    date: '2026-08-31',
    ipAddress: '103.28.12.194 (Indosat Ooredoo)',
    deviceInfo: 'Chrome 127 / Android 14',
    status: 'SUCCESS',
    targetId: 'REQ-003'
  },
  {
    id: 'LOG-2026-0830-06',
    userName: 'Maya Anggraini',
    userEmail: 'maya.a@pancaran-logistic.id',
    companyName: 'PT Pancaran Darat Transport (Internal)',
    role: 'INTERNAL',
    vendorType: 'FINANCE',
    actionType: 'DOWNLOAD_REPORT',
    actionTitle: 'Ekspor Laporan Realisasi Belanja & PO',
    actionDetail: 'Mengunduh laporan komparasi penghematan tender format Excel.',
    timestamp: 'Kemarin, 16:15 WIB',
    date: '2026-08-30',
    ipAddress: '192.168.10.45 (Pancaran HQ Jakarta)',
    deviceInfo: 'Firefox 129 / MacOS Sonoma',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-2026-0830-07',
    userName: 'Irwan Setiawan',
    userEmail: 'info@sumberkaret.com',
    companyName: 'CV Sumber Karet Nusantara',
    role: 'EXTERNAL',
    vendorType: 'SUPPLIER',
    actionType: 'CATALOG_UPDATE',
    actionTitle: 'Pembaruan Stok Katalog Ban GT Radial',
    actionDetail: 'Memperbarui stok produk Ban Super 88N dari 75 menjadi 95 unit.',
    timestamp: 'Kemarin, 14:05 WIB',
    date: '2026-08-30',
    ipAddress: '180.252.88.12 (Telkom Speedy)',
    deviceInfo: 'Chrome 128 / Windows 10',
    status: 'SUCCESS'
  }
];

export function getStoredActivityLogs(): UserActivityLog[] {
  try {
    const saved = localStorage.getItem('optima_activity_logs');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ACTIVITY_LOGS;
}

export function logUserActivity(log: Omit<UserActivityLog, 'id' | 'timestamp' | 'date'>) {
  try {
    const existing = getStoredActivityLogs();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = now.toISOString().split('T')[0];

    const newLog: UserActivityLog = {
      ...log,
      id: `LOG-${Date.now()}`,
      timestamp: `Hari ini, ${hours}:${minutes} WIB`,
      date: dateStr
    };

    const updated = [newLog, ...existing].slice(0, 100);
    localStorage.setItem('optima_activity_logs', JSON.stringify(updated));
    return newLog;
  } catch (e) {
    console.error('Failed to save activity log:', e);
    return null;
  }
}
