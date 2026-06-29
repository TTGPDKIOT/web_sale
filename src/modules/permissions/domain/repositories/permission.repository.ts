export abstract class PermissionRepository {
  abstract findById(id: string): Promise<any | null>;
  abstract findByCode(code: string): Promise<any | null>;
  abstract findAll(skip?: number, take?: number, groupName?: string): Promise<[any[], number]>;
  abstract findByCodes(codes: string[]): Promise<any[]>;
  abstract create(permission: any): Promise<any>;
  abstract update(id: string, data: Partial<any>): Promise<any | null>;
  abstract delete(id: string): Promise<boolean>;
}
