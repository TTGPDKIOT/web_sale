import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateRegionUseCase } from './application/use-cases/create-region.use-case';
import { GetRegionBySlugUseCase } from './application/use-cases/get-region-by-slug.use-case';
import { GetRegionsUseCase } from './application/use-cases/get-regions.use-case';
import { REGION_REPOSITORY } from './domain/repositories/region.repository';
import { RegionOrmEntity } from './infrastructure/persistence/typeorm/entities/region.orm-entity';
import { TypeOrmRegionRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-region.repository';
import { RegionController } from './presentation/http/region.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegionOrmEntity])],
  controllers: [RegionController],
  providers: [
    GetRegionsUseCase,
    GetRegionBySlugUseCase,
    CreateRegionUseCase,
    {
      provide: REGION_REPOSITORY,
      useClass: TypeOrmRegionRepository,
    },
  ],
  exports: [REGION_REPOSITORY],
})
export class RegionModule {}
