import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Cart } from '../../core/models/cart.model';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartPage implements OnInit {
  cart: Cart | null = null;
  loading = true;
  error = false;

  placingOrder = false;
  placedOrder: Order | null = null;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  changeQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateItemQuantity(itemId, quantity).subscribe({
      next: (data) => (this.cart = data),
      error: (err) =>
        (this.errorMessage =
          err?.error?.message || err?.error || 'Impossible de modifier la quantité.'),
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe({
      next: () => this.loadCart(),
      error: () => (this.errorMessage = 'Impossible de retirer cet article.'),
    });
  }

  placeOrder(): void {
    this.placingOrder = true;
    this.errorMessage = '';

    this.orderService.placeOrder().subscribe({
      next: (order) => {
        this.placingOrder = false;
        this.placedOrder = order;
        this.cart = null;
      },
      error: (err) => {
        this.placingOrder = false;
        this.errorMessage =
          err?.error?.message || err?.error || 'Impossible de passer la commande.';
      },
    });
  }

  formatPrice(price?: number): string {
    if (price == null) return '-';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
