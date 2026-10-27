import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryRequest } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryAdminService {
  constructor(private http: HttpClient) {}

  create(request: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}/categories`, request);
  }

  update(id: number, request: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${environment.apiUrl}/categories/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/categories/${id}`);
  }
}
