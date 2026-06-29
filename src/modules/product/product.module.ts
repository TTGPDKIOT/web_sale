import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductBySlugUseCase } from './application/use-cases/get-product-by-slug.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { ProductAdminService } from './product-admin.service';
import { ProductImageOrmEntity } from './infrastructure/persistence/typeorm/entities/product-image.orm-entity';
import { ProductOrmEntity } from './infrastructure/persistence/typeorm/entities/product.orm-entity';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ProductAdminController } from './presentation/http/product-admin.controller';
import { ProductController } from './presentation/http/product.controller';
import { ProductUploadController } from './presentation/http/product-upload.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity, ProductImageOrmEntity]), AuditLogsModule],
  controllers: [ProductController, ProductAdminController, ProductUploadController],
  providers: [
    GetProductsUseCase,
    GetProductBySlugUseCase,
    CreateProductUseCase,
    ProductAdminService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeOrmProductRepository,
    },
  ],
})
export class ProductModule {}
