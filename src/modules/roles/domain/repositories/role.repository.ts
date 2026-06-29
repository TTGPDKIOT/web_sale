export abstract class RoleRepository {
  abstract findById(id: string): Promise<any | null>;
  abstract findByCode(code: string): Promise<any | null>;
  abstract findAll(skip?: number, take?: number): Promise<[any[], number]>;
  abstract create(role: any): Promise<any>;
  abstract update(id: string, data: Partial<any>): Promise<any | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findWithPermissions(id: string): Promise<any | null>;
  abstract assignPermissions(roleId: string, permissionIds: string[]): Promise<void>;
}
