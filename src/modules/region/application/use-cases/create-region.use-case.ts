import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Region } from '../../domain/entities/region.entity';
import { REGION_REPOSITORY, RegionRepository } from '../../domain/repositories/region.repository';
import { CreateRegionDto } from '../dtos/create-region.dto';

@Injectable()
export class CreateRegionUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepository: RegionRepository,
  ) {}

  async execute(dto: CreateRegionDto): Promise<Region> {
    const region = new Region(
      randomUUID(),
      dto.name,
      dto.slug,
      dto.type,
      dto.description,
      dto.parentId ?? null,
      dto.imageUrl ?? null,
      dto.latitude ?? null,
      dto.longitude ?? null,
      dto.isActive ?? true,
    );

    return this.regionRepository.save(region);
  }
}
