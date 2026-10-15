import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  host: { class: 'block h-full' },
})
export class ProductCard {
  readonly product = input.required<Product>();

  formatPrice(price?: number | null): string {
    if (price == null) return 'Sur devis';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
