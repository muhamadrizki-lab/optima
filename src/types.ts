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

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  datePosted: string;
  status: 'OPEN' | 'CLOSED';
  imageUrl?: string;
  specifications?: string[];
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
}

export interface Bid {
  id: string;
  reqId: string;
  reqTitle: string;
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
  imageUrl: string;
  warranty?: string;
  deliveryInfo?: string;
  location?: string;
  lastUpdated: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'PRE_ORDER';
}
