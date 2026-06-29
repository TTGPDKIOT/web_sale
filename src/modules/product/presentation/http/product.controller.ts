import { Controller, Get, Param } from '@nestjs/common';
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug.use-case';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
  ) {}

  @Get()
  findAll() {
    return this.getProductsUseCase.execute();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.getProductBySlugUseCase.execute(slug);
  }

}
