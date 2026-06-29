export abstract class AuditLogRepository {
  abstract create(auditLog: any): Promise<any>;
  abstract findByUserId(userId: string, skip?: number, take?: number): Promise<[any[], number]>;
  abstract findByTargetId(targetId: string): Promise<any[]>;
}
