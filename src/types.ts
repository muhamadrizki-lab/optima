export type Role = 'INTERNAL' | 'EXTERNAL';
export type VendorType = 'SUPPLIER' | 'VENDOR_JASA';

export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  phone?: string;
  role: Role;
  vendorType?: VendorType;
  isInternalEmployee?: boolean;
}

export interface SpecTableItem {
  no: number;
  nama: string;
  brand: string;
  qty: number;
  uom: string;
  ket: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  category?: string;
  quantity?: number;
  unit?: string;
  oe?: number;
  description: string;
  datePosted: string;
  deadline?: string;
  status: 'OPEN' | 'CLOSED';
  imageUrl?: string;
  warranty?: string;
  specifications?: string[];
  specTable?: SpecTableItem[];
  termsAndConditions?: string;
  topPayment?: string;
  locationDelivery?: string;
  taxTerm?: string;
  tnc?: string;
  top?: string;
  delivery?: string;
  tax?: string;
  ownerEstimate?: number;
  bidsCount?: number;
  lowestBid?: number;
  highestBid?: number;
  winnerVendorName?: string;
  winnerVendorId?: string;
  winnerAmount?: number;
  winnerDate?: string;
  winnerNotes?: string;
  winnerPaymentMethod?: string;
  winnerRank?: number;
  winnerOriginalRank1VendorName?: string;
  winnerOriginalRank1Amount?: number;
  winnerReasonCategory?: 'STOCK_KOSONG' | 'LEAD_TIME' | 'SPESIFIKASI_TIDAK_LOLOS' | 'TOP_TIDAK_SESUAI' | 'LAINNYA';
  winnerEvidencePhoto?: string;
  winnerEvidenceDescription?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'INTERNAL' | 'EXTERNAL';
  senderAvatar?: string;
  message: string;
  attachmentUrl?: string;
  attachmentType?: 'IMAGE' | 'DOCUMENT';
  attachmentName?: string;
  timestamp: string;
  isRead?: boolean;
}

export interface ChatConversation {
  id: string;
  vendorId?: string;
  vendorName: string;
  vendorCompany?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  tenderId?: string;
  tenderTitle?: string;
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface UserActivityLog {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  companyName?: string;
  role: Role;
  vendorType?: string;
  actionType: 'LOGIN' | 'BID_SUBMIT' | 'WINNER_ASSIGNED' | 'CHAT_SENT' | 'CATALOG_UPDATE' | 'PO_GENERATED' | 'DOWNLOAD_REPORT';
  actionTitle: string;
  actionDetail: string;
  timestamp: string;
  date: string;
  ipAddress?: string;
  deviceInfo?: string;
  status: 'SUCCESS' | 'WARNING' | 'INFO';
  evidencePhoto?: string;
  targetId?: string;
}

export interface Bid {
  id: string;
  reqId: string;
  reqTitle: string;
  offeredProduct?: string;
  vendorId?: string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  vendorCompany?: string;
  category?: ItemCategory;
  amount: number;
  unitPrice?: number;
  quantity?: number;
  unit?: string;
  validityDays?: string;
  warranty?: string;
  tncNotes?: string;
  paymentMethod?: string;
  downPayment?: number;
  deliveryOption?: string;
  deliveryLocation?: string;
  taxOption?: string;
  estimatedLeadTime?: string;
  availabilityType?: 'READY' | 'INDENT';
  indentDuration?: string;
  dateSubmitted: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED' | 'NEGOTIATION';
  internalNotes?: string;
  documents?: { name: string; size: string; type: string }[];
}

export interface AccessDetail {
  id: string;
  name: string;
  companyName?: string;
  phone?: string;
  email: string;
  role: Role;
  vendorType?: VendorType;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

export type ItemCategory = 'BAN' | 'AKI' | 'SPARE_PART' | 'JASA' | 'IT' | 'LAINNYA';

export interface VendorCatalogItem {
  id: string;
  vendorId?: string;
  vendorName: string;
  companyName: string;
  vendorPhone: string;
  vendorEmail: string;
  vendorType: VendorType;
  category: ItemCategory;
  categoryLabel: string;
  title: string;
  partNumber?: string;
  brand: string;
  price: number;
  unit: string;
  stock: number;
  minOrder?: number;
  condition: 'BARU' | 'REKONDISI' | 'LAYANAN';
  availabilityType?: 'READY' | 'PREORDER' | 'INDENT';
  top?: string;
  description: string;
  specifications: string[];
  specTable?: SpecTableItem[];
  imageUrl: string;
  warranty?: string;
  deliveryInfo?: string;
  location?: string;
  lastUpdated: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'PRE_ORDER';
  indentDuration?: string;
}
