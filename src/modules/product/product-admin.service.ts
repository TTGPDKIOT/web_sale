import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { DataSource, Repository } from 'typeorm';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateProductDto } from './application/dtos/create-product.dto';
import { ProductImageOrmEntity } from './infrastructure/persistence/typeorm/entities/product-image.orm-entity';
import { ProductOrmEntity } from './infrastructure/persistence/typeorm/entities/product.orm-entity';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

@Injectable()
export class ProductAdminService {
  private readonly products: Repository<ProductOrmEntity>;
  private readonly productImages: Repository<ProductImageOrmEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly auditLogsService: AuditLogsService,
  ) {
    this.products = this.dataSource.getRepository(ProductOrmEntity);
    this.productImages = this.dataSource.getRepository(ProductImageOrmEntity);
  }

  async checkSlug(slug: string) {
    const count = await this.products.count({ where: { slug } });
    return { available: count === 0 };
  }

  async findAdminProduct(id: string) {
    const product = await this.products.findOne({ where: { id }, relations: { images: true } });
    if (!product) throw new NotFoundException('Product not found');
    return this.toResponse(product);
  }

  async uploadImage(file: any, type: 'MAIN' | 'GALLERY') {
    if (!file) throw new BadRequestException('Image file is required');
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only jpg, jpeg, png and webp images are allowed');
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException('Image must not exceed 5MB');
    }

    const uploadDir = join(process.cwd(), 'uploads', 'products');
    await fs.mkdir(uploadDir, { recursive: true });
    const extension = extname(file.originalname) || this.extensionFromMime(file.mimetype);
    const fileName = `${type.toLowerCase()}-${Date.now()}-${randomUUID()}${extension}`;
    const filePath = join(uploadDir, fileName);
    await fs.writeFile(filePath, file.buffer);

    const baseUrl = this.configService.get<string>('PUBLIC_API_URL') || `http://localhost:${this.configService.get<string>('APP_PORT') || 3000}/api`;
    const url = `${baseUrl}/uploads/products/${fileName}`;
    return {
      url,
      thumbnailUrl: url,
      fileName,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async createProduct(dto: CreateProductDto, user?: any, requestMeta?: { ipAddress?: string; userAgent?: string }) {
    this.validateCreatePayload(dto);

    const slugAvailable = await this.checkSlug(dto.slug);
    if (!slugAvailable.available) throw new ConflictException('Slug already exists');

    if (dto.sku) {
      const skuExists = await this.products.count({ where: { sku: dto.sku } });
      if (skuExists > 0) throw new ConflictException('SKU already exists');
    }

    const result = await this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(ProductOrmEntity);
      const imageRepo = manager.getRepository(ProductImageOrmEntity);
      const id = randomUUID();
      const normalizedImages = this.normalizeImages(dto);
      const mainImage = normalizedImages.find((image) => image.isMain);

      const product = productRepo.create({
        id,
        name: dto.name,
        slug: dto.slug,
        sku: dto.sku || null,
        categoryId: dto.categoryId,
        supplierId: dto.supplierId || null,
        originRegionId: dto.originRegionId || dto.categoryId,
        region: dto.region,
        province: dto.province,
        price: dto.price,
        salePrice: dto.salePrice ?? null,
        stockQuantity: dto.stockQuantity ?? 0,
        minStockQuantity: dto.minStockQuantity ?? 0,
        unit: dto.unit,
        expiryDate: dto.expiryDate || null,
        shortDescription: dto.shortDescription,
        description: dto.description,
        productStory: dto.productStory,
        ingredients: dto.ingredients,
        storageInstruction: dto.storageInstruction,
        usageInstruction: dto.usageInstruction,
        originInfo: dto.originInfo,
        shippingNote: dto.shippingNote,
        mainImageUrl: mainImage?.imageUrl || dto.mainImageUrl || null,
        thumbnailUrl: mainImage?.thumbnailUrl || dto.thumbnailUrl || null,
        shippingType: dto.shippingType ?? 'NORMAL',
        status: dto.stockQuantity === 0 && dto.status === 'ACTIVE' ? 'OUT_OF_STOCK' : dto.status ?? 'DRAFT',
        isFeatured: dto.isFeatured ?? false,
        isBestSeller: dto.isBestSeller ?? false,
        isGiftSuitable: dto.isGiftSuitable ?? false,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        createdBy: user?.id || null,
        updatedBy: user?.id || null,
      });

      const saved = await productRepo.save(product);
      if (normalizedImages.length) {
        await imageRepo.save(normalizedImages.map((image) => imageRepo.create({ ...image, productId: saved.id })));
      }
      return saved;
    });

    await this.auditLogsService.createAuditLog({
      userId: user?.id,
      action: 'PRODUCT_CREATED',
      targetType: 'PRODUCT',
      targetId: result.id,
      metadata: {
        name: result.name,
        slug: result.slug,
        status: result.status,
        price: Number(result.price),
        salePrice: result.salePrice ? Number(result.salePrice) : null,
      },
      ipAddress: requestMeta?.ipAddress,
      userAgent: requestMeta?.userAgent,
    }).catch(() => undefined);

    return {
      id: result.id,
      name: result.name,
      slug: result.slug,
      sku: result.sku,
      status: result.status,
      mainImageUrl: result.mainImageUrl,
      createdAt: result.createdAt,
    };
  }

  private validateCreatePayload(dto: CreateProductDto) {
    if (dto.salePrice !== undefined && dto.salePrice > dto.price) {
      throw new BadRequestException('Sale price must not be greater than price');
    }
    if ((dto.images?.length ?? 0) > 10) {
      throw new BadRequestException('Product gallery must not exceed 10 images');
    }
    const mainImages = dto.images?.filter((image) => image.isMain) ?? [];
    if (mainImages.length > 1) {
      throw new BadRequestException('Only one image can be main image');
    }
    const status = dto.status ?? 'DRAFT';
    if (status === 'ACTIVE' && (!dto.mainImageUrl || !dto.shortDescription || !dto.description)) {
      throw new BadRequestException('ACTIVE product requires main image, short description and description');
    }
    if (mainImages.length === 1 && dto.mainImageUrl && mainImages[0].imageUrl !== dto.mainImageUrl) {
      throw new BadRequestException('Main gallery image must match mainImageUrl');
    }
  }

  private normalizeImages(dto: CreateProductDto) {
    const images = [...(dto.images ?? [])];
    if (dto.mainImageUrl && !images.some((image) => image.imageUrl === dto.mainImageUrl)) {
      images.unshift({
        imageUrl: dto.mainImageUrl,
        thumbnailUrl: dto.thumbnailUrl || dto.mainImageUrl,
        altText: dto.name,
        sortOrder: 0,
        isMain: true,
      });
    }
    const mainIndex = Math.max(0, images.findIndex((image) => image.isMain));
    return images.slice(0, 10).map((image, index) => ({
      imageUrl: image.imageUrl,
      thumbnailUrl: image.thumbnailUrl || image.imageUrl,
      altText: image.altText || dto.name,
      sortOrder: image.sortOrder ?? index,
      isMain: index === mainIndex,
    }));
  }

  private extensionFromMime(mime: string) {
    if (mime === 'image/png') return '.png';
    if (mime === 'image/webp') return '.webp';
    return '.jpg';
  }

  private toResponse(product: ProductOrmEntity) {
    return {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice !== null && product.salePrice !== undefined ? Number(product.salePrice) : null,
      imageUrls: product.images?.sort((a, b) => a.sortOrder - b.sortOrder).map((image) => image.imageUrl) ?? [],
    };
  }
}
