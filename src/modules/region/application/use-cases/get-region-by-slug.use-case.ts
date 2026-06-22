import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Region } from '../../domain/entities/region.entity';
import { REGION_REPOSITORY, RegionRepository } from '../../domain/repositories/region.repository';

@Injectable()
export class GetRegionBySlugUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepository: RegionRepository,
  ) {}

  async execute(slug: string): Promise<Region> {
    const region = await this.regionRepository.findBySlug(slug);

    if (!region) {
      throw new NotFoundException(`Region with slug "${slug}" not found`);
    }

    return region;
  }
}
