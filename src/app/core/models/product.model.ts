export type ProductType = 'STANDARD' | 'CUSTOM';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: ProductType;
  basePrice?: number;
  imageUrl?: string;
  categoryId: number;
  categoryName: string;
}
