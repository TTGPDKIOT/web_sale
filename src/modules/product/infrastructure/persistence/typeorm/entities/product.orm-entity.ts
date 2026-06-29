import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ProductStatus, ShippingType } from '../../../../domain/entities/product.entity';
import { ProductImageOrmEntity } from './product-image.orm-entity';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  sku?: string | null;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId?: string | null;

  @Column({ name: 'supplier_id', type: 'uuid', nullable: true })
  supplierId?: string | null;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  province?: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  price!: number;

  @Column({ name: 'origin_region_id', type: 'uuid', nullable: true })
  originRegionId?: string | null;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'product_story', type: 'text', nullable: true })
  productStory?: string;

  @Column({ type: 'text', nullable: true })
  ingredients?: string;

  @Column({ name: 'storage_instruction', type: 'text', nullable: true })
  storageInstruction?: string;

  @Column({ name: 'usage_instruction', type: 'text', nullable: true })
  usageInstruction?: string;

  @Column({ name: 'origin_info', type: 'text', nullable: true })
  originInfo?: string;

  @Column({ name: 'shipping_note', type: 'text', nullable: true })
  shippingNote?: string;

  @Column({ name: 'sale_price', type: 'numeric', precision: 15, scale: 2, nullable: true })
  salePrice?: number | null;

  @Column({ nullable: true })
  unit?: string;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity!: number;

  @Column({ name: 'min_stock_quantity', default: 0 })
  minStockQuantity!: number;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate?: string | null;

  @Column({ name: 'main_image_url', type: 'text', nullable: true })
  mainImageUrl?: string | null;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl?: string | null;

  @Column({ name: 'shipping_type', default: 'NORMAL' })
  shippingType!: ShippingType;

  @Column({ default: 'DRAFT' })
  status!: ProductStatus;

  @Column({ name: 'is_featured', default: false })
  isFeatured!: boolean;

  @Column({ name: 'is_best_seller', default: false })
  isBestSeller!: boolean;

  @Column({ name: 'is_gift_suitable', default: false })
  isGiftSuitable!: boolean;

  @Column({ name: 'meta_title', nullable: true })
  metaTitle?: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription?: string;

  @Column({ name: 'meta_keywords', type: 'text', nullable: true })
  metaKeywords?: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string | null;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @OneToMany(() => ProductImageOrmEntity, (image) => image.product, { cascade: true })
  images?: ProductImageOrmEntity[];
}
