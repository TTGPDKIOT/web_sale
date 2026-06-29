import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { UserOrmEntity } from '../users/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from '../roles/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { TypeOrmUserRepository } from '../users/infrastructure/persistence/typeorm/repositories/typeorm-user.repository';
import { TypeOrmRoleRepository } from '../roles/infrastructure/persistence/typeorm/repositories/typeorm-role.repository';
import { RefreshTokenOrmEntity } from '../../common/utils/refresh-token.orm-entity';
import { TypeOrmRefreshTokenRepository } from '../../common/utils/typeorm-refresh-token.repository';
import { AuditLogOrmEntity } from '../audit-logs/infrastructure/persistence/typeorm/entities/audit-log.orm-entity';
import { TypeOrmAuditLogRepository } from '../audit-logs/infrastructure/persistence/typeorm/repositories/typeorm-audit-log.repository';
import { UserRepository } from '../users/domain/repositories/user.repository';
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
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
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
