import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Cart, CartItem } from '../../core/models/cart.model';
import { Order } from '../../core/models/order.model';
import { extractError } from '../../core/utils/http.utils';
import { formatPrice } from '../../core/utils/format.utils';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartPage implements OnInit {
  cart: Cart | null = null;
  loading = true;
  error = false;

  busyItemId: number | null = null;
  placingOrder = false;
  placedOrder: Order | null = null;
  errorMessage = '';

  readonly formatPrice = formatPrice;
  readonly skeletons = [1, 2];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
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

  get itemCount(): number {
    return this.cart?.items.reduce((count, item) => count + item.quantity, 0) ?? 0;
  }

  changeQuantity(item: CartItem, delta: number): void {
    const quantity = item.quantity + delta;
    if (quantity < 1 || this.busyItemId !== null) return;

    this.busyItemId = item.id;
    this.errorMessage = '';

    this.cartService.updateItemQuantity(item.id, quantity).subscribe({
      next: (data) => {
        this.cart = data;
        this.busyItemId = null;
      },
      error: (err) => {
        this.busyItemId = null;
        this.errorMessage = extractError(err, 'Impossible de modifier la quantité.');
      },
    });
  }

  removeItem(item: CartItem): void {
    if (this.busyItemId !== null) return;

    this.busyItemId = item.id;
    this.errorMessage = '';

    this.cartService.removeItem(item.id).subscribe({
      next: () => {
        // On recharge le panier sans repasser par l'écran de chargement.
        this.cartService.getCart().subscribe({
          next: (data) => {
            this.cart = data;
            this.busyItemId = null;
          },
          error: () => {
            this.busyItemId = null;
            this.errorMessage = "Le panier n'a pas pu être actualisé.";
          },
        });
      },
      error: (err) => {
        this.busyItemId = null;
        this.errorMessage = extractError(err, 'Impossible de retirer cet article.');
      },
    });
  }

  placeOrder(): void {
    if (this.placingOrder || this.busyItemId !== null) return;

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
        this.errorMessage = extractError(err, 'Impossible de passer la commande pour le moment.');
      },
    });
  }
}
