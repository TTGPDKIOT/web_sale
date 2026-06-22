import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug.use-case';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Get()
  findAll() {
    return this.getProductsUseCase.execute();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.getProductBySlugUseCase.execute(slug);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }
}
