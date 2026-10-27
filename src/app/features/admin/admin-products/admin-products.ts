import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductAdminService } from '../../../core/services/product-admin.service';
import { NoticeService } from '../../../core/services/notice.service';
import { Product } from '../../../core/models/product.model';
import { extractError } from '../../../core/utils/http.utils';
import { formatPrice } from '../../../core/utils/format.utils';

type ProductFilter = 'ALL' | 'ONLINE' | 'HIDDEN';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  products: Product[] = [];
  loading = true;
  error = false;

  filter: ProductFilter = 'ALL';
  search = '';

  notice = '';
  errorMessage = '';
  togglingId: number | null = null;

  readonly formatPrice = formatPrice;
  readonly skeletons = [1, 2, 3, 4];

  readonly filters: { key: ProductFilter; label: string }[] = [
    { key: 'ALL', label: 'Tous' },
    { key: 'ONLINE', label: 'En ligne' },
    { key: 'HIDDEN', label: 'Masqués' },
  ];

  constructor(
    private productService: ProductAdminService,
    private notices: NoticeService,
  ) {}

  ngOnInit(): void {
    this.notice = this.notices.consume() ?? '';

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = [...data].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  get visibleProducts(): Product[] {
    const query = this.search.trim().toLowerCase();

    return this.products.filter((product) => {
      if (this.filter === 'ONLINE' && !product.active) return false;
      if (this.filter === 'HIDDEN' && product.active) return false;
      if (!query) return true;

      return (
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query)
      );
    });
  }

  count(filter: ProductFilter): number {
    if (filter === 'ALL') return this.products.length;
    return this.products.filter((product) =>
      filter === 'ONLINE' ? product.active : !product.active,
    ).length;
  }

  toggleActive(product: Product): void {
    if (this.togglingId !== null) return;

    this.togglingId = product.id;
    this.errorMessage = '';
    this.notice = '';

    this.productService.update(product.id, { active: !product.active }).subscribe({
      next: (updated) => {
        this.products = this.products.map((p) => (p.id === updated.id ? updated : p));
        this.togglingId = null;
      },
      error: (err) => {
        this.togglingId = null;
        this.errorMessage = extractError(err, 'Impossible de modifier ce produit.');
      },
    });
  }
}
