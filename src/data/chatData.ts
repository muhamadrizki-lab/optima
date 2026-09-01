import { ChatConversation, ChatMessage } from '../types';

export interface EvidenceProofItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  reasonNote: string;
}

export const INITIAL_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-tesvendor',
    vendorName: 'PT Tesvendor',
    vendorEmail: 'sales@tesvendor.co.id',
    tenderId: 'REQ-001',
    tenderTitle: 'Pengadaan Ban Truk Heavy Duty 11R22.5',
    lastMessage: 'Halo Tim Procurement Pancaran, penawaran resmi telah kami kirimkan.',
    lastTimestamp: '2026-08-31, 09:00 WIB',
    isOnline: true,
    unreadCount: 0
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-tesvendor': [
    {
      id: 'm1',
      conversationId: 'conv-tesvendor',
      senderId: 'USR-EXT-TES',
      senderName: 'PT Tesvendor',
      senderRole: 'EXTERNAL',
      message: 'Halo Tim Procurement Pancaran, penawaran resmi telah kami kirimkan.',
      timestamp: '2026-08-31, 09:00 WIB'
    }
  ]
};

export const PRESET_EVIDENCE_PROOFS: EvidenceProofItem[] = [
  {
    id: 'proof-1',
    title: 'Sertifikat Keaslian Distributor & SNI',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    description: 'Sertifikat garansi resmi dan bukti keaslian barang.',
    reasonNote: 'Melampirkan sertifikat keaslian produk pabrikan.'
  },
  {
    id: 'proof-2',
    title: 'Dokumentasi Ekspedisi / Surat Jalan',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    description: 'Bukti pengiriman dan resi fisik armada pengangkut.',
    reasonNote: 'Bukti fisik surat jalan & pengiriman ke lokasi depo.'
  }
];

