export enum RoleCode {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export class Role {
  id: string;
  code: RoleCode | string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
