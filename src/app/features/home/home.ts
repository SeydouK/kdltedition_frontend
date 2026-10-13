import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { TkardPromo } from '../../shared/components/tkard-promo/tkard-promo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TkardPromo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  loading = true;
  error = false;

  readonly skeletons = [1, 2, 3];

  readonly steps = [
    {
      icon: 'pi-comments',
      label: 'Conseil',
      text: 'Comprendre votre besoin avant de proposer une solution.',
    },
    { icon: 'pi-pencil', label: 'Conception', text: 'Transformer votre idée en produit concret.' },
    {
      icon: 'pi-table',
      label: 'Mise en page',
      text: 'Une présentation soignée, cohérente avec votre identité.',
    },
    { icon: 'pi-print', label: 'Impression', text: 'Qualité, régularité et personnalisation.' },
    {
      icon: 'pi-check-circle',
      label: 'Finition',
      text: "Des finitions adaptées à l'usage du support.",
    },
    {
      icon: 'pi-truck',
      label: 'Livraison',
      text: 'Le respect des engagements et des délais de production.',
    },
  ];

  readonly sectors = [
    'Santé',
    'Entreprises',
    'Institutions',
    'Associations',
    'Éducation',
    'Commerce',
    'Événementiel',
  ];

  readonly healthItems = [
    'Carnets mère-enfant',
    'Carnets de suivi médical et gynécologique',
    'Ordonnanciers et ordonnances sécurisées',
    'Fiches et documents médicaux',
    'En-têtes et blocs professionnels',
    'Répertoires de professionnels de santé',
    "Supports de sensibilisation et d'information",
    'Supports personnalisés pour cabinets, cliniques et pharmacies',
  ];

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => (this.error = true),
    });

    this.catalogService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
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
}
