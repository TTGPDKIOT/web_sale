export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING_VERIFY = 'PENDING_VERIFY',
}

export enum UserProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export class User {
  id: string;
  email: string;
  phone?: string;
  passwordHash: string;
  fullName: string;
  avatarUrl?: string;
  status: UserStatus;
  provider: UserProvider;
  providerId?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
