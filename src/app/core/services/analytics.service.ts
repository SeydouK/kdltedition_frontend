import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardSummary, RevenueByMonth, TopProduct } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${environment.apiUrl}/analytics/summary`);
  }

  getRevenueByMonth(): Observable<RevenueByMonth[]> {
    return this.http.get<RevenueByMonth[]>(`${environment.apiUrl}/analytics/revenue-by-month`);
  }

  getTopProducts(limit = 5): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(
      `${environment.apiUrl}/analytics/top-products?limit=${limit}`,
    );
  }
}
