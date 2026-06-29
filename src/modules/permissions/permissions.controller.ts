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
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreatePermissionDto, UpdatePermissionDto } from './application/dtos/permission.dto';

@ApiTags('admin/permissions')
@ApiBearerAuth()
@Controller('admin/permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions('permission.read')
  @ApiOperation({ summary: 'Get all permissions' })
  async getAllPermissions(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('groupName') groupName?: string,
  ) {
    return this.permissionsService.getAllPermissions(page, limit, groupName);
  }

  @Get(':id')
  @RequirePermissions('permission.read')
  @ApiOperation({ summary: 'Get permission by ID' })
  async getPermissionById(@Param('id') id: string) {
    return this.permissionsService.getPermissionById(id);
  }

  @Post()
  @RequirePermissions('permission.create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new permission' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @Patch(':id')
  @RequirePermissions('permission.update')
  @ApiOperation({ summary: 'Update permission' })
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.updatePermission(id, updatePermissionDto);
  }

  @Delete(':id')
  @RequirePermissions('permission.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete permission' })
  async deletePermission(@Param('id') id: string) {
    return this.permissionsService.deletePermission(id);
  }
}
