import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
}
