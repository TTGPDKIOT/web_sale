import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleOrmEntity } from './infrastructure/persistence/typeorm/entities/role.orm-entity';
import { PermissionOrmEntity } from '../permissions/infrastructure/persistence/typeorm/entities/permission.orm-entity';
import { AuditLogOrmEntity } from '../audit-logs/infrastructure/persistence/typeorm/entities/audit-log.orm-entity';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-role.repository';
import { TypeOrmPermissionRepository } from '../permissions/infrastructure/persistence/typeorm/repositories/typeorm-permission.repository';
import { TypeOrmAuditLogRepository } from '../audit-logs/infrastructure/persistence/typeorm/repositories/typeorm-audit-log.repository';
import { RoleRepository } from './domain/repositories/role.repository';
import { PermissionRepository } from '../permissions/domain/repositories/permission.repository';
import { AuditLogRepository } from '../audit-logs/domain/repositories/audit-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleOrmEntity,
      PermissionOrmEntity,
      AuditLogOrmEntity,
    ]),
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: RoleRepository,
      useClass: TypeOrmRoleRepository,
    },
    {
      provide: PermissionRepository,
      useClass: TypeOrmPermissionRepository,
    },
    {
      provide: AuditLogRepository,
      useClass: TypeOrmAuditLogRepository,
    },
  ],
  exports: [RolesService],
})
export class RolesModule {}
