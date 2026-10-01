import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { CartService } from '../../../core/services/cart.service';
import { QuoteService } from '../../../core/services/quote.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading = true;
  error = false;

  quantity = 1;
  specifications = '';

  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private cartService: CartService,
    private quoteService: QuoteService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    this.catalogService.getProductBySlug(slug).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  formatPrice(price?: number): string {
    if (price == null) return 'Sur devis';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  addToCart(): void {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.addItem(this.product.id, this.quantity).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Produit ajouté au panier.';
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err?.error?.message || err?.error || "Impossible d'ajouter ce produit au panier.";
      },
    });
  }

  requestQuote(): void {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.quoteService
      .createQuote({
        productId: this.product.id,
        quantity: this.quantity,
        specifications: this.specifications || undefined,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage =
            'Votre demande de devis a été envoyée. Nous vous répondrons rapidement.';
          this.specifications = '';
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err?.error?.message || err?.error || "Impossible d'envoyer la demande de devis.";
        },
      });
  }
}
