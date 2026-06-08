export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
export type ShippingType = 'NORMAL' | 'COLD' | 'EXPRESS';

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public sku: string,
    public price: number,
    public originRegionId: string,
    public shortDescription?: string,
    public description?: string,
    public salePrice?: number | null,
    public unit?: string,
    public stockQuantity = 0,
    public shippingType: ShippingType = 'NORMAL',
    public status: ProductStatus = 'DRAFT',
  ) {}
}
