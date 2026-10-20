export type QuoteStatus = 'PENDING' | 'ANSWERED' | 'REJECTED';

export interface Quote {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  specifications?: string;
  status: QuoteStatus;
  proposedPrice?: number;
  staffResponse?: string;
  dateCreation: string;
  customerName?: string;
  customerEmail?: string;
}
export interface CreateQuoteRequest {
  productId: number;
  quantity: number;
  specifications?: string;
}
export interface RespondQuoteRequest {
  status: 'ANSWERED' | 'REJECTED';
  proposedPrice?: number;
  staffResponse?: string;
}
