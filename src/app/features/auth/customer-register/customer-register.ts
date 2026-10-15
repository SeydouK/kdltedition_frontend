import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayout } from '../../../shared/components/auth-layout/auth-layout';
import { extractError, isValidEmail, safeReturnUrl } from '../../../core/utils/http.utils';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthLayout],
  templateUrl: './customer-register.html',
  styleUrl: './customer-register.css',
})
export class CustomerRegister {
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  password = '';
  showPassword = false;

  submitting = false;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  readonly returnUrl: string | null;

  readonly points = [
    'Commandez vos supports imprimés en ligne',
    'Demandez un devis pour vos produits sur mesure',
    'Suivez vos commandes et vos devis au même endroit',
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
  ) {
    this.returnUrl = route.snapshot.queryParamMap.get('returnUrl');
  }

  private validate(): boolean {
    const errors: Record<string, string> = {};

    if (!this.firstName.trim()) errors['firstName'] = 'Saisissez votre prénom.';
    if (!this.lastName.trim()) errors['lastName'] = 'Saisissez votre nom.';

    if (!this.email.trim()) errors['email'] = 'Saisissez votre adresse email.';
    else if (!isValidEmail(this.email.trim()))
      errors['email'] = "Cette adresse email n'est pas valide.";

    if (this.password.length < 8)
      errors['password'] = 'Le mot de passe doit contenir au moins 8 caractères.';

    this.fieldErrors = errors;
    return Object.keys(errors).length === 0;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.validate()) return;

    this.submitting = true;
    const email = this.email.trim();

    this.http
      .post(`${environment.apiUrl}/users/register`, {
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim(),
        email,
        motDePasse: this.password,
        phoneNumber: this.phoneNumber.trim() || undefined,
      })
      .subscribe({
        next: () => this.signIn(email),
        error: (err) => {
          this.submitting = false;
          this.errorMessage = extractError(
            err,
            'Impossible de créer le compte pour le moment. Vérifiez vos informations et réessayez.',
          );
        },
      });
  }

  // Le compte est créé : on connecte directement l'utilisateur plutôt que de le renvoyer vers la page de connexion.
  private signIn(email: string): void {
    this.authService.login(email, this.password).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl(safeReturnUrl(this.returnUrl));
      },
      error: () => {
        this.submitting = false;
        this.router.navigate(['/auth/login'], {
          queryParams: this.returnUrl ? { returnUrl: this.returnUrl } : {},
        });
      },
    });
  }
}
