import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PermissionRepository } from './domain/repositories/permission.repository';
import { CreatePermissionDto, UpdatePermissionDto } from './application/dtos/permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getAllPermissions(page = 1, limit = 50, groupName?: string) {
    const skip = (page - 1) * limit;
    const [permissions, total] = await this.permissionRepository.findAll(
      skip,
      limit,
      groupName,
    );

    // Group permissions by groupName
    const grouped = permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.groupName]) {
          acc[permission.groupName] = [];
        }
        acc[permission.groupName].push(this.formatPermissionResponse(permission));
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return {
      data: grouped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPermissionById(id: string) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return this.formatPermissionResponse(permission);
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const { code, name, groupName, description } = createPermissionDto;

    // Check if code already exists
    const existingPermission = await this.permissionRepository.findByCode(code);
    if (existingPermission) {
      throw new BadRequestException('Permission with this code already exists');
    }

    const newPermission = await this.permissionRepository.create({
      code,
      name,
      groupName,
      description,
    });

    return this.formatPermissionResponse(newPermission);
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const updated = await this.permissionRepository.update(id, updatePermissionDto);
    return this.formatPermissionResponse(updated);
  }

  async deletePermission(id: string) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const deleted = await this.permissionRepository.delete(id);

    if (deleted) {
      return { message: 'Permission deleted successfully' };
    }

    throw new BadRequestException('Failed to delete permission');
  }

  private formatPermissionResponse(permission: any) {
    return {
      id: permission.id,
      code: permission.code,
      name: permission.name,
      groupName: permission.groupName,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
