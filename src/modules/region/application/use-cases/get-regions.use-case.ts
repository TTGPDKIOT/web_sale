import { Inject, Injectable } from '@nestjs/common';
import { Region } from '../../domain/entities/region.entity';
import { REGION_REPOSITORY, RegionRepository } from '../../domain/repositories/region.repository';

@Injectable()
export class GetRegionsUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepository: RegionRepository,
  ) {}

  async execute(): Promise<Region[]> {
    return this.regionRepository.findAll();
  }
}
