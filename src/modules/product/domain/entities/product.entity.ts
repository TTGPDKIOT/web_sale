export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
export type ShippingType = 'NORMAL' | 'COLD' | 'EXPRESS';

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public sku: string | null | undefined,
    public price: number,
    public originRegionId: string | null | undefined,
    public shortDescription?: string,
    public description?: string,
    public salePrice?: number | null,
    public unit?: string,
    public stockQuantity = 0,
    public shippingType: ShippingType = 'NORMAL',
    public status: ProductStatus = 'DRAFT',
    public mainImageUrl?: string,
    public thumbnailUrl?: string,
    public region?: string,
    public province?: string,
    public productStory?: string,
    public ingredients?: string,
    public storageInstruction?: string,
    public usageInstruction?: string,
    public originInfo?: string,
    public shippingNote?: string,
    public isFeatured = false,
    public isBestSeller = false,
    public isGiftSuitable = false,
    public metaTitle?: string,
    public metaDescription?: string,
    public metaKeywords?: string,
  ) {}
}
