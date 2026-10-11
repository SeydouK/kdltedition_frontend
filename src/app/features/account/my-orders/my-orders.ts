import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = false;

  private readonly statusLabels: Record<OrderStatus, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    IN_PRODUCTION: 'En production',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
  };

  private readonly statusClasses: Record<OrderStatus, string> = {
    PENDING: 'bg-slate-100 text-slate-700',
    CONFIRMED: 'bg-navy-50 text-navy-700',
    IN_PRODUCTION: 'bg-gold-50 text-gold-700',
    SHIPPED: 'bg-navy-100 text-navy-800',
    DELIVERED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-red-50 text-red-700',
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  statusLabel(status: OrderStatus): string {
    return this.statusLabels[status] ?? status;
  }

  statusClass(status: OrderStatus): string {
    return this.statusClasses[status] ?? 'bg-slate-100 text-slate-700';
  }

  formatPrice(price?: number): string {
    if (price == null) return '-';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
