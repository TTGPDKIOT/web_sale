import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsToRoleDto } from './application/dtos/role.dto';

@ApiTags('admin/roles')
@ApiBearerAuth()
@Controller('admin/roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('role.read')
  @ApiOperation({ summary: 'Get all roles' })
  async getAllRoles(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.rolesService.getAllRoles(page, limit);
  }

  @Get(':id')
  @RequirePermissions('role.read')
  @ApiOperation({ summary: 'Get role by ID' })
  async getRoleById(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  @Post()
  @RequirePermissions('role.create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new role' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Patch(':id')
  @RequirePermissions('role.update')
  @ApiOperation({ summary: 'Update role' })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @RequirePermissions('role.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete role' })
  async deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }

  @Post(':id/permissions')
  @RequirePermissions('permission.assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permissions to role' })
  async assignPermissionsToRole(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsToRoleDto,
  ) {
    return this.rolesService.assignPermissionsToRole(id, assignPermissionsDto);
  }
}
