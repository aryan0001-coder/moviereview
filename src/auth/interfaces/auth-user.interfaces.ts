import { UserRole } from '../../users/schemas/user.schema';

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}
