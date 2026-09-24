import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = true;
  error = false;

  constructor(
    private catalogService: CatalogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe({
      next: (data) => this.categories = data
    });

    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'] ? Number(params['categoryId']) : null;
      this.selectedCategoryId = categoryId;
      this.loadProducts(categoryId ?? undefined);
    });
  }

  loadProducts(categoryId?: number): void {
    this.loading = true;
    this.error = false;
    this.catalogService.getProducts(categoryId).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.loadProducts(categoryId ?? undefined);
  }

  formatPrice(price?: number): string {
    if (price == null) return 'Sur devis';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
