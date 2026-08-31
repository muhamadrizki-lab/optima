import { ChatConversation, ChatMessage } from '../types';

export const INITIAL_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-daya-sel',
    vendorId: 'VEND-03',
    vendorName: 'PT Daya Sel Elektrika',
    vendorCompany: 'PT Daya Sel Elektrika (Juara 1 Asli REQ-004)',
    vendorEmail: 'b2b@dayaselelektrika.co.id',
    vendorPhone: '0811-9876-5432',
    tenderId: 'REQ-004',
    tenderTitle: 'Pengadaan Aki Truk Heavy Duty 12V 100Ah N100 (150 Unit)',
    lastMessage: 'Berikut kami lampirkan Surat Resmi Pernyataan Keterbatasan Stok dari manajemen pabrik kami...',
    lastTimestamp: 'Hari ini, 09:15 WIB',
    unreadCount: 1,
    isOnline: true
  },
  {
    id: 'conv-mandiri-ban',
    vendorId: 'VEND-01',
    vendorName: 'PT Mandiri Ban Pratama',
    vendorCompany: 'PT Mandiri Ban Pratama',
    vendorEmail: 'sales@mandiriban.co.id',
    vendorPhone: '0812-8899-2341',
    tenderId: 'REQ-003',
    tenderTitle: 'Pengadaan Ban Radial Truk Tronton 11R22.5 (200 Unit)',
    lastMessage: 'Siap Pak Rizki! PO resmi REQ-003 telah kami terima Pak, batch 1 sebanyak 50 unit siap dikirim...',
    lastTimestamp: 'Hari ini, 08:40 WIB',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 'conv-sumber-komputer',
    vendorId: 'VEND-05',
    vendorName: 'PT Sumber Komputer Utama',
    vendorCompany: 'PT Sumber Komputer Utama',
    vendorEmail: 'corporate@sumberkomputer.co.id',
    vendorPhone: '0813-2211-4455',
    tenderId: 'REQ-001',
    tenderTitle: 'Pembaruan Perangkat IT 2024 (50 Laptop)',
    lastMessage: 'Semua unit ThinkPad P14s sudah ready stock di distributor Jakarta dan garansi resmi 3 tahun onsite...',
    lastTimestamp: 'Hari ini, 16:30 WIB',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 'conv-mitra-vendor',
    vendorId: 'VEND-VENDOR-01',
    vendorName: 'PT Mitra Vendor Nusantara',
    vendorCompany: 'PT Mitra Vendor Nusantara',
    vendorEmail: 'vendor@gmail.com',
    vendorPhone: '0812-9988-7766',
    tenderId: 'REQ-003',
    tenderTitle: 'Pengadaan Ban Radial Truk Tronton 11R22.5 (200 Unit)',
    lastMessage: 'Bisa Pak, silakan upload melalui portal pengajuan penawaran pada kolom dokumen lampiran.',
    lastTimestamp: 'Hari ini, 14:35 WIB',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 'conv-berkah-auto',
    vendorId: 'VEND-02',
    vendorName: 'CV Berkah Auto Jaya',
    vendorCompany: 'CV Berkah Auto Jaya (Distributor Resmi Pertamina Lubricants)',
    vendorEmail: 'sales@berkahautojaya.co.id',
    vendorPhone: '0813-7766-5544',
    tenderId: 'REQ-005',
    tenderTitle: 'Pengadaan Pelumas & Oli Mesin Truk Diesel 15W-40 (20 Drum)',
    lastMessage: 'Surat Keagenan Resmi Pertamina Lubricants dan CoA Batch 2026 sudah kami upload di sistem tender.',
    lastTimestamp: 'Hari ini, 11:20 WIB',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 'conv-cipta-solusi',
    vendorId: 'VEND-06',
    vendorName: 'PT Cipta Solusi Logistik',
    vendorCompany: 'PT Cipta Solusi Logistik (Spesialis Maintenance Alat Berat & Forklift)',
    vendorEmail: 'service@ciptasolusi.com',
    vendorPhone: '0821-3344-5566',
    tenderId: 'REQ-002',
    tenderTitle: 'Jasa Maintenance Forklift & Re-Greasing Depo Marunda (4 Unit)',
    lastMessage: 'Tim teknisi bersertifikasi BNSP siap standby di Depo Marunda mulai Kamis pukul 08:00 WIB.',
    lastTimestamp: 'Kemarin, 15:10 WIB',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 'conv-global-gps',
    vendorId: 'VEND-07',
    vendorName: 'PT Global GPS Telematika',
    vendorCompany: 'PT Global GPS Telematika (IoT & Fleet Management Solution)',
    vendorEmail: 'support@globalgps.id',
    vendorPhone: '0812-3322-1100',
    tenderId: 'REQ-006',
    tenderTitle: 'Pengadaan Sensor IoT Fuel Level & GPS Tracker Truk (100 Unit)',
    lastMessage: 'Dokumentasi Webhook API dan sample payload telemetry solar sudah kami kirimkan via email.',
    lastTimestamp: 'Kemarin, 13:45 WIB',
    unreadCount: 0,
    isOnline: true
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-daya-sel': [
    {
      id: 'msg-ds-1',
      conversationId: 'conv-daya-sel',
      senderId: 'USR-INT-01',
      senderName: 'Muhamad Rizki (Procurement Pancaran)',
      senderRole: 'INTERNAL',
      message: 'Selamat pagi Tim Sales PT Daya Sel Elektrika. Terkait penawaran tender REQ-004 Pengadaan Aki 12V 100Ah N100 sebanyak 150 unit, penawaran Anda merupakan nilai terendah (Juara 1). Mohon konfirmasi kesiapan pengiriman dan ketersediaan stok fisik di depo Jakarta.',
      timestamp: 'Hari ini, 08:30 WIB',
      isRead: true
    },
    {
      id: 'msg-ds-2',
      conversationId: 'conv-daya-sel',
      senderId: 'VEND-03',
      senderName: 'Hendra Gunawan (Sales Manager PT Daya Sel Elektrika)',
      senderRole: 'EXTERNAL',
      message: 'Selamat pagi Pak Rizki dan Tim Procurement Pancaran Group. Terima kasih atas konfirmasinya.',
      timestamp: 'Hari ini, 08:55 WIB',
      isRead: true
    },
    {
      id: 'msg-ds-3',
      conversationId: 'conv-daya-sel',
      senderId: 'VEND-03',
      senderName: 'Hendra Gunawan (Sales Manager PT Daya Sel Elektrika)',
      senderRole: 'EXTERNAL',
      message: 'Mohon maaf yang sebesar-besarnya Pak Rizki, setelah kami koordinasikan dengan gudang pusat dan prinsipal GS Astra, stok aki heavy duty 100Ah N100 per minggu ini sedang kosong habis (out of stock) karena ada lonjakan permintaan mendadak. Pabrik baru bisa menyediakan supply kembali minimal 2 bulan ke depan.',
      timestamp: 'Hari ini, 09:12 WIB',
      isRead: true
    },
    {
      id: 'msg-ds-4',
      conversationId: 'conv-daya-sel',
      senderId: 'VEND-03',
      senderName: 'Hendra Gunawan (Sales Manager PT Daya Sel Elektrika)',
      senderRole: 'EXTERNAL',
      message: 'Berikut kami lampirkan Surat Resmi Pernyataan Keterbatasan Stok dari manajemen pabrik kami sebagai bukti fisik.',
      attachmentUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
      attachmentType: 'IMAGE',
      attachmentName: 'Bukti_Konfirmasi_Chat_Stok_Kosong_PT_Daya_Sel.png',
      timestamp: 'Hari ini, 09:15 WIB',
      isRead: false
    }
  ],
  'conv-mandiri-ban': [
    {
      id: 'msg-mb-1',
      conversationId: 'conv-mandiri-ban',
      senderId: 'USR-INT-01',
      senderName: 'Muhamad Rizki (Procurement Pancaran)',
      senderRole: 'INTERNAL',
      message: 'Halo Pak Mandiri Ban, PO nomor PO-2026-08-003 untuk 200 unit Ban Radial Bridgestone telah resmi diterbitkan. Mohon konfirmasi jadwal pengiriman batch pertama.',
      timestamp: 'Hari ini, 08:15 WIB',
      isRead: true
    },
    {
      id: 'msg-mb-2',
      conversationId: 'conv-mandiri-ban',
      senderId: 'VEND-01',
      senderName: 'Sales Admin PT Mandiri Ban Pratama',
      senderRole: 'EXTERNAL',
      message: 'Siap Pak Rizki! PO resmi REQ-003 telah kami terima Pak, batch 1 sebanyak 50 unit siap dikirim ke Pool Cakung besok pagi lengkap dengan sertifikat garansi resmi pabrik 12 bulan / 60.000 KM.',
      timestamp: 'Hari ini, 08:40 WIB',
      isRead: true
    },
    {
      id: 'msg-mb-3',
      conversationId: 'conv-mandiri-ban',
      senderId: 'USR-INT-01',
      senderName: 'Muhamad Rizki (Procurement Pancaran)',
      senderRole: 'INTERNAL',
      message: 'Terima kasih atas respons cepatnya Pak. Mohon sertakan surat jalan 3 rangkap dan lampiran nomor seri ban saat serah terima BAST.',
      timestamp: 'Hari ini, 08:45 WIB',
      isRead: true
    }
  ],
  'conv-sumber-komputer': [
    {
      id: 'msg-sk-1',
      conversationId: 'conv-sumber-komputer',
      senderId: 'USR-INT-01',
      senderName: 'Muhamad Rizki (Procurement Pancaran)',
      senderRole: 'INTERNAL',
      message: 'Siang PT Sumber Komputer, untuk laptop ThinkPad P14s apakah garansi 3 tahun sudah include accidental damage protection?',
      timestamp: 'Hari ini, 15:45 WIB',
      isRead: true
    },
    {
      id: 'msg-sk-2',
      conversationId: 'conv-sumber-komputer',
      senderId: 'VEND-05',
      senderName: 'B2B Account Executive (PT Sumber Komputer)',
      senderRole: 'EXTERNAL',
      message: 'Semua unit ThinkPad P14s sudah ready stock di distributor Jakarta dan dilengkapi garansi resmi Lenovo Indonesia 3 tahun onsite support + premier support.',
      timestamp: 'Hari ini, 16:30 WIB',
      isRead: true
    }
  ],
  'conv-mitra-vendor': [
    {
      id: 'msg-mv-1',
      conversationId: 'conv-mitra-vendor',
      senderId: 'VEND-VENDOR-01',
      senderName: 'PT Mitra Vendor Nusantara',
      senderRole: 'EXTERNAL',
      message: 'Apakah kami bisa melampirkan sertifikat SNI tambahan untuk kelengkapan berkas tender ban?',
      timestamp: 'Hari ini, 14:10 WIB',
      isRead: true
    },
    {
      id: 'msg-mv-2',
      conversationId: 'conv-mitra-vendor',
      senderId: 'USR-INT-01',
      senderName: 'Muhamad Rizki (Procurement Pancaran)',
      senderRole: 'INTERNAL',
      message: 'Bisa Pak, silakan upload melalui portal pengajuan penawaran pada kolom dokumen lampiran.',
      timestamp: 'Hari ini, 14:35 WIB',
      isRead: true
    }
  ],
  'conv-berkah-auto': [
    {
      id: 'msg-ba-1',
      conversationId: 'conv-berkah-auto',
      senderId: 'USR-INT-01',
      senderName: 'Muhamad Rizki (Procurement Pancaran)',
      senderRole: 'INTERNAL',
      message: 'Selamat pagi CV Berkah Auto Jaya, untuk penawaran oli drum Meditran SX 15W-40 pada tender REQ-005, mohon konfirmasi tahun produksi dan jaminan keaslian segel drum.',
      timestamp: 'Hari ini, 10:45 WIB',
      isRead: true
    },
    {
      id: 'msg-ba-2',
      conversationId: 'conv-berkah-auto',
      senderId: 'VEND-02',
      senderName: 'Bambang Supriyanto (CV Berkah Auto Jaya)',
      senderRole: 'EXTERNAL',
      message: 'Selamat pagi Pak Rizki. Seluruh drum oli kami adalah produksi fresh batch Januari 2026 dengan QR Code segel barcode Pertamina Lubricants utuh dan Certificate of Analysis (CoA) resmi.',
      timestamp: 'Hari ini, 11:15 WIB',
      isRead: true
    },
    {
      id: 'msg-ba-3',
      conversationId: 'conv-berkah-auto',
      senderId: 'VEND-02',
      senderName: 'Bambang Supriyanto (CV Berkah Auto Jaya)',
      senderRole: 'EXTERNAL',
      message: 'Surat Keagenan Resmi Pertamina Lubricants dan CoA Batch 2026 sudah kami upload di sistem tender.',
      attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      attachmentType: 'IMAGE',
      attachmentName: 'Surat_Keagenan_Resmi_Pertamina_CoA_2026.png',
      timestamp: 'Hari ini, 11:20 WIB',
      isRead: true
    }
  ],
  'conv-cipta-solusi': [
    {
      id: 'msg-cs-1',
      conversationId: 'conv-cipta-solusi',
      senderId: 'USR-INT-01',
      senderName: 'Muhamad Rizki (Procurement Pancaran)',
      senderRole: 'INTERNAL',
      message: 'Siang Tim PT Cipta Solusi, untuk agenda overhaul 4 unit forklift Depo Marunda, apakah seluruh mekanik yang ditugaskan telah memiliki sertifikat K3 dan BNSP?',
      timestamp: 'Kemarin, 14:20 WIB',
      isRead: true
    },
    {
      id: 'msg-cs-2',
      conversationId: 'conv-cipta-solusi',
      senderId: 'VEND-06',
      senderName: 'Ir. Wahyu Pratama (Lead Engineer Cipta Solusi)',
      senderRole: 'EXTERNAL',
      message: 'Tim teknisi bersertifikasi BNSP siap standby di Depo Marunda mulai Kamis pukul 08:00 WIB lengkap dengan APD standar industri migas & logistik serta tool kalibrasi hidrolik.',
      timestamp: 'Kemarin, 15:10 WIB',
      isRead: true
    }
  ],
  'conv-global-gps': [
    {
      id: 'msg-gg-1',
      conversationId: 'conv-global-gps',
      senderId: 'USR-INT-01',
      senderName: 'Muhamad Rizki (Procurement Pancaran)',
      senderRole: 'INTERNAL',
      message: 'Pagi PT Global GPS, mohon info apakah sensor level tangki solar kompatibel dengan model tangki truk Volvo FMX dan Hino 500 kami?',
      timestamp: 'Kemarin, 11:30 WIB',
      isRead: true
    },
    {
      id: 'msg-gg-2',
      conversationId: 'conv-global-gps',
      senderId: 'VEND-07',
      senderName: 'Tech Lead PT Global GPS Telematika',
      senderRole: 'EXTERNAL',
      message: 'Sangat kompatibel Pak. Probe sensor ultrasonic kami menggunakan koneksi RS485 digital dan akurasi sensor mencapai 99.2%. Dokumentasi Webhook API dan sample payload telemetry solar sudah kami kirimkan via email.',
      timestamp: 'Kemarin, 13:45 WIB',
      isRead: true
    }
  ]
};

// Preset proof images for Winner Selection justification
export const PRESET_EVIDENCE_PROOFS = [
  {
    id: 'proof-stock-empty',
    title: 'Chat Konfirmasi Juara 1: Stok Habis / Kosong 2 Bulan',
    vendorName: 'PT Daya Sel Elektrika (Juara 1 Asli)',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    description: 'Tangkapan layar chat resmi dari Sales Manager vendor Juara 1 yang menyatakan stok kosong pabrik dan tidak bisa supply sesuai jadwal operasional.',
    reasonNote: 'Vendor Juara 1 (PT Daya Sel Elektrika) mengonfirmasi via chat dan surat resmi bahwa stok habis total di gudang pabrik dan baru restock 2 bulan lagi. Pengadaan dialihkan ke Juara 2 demi menjaga kelancaran operasional armada logistik.'
  },
  {
    id: 'proof-lead-time',
    title: 'Bukti Chat: Lead Time Melebihi Kebutuhan Urgent',
    vendorName: 'PT Supplier Perdana',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    description: 'Chat negosiasi tanggal pengiriman di mana vendor Juara 1 tidak menyanggupi batas waktu darurat 3 hari.',
    reasonNote: 'Vendor Juara 1 membutuhkan waktu pengiriman 30 hari kalender, sedangkan kebutuhan armada mendesak dalam 3 hari kerja. Pemenang dialihkan ke Juara 2 yang ready stock di depo lokal.'
  },
  {
    id: 'proof-spec-reject',
    title: 'Bukti Teknis: Garansi & Spesifikasi Tidak Memenuhi Uji',
    vendorName: 'CV Multi Niaga Teknika',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    description: 'Berita acara pengujian teknis bahwa sampel produk Juara 1 tidak memiliki garansi resmi pabrikan Indonesia.',
    reasonNote: 'Hasil evaluasi teknis dan verifikasi sertifikat distributor resmi menyatakan bahwa penawaran Juara 1 tidak mencakup garansi resmi pabrikan yang diwajibkan dalam Term of Reference.'
  }
];

