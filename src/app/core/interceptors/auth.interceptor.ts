import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();

  const apiOrigin = new URL(environment.apiUrl, window.location.origin).origin;

  const isOurApi = (url: string): boolean => {
    if (!/^https?:\/\//i.test(url)) return true;
    try {
      return new URL(url).origin === apiOrigin;
    } catch {
      return false;
    }
  };

  if (!token || !isOurApi(req.url)) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
