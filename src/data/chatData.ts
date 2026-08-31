import { ChatConversation, ChatMessage } from '../types';

export interface EvidenceProofItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  reasonNote: string;
}

export const INITIAL_CHAT_CONVERSATIONS: ChatConversation[] = [];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {};

export const PRESET_EVIDENCE_PROOFS: EvidenceProofItem[] = [];
