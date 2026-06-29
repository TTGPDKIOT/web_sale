import { IsString, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  groupName: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
