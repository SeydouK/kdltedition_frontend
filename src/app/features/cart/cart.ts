import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { GeocodingService } from '../../core/services/geocoding.service';
import { Cart, CartItem } from '../../core/models/cart.model';
import { Order } from '../../core/models/order.model';
import { extractError } from '../../core/utils/http.utils';
import { formatPrice } from '../../core/utils/format.utils';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, RouterLink],
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

  // Adresse de livraison
  deliveryPhone = '';
  deliveryAddress = '';
  deliveryCity = '';
  deliveryNotes = '';
  latitude: number | null = null;
  longitude: number | null = null;
  accuracy: number | null = null;
  locating = false;
  locationMessage = '';
  fieldErrors: Record<string, string> = {};

  readonly formatPrice = formatPrice;
  readonly skeletons = [1, 2];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private geocoding: GeocodingService,
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

    this.prefillFromLastOrder();
  }

  get itemCount(): number {
    return this.cart?.items.reduce((count, item) => count + item.quantity, 0) ?? 0;
  }

  // Confort : on propose l'adresse de la dernière commande (sans ses coordonnées GPS, qui peuvent être périmées).
  private prefillFromLastOrder(): void {
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        const last = orders.find((order) => order.deliveryAddress)?.deliveryAddress;
        if (!last) return;

        if (!this.deliveryPhone) this.deliveryPhone = last.phone;
        if (!this.deliveryAddress) this.deliveryAddress = last.address;
        if (!this.deliveryCity) this.deliveryCity = last.city;
        if (!this.deliveryNotes && last.notes) this.deliveryNotes = last.notes;
      },
      error: () => {
        // Sans pré-remplissage, le client saisit simplement son adresse.
      },
    });
  }

  // ───── Localisation automatique ─────

  locate(): void {
    this.locationMessage = '';

    if (!('geolocation' in navigator)) {
      this.locationMessage =
        'Votre navigateur ne permet pas la localisation. Saisissez votre adresse manuellement.';
      return;
    }

    this.locating = true;

    navigator.geolocation.getCurrentPosition(
      (position) => this.onPosition(position),
      (error) => this.onPositionError(error),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }

  private onPosition(position: GeolocationPosition): void {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.accuracy = Math.round(position.coords.accuracy);

    this.geocoding.reverse(this.latitude, this.longitude).subscribe((result) => {
      this.locating = false;

      if (!result) {
        this.locationMessage =
          "Position trouvée, mais l'adresse n'a pas pu en être déduite. Complétez-la ci-dessous.";
        return;
      }

      // Le client a explicitement demandé la localisation : on remplace l'adresse et la ville.
      if (result.address) this.deliveryAddress = result.address;
      if (result.city) this.deliveryCity = result.city;
      delete this.fieldErrors['deliveryAddress'];
      delete this.fieldErrors['deliveryCity'];
    });
  }

  private onPositionError(error: GeolocationPositionError): void {
    this.locating = false;

    if (error.code === error.PERMISSION_DENIED) {
      this.locationMessage = 'Localisation refusée. Saisissez votre adresse manuellement.';
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      this.locationMessage =
        'Position indisponible pour le moment. Saisissez votre adresse manuellement.';
    } else {
      this.locationMessage =
        'La localisation a pris trop de temps. Réessayez ou saisissez votre adresse manuellement.';
    }
  }

  clearLocation(): void {
    this.latitude = null;
    this.longitude = null;
    this.accuracy = null;
  }

  // ───── Panier ─────

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

  // ───── Commande ─────

  private validateAddress(): boolean {
    const errors: Record<string, string> = {};

    if (!/^[+0-9 ().-]{8,30}$/.test(this.deliveryPhone.trim())) {
      errors['deliveryPhone'] = 'Saisissez un numéro de téléphone valide.';
    }
    if (!this.deliveryAddress.trim()) {
      errors['deliveryAddress'] = 'Saisissez votre adresse de livraison.';
    }
    if (!this.deliveryCity.trim()) {
      errors['deliveryCity'] = 'Saisissez votre ville ou votre commune.';
    }

    this.fieldErrors = errors;
    return Object.keys(errors).length === 0;
  }

  placeOrder(): void {
    if (this.placingOrder || this.busyItemId !== null) return;

    this.errorMessage = '';

    if (!this.validateAddress()) {
      this.errorMessage = "Vérifiez l'adresse de livraison avant de valider.";
      document
        .getElementById('delivery-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    this.placingOrder = true;

    this.orderService
      .placeOrder({
        deliveryPhone: this.deliveryPhone.trim(),
        deliveryAddress: this.deliveryAddress.trim(),
        deliveryCity: this.deliveryCity.trim(),
        deliveryNotes: this.deliveryNotes.trim() || undefined,
        latitude: this.latitude ?? undefined,
        longitude: this.longitude ?? undefined,
      })
      .subscribe({
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
