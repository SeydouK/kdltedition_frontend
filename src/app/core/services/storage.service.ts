import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

const TOKEN_KEY = 'kdlt_token';
const USER_KEY = 'kdlt_user';

@Injectable({ providedIn: 'root' })
export class StorageService {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
