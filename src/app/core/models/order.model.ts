export type OrderStatus =
  'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface DeliveryAddress {
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  dateCreation: string;
  customerName?: string;
  customerEmail?: string;
  deliveryAddress?: DeliveryAddress | null;
}

export interface PlaceOrderRequest {
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes?: string;
  latitude?: number;
  longitude?: number;
}
