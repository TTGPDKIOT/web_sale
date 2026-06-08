import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductStatus, ShippingType } from '../../../../domain/entities/product.entity';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ unique: true })
  sku!: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  price!: number;

  @Column({ name: 'origin_region_id', type: 'uuid' })
  originRegionId!: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'sale_price', type: 'numeric', precision: 15, scale: 2, nullable: true })
  salePrice?: number | null;

  @Column({ nullable: true })
  unit?: string;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity!: number;

  @Column({ name: 'shipping_type', default: 'NORMAL' })
  shippingType!: ShippingType;

  @Column({ default: 'DRAFT' })
  status!: ProductStatus;
}
