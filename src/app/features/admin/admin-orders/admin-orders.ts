import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { ORDER_STATUS } from '../../../core/config/status';
import { formatDate, formatPrice } from '../../../core/utils/format.utils';

type OrderFilter = 'ALL' | OrderStatus;

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = false;
  filter: OrderFilter = 'ALL';

  readonly statuses = ORDER_STATUS;
  readonly formatPrice = formatPrice;
  readonly formatDate = formatDate;
  readonly skeletons = [1, 2, 3, 4];

  readonly filters: { key: OrderFilter; label: string }[] = [
    { key: 'ALL', label: 'Toutes' },
    { key: 'PENDING', label: 'En attente' },
    { key: 'CONFIRMED', label: 'Confirmées' },
    { key: 'IN_PRODUCTION', label: 'En production' },
    { key: 'SHIPPED', label: 'Expédiées' },
    { key: 'DELIVERED', label: 'Livrées' },
    { key: 'CANCELLED', label: 'Annulées' },
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
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

  get visibleOrders(): Order[] {
    return this.filter === 'ALL'
      ? this.orders
      : this.orders.filter((order) => order.status === this.filter);
  }

  count(filter: OrderFilter): number {
    return filter === 'ALL'
      ? this.orders.length
      : this.orders.filter((order) => order.status === filter).length;
  }
}
