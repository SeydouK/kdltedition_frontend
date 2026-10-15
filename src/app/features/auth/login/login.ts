import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayout } from '../../../shared/components/auth-layout/auth-layout';
import { extractError, safeReturnUrl } from '../../../core/utils/http.utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthLayout],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  showPassword = false;

  submitting = false;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  readonly returnUrl: string | null;

  readonly points = [
    "Suivez l'état de vos commandes",
    'Retrouvez vos demandes de devis et nos réponses',
    'Commandez vos produits en quelques clics',
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
  ) {
    this.returnUrl = route.snapshot.queryParamMap.get('returnUrl');
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    if (!this.email.trim()) this.fieldErrors['email'] = 'Saisissez votre adresse email.';
    if (!this.password) this.fieldErrors['password'] = 'Saisissez votre mot de passe.';
    if (Object.keys(this.fieldErrors).length) return;

    this.submitting = true;

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl(safeReturnUrl(this.returnUrl));
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = extractError(
          err,
          'Connexion impossible pour le moment. Réessayez dans quelques instants.',
        );
      },
    });
  }
}
