import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('admin/audit-logs')
@ApiBearerAuth()
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get('user/:userId')
  @RequirePermissions('user.read')
  @ApiOperation({ summary: 'Get audit logs for a user' })
  async getAuditLogsByUser(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.auditLogsService.getAuditLogsByUser(userId, page, limit);
  }

  @Get('target/:targetId')
  @RequirePermissions('user.read')
  @ApiOperation({ summary: 'Get audit logs for a specific target' })
  async getAuditLogsByTarget(@Param('targetId') targetId: string) {
    return this.auditLogsService.getAuditLogsByTarget(targetId);
  }
}
