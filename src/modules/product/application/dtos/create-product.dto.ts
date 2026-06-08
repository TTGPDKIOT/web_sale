import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProductStatus, ShippingType } from '../../domain/entities/product.entity';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsString()
  sku!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  originRegionId!: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsIn(['NORMAL', 'COLD', 'EXPRESS'])
  shippingType?: ShippingType;

  @IsOptional()
  @IsIn(['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'])
  status?: ProductStatus;
}
