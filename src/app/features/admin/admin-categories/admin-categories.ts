import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CatalogService } from '../../../core/services/catalog.service';
import { CategoryAdminService } from '../../../core/services/category-admin.service';
import { ProductAdminService } from '../../../core/services/product-admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Category } from '../../../core/models/category.model';
import { Product } from '../../../core/models/product.model';
import { Role } from '../../../core/models/role.enum';
import { extractError } from '../../../core/utils/http.utils';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit {
  categories: Category[] = [];
  productCounts: Record<number, number> = {};
  loading = true;
  error = false;

  // Formulaire (création si editingId vaut null)
  formOpen = false;
  editingId: number | null = null;
  name = '';
  description = '';
  saving = false;
  nameError = '';
  formError = '';

  successMessage = '';
  errorMessage = '';

  confirmDeleteId: number | null = null;
  deletingId: number | null = null;

  readonly canDelete: boolean;
  readonly skeletons = [1, 2, 3];

  constructor(
    private catalogService: CatalogService,
    private productService: ProductAdminService,
    private categoryService: CategoryAdminService,
    authService: AuthService,
  ) {
    this.canDelete = authService.hasRole(Role.OWNER, Role.ADMIN);
  }

  ngOnInit(): void {
    forkJoin({
      categories: this.catalogService.getCategories(),
      products: this.productService.getAll().pipe(catchError(() => of<Product[]>([]))),
    }).subscribe({
      next: ({ categories, products }) => {
        this.categories = this.sorted(categories);

        const counts: Record<number, number> = {};
        for (const product of products) {
          counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
        }
        this.productCounts = counts;

        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  private sorted(list: Category[]): Category[] {
    return [...list].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }

  count(category: Category): number {
    return this.productCounts[category.id] ?? 0;
  }

  // ───── Formulaire ─────

  openCreate(): void {
    this.resetMessages();
    this.editingId = null;
    this.name = '';
    this.description = '';
    this.formOpen = true;
  }

  openEdit(category: Category): void {
    this.resetMessages();
    this.editingId = category.id;
    this.name = category.name;
    this.description = category.description ?? '';
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.nameError = '';
    this.formError = '';
  }

  private resetMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.nameError = '';
    this.formError = '';
    this.confirmDeleteId = null;
  }

  save(): void {
    if (this.saving) return;

    this.nameError = '';
    this.formError = '';

    const name = this.name.trim();
    if (!name) {
      this.nameError = 'Saisissez le nom de la catégorie.';
      return;
    }
    if (name.length > 100) {
      this.nameError = 'Le nom est trop long (100 caractères maximum).';
      return;
    }

    this.saving = true;
    const description = this.description.trim();

    if (this.editingId === null) {
      this.categoryService.create({ name, description: description || undefined }).subscribe({
        next: (created) => {
          this.categories = this.sorted([...this.categories, created]);
          this.saving = false;
          this.formOpen = false;
          this.successMessage = `Catégorie « ${created.name} » créée.`;
        },
        error: (err) => {
          this.saving = false;
          this.formError = extractError(err, 'Impossible de créer la catégorie.');
        },
      });
      return;
    }

    this.categoryService.update(this.editingId, { name, description }).subscribe({
      next: (updated) => {
        this.categories = this.sorted(
          this.categories.map((c) => (c.id === updated.id ? updated : c)),
        );
        this.saving = false;
        this.formOpen = false;
        this.successMessage = `Catégorie « ${updated.name} » enregistrée.`;
      },
      error: (err) => {
        this.saving = false;
        this.formError = extractError(err, "Impossible d'enregistrer la catégorie.");
      },
    });
  }

  // ───── Suppression ─────

  askDelete(category: Category): void {
    this.resetMessages();
    this.confirmDeleteId = category.id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(category: Category): void {
    if (this.deletingId !== null) return;

    this.deletingId = category.id;
    this.errorMessage = '';

    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c.id !== category.id);
        this.deletingId = null;
        this.confirmDeleteId = null;
        this.successMessage = `Catégorie « ${category.name} » supprimée.`;
      },
      error: (err) => {
        this.deletingId = null;
        this.confirmDeleteId = null;
        this.errorMessage = extractError(err, 'Impossible de supprimer cette catégorie.');
      },
    });
  }
}
