
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/role.enum';
import { adminHomeGuard } from './core/guards/admin-home.guard';

export const routes: Routes = [
  // Accueil
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },

  // Routes publiques des produits
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

  // Authentification
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

  // Espace client
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

  // Administration
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [Role.STAFF, Role.OWNER, Role.ADMIN],
    },
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      // Tableau de bord
      {
        path: '',
        pathMatch: 'full',
        canActivate: [adminHomeGuard],
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },

      // Gestion des commandes
      {
        path: 'commandes',
        loadComponent: () =>
          import('./features/admin/admin-orders/admin-orders').then((m) => m.AdminOrders),
      },
      {
        path: 'commandes/:id',
        loadComponent: () =>
          import('./features/admin/admin-order-detail/admin-order-detail').then(
            (m) => m.AdminOrderDetail,
          ),
      },

      // Gestion des devis
      {
        path: 'devis',
        loadComponent: () =>
          import('./features/admin/admin-quotes/admin-quotes').then((m) => m.AdminQuotes),
      },

      // Gestion des produits
      {
        path: 'produits',
        loadComponent: () =>
          import('./features/admin/admin-products/admin-products').then((m) => m.AdminProducts),
      },
      {
        path: 'produits/nouveau',
        loadComponent: () =>
          import('./features/admin/admin-product-form/admin-product-form').then(
            (m) => m.AdminProductForm,
          ),
      },
      {
        path: 'produits/:id',
        loadComponent: () =>
          import('./features/admin/admin-product-form/admin-product-form').then(
            (m) => m.AdminProductForm,
          ),
      },
    ],
  },

  // Services
  {
    path: 'services',
    loadComponent: () => import('./features/services/services').then((m) => m.Services),
  },

  {
    path: 'categories',
    loadComponent: () =>
      import('./features/admin/admin-categories/admin-categories').then((m) => m.AdminCategories),
  },

  // Route inconnue
  {
    path: '**',
    redirectTo: '',
  },
];
