import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  loading = true;
  error = false;

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => this.error = true
    });

    this.catalogService.getProducts().subscribe({
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

  formatPrice(price?: number): string {
    if (price == null) return 'Sur devis';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  }
}
