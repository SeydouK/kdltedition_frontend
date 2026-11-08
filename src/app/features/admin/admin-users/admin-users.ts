import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserAdminService } from '../../../core/services/user-admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { ManagedUser } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.enum';
import { ASSIGNABLE_ROLES, ROLE_LABELS } from '../../../core/config/roles';
import { extractError, isValidEmail } from '../../../core/utils/http.utils';

type UserFilter = 'TEAM' | 'CUSTOMERS' | 'INACTIVE' | 'ALL';

interface PendingAction {
  userId: number;
  kind: 'role' | 'deactivate';
  role?: Role;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: ManagedUser[] = [];
  loading = true;
  error = false;

  filter: UserFilter = 'TEAM';
  search = '';

  // Invitation
  inviteEmail = '';
  inviteRole: Role = Role.STAFF;
  inviting = false;
  inviteEmailError = '';
  inviteError = '';
  inviteSuccess = '';

  // Actions sur un compte
  pending: PendingAction | null = null;
  busyId: number | null = null;
  successMessage = '';
  errorMessage = '';

  readonly roles = ROLE_LABELS;
  readonly assignable = ASSIGNABLE_ROLES;
  readonly Role = Role;
  readonly skeletons = [1, 2, 3];
  private readonly myEmail: string;

  readonly filters: { key: UserFilter; label: string }[] = [
    { key: 'TEAM', label: 'Équipe' },
    { key: 'CUSTOMERS', label: 'Clients' },
    { key: 'INACTIVE', label: 'Désactivés' },
    { key: 'ALL', label: 'Tous' },
  ];

  constructor(
    private userService: UserAdminService,
    authService: AuthService,
  ) {
    this.myEmail = (authService.currentUser?.email ?? '').toLowerCase();
  }

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  // ───── Liste ─────

  private matches(user: ManagedUser, filter: UserFilter): boolean {
    switch (filter) {
      case 'TEAM':
        return user.role !== Role.CUSTOMER;
      case 'CUSTOMERS':
        return user.role === Role.CUSTOMER;
      case 'INACTIVE':
        return !user.active;
      default:
        return true;
    }
  }

  get visibleUsers(): ManagedUser[] {
    const query = this.search.trim().toLowerCase();

    return this.users
      .filter((user) => this.matches(user, this.filter))
      .filter(
        (user) =>
          !query ||
          user.email.toLowerCase().includes(query) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(query),
      )
      .sort((a, b) =>
        `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, 'fr'),
      );
  }

  count(filter: UserFilter): number {
    return this.users.filter((user) => this.matches(user, filter)).length;
  }

  isMe(user: ManagedUser): boolean {
    return user.email.toLowerCase() === this.myEmail;
  }

  // Le backend applique les mêmes règles ; ici on évite simplement de proposer des boutons voués à l'échec.
  canManage(user: ManagedUser): boolean {
    return !this.isMe(user) && user.role !== Role.OWNER;
  }

  // Le changement de rôle proposé pour un compte.
  roleChange(user: ManagedUser): { role: Role; label: string } {
    if (user.role === Role.ADMIN) return { role: Role.STAFF, label: 'Passer modérateur' };
    if (user.role === Role.STAFF) return { role: Role.ADMIN, label: 'Passer administrateur' };
    return { role: Role.STAFF, label: 'Nommer modérateur' };
  }

  // ───── Invitation ─────

  invite(): void {
    this.inviteEmailError = '';
    this.inviteError = '';
    this.inviteSuccess = '';

    const email = this.inviteEmail.trim();

    if (!email) {
      this.inviteEmailError = 'Saisissez une adresse email.';
      return;
    }
    if (!isValidEmail(email)) {
      this.inviteEmailError = "Cette adresse email n'est pas valide.";
      return;
    }

    this.inviting = true;

    this.userService.invite(email, this.inviteRole).subscribe({
      next: () => {
        this.inviting = false;
        this.inviteSuccess = `Invitation envoyée à ${email} en tant que ${this.roles[this.inviteRole].label.toLowerCase()}.`;
        this.inviteEmail = '';
      },
      error: (err) => {
        this.inviting = false;
        this.inviteError = extractError(
          err,
          "Impossible d'envoyer l'invitation. Vérifiez l'adresse et réessayez.",
        );
      },
    });
  }

  // ───── Actions sur un compte ─────

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  askRole(user: ManagedUser): void {
    this.clearMessages();
    this.pending = { userId: user.id, kind: 'role', role: this.roleChange(user).role };
  }

  askDeactivate(user: ManagedUser): void {
    this.clearMessages();
    this.pending = { userId: user.id, kind: 'deactivate' };
  }

  cancel(): void {
    this.pending = null;
  }

  confirmText(): string {
    if (!this.pending) return '';
    if (this.pending.kind === 'deactivate') return 'Désactiver ce compte ?';
    return this.pending.role === Role.ADMIN
      ? "Donner les droits d'administrateur ?"
      : `Passer en ${this.roles[this.pending.role!].label.toLowerCase()} ?`;
  }

  confirm(user: ManagedUser): void {
    if (!this.pending || this.busyId !== null) return;

    const action = this.pending;
    this.busyId = user.id;

    const request =
      action.kind === 'role'
        ? this.userService.changeRole(user.id, action.role!)
        : this.userService.deactivate(user.id);

    request.subscribe({
      next: (updated) => {
        this.replace(updated);
        this.busyId = null;
        this.pending = null;
        this.successMessage =
          action.kind === 'role'
            ? `${this.fullName(updated)} est maintenant ${this.roles[updated.role].label.toLowerCase()}.`
            : `${this.fullName(updated)} a été désactivé : son accès est coupé immédiatement.`;
      },
      error: (err) => {
        this.busyId = null;
        this.pending = null;
        this.errorMessage = extractError(err, "Impossible d'effectuer cette action.");
      },
    });
  }

  activate(user: ManagedUser): void {
    if (this.busyId !== null) return;

    this.clearMessages();
    this.busyId = user.id;

    this.userService.activate(user.id).subscribe({
      next: (updated) => {
        this.replace(updated);
        this.busyId = null;
        this.successMessage = `${this.fullName(updated)} a été réactivé.`;
      },
      error: (err) => {
        this.busyId = null;
        this.errorMessage = extractError(err, 'Impossible de réactiver ce compte.');
      },
    });
  }

  private replace(updated: ManagedUser): void {
    this.users = this.users.map((user) => (user.id === updated.id ? updated : user));
  }

  fullName(user: ManagedUser): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }
}
