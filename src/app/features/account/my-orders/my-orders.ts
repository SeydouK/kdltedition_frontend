import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { ORDER_STATUS } from '../../../core/config/status';
import { formatDate, formatPrice } from '../../../core/utils/format.utils';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = false;

  readonly statuses = ORDER_STATUS;
  readonly formatPrice = formatPrice;
  readonly formatDate = formatDate;
  readonly skeletons = [1, 2, 3];

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
}
