import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './domain/repositories/role.repository';
import { PermissionRepository } from '../permissions/domain/repositories/permission.repository';
import { AuditLogRepository } from '../audit-logs/domain/repositories/audit-log.repository';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsToRoleDto } from './application/dtos/role.dto';
import { RoleCode } from './domain/entities/role.entity';
import { AuditActionType } from '../audit-logs/domain/entities/audit-log.entity';

@Injectable()
export class RolesService {
  private readonly protectedRoles = [RoleCode.CUSTOMER, RoleCode.ADMIN];

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async getAllRoles(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [roles, total] = await this.roleRepository.findAll(skip, limit);

    return {
      data: roles.map((role) => this.formatRoleResponse(role)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRoleById(id: string) {
    const role = await this.roleRepository.findWithPermissions(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return this.formatRoleResponse(role);
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const { code, name, description } = createRoleDto;

    // Check if code already exists
    const existingRole = await this.roleRepository.findByCode(code);
    if (existingRole) {
      throw new BadRequestException('Role with this code already exists');
    }

    const newRole = await this.roleRepository.create({
      code,
      name,
      description,
    });

    await this.auditLogRepository.create({
      action: AuditActionType.ROLE_CREATED,
      targetType: 'ROLE',
      targetId: newRole.id,
      metadata: { code, name },
    });

    return this.formatRoleResponse(newRole);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Prevent updating protected roles code
    if (this.protectedRoles.includes(role.code as RoleCode)) {
      throw new BadRequestException('Cannot modify system roles');
    }

    const updated = await this.roleRepository.update(id, updateRoleDto);

    await this.auditLogRepository.create({
      action: AuditActionType.ROLE_UPDATED,
      targetType: 'ROLE',
      targetId: id,
      metadata: updateRoleDto,
    });

    return this.formatRoleResponse(updated);
  }

  async deleteRole(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Prevent deleting protected roles
    if (this.protectedRoles.includes(role.code as RoleCode)) {
      throw new BadRequestException('Cannot delete system roles');
    }

    const deleted = await this.roleRepository.delete(id);

    if (deleted) {
      await this.auditLogRepository.create({
        action: AuditActionType.ROLE_UPDATED,
        targetType: 'ROLE',
        targetId: id,
        metadata: { action: 'deleted' },
      });
    }

    return { message: 'Role deleted successfully' };
  }

  async assignPermissionsToRole(
    roleId: string,
    assignPermissionsDto: AssignPermissionsToRoleDto,
  ) {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const { permissionIds } = assignPermissionsDto;

    // Verify all permissions exist
    for (const permissionId of permissionIds) {
      const permission = await this.permissionRepository.findById(permissionId);
      if (!permission) {
        throw new BadRequestException(`Permission with id ${permissionId} not found`);
      }
    }

    // Assign permissions
    await this.roleRepository.assignPermissions(roleId, permissionIds);

    await this.auditLogRepository.create({
      action: AuditActionType.ROLE_PERMISSION_UPDATED,
      targetType: 'ROLE',
      targetId: roleId,
      metadata: { permissionIds },
    });

    const updatedRole = await this.roleRepository.findWithPermissions(roleId);
    return this.formatRoleResponse(updatedRole);
  }

  private formatRoleResponse(role: any) {
    return {
      id: role.id,
      code: role.code,
      name: role.name,
      description: role.description,
      permissions: role.permissions?.map((p: any) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        groupName: p.groupName,
      })) || [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
