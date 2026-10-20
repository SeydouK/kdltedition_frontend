import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

// /admin : le tableau de bord est réservé aux administrateurs ; un modérateur arrive directement sur les commandes.
export const adminHomeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasRole(Role.OWNER, Role.ADMIN)) return true;
  if (authService.hasRole(Role.STAFF)) return router.parseUrl('/admin/commandes');
  return router.parseUrl('/');
};
