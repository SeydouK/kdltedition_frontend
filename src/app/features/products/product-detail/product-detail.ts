import { Component, OnInit } from '@angular/core';
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
  imports: [FormsModule, RouterLink],
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
  successLink: { label: string; path: string } | null = null;
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

  get total(): number | null {
    if (!this.product || this.product.basePrice == null) return null;
    return this.product.basePrice * Math.max(1, this.quantity || 1);
  }

  formatPrice(price?: number | null): string {
    if (price == null) return 'Sur devis';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }

  addToCart(): void {
    if (!this.product || !this.prepareSubmit()) return;

    this.cartService.addItem(this.product.id, this.quantity).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Produit ajouté au panier.';
        this.successLink = { label: 'Voir mon panier', path: '/panier' };
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = this.extractError(err, "Impossible d'ajouter ce produit au panier.");
      },
    });
  }

  requestQuote(): void {
    if (!this.product || !this.prepareSubmit()) return;

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
          this.successLink = { label: 'Voir mes devis', path: '/mes-devis' };
          this.specifications = '';
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = this.extractError(err, "Impossible d'envoyer la demande de devis.");
        },
      });
  }

  // Vérifie la connexion et la quantité, remet les messages à zéro. Renvoie false si l'envoi doit s'arrêter.
  private prepareSubmit(): boolean {
    this.successMessage = '';
    this.successLink = null;
    this.errorMessage = '';

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return false;
    }

    if (!this.quantity || this.quantity < 1) {
      this.errorMessage = "Indiquez une quantité d'au moins 1.";
      return false;
    }

    this.submitting = true;
    return true;
  }

  private extractError(err: any, fallback: string): string {
    const body = err?.error;
    if (typeof body === 'string' && body.trim()) return body;
    if (typeof body?.message === 'string' && body.message.trim()) return body.message;
    return fallback;
  }
}
