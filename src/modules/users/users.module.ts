import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from '../roles/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { RefreshTokenOrmEntity } from '../../common/utils/refresh-token.orm-entity';
import { AuditLogOrmEntity } from '../audit-logs/infrastructure/persistence/typeorm/entities/audit-log.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-user.repository';
import { TypeOrmRoleRepository } from '../roles/infrastructure/persistence/typeorm/repositories/typeorm-role.repository';
import { TypeOrmRefreshTokenRepository } from '../../common/utils/typeorm-refresh-token.repository';
import { TypeOrmAuditLogRepository } from '../audit-logs/infrastructure/persistence/typeorm/repositories/typeorm-audit-log.repository';
import { UserRepository } from './domain/repositories/user.repository';
import { RoleRepository } from '../roles/domain/repositories/role.repository';
import { RefreshTokenRepository } from '../../common/utils/refresh-token.repository';
import { AuditLogRepository } from '../audit-logs/domain/repositories/audit-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RoleOrmEntity,
      RefreshTokenOrmEntity,
      AuditLogOrmEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: RoleRepository,
      useClass: TypeOrmRoleRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: TypeOrmRefreshTokenRepository,
    },
    {
      provide: AuditLogRepository,
      useClass: TypeOrmAuditLogRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
