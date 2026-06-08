import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { RegionType } from '../../domain/entities/region.entity';

export class CreateRegionDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsIn(['NORTH', 'CENTRAL', 'SOUTH', 'PROVINCE', 'VILLAGE'])
  type!: RegionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
