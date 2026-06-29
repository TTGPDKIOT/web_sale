import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../../../../domain/entities/product.entity';
import { ProductRepository } from '../../../../domain/repositories/product.repository';
import { ProductOrmEntity } from '../entities/product.orm-entity';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  private readonly repo: Repository<ProductOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ProductOrmEntity);
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.repo.find({
      where: [{ status: 'ACTIVE' }, { status: 'OUT_OF_STOCK' }],
      relations: { images: true },
      order: { name: 'ASC' },
    });
    return rows.map(this.toDomain);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const row = await this.repo.findOne({
      where: [{ slug, status: 'ACTIVE' }, { slug, status: 'OUT_OF_STOCK' }],
      relations: { images: true },
    });
    return row ? this.toDomain(row) : null;
  }

  async save(product: Product): Promise<Product> {
    const row = this.repo.create(product);
    const saved = await this.repo.save(row);
    return this.toDomain(saved);
  }

  private toDomain(row: ProductOrmEntity): Product {
    return new Product(
      row.id,
      row.name,
      row.slug,
      row.sku,
      Number(row.price),
      row.originRegionId,
      row.shortDescription,
      row.description,
      row.salePrice !== null && row.salePrice !== undefined ? Number(row.salePrice) : null,
      row.unit,
      row.stockQuantity,
      row.shippingType,
      row.status,
      row.mainImageUrl ?? undefined,
      row.thumbnailUrl ?? undefined,
      row.region,
      row.province,
      row.productStory,
      row.ingredients,
      row.storageInstruction,
      row.usageInstruction,
      row.originInfo,
      row.shippingNote,
      row.isFeatured,
      row.isBestSeller,
      row.isGiftSuitable,
      row.metaTitle,
      row.metaDescription,
      row.metaKeywords,
    );
  }
}
