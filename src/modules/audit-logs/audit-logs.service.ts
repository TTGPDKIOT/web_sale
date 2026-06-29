import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from './domain/repositories/audit-log.repository';

@Injectable()
export class AuditLogsService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async createAuditLog(auditLog: any) {
    return this.auditLogRepository.create(auditLog);
  }

  async getAuditLogsByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await this.auditLogRepository.findByUserId(userId, skip, limit);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAuditLogsByTarget(targetId: string) {
    const logs = await this.auditLogRepository.findByTargetId(targetId);
    return { data: logs };
  }
}
