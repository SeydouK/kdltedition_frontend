import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${environment.apiUrl}/cart`);
  }

  addItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${environment.apiUrl}/cart/items`, { productId, quantity });
  }

  updateItemQuantity(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(
      `${environment.apiUrl}/cart/items/${itemId}?quantity=${quantity}`,
      {},
    );
  }

  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/cart/items/${itemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/cart`);
  }
}
