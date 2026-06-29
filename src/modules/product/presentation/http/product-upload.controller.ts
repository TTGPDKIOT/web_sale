import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Controller('uploads/products')
export class ProductUploadController {
  @Get(':fileName')
  sendProductImage(@Param('fileName') fileName: string, @Res() response: any) {
    const filePath = join(process.cwd(), 'uploads', 'products', fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }
    return response.sendFile(filePath);
  }
}
