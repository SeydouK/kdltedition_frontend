import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  token: string | null = null;
  tokenValid = false;
  checkingToken = true;

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
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.checkingToken = false;
      this.tokenValid = false;
      return;
    }

    this.http.get(`${environment.apiUrl}/invites/${this.token}`).subscribe({
      next: (data: any) => {
        this.email = data?.email || '';
        this.tokenValid = true;
        this.checkingToken = false;
      },
      error: () => {
        this.tokenValid = false;
        this.checkingToken = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.token) return;

    this.submitting = true;
    this.errorMessage = '';

    this.http
      .post(`${environment.apiUrl}/users?token=${this.token}`, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        motDePasse: this.password,
        phoneNumber: this.phoneNumber || undefined,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Compte créé avec succès. Vous pouvez maintenant vous connecter.';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage = err?.error?.message || err?.error || 'Impossible de créer le compte.';
        },
      });
  }
}
