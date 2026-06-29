import { SetMetadata } from '@nestjs/common';
import { AuditActionType } from '../../modules/audit-logs/domain/entities/audit-log.entity';

export const AUDIT_LOG_KEY = 'auditLog';

export interface AuditLogMetadata {
  action: AuditActionType | string;
  targetType?: string;
}

export const AuditLog = (metadata: AuditLogMetadata) =>
  SetMetadata(AUDIT_LOG_KEY, metadata);
