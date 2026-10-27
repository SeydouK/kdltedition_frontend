import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateProductRequest, Product, UpdateProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductAdminService {
  constructor(private http: HttpClient) {}

  // Tous les produits, masqués compris.
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/manage`);
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, request);
  }

  update(id: number, request: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`);
  }

  uploadImage(id: number, file: File): Observable<Product> {
    const body = new FormData();
    body.append('file', file);
    return this.http.post<Product>(`${environment.apiUrl}/products/${id}/image`, body);
  }
}
