import { OrderStatus } from '../models/order.model';
import { QuoteStatus } from '../models/quote.model';

export interface StatusStyle {
  label: string;
  badge: string;
}

export const ORDER_STATUS: Record<OrderStatus, StatusStyle> = {
  PENDING: { label: 'En attente', badge: 'badge-neutral' },
  CONFIRMED: { label: 'Confirmée', badge: 'badge-info' },
  IN_PRODUCTION: { label: 'En production', badge: 'badge-warning' },
  SHIPPED: { label: 'Expédiée', badge: 'badge-brand' },
  DELIVERED: { label: 'Livrée', badge: 'badge-success' },
  CANCELLED: { label: 'Annulée', badge: 'badge-danger' },
};

export const QUOTE_STATUS: Record<QuoteStatus, StatusStyle> = {
  PENDING: { label: 'En attente de réponse', badge: 'badge-neutral' },
  ANSWERED: { label: 'Réponse reçue', badge: 'badge-success' },
  REJECTED: { label: 'Non retenu', badge: 'badge-danger' },
};
