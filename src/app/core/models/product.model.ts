export type ProductType = 'STANDARD' | 'CUSTOM';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: ProductType;
  basePrice?: number | null;
  imageUrl?: string | null;
  categoryId: number;
  categoryName: string;
  active?: boolean;
}

export interface CreateProductRequest {
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  type: ProductType;
  basePrice?: number;
}

export interface UpdateProductRequest {
  categoryId?: number;
  name?: string;
  description?: string;
  type?: ProductType;
  basePrice?: number;
  active?: boolean;
}
