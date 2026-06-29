import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../modules/product/infrastructure/persistence/typeorm/entities/product.orm-entity';
import { ProductImageOrmEntity } from '../modules/product/infrastructure/persistence/typeorm/entities/product-image.orm-entity';
import { RegionOrmEntity } from '../modules/region/infrastructure/persistence/typeorm/entities/region.orm-entity';
import { StoryOrmEntity } from '../modules/story/infrastructure/persistence/typeorm/entities/story.orm-entity';
import { UserOrmEntity } from '../modules/users/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from '../modules/roles/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { PermissionOrmEntity } from '../modules/permissions/infrastructure/persistence/typeorm/entities/permission.orm-entity';
import { RefreshTokenOrmEntity } from '../common/utils/refresh-token.orm-entity';
import { AuditLogOrmEntity } from '../modules/audit-logs/infrastructure/persistence/typeorm/entities/audit-log.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const password = config.get<string>('DB_PASSWORD');

        if (!password) {
          throw new Error('Missing DB_PASSWORD in .env file');
        }

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST') ?? 'localhost',
          port: Number(config.get<string>('DB_PORT') ?? 5432),
          username: config.get<string>('DB_USERNAME') ?? 'postgres',
          password: String(password),
          database: config.get<string>('DB_DATABASE') ?? 'dac_san_db',
          entities: [
            RegionOrmEntity,
            ProductOrmEntity,
            ProductImageOrmEntity,
            StoryOrmEntity,
            UserOrmEntity,
            RoleOrmEntity,
            PermissionOrmEntity,
            RefreshTokenOrmEntity,
            AuditLogOrmEntity,
          ],
          synchronize: true,
          logging: process.env.DB_LOGGING === 'true',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
