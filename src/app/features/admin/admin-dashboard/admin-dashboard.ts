import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { DashboardSummary, RevenueByMonth, TopProduct } from '../../../core/models/analytics.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  summary: DashboardSummary | null = null;
  revenueByMonth: RevenueByMonth[] = [];
  topProducts: TopProduct[] = [];
  maxRevenue = 0;

  loading = true;
  error = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    forkJoin({
      summary: this.analyticsService.getSummary(),
      revenue: this.analyticsService.getRevenueByMonth(),
      top: this.analyticsService.getTopProducts(5),
    }).subscribe({
      next: ({ summary, revenue, top }) => {
        this.summary = summary;
        this.revenueByMonth = revenue;
        this.topProducts = top;
        this.maxRevenue = Math.max(0, ...revenue.map((r) => r.revenue));
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  get statusRows(): { label: string; count: number }[] {
    const s = this.summary;
    if (!s) return [];
    return [
      { label: 'En attente', count: s.pendingOrders },
      { label: 'Confirmées', count: s.confirmedOrders },
      { label: 'En production', count: s.inProductionOrders },
      { label: 'Expédiées', count: s.shippedOrders },
      { label: 'Livrées', count: s.deliveredOrders },
      { label: 'Annulées', count: s.cancelledOrders },
    ];
  }

  barHeight(revenue: number): number {
    if (this.maxRevenue === 0) return 0;
    return Math.max(4, (revenue / this.maxRevenue) * 100);
  }

  formatMonth(month: string): string {
    return new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  }

  formatPrice(price?: number): string {
    if (price == null) return '-';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
