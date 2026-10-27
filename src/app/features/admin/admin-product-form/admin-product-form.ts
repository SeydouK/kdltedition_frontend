import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { ProductAdminService } from '../../../core/services/product-admin.service';
import { NoticeService } from '../../../core/services/notice.service';
import { Category } from '../../../core/models/category.model';
import { Product, ProductType } from '../../../core/models/product.model';
import { extractError } from '../../../core/utils/http.utils';
import { slugify } from '../../../core/utils/slug.utils';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm implements OnInit {
  productId: number | null = null;
  product: Product | null = null;
  categories: Category[] = [];

  loading = true;
  notFound = false;

  name = '';
  slug = '';
  slugTouched = false;
  categoryId: number | null = null;
  type: ProductType = 'STANDARD';
  price: number | null = null;
  description = '';
  active = true;

  saving = false;
  fieldErrors: Record<string, string> = {};
  errorMessage = '';
  successMessage = '';

  uploading = false;
  imageError = '';

  confirmingDelete = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private productService: ProductAdminService,
    private notices: NoticeService,
  ) {}

  get isEdit(): boolean {
    return this.productId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null) {
      this.productId = Number(idParam);
      if (!this.productId) {
        this.notFound = true;
        this.loading = false;
        return;
      }
    }

    this.successMessage = this.notices.consume() ?? '';

    forkJoin({
      categories: this.catalogService.getCategories(),
      products: this.isEdit ? this.productService.getAll() : of<Product[]>([]),
    }).subscribe({
      next: ({ categories, products }) => {
        this.categories = categories;

        if (this.isEdit) {
          const found = products.find((p) => p.id === this.productId);
          if (!found) {
            this.notFound = true;
          } else {
            this.fill(found);
          }
        }
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  private fill(product: Product): void {
    this.product = product;
    this.name = product.name;
    this.slug = product.slug;
    this.categoryId = product.categoryId;
    this.type = product.type;
    this.price = product.basePrice ?? null;
    this.description = product.description ?? '';
    this.active = product.active ?? true;
  }

  // À la création, le slug se déduit du nom tant qu'on ne l'a pas modifié à la main.
  onNameChange(value: string): void {
    this.name = value;
    if (!this.isEdit && !this.slugTouched) {
      this.slug = slugify(value);
    }
  }

  onSlugInput(): void {
    this.slugTouched = true;
  }

  private validate(): boolean {
    const errors: Record<string, string> = {};

    if (!this.name.trim()) errors['name'] = 'Saisissez le nom du produit.';
    else if (this.name.trim().length > 255)
      errors['name'] = 'Le nom est trop long (255 caractères maximum).';

    if (!this.isEdit) {
      if (!this.slug.trim()) errors['slug'] = 'Le slug est obligatoire.';
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(this.slug)) {
        errors['slug'] = 'Minuscules, chiffres et tirets uniquement (exemple : carnet-medical).';
      }
    }

    if (this.categoryId === null) errors['category'] = 'Choisissez une catégorie.';

    if (this.type === 'STANDARD' && (this.price === null || !(this.price > 0))) {
      errors['price'] = 'Indiquez un prix supérieur à 0.';
    }

    if (this.description.length > 2000) {
      errors['description'] = 'La description est trop longue (2000 caractères maximum).';
    }

    this.fieldErrors = errors;
    return Object.keys(errors).length === 0;
  }

  save(): void {
    if (this.saving) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validate()) {
      this.errorMessage = "Corrigez les champs signalés avant d'enregistrer.";
      return;
    }

    this.saving = true;
    const basePrice = this.type === 'STANDARD' ? (this.price ?? undefined) : undefined;

    if (!this.isEdit) {
      this.productService
        .create({
          categoryId: this.categoryId!,
          name: this.name.trim(),
          slug: this.slug.trim(),
          description: this.description.trim() || undefined,
          type: this.type,
          basePrice,
        })
        .subscribe({
          next: (created) => {
            this.notices.set('Produit créé. Vous pouvez maintenant ajouter une image.');
            this.router.navigate(['/admin/produits', created.id]);
          },
          error: (err) => {
            this.saving = false;
            this.errorMessage = extractError(err, 'Impossible de créer le produit.');
          },
        });
      return;
    }

    this.productService
      .update(this.productId!, {
        categoryId: this.categoryId!,
        name: this.name.trim(),
        description: this.description.trim(),
        type: this.type,
        basePrice,
        active: this.active,
      })
      .subscribe({
        next: (updated) => {
          this.saving = false;
          this.fill(updated);
          this.successMessage = 'Modifications enregistrées.';
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = extractError(err, "Impossible d'enregistrer les modifications.");
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // permet de choisir deux fois de suite le même fichier

    if (!file || !this.product) return;

    this.imageError = '';

    if (file.size > MAX_IMAGE_BYTES) {
      this.imageError = 'Ce fichier dépasse 5 Mo.';
      return;
    }

    this.uploading = true;

    this.productService.uploadImage(this.product.id, file).subscribe({
      next: (updated) => {
        // On ne touche qu'à l'image : les champs en cours de saisie restent intacts.
        this.product = updated;
        this.uploading = false;
      },
      error: (err) => {
        this.uploading = false;
        this.imageError = extractError(err, "Impossible d'envoyer l'image.");
      },
    });
  }

  askDelete(): void {
    this.confirmingDelete = true;
  }

  cancelDelete(): void {
    this.confirmingDelete = false;
  }

  confirmDelete(): void {
    if (!this.product || this.deleting) return;

    this.deleting = true;
    this.errorMessage = '';

    this.productService.delete(this.product.id).subscribe({
      next: () => {
        this.notices.set('Produit supprimé.');
        this.router.navigate(['/admin/produits']);
      },
      error: (err) => {
        this.deleting = false;
        this.confirmingDelete = false;
        this.errorMessage = extractError(err, 'Impossible de supprimer ce produit.');
      },
    });
  }
}
