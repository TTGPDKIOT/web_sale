import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Product } from '../../domain/entities/product.entity';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const product = new Product(
      randomUUID(),
      dto.name,
      dto.slug,
      dto.sku,
      dto.price,
      dto.originRegionId,
      dto.shortDescription,
      dto.description,
      dto.salePrice ?? null,
      dto.unit,
      dto.stockQuantity ?? 0,
      dto.shippingType ?? 'NORMAL',
      dto.status ?? 'DRAFT',
    );

    return this.productRepository.save(product);
  }
}
