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

// Ordre du parcours normal d'une commande (une commande annulée en sort).
export const ORDER_FLOW: OrderStatus[] = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED'];

export interface OrderAction {
  status: OrderStatus;
  label: string;
  tone: 'primary' | 'danger';
}

// Miroir des règles du backend (OrderStatus.canTransitionTo) : les boutons proposés sont ceux qui sont permis.
// Le backend reste l'autorité et refuse toute transition invalide.
export const ORDER_ACTIONS: Record<OrderStatus, OrderAction[]> = {
  PENDING: [
    { status: 'CONFIRMED', label: 'Confirmer la commande', tone: 'primary' },
    { status: 'CANCELLED', label: 'Annuler la commande', tone: 'danger' }
  ],
  CONFIRMED: [
    { status: 'IN_PRODUCTION', label: 'Lancer la production', tone: 'primary' },
    { status: 'CANCELLED', label: 'Annuler la commande', tone: 'danger' }
  ],
  IN_PRODUCTION: [
    { status: 'SHIPPED', label: 'Marquer comme expédiée', tone: 'primary' },
    { status: 'CANCELLED', label: 'Annuler la commande', tone: 'danger' }
  ],
  SHIPPED: [
    { status: 'DELIVERED', label: 'Marquer comme livrée', tone: 'primary' }
  ],
  DELIVERED: [],
  CANCELLED: []
};
