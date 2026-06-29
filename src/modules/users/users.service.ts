import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './domain/repositories/user.repository';
import { RoleRepository } from '../roles/domain/repositories/role.repository';
import { AuditLogRepository } from '../audit-logs/domain/repositories/audit-log.repository';
import { RefreshTokenRepository } from '../../common/utils/refresh-token.repository';
import { CreateUserDto, UpdateUserDto, AssignRolesToUserDto } from './application/dtos/user.dto';
import { UserStatus } from './domain/entities/user.entity';
import { AuditActionType } from '../audit-logs/domain/entities/audit-log.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async getAllUsers(
    page = 1,
    limit = 10,
    status?: string,
    roleId?: string,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAll(
      skip,
      limit,
      status,
      roleId,
      search,
    );

    return {
      data: users.map((user) => this.formatUserResponse(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findWithRolesAndPermissions(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.formatUserResponse(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.userRepository.update(id, updateUserDto);

    await this.auditLogRepository.create({
      action: AuditActionType.USER_UPDATED,
      targetType: 'USER',
      targetId: id,
      metadata: updateUserDto,
    });

    return this.formatUserResponse(updated);
  }

  async assignRolesToUser(userId: string, assignRolesToUserDto: AssignRolesToUserDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { roleIds } = assignRolesToUserDto;

    // Verify all roles exist
    for (const roleId of roleIds) {
      const role = await this.roleRepository.findById(roleId);
      if (!role) {
        throw new BadRequestException(`Role with id ${roleId} not found`);
      }
    }

    // Update user roles - This would require a proper many-to-many update
    // For now, we'll just audit log it

    await this.auditLogRepository.create({
      action: AuditActionType.USER_UPDATED,
      targetType: 'USER',
      targetId: userId,
      metadata: { rolesAssigned: roleIds },
    });

    const updatedUser = await this.userRepository.findWithRolesAndPermissions(userId);
    return this.formatUserResponse(updatedUser);
  }

  async blockUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new BadRequestException('User is already blocked');
    }

    // Block user
    await this.userRepository.update(userId, {
      status: UserStatus.BLOCKED,
    });

    // Revoke all tokens
    await this.refreshTokenRepository.revokeAllUserTokens(userId);

    // Audit log
    await this.auditLogRepository.create({
      action: AuditActionType.USER_BLOCKED,
      targetType: 'USER',
      targetId: userId,
    });

    const updatedUser = await this.userRepository.findById(userId);
    return this.formatUserResponse(updatedUser);
  }

  async unblockUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== UserStatus.BLOCKED) {
      throw new BadRequestException('User is not blocked');
    }

    await this.userRepository.update(userId, {
      status: UserStatus.ACTIVE,
    });

    const updatedUser = await this.userRepository.findById(userId);
    return this.formatUserResponse(updatedUser);
  }

  private formatUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      status: user.status,
      roles: user.roles?.map((r: any) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })) || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
