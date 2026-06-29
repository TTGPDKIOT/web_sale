import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ProductOrmEntity } from '../modules/product/infrastructure/persistence/typeorm/entities/product.orm-entity';
import { ProductImageOrmEntity } from '../modules/product/infrastructure/persistence/typeorm/entities/product-image.orm-entity';
import { RegionOrmEntity } from '../modules/region/infrastructure/persistence/typeorm/entities/region.orm-entity';
import { StoryOrmEntity } from '../modules/story/infrastructure/persistence/typeorm/entities/story.orm-entity';
import { UserOrmEntity } from '../modules/users/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from '../modules/roles/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { PermissionOrmEntity } from '../modules/permissions/infrastructure/persistence/typeorm/entities/permission.orm-entity';
import { RefreshTokenOrmEntity } from '../common/utils/refresh-token.orm-entity';
import { AuditLogOrmEntity } from '../modules/audit-logs/infrastructure/persistence/typeorm/entities/audit-log.orm-entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
  migrations: ['src/database/migrations/*.ts'],
});
