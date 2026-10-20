import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { DeliveryAddress, Order, OrderStatus } from '../../../core/models/order.model';
import { ORDER_ACTIONS, ORDER_FLOW, ORDER_STATUS, OrderAction } from '../../../core/config/status';
import { extractError } from '../../../core/utils/http.utils';
import { formatDate, formatPrice } from '../../../core/utils/format.utils';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-order-detail.html',
  styleUrl: './admin-order-detail.css',
})
export class AdminOrderDetail implements OnInit {
  order: Order | null = null;
  loading = true;
  notFound = false;

  updating = false;
  confirmingCancel = false;
  successMessage = '';
  errorMessage = '';

  readonly statuses = ORDER_STATUS;
  readonly flow = ORDER_FLOW;
  readonly formatPrice = formatPrice;
  readonly formatDate = formatDate;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    this.orderService.getOrder(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  get actions(): OrderAction[] {
    return this.order ? ORDER_ACTIONS[this.order.status] : [];
  }

  apply(action: OrderAction): void {
    if (action.tone === 'danger') {
      this.confirmingCancel = true;
      return;
    }
    this.send(action.status);
  }

  confirmCancel(): void {
    this.send('CANCELLED');
  }

  keepOrder(): void {
    this.confirmingCancel = false;
  }

  private send(status: OrderStatus): void {
    if (!this.order || this.updating) return;

    this.updating = true;
    this.confirmingCancel = false;
    this.successMessage = '';
    this.errorMessage = '';

    this.orderService.updateStatus(this.order.id, status).subscribe({
      next: (order) => {
        this.order = order;
        this.updating = false;
        this.successMessage = `Statut mis à jour : ${ORDER_STATUS[order.status].label}. Un email d'information est envoyé au client.`;
      },
      error: (err) => {
        this.updating = false;
        this.errorMessage = extractError(err, 'Impossible de modifier le statut de la commande.');
      },
    });
  }

  stepClass(step: OrderStatus): string {
    if (!this.order) return 'bg-muted text-ink-3';

    const current = this.flow.indexOf(this.order.status);
    const index = this.flow.indexOf(step);

    if (index < current) return 'bg-brand-600 text-white';
    if (index === current) return 'bg-accent-400 text-brand-900 ring-4 ring-accent-100';
    return 'bg-muted text-ink-3';
  }

  stepDone(step: OrderStatus): boolean {
    return !!this.order && this.flow.indexOf(step) < this.flow.indexOf(this.order.status);
  }

  // Simple lien vers une carte, sans clé ni API.
  mapUrl(delivery: DeliveryAddress): string | null {
    if (delivery.latitude == null || delivery.longitude == null) return null;
    return `https://www.google.com/maps?q=${delivery.latitude},${delivery.longitude}`;
  }
}
