import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { isJwtExpired } from '../utils/jwt.utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

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

  // Le jeton n'est envoyé qu'à notre propre API, et jamais s'il est périmé.
  const expired = !!token && isJwtExpired(token);
  const ourApi = isOurApi(req.url);
  const request =
    token && !expired && ourApi
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const sessionLost = error.status === 401 || (error.status === 403 && expired);

      if (token && ourApi && sessionLost && !router.url.startsWith('/auth')) {
        authService.logout();
        router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
      }

      return throwError(() => error);
    }),
  );
};
