import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/role.enum';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'produits',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'produits/:slug',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'auth/inscription',
    loadComponent: () =>
      import('./features/auth/customer-register/customer-register').then((m) => m.CustomerRegister),
  },
  {
    path: 'panier',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cart/cart').then((m) => m.CartPage),
  },
  {
    path: 'mes-commandes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/my-orders/my-orders').then((m) => m.MyOrders),
  },
  {
    path: 'mes-devis',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/my-quotes/my-quotes').then((m) => m.MyQuotes),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.STAFF, Role.OWNER, Role.ADMIN] },
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [roleGuard],
        data: { roles: [Role.OWNER, Role.ADMIN] },
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
    ],
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services').then((m) => m.Services),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
