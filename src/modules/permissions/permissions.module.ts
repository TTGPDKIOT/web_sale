import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionOrmEntity } from './infrastructure/persistence/typeorm/entities/permission.orm-entity';
import { TypeOrmPermissionRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-permission.repository';
import { PermissionRepository } from './domain/repositories/permission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionOrmEntity])],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    {
      provide: PermissionRepository,
      useClass: TypeOrmPermissionRepository,
    },
  ],
  exports: [PermissionsService],
})
export class PermissionsModule {}
