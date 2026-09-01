import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CheckCheck, 
  Sparkles,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  AlertCircle,
  RotateCcw,
  Bot,
  UserCheck,
  Truck,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ChatConversation, ChatMessage, User } from '../types';
import { INITIAL_CHAT_CONVERSATIONS, INITIAL_CHAT_MESSAGES, PRESET_EVIDENCE_PROOFS } from '../data/chatData';
import { logUserActivity } from '../data/activityLogData';
import ImageLightboxModal from './ImageLightboxModal';

interface VendorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  targetVendorName?: string | null;
  targetTenderId?: string | null;
  onSelectProofForWinner?: (proofUrl: string, reasonText: string) => void;
}

export default function VendorChatModal({
  isOpen,
  onClose,
  currentUser,
  targetVendorName,
  targetTenderId,
  onSelectProofForWinner
}: VendorChatModalProps) {
  // Load and merge conversations with initial presets
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('optima_chat_conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const merged = [...parsed];
          for (const init of INITIAL_CHAT_CONVERSATIONS) {
            if (!existingIds.has(init.id)) {
              merged.push(init);
            }
          }
          return merged;
        }
      }
    } catch (e) {}
    return INITIAL_CHAT_CONVERSATIONS;
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('optima_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          return { ...INITIAL_CHAT_MESSAGES, ...parsed };
        }
      }
    } catch (e) {}
    return INITIAL_CHAT_MESSAGES;
  });

  const [activeConvId, setActiveConvId] = useState<string>('conv-daya-sel');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'BARANG' | 'JASA' | 'WINNER'>('ALL');
  const [inputMessage, setInputMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedName, setAttachedName] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [isSimulatingReply, setIsSimulatingReply] = useState(false);

  // New Chat modal state
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatVendorSearch, setNewChatVendorSearch] = useState('');
  const [selectedVendorObj, setSelectedVendorObj] = useState<{ name: string; email: string; phone?: string; category?: string } | null>(null);
  const [customVendorNameInput, setCustomVendorNameInput] = useState('');
  const [customVendorEmailInput, setCustomVendorEmailInput] = useState('');
  const [selectedTenderIdInput, setSelectedTenderIdInput] = useState('REQ-001');
  const [initialGreetingInput, setInitialGreetingInput] = useState('');
  
  // Custom sender role toggle so users can simulate typing as Internal or External Vendor
  const [senderRoleOverride, setSenderRoleOverride] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isInternal = currentUser?.role === 'INTERNAL';

  // Master vendor dictionary for starting new chats
  const PRESET_VENDORS_FOR_CHAT = [
    { name: 'PT Tesvendor', email: 'sales@tesvendor.co.id', category: 'General Logistics & Sparepart', phone: '0812-3344-5566' }
  ];

  const PRESET_TENDERS_FOR_CHAT = [
    { id: 'REQ-001', title: 'REQ-001: Pengadaan Ban Truk Heavy Duty 11R22.5' },
    { id: 'REQ-002', title: 'REQ-002: Pengadaan Aki Heavy Duty GS Astra N100' },
    { id: 'REQ-003', title: 'REQ-003: Pengadaan Suku Cadang Sistem Pengereman & Kopling Hino 500' },
    { id: 'REQ-004', title: 'REQ-004: Pengadaan Pelumas & Oli Mesin Heavy Duty SAE 15W-40' },
    { id: 'REQ-005', title: 'REQ-005: Pengadaan Perangkat Laptop Workstation IT & Scanner Barcode' },
    { id: '', title: 'Diskusi Umum / Tanpa Referensi Tender Specific' }
  ];

  const handleCreateNewConversation = (
    vendorName: string,
    vendorEmail: string,
    tenderId?: string,
    greetingMessage?: string
  ) => {
    if (!vendorName.trim()) return;

    const matchedTender = PRESET_TENDERS_FOR_CHAT.find(t => t.id === tenderId);
    const tenderTitle = matchedTender?.title ? matchedTender.title.split(': ')[1] || matchedTender.title : (tenderId ? `Tender ${tenderId}` : 'Diskusi Pengadaan Logistik');

    // Check if conversation already exists for this vendor
    const existingIndex = conversations.findIndex(c => 
      c.vendorName.toLowerCase() === vendorName.toLowerCase() ||
      (vendorEmail && c.vendorEmail.toLowerCase() === vendorEmail.toLowerCase())
    );

    if (existingIndex !== -1) {
      const existingConv = conversations[existingIndex];
      setActiveConvId(existingConv.id);
      setIsNewChatModalOpen(false);

      if (greetingMessage && greetingMessage.trim()) {
        handleSendMessage(greetingMessage, 'INTERNAL');
      }
      return;
    }

    const newConvId = `conv-new-${Date.now()}`;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestampStr = `Hari ini, ${hours}:${minutes} WIB`;

    const newConv: ChatConversation = {
      id: newConvId,
      vendorName: vendorName.trim(),
      vendorEmail: vendorEmail.trim() || `${vendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}@vendor.co.id`,
      tenderId: tenderId || undefined,
      tenderTitle: tenderTitle,
      lastMessage: greetingMessage?.trim() || 'Percakapan baru dimulai.',
      lastTimestamp: timestampStr,
      isOnline: true,
      unreadCount: 0
    };

    const updatedConvs = [newConv, ...conversations];
    setConversations(updatedConvs);

    const initialMsgs: ChatMessage[] = greetingMessage?.trim() ? [
      {
        id: `msg-${Date.now()}`,
        conversationId: newConvId,
        senderId: 'USR-INT',
        senderName: currentUser?.name || 'Muhamad Rizki (Procurement Pancaran)',
        senderRole: 'INTERNAL',
        message: greetingMessage.trim(),
        timestamp: timestampStr,
        isRead: true
      }
    ] : [
      {
        id: `msg-${Date.now()}`,
        conversationId: newConvId,
        senderId: 'SYSTEM',
        senderName: 'Sistem Informasi Pancaran',
        senderRole: 'INTERNAL',
        message: `Percakapan baru dengan ${vendorName} telah dibuat. Silakan ajukan pertanyaan atau koordinasi tender.`,
        timestamp: timestampStr,
        isRead: true
      }
    ];

    const updatedMessagesMap = {
      ...messagesMap,
      [newConvId]: initialMsgs
    };

    setMessagesMap(updatedMessagesMap);
    setActiveConvId(newConvId);
    setIsNewChatModalOpen(false);

    // Reset form states
    setSelectedVendorObj(null);
    setCustomVendorNameInput('');
    setCustomVendorEmailInput('');
    setInitialGreetingInput('');

    try {
      localStorage.setItem('optima_chat_conversations', JSON.stringify(updatedConvs));
      localStorage.setItem('optima_chat_messages', JSON.stringify(updatedMessagesMap));
    } catch (e) {
      console.error(e);
    }
  };

  // Set default sender role based on logged in user
  useEffect(() => {
    if (currentUser?.role === 'EXTERNAL') {
      setSenderRoleOverride('EXTERNAL');
    } else {
      setSenderRoleOverride('INTERNAL');
    }
  }, [currentUser]);

  // Synchronize when targetVendorName or targetTenderId is passed
  useEffect(() => {
    if (!isOpen) return;

    if (targetVendorName) {
      // Find existing conversation matching target vendor
      const match = conversations.find(c => 
        c.vendorName.toLowerCase().includes(targetVendorName.toLowerCase()) ||
        (targetTenderId && c.tenderId === targetTenderId)
      );

      if (match) {
        setActiveConvId(match.id);
      } else {
        // Create new conversation on the fly
        const newId = `conv-vendor-${Date.now()}`;
        const newConv: ChatConversation = {
          id: newId,
          vendorName: targetVendorName,
          vendorCompany: targetVendorName,
          vendorEmail: 'sales@rekanan-pancaran.com',
          vendorPhone: '0812-9988-7700',
          tenderId: targetTenderId || 'REQ-UMUM',
          tenderTitle: targetTenderId ? `Tender Terkait ${targetTenderId}` : 'Konsultasi Pengadaan',
          lastMessage: 'Memulai percakapan baru dengan vendor...',
          lastTimestamp: 'Baru saja',
          unreadCount: 0,
          isOnline: true
        };
        const updated = [newConv, ...conversations];
        setConversations(updated);
        setActiveConvId(newId);
        try {
          localStorage.setItem('optima_chat_conversations', JSON.stringify(updated));
        } catch (e) {}
      }
    }
  }, [isOpen, targetVendorName, targetTenderId]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, messagesMap, isSimulatingReply]);

  if (!isOpen) return null;

  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeMessages = activeConversation ? (messagesMap[activeConversation.id] || []) : [];

  // Reset to default initial chats
  const handleResetDefaultChats = () => {
    if (confirm('Kembalikan seluruh daftar chat & pesan ke contoh dummy default?')) {
      setConversations(INITIAL_CHAT_CONVERSATIONS);
      setMessagesMap(INITIAL_CHAT_MESSAGES);
      if (INITIAL_CHAT_CONVERSATIONS.length > 0) {
        setActiveConvId(INITIAL_CHAT_CONVERSATIONS[0].id);
      }
      try {
        localStorage.setItem('optima_chat_conversations', JSON.stringify(INITIAL_CHAT_CONVERSATIONS));
        localStorage.setItem('optima_chat_messages', JSON.stringify(INITIAL_CHAT_MESSAGES));
      } catch (e) {}
    }
  };

  const handleSendMessage = (customMsg?: string, customRole?: 'INTERNAL' | 'EXTERNAL', customAttachment?: { url: string; name: string }) => {
    if (!activeConversation) return;

    const textToSend = customMsg !== undefined ? customMsg : inputMessage;
    const roleToSend = customRole || senderRoleOverride;
    const photoUrl = customAttachment?.url || attachedImage || undefined;
    const photoName = customAttachment?.name || attachedName || (photoUrl ? 'Bukti_Lampiran_Chat.png' : undefined);

    if (!textToSend.trim() && !photoUrl) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestampStr = `Hari ini, ${hours}:${minutes} WIB`;

    const senderName = roleToSend === 'INTERNAL' 
      ? (currentUser?.name || 'Muhamad Rizki (Procurement Pancaran)')
      : `Sales Representative (${activeConversation.vendorName || 'Vendor'})`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      conversationId: activeConversation.id,
      senderId: roleToSend === 'INTERNAL' ? 'USR-INT' : (activeConversation.vendorId || 'USR-EXT'),
      senderName: senderName,
      senderRole: roleToSend,
      message: textToSend.trim(),
      attachmentUrl: photoUrl,
      attachmentType: photoUrl ? 'IMAGE' : undefined,
      attachmentName: photoName,
      timestamp: timestampStr,
      isRead: true
    };

    const updatedMessages = [...activeMessages, newMsg];
    const newMessagesMap = {
      ...messagesMap,
      [activeConversation.id]: updatedMessages
    };

    setMessagesMap(newMessagesMap);
    if (customMsg === undefined) {
      setInputMessage('');
      setAttachedImage(null);
      setAttachedName(null);
      setShowPresetMenu(false);
      setShowQuickTemplates(false);
    }

    // Update conversation last message
    const updatedConvs = conversations.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          lastMessage: newMsg.message || (newMsg.attachmentUrl ? '📷 Mengirim lampiran foto' : ''),
          lastTimestamp: timestampStr
        };
      }
      return c;
    });

    setConversations(updatedConvs);

    // Persist to localStorage
    try {
      localStorage.setItem('optima_chat_messages', JSON.stringify(newMessagesMap));
      localStorage.setItem('optima_chat_conversations', JSON.stringify(updatedConvs));
    } catch (e) {
      console.error(e);
    }

    // Log Activity
    logUserActivity({
      userName: senderName,
      userEmail: roleToSend === 'INTERNAL' ? 'procurement@pancaran-logistic.id' : activeConversation.vendorEmail || 'vendor@pancaran.com',
      companyName: roleToSend === 'INTERNAL' ? 'PT Pancaran Darat Transport' : activeConversation.vendorName || 'Rekanan Vendor',
      role: roleToSend,
      actionType: 'CHAT_SENT',
      actionTitle: `Pesan Chat [${roleToSend}]: ${activeConversation.vendorName || 'Vendor'}`,
      actionDetail: `Terkait ${activeConversation.tenderId || 'Pengadaan'}: "${newMsg.message.slice(0, 70)}..."`,
      status: 'SUCCESS',
      targetId: activeConversation.tenderId,
      evidencePhoto: newMsg.attachmentUrl
    });
  };

  // Simulate instant realistic vendor reply
  const handleSimulateVendorReply = () => {
    if (!activeConversation) return;

    setIsSimulatingReply(true);

    setTimeout(() => {
      setIsSimulatingReply(false);
      
      const vendorRepliesByTender: Record<string, { msg: string; photo?: { url: string; name: string } }> = {
        'conv-daya-sel': {
          msg: 'Terima kasih atas pengertiannya Pak Rizki. Terlampir memo resmi dari pabrik GS Astra terkait kendala pasokan aki 100Ah N100.',
          photo: {
            url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
            name: 'Memo_Resmi_Keterbatasan_Stok_Pabrik.png'
          }
        },
        'conv-mandiri-ban': {
          msg: 'Siap Pak Rizki, armada ekspedisi kami sudah bergerak menuju Pool Cakung membawa 50 unit Ban Radial Bridgestone 11R22.5 beserta faktur resmi dan kartu garansi 12 bulan.',
          photo: {
            url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
            name: 'Surat_Jalan_Ekspedisi_Ban_Pancaran.png'
          }
        },
        'conv-sumber-komputer': {
          msg: 'Baik Pak Rizki, 50 unit Lenovo ThinkPad P14s sudah kami alokasikan di gudang transit Roxy dan siap kami kirimkan ke Head Office Pancaran.',
          photo: {
            url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
            name: 'Sertifikat_Garansi_Lenovo_Indonesia.png'
          }
        },
        'conv-berkah-auto': {
          msg: 'Baik Pak, 20 drum Pertamina Meditran SX 15W-40 siap kami kirim dengan segel barcode utuh dan sertifikat keaslian resmi.',
          photo: {
            url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
            name: 'Certificate_of_Analysis_Pertamina_2026.png'
          }
        },
        'conv-cipta-solusi': {
          msg: 'Siap Pak, tim teknisi bersertifikasi BNSP kami siap standby di Depo Marunda tepat pukul 08:00 WIB untuk pekerjaan overhaul forklift.',
        },
        'conv-global-gps': {
          msg: 'Dokumentasi Webhook API dan API Key sandbox sudah kami aktifkan untuk tim IT Pancaran Group.',
        },
        'conv-mitra-vendor': {
          msg: 'Terima kasih atas petunjuknya Pak Rizki, seluruh dokumen sertifikat SNI dan legalitas perusahaan telah kami upload di portal.',
        }
      };

      const defaultReply = vendorRepliesByTender[activeConversation.id] || {
        msg: `Selamat siang Pak Rizki, penawaran harga dan komitmen pengiriman kami telah siap disesuaikan dengan Term of Reference PT Pancaran Darat Transport.`
      };

      handleSendMessage(defaultReply.msg, 'EXTERNAL', defaultReply.photo);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAttachedImage(result);
      setAttachedName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetProof = (proof: typeof PRESET_EVIDENCE_PROOFS[0]) => {
    if (!proof) return;
    setAttachedImage(proof.imageUrl);
    setAttachedName(proof.title);
    setInputMessage(prev => prev ? prev : `Lampiran Bukti Resmi: ${proof.reasonNote}`);
    setShowPresetMenu(false);
  };

  const filteredConversations = conversations.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      (c.vendorName || '').toLowerCase().includes(q) ||
      (c.tenderId && c.tenderId.toLowerCase().includes(q)) ||
      (c.tenderTitle && c.tenderTitle.toLowerCase().includes(q)) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q));

    if (!matchSearch) return false;

    if (categoryFilter === 'BARANG') {
      return c.tenderTitle.toLowerCase().includes('aki') || c.tenderTitle.toLowerCase().includes('ban') || c.tenderTitle.toLowerCase().includes('laptop') || c.tenderTitle.toLowerCase().includes('oli');
    }
    if (categoryFilter === 'JASA') {
      return c.tenderTitle.toLowerCase().includes('jasa') || c.tenderTitle.toLowerCase().includes('maintenance') || c.tenderTitle.toLowerCase().includes('sensor');
    }
    if (categoryFilter === 'WINNER') {
      return c.tenderId === 'REQ-003' || c.tenderId === 'REQ-004' || c.tenderId === 'REQ-001';
    }

    return true;
  });

  const quickTemplates = senderRoleOverride === 'INTERNAL' ? [
    'Mohon konfirmasi ketersediaan stok fisik di gudang untuk kuantitas yang diajukan.',
    'Apakah spesifikasi produk telah memenuhi syarat garansi resmi distributor Indonesia?',
    'Mohon estimasi lead time pengiriman sampai ke lokasi depo Pancaran Cakung.',
    'PO resmi telah diterbitkan, mohon koordinasi BAST dengan tim logistik kami.'
  ] : [
    'Semua unit barang ready stock di gudang kami dan siap kirim 1-2 hari kerja.',
    'Produk dilengkapi garansi resmi pabrikan selama 12 bulan penuh.',
    'Mohon konfirmasi apakah Term of Payment (TOP) Net 30 Hari dapat disetujui?',
    'Surat penawaran harga resmi dan sertifikat keagenan telah kami lampirkan.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-2 sm:p-4 lg:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-5xl h-[92vh] max-h-[880px] flex flex-col overflow-hidden animate-scaleUp">
        
        {/* TOP MODAL HEADER */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-sm text-white flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  Pusat Komunikasi
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Direct Chat
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title="Tutup Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN CHAT BODY: 2 COLUMNS */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR: CONVERSATION LIST */}
          <div className="w-72 sm:w-80 lg:w-88 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0">
            {/* Search Bar & New Chat Button */}
            <div className="p-3 border-b border-slate-200/80 bg-white space-y-2">
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Mulai Chat Baru / Pilih Vendor</span>
              </button>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari vendor, nomor tender..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px] font-bold">
                <button
                  onClick={() => setCategoryFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({conversations.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('BARANG')}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === 'BARANG' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Sparepart & Barang
                </button>
                <button
                  onClick={() => setCategoryFilter('JASA')}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === 'JASA' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  Jasa & IoT
                </button>
              </div>
            </div>

            {/* List of Contacts */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 p-2 space-y-1">
              {filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                const msgs = messagesMap[conv.id] || [];
                const lastMsg = msgs[msgs.length - 1] || { message: conv.lastMessage, timestamp: conv.lastTimestamp };

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-0.5' 
                        : 'bg-white hover:bg-slate-100/80 text-slate-800 border border-slate-200/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {conv.vendorName.charAt(0)}
                      </div>
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`font-bold text-xs truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                          {conv.vendorName}
                        </span>
                        <span className={`text-[10px] whitespace-nowrap ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                          {lastMsg.timestamp?.split(',')[1] || lastMsg.timestamp || '09:15 WIB'}
                        </span>
                      </div>

                      {conv.tenderId && (
                        <div className="mb-1">
                          <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {conv.tenderId}
                          </span>
                        </div>
                      )}

                      <p className={`text-[11px] truncate leading-tight ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {lastMsg.message || '📷 Lampiran Foto Bukti'}
                      </p>
                    </div>
                  </button>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="p-6 text-center space-y-3">
                  <p className="text-slate-400 text-xs">
                    Tidak ada percakapan vendor ditemukan.
                  </p>
                  <button
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Mulai Chat Baru</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT MAIN CHAT AREA */}
          <div className="flex-1 flex flex-col bg-slate-100/50">
            
            {!activeConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Belum Ada Percakapan Dipilih</h3>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Pilih salah satu percakapan vendor di sebelah kiri atau pilih akun vendor untuk memulai chat baru.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Pilih Akun Vendor & Mulai Chat Baru</span>
                  </button>
                  <button
                    onClick={handleResetDefaultChats}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Muat Percakapan Default</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ACTIVE CHAT HEADER */}
                <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {(activeConversation.vendorName || 'V').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-sm text-slate-900 truncate">
                          {activeConversation.vendorName || 'Vendor'}
                        </h3>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5 truncate">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {activeConversation.vendorPhone || '0812-8899-2341'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {activeConversation.vendorEmail || 'sales@vendor.co.id'}
                        </span>
                        {activeConversation.tenderId && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-slate-700">Tender: {activeConversation.tenderId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CHAT MESSAGES SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {activeMessages.map((msg) => {
                    const isInternalMsg = msg.senderRole === 'INTERNAL';
                    // Decide alignment based on who is viewing
                    const isRightSide = isInternal ? isInternalMsg : !isInternalMsg;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isRightSide ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[11px] font-bold text-slate-700">
                            {msg.senderName}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                            msg.senderRole === 'INTERNAL' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {msg.senderRole === 'INTERNAL' ? 'Procurement Pancaran' : 'Rekanan Vendor'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {msg.timestamp}
                          </span>
                        </div>

                        <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-xs ${
                          isRightSide 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                        }`}>
                          {/* Message text */}
                          {msg.message && (
                            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          )}

                          {/* Attached Image / Proof */}
                          {msg.attachmentUrl && (
                            <div className="mt-2.5 space-y-2">
                              <div 
                                onClick={() => {
                                  setLightboxImage(msg.attachmentUrl || null);
                                  setLightboxTitle(msg.attachmentName || 'Bukti Lampiran Chat');
                                }}
                                className="relative rounded-xl overflow-hidden border border-black/10 cursor-pointer group bg-black/5"
                              >
                                <img 
                                  src={msg.attachmentUrl} 
                                  alt={msg.attachmentName || 'Lampiran'} 
                                  className="max-h-48 w-full object-cover rounded-xl group-hover:scale-102 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                  <span>🔎 Klik untuk Perbesar</span>
                                </div>
                              </div>

                              <div className={`flex items-center justify-between text-[11px] ${isRightSide ? 'text-blue-100' : 'text-slate-500'}`}>
                                <span className="font-semibold truncate pr-2">
                                  📎 {msg.attachmentName || 'Dokumen_Lampiran.png'}
                                </span>
                                {onSelectProofForWinner && (
                                  <button
                                    onClick={() => onSelectProofForWinner(msg.attachmentUrl!, msg.message || 'Bukti konfirmasi chat vendor')}
                                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[10px] transition-colors shrink-0 shadow-xs flex items-center gap-1 cursor-pointer"
                                    title="Gunakan foto ini sebagai Berita Acara Penetapan Pemenang"
                                  >
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Gunakan sbg Bukti Pemenang</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator simulation */}
                  {isSimulatingReply && (
                    <div className="flex items-start gap-2 animate-fadeIn">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                        {(activeConversation.vendorName || 'V').charAt(0)}
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                        <span className="text-[11px] text-slate-500 ml-1.5">{activeConversation.vendorName || 'Vendor'} sedang mengetik balasan...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ATTACHMENT PREVIEW BEFORE SENDING */}
                {attachedImage && (
                  <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={attachedImage} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-amber-300" />
                      <div>
                        <span className="text-xs font-bold text-amber-900 block">Lampiran Siap Dikirim:</span>
                        <span className="text-[11px] text-amber-700 truncate max-w-xs block">{attachedName}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setAttachedImage(null);
                        setAttachedName(null);
                      }}
                      className="p-1.5 text-amber-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* CHAT INPUT FORM */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-end gap-2"
                  >
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                    />

                    {/* Upload Photo Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl transition-colors cursor-pointer shrink-0"
                      title="Unggah Foto / Tangkapan Layar Chat dari Komputer"
                    >
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </button>

                    {/* Message Text Input */}
                    <div className="flex-1 min-w-0">
                      <textarea
                        rows={1}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={
                          senderRoleOverride === 'INTERNAL'
                            ? "Tulis pesan negosiasi internal, konfirmasi stok, atau permintaan sertifikat..."
                            : `Tulis tanggapan atau konfirmasi penawaran sebagai ${activeConversation.vendorName || 'Vendor'}...`
                        }
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none max-h-28 transition-all"
                      />
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() && !attachedImage}
                      className={`p-3 text-white rounded-2xl transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-40 ${
                        senderRoleOverride === 'INTERNAL' 
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' 
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                      }`}
                      title="Kirim Pesan"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}

          </div>
        </div>

      </div>

      {/* MODAL PILIH NAMA VENDOR UNTUK MULAI CHAT BARU */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
            {/* Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Mulai Chat Baru</h3>
                  <p className="text-[11px] text-slate-400">Pilih nama vendor untuk membuka ruang obrolan</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-slate-800">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Pilih atau Ketik Nama Vendor:</span>
                  {(selectedVendorObj || customVendorNameInput.trim()) && (
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      ✓ Terpilih: {selectedVendorObj ? selectedVendorObj.name : customVendorNameInput.trim()}
                    </span>
                  )}
                </label>

                {/* Search & Custom Input Box */}
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newChatVendorSearch}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewChatVendorSearch(val);
                      setCustomVendorNameInput(val);
                      // Check if matches an existing vendor
                      const found = PRESET_VENDORS_FOR_CHAT.find(v => v.name.toLowerCase() === val.trim().toLowerCase());
                      if (found) {
                        setSelectedVendorObj(found);
                      } else {
                        setSelectedVendorObj(null);
                      }
                    }}
                    placeholder="Cari atau ketik nama PT vendor..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Registered Vendor List */}
                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-slate-50/50">
                  {/* Custom Name Option if typed name is not in preset */}
                  {newChatVendorSearch.trim() && !PRESET_VENDORS_FOR_CHAT.some(v => v.name.toLowerCase() === newChatVendorSearch.trim().toLowerCase()) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVendorObj(null);
                        setCustomVendorNameInput(newChatVendorSearch.trim());
                      }}
                      className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                        !selectedVendorObj && customVendorNameInput.trim() === newChatVendorSearch.trim()
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-blue-50/50 hover:bg-blue-100/70 text-blue-900 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 shrink-0" />
                        <span className="text-xs">Gunakan nama vendor baru: <strong>"{newChatVendorSearch.trim()}"</strong></span>
                      </div>
                      <CheckCheck className="w-4 h-4 shrink-0" />
                    </button>
                  )}

                  {/* Filtered Preset Vendors */}
                  {PRESET_VENDORS_FOR_CHAT
                    .filter(v => 
                      v.name.toLowerCase().includes(newChatVendorSearch.toLowerCase()) || 
                      v.category.toLowerCase().includes(newChatVendorSearch.toLowerCase())
                    )
                    .map((v, idx) => {
                      const isSelected = selectedVendorObj?.name === v.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedVendorObj(v);
                            setCustomVendorNameInput('');
                            setNewChatVendorSearch(v.name);
                          }}
                          className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-blue-50/80 text-slate-800'
                          }`}
                        >
                          <div>
                            <p className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {v.name}
                            </p>
                            <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                              <span className="font-medium">{v.category}</span>
                            </p>
                          </div>
                          {isSelected && <CheckCheck className="w-4 h-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalName = selectedVendorObj ? selectedVendorObj.name : (customVendorNameInput.trim() || newChatVendorSearch.trim());
                  const finalEmail = selectedVendorObj ? selectedVendorObj.email : `${finalName.toLowerCase().replace(/[^a-z0-9]/g, '')}@vendor.co.id`;
                  if (!finalName) {
                    alert('Silakan pilih atau ketik nama vendor terlebih dahulu.');
                    return;
                  }
                  handleCreateNewConversation(
                    finalName,
                    finalEmail,
                    'REQ-UMUM',
                    ''
                  );
                }}
                disabled={!selectedVendorObj && !customVendorNameInput.trim() && !newChatVendorSearch.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mulai Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        imageUrl={lightboxImage}
        title={lightboxTitle}
      />
    </div>
  );
}
