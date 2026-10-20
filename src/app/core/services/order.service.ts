import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderStatus, PlaceOrderRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  placeOrder(request: PlaceOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, request);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/me`);
  }

  // ───── Équipe ─────

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${environment.apiUrl}/orders/${id}/status`, null, {
      params: { status },
    });
  }
}
