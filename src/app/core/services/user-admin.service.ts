import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ManagedUser } from '../models/user.model';
import { Role } from '../models/role.enum';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ManagedUser[]> {
    return this.http.get<ManagedUser[]>(`${environment.apiUrl}/users`);
  }

  invite(email: string, role: Role): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/invites`, { email, role });
  }

  changeRole(id: number, role: Role): Observable<ManagedUser> {
    return this.http.put<ManagedUser>(`${environment.apiUrl}/users/${id}/role`, null, {
      params: { newRole: role },
    });
  }

  deactivate(id: number): Observable<ManagedUser> {
    return this.http.put<ManagedUser>(`${environment.apiUrl}/users/${id}/deactivate`, null);
  }

  activate(id: number): Observable<ManagedUser> {
    return this.http.put<ManagedUser>(`${environment.apiUrl}/users/${id}/activate`, null);
  }
}
