export abstract class UserRepository {
  abstract findById(id: string): Promise<any | null>;
  abstract findByEmail(email: string): Promise<any | null>;
  abstract findByPhone(phone: string): Promise<any | null>;
  abstract findByEmailOrPhone(emailOrPhone: string): Promise<any | null>;
  abstract findAll(
    skip?: number,
    take?: number,
    status?: string,
    roleId?: string,
    search?: string,
  ): Promise<[any[], number]>;
  abstract create(user: any): Promise<any>;
  abstract update(id: string, data: Partial<any>): Promise<any | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findWithRoles(id: string): Promise<any | null>;
  abstract findWithRolesAndPermissions(id: string): Promise<any | null>;
}
