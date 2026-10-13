import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/role.enum';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-nav.html',
})
export class MobileNav {
  sheetOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  get email(): string {
    return this.authService.currentUser?.email ?? '';
  }

  get isStaff(): boolean {
    return this.authService.hasRole(Role.STAFF, Role.OWNER, Role.ADMIN);
  }

  openSheet(): void {
    this.sheetOpen = true;
  }

  closeSheet(): void {
    this.sheetOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeSheet();
    this.router.navigate(['/']);
  }
}
