import { Role } from './role.enum';

export interface ManagedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  role: Role;
  active: boolean;
}
