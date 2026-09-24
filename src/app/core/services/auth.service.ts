import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtResponse } from '../models/jwt-response.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.enum';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.storage.getUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          this.storage.setToken(res.token);
          const user: User = { email, role: res.role as Role };
          this.storage.setUser(user);
          this.currentUserSubject.next(user);
        }),
      );
  }

  logout(): void {
    this.storage.clear();
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.storage.getToken();
  }

  hasRole(...roles: Role[]): boolean {
    const user = this.currentUser;
    return !!user && roles.includes(user.role);
  }
}
