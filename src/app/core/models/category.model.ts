export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}
