import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRegionDto } from '../../application/dtos/create-region.dto';
import { CreateRegionUseCase } from '../../application/use-cases/create-region.use-case';
import { GetRegionsUseCase } from '../../application/use-cases/get-regions.use-case';

@Controller('regions')
export class RegionController {
  constructor(
    private readonly getRegionsUseCase: GetRegionsUseCase,
    private readonly createRegionUseCase: CreateRegionUseCase,
  ) {}

  @Get()
  findAll() {
    return this.getRegionsUseCase.execute();
  }

  @Post()
  create(@Body() dto: CreateRegionDto) {
    return this.createRegionUseCase.execute(dto);
  }
}
