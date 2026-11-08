import { Role } from '../models/role.enum';

export const ROLE_LABELS: Record<Role, { label: string; badge: string }> = {
  [Role.OWNER]: { label: 'Propriétaire', badge: 'badge-accent' },
  [Role.ADMIN]: { label: 'Administrateur', badge: 'badge-brand' },
  [Role.STAFF]: { label: 'Modérateur', badge: 'badge-info' },
  [Role.CUSTOMER]: { label: 'Client', badge: 'badge-neutral' },
};

// Rôles que l'on peut attribuer depuis l'application (le propriétaire ne s'attribue pas).
// Quand on ajoutera les médecins et pédiatres, c'est ici et dans InviteService côté backend.
export const ASSIGNABLE_ROLES: Role[] = [Role.STAFF, Role.ADMIN];
