import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { UserStatus } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  fullName: string;

  @IsArray()
  roleIds: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class AssignRolesToUserDto {
  @IsArray()
  roleIds: string[];
}

export class BlockUserDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
