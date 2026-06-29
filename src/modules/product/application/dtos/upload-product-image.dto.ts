import { IsIn } from 'class-validator';

export class UploadProductImageDto {
  @IsIn(['MAIN', 'GALLERY'])
  type!: 'MAIN' | 'GALLERY';
}
