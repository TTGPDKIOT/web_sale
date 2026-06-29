import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateUserDto, UpdateUserDto, AssignRolesToUserDto } from './application/dtos/user.dto';

@ApiTags('admin/users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('user.read')
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('roleId') roleId?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.getAllUsers(page, limit, status, roleId, search);
  }

  @Get(':id')
  @RequirePermissions('user.read')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @RequirePermissions('user.update')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Post(':id/assign-roles')
  @RequirePermissions('role.assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign roles to user' })
  async assignRolesToUser(
    @Param('id') id: string,
    @Body() assignRolesToUserDto: AssignRolesToUserDto,
  ) {
    return this.usersService.assignRolesToUser(id, assignRolesToUserDto);
  }

  @Post(':id/block')
  @RequirePermissions('user.block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Block user' })
  async blockUser(@Param('id') id: string) {
    return this.usersService.blockUser(id);
  }

  @Post(':id/unblock')
  @RequirePermissions('user.block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unblock user' })
  async unblockUser(@Param('id') id: string) {
    return this.usersService.unblockUser(id);
  }
}
