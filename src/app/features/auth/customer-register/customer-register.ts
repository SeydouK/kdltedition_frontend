import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-register.html',
  styleUrl: './customer-register.css',
})
export class CustomerRegister {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  phoneNumber = '';

  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.submitting = true;
    this.errorMessage = '';

    this.http
      .post(`${environment.apiUrl}/users/register`, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        motDePasse: this.password,
        phoneNumber: this.phoneNumber || undefined,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err?.error?.message || err?.error || 'Impossible de créer le compte.';
        },
      });
  }
}
