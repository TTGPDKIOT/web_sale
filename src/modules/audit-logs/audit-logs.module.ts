import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogOrmEntity } from './infrastructure/persistence/typeorm/entities/audit-log.orm-entity';
import { TypeOrmAuditLogRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-audit-log.repository';
import { AuditLogRepository } from './domain/repositories/audit-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogOrmEntity])],
  controllers: [AuditLogsController],
  providers: [
    AuditLogsService,
    {
      provide: AuditLogRepository,
      useClass: TypeOrmAuditLogRepository,
    },
  ],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
