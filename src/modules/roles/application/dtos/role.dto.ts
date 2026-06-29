import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { RoleCode } from '../../domain/entities/role.entity';

export class CreateRoleDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignPermissionsToRoleDto {
  @IsArray()
  permissionIds: string[];
}
