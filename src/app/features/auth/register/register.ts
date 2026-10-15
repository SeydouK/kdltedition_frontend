import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayout } from '../../../shared/components/auth-layout/auth-layout';
import { extractError, isValidEmail } from '../../../core/utils/http.utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthLayout],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  token: string | null = null;
  checkingToken = true;
  tokenValid = false;
  emailLocked = false;

  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  password = '';
  showPassword = false;

  submitting = false;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  readonly points = [
    'Votre invitation est valable 30 minutes',
    'Choisissez un mot de passe pour activer votre compte',
  ];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.checkingToken = false;
      return;
    }

    this.http
      .get<any>(`${environment.apiUrl}/invites/${encodeURIComponent(this.token)}`)
      .subscribe({
        next: (data) => {
          // Si l'invitation renvoie l'adresse invitée, on la pré-remplit et on la verrouille.
          const invitedEmail = typeof data?.email === 'string' ? data.email : '';
          if (invitedEmail) {
            this.email = invitedEmail;
            this.emailLocked = true;
          }
          this.tokenValid = true;
          this.checkingToken = false;
        },
        error: () => {
          this.checkingToken = false;
        },
      });
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
    if (!this.token || !this.validate()) return;

    this.submitting = true;
    const email = this.email.trim();

    this.http
      .post(`${environment.apiUrl}/users?token=${encodeURIComponent(this.token)}`, {
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
            "Impossible de créer le compte. L'invitation a peut-être expiré.",
          );
        },
      });
  }

  private signIn(email: string): void {
    this.authService.login(email, this.password).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.submitting = false;
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
