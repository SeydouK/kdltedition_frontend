export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}
