import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../common/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { UploadProductImageDto } from '../../application/dtos/upload-product-image.dto';
import { ProductAdminService } from '../../product-admin.service';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) {}

  @Get('check-slug')
  @RequirePermissions('product.create', 'product.update')
  checkSlug(@Query('slug') slug: string) {
    return this.productAdminService.checkSlug(slug);
  }

  @Get(':id')
  @RequirePermissions('product.read')
  findOne(@Param('id') id: string) {
    return this.productAdminService.findAdminProduct(id);
  }

  @Post('images/upload')
  @RequirePermissions('product.create', 'product.update')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: any, @Body() dto: UploadProductImageDto) {
    return this.productAdminService.uploadImage(file, dto.type);
  }

  @Post()
  @RequirePermissions('product.create')
  create(@Body() dto: CreateProductDto, @CurrentUser() user: any, @Req() request: any) {
    return this.productAdminService.createProduct(dto, user, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });
  }
}
