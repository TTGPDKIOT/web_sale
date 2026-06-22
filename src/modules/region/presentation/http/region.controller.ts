import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRegionDto } from '../../application/dtos/create-region.dto';
import { CreateRegionUseCase } from '../../application/use-cases/create-region.use-case';
import { GetRegionBySlugUseCase } from '../../application/use-cases/get-region-by-slug.use-case';
import { GetRegionsUseCase } from '../../application/use-cases/get-regions.use-case';

@Controller('regions')
export class RegionController {
  constructor(
    private readonly getRegionsUseCase: GetRegionsUseCase,
    private readonly getRegionBySlugUseCase: GetRegionBySlugUseCase,
    private readonly createRegionUseCase: CreateRegionUseCase,
  ) {}

  @Get()
  findAll() {
    return this.getRegionsUseCase.execute();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.getRegionBySlugUseCase.execute(slug);
  }

  @Post()
  create(@Body() dto: CreateRegionDto) {
    return this.createRegionUseCase.execute(dto);
  }
}
