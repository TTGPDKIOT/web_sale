import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './application/dtos/register.dto';
import { LoginDto } from './application/dtos/login.dto';
import { GoogleLoginDto } from './application/dtos/google-login.dto';
import { RefreshTokenDto } from './application/dtos/refresh-token.dto';
import { LogoutDto } from './application/dtos/logout.dto';
import { ChangePasswordDto } from './application/dtos/change-password.dto';
import { AuthResponseDto, TokenResponseDto, CurrentUserDto } from './application/dtos/auth-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<AuthResponseDto> {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or register user with Google ID token' })
  async loginWithGoogle(
    @Body() googleLoginDto: GoogleLoginDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    return this.authService.loginWithGoogle(googleLoginDto.idToken, ipAddress, userAgent);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(
    @Body() logoutDto: LogoutDto,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    await this.authService.logout(logoutDto.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAllDevices(@CurrentUser() user: any): Promise<{ message: string }> {
    if (!user || !user.id) {
      throw new UnauthorizedException('User not found');
    }
    await this.authService.logoutAllDevices(user.id);
    return { message: 'Logged out from all devices' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    if (!user || !user.id) {
      throw new UnauthorizedException('User not found');
    }
    await this.authService.changePassword(user.id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getCurrentUser(@CurrentUser() user: any): Promise<CurrentUserDto> {
    if (!user || !user.id) {
      throw new UnauthorizedException('User not found');
    }
    return this.authService.getCurrentUser(user.id);
  }
}
