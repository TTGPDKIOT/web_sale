import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './application/dtos/register.dto';
import { LoginDto } from './application/dtos/login.dto';
import { ChangePasswordDto } from './application/dtos/change-password.dto';
import { AuthResponseDto, CurrentUserDto, TokenResponseDto } from './application/dtos/auth-response.dto';
import { UserRepository } from '../users/domain/repositories/user.repository';
import { RoleRepository } from '../roles/domain/repositories/role.repository';
import { UserStatus, UserProvider } from '../users/domain/entities/user.entity';
import { RefreshTokenRepository } from '../../common/utils/refresh-token.repository';
import { AuditLogRepository } from '../audit-logs/domain/repositories/audit-log.repository';
import { AuditActionType } from '../audit-logs/domain/entities/audit-log.entity';
import { RoleCode } from '../roles/domain/entities/role.entity';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly refreshTokenMaxAge: number;
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {
    this.accessTokenExpiry = this.configService.get('JWT_EXPIRY', '15m');
    this.refreshTokenExpiry = this.configService.get('REFRESH_TOKEN_EXPIRY', '7d');
    this.refreshTokenMaxAge = this.parseExpiryToMilliseconds(this.refreshTokenExpiry);
    this.googleClient = new OAuth2Client();
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, phone, password, fullName } = registerDto;

    // Check if email exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if phone exists
    if (phone) {
      const userWithPhone = await this.userRepository.findByPhone(phone);
      if (userWithPhone) {
        throw new ConflictException('Phone number already registered');
      }
    }

    // Hash password using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Get customer role
    const customerRole = await this.roleRepository.findByCode(RoleCode.CUSTOMER);
    if (!customerRole) {
      throw new InternalServerErrorException('Customer role not found');
    }

    const defaultStatus = this.configService.get<UserStatus>(
      'REGISTER_DEFAULT_STATUS',
      UserStatus.ACTIVE,
    );

    // Create user
    const newUser = await this.userRepository.create({
      email,
      phone,
      passwordHash,
      fullName,
      status: defaultStatus,
      provider: UserProvider.LOCAL,
      roles: [customerRole],
    });

    const userWithRoles = await this.userRepository.findWithRolesAndPermissions(newUser.id);
    return this.buildAuthResponse(userWithRoles);
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const identifier = loginDto.identifier.trim().toLowerCase();
    const { password } = loginDto;

    // Find user by email or phone
    const user = await this.userRepository.findByEmailOrPhone(identifier);
    if (!user) {
      await this.auditLogRepository.create({
        action: AuditActionType.LOGIN_FAILED,
        ipAddress,
        userAgent,
        metadata: { reason: 'User not found', identifier },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      await this.auditLogRepository.create({
        userId: user.id,
        action: AuditActionType.LOGIN_FAILED,
        ipAddress,
        userAgent,
        metadata: { reason: 'Invalid password' },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check user status
    if (user.status !== UserStatus.ACTIVE) {
      const messages: Record<string, string> = {
        [UserStatus.BLOCKED]: 'Your account has been blocked',
        [UserStatus.INACTIVE]: 'Your account is inactive',
        [UserStatus.PENDING_VERIFY]: 'Your account is pending verification',
      };
      throw new UnauthorizedException(messages[user.status] || 'Your account is not active');
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    const userWithRoles = await this.userRepository.findWithRolesAndPermissions(user.id);

    // Create tokens
    const accessToken = this.generateAccessToken(userWithRoles ?? user);
    const refreshToken = await this.generateAndSaveRefreshToken(user.id, ipAddress, userAgent);

    // Audit log
    await this.auditLogRepository.create({
      userId: user.id,
      action: AuditActionType.LOGIN_SUCCESS,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: await this.buildCurrentUserDto(userWithRoles ?? user),
    };
  }

  async loginWithGoogle(
    idToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const googlePayload = await this.verifyGoogleIdToken(idToken);
    const email = googlePayload.email?.trim().toLowerCase();

    if (!email || !googlePayload.sub) {
      await this.auditLogRepository.create({
        action: AuditActionType.LOGIN_FAILED,
        ipAddress,
        userAgent,
        metadata: { provider: UserProvider.GOOGLE, reason: 'Missing email or subject' },
      });
      throw new UnauthorizedException('Invalid Google account');
    }

    if (!googlePayload.email_verified) {
      await this.auditLogRepository.create({
        action: AuditActionType.LOGIN_FAILED,
        ipAddress,
        userAgent,
        metadata: { provider: UserProvider.GOOGLE, reason: 'Email is not verified', email },
      });
      throw new UnauthorizedException('Google email is not verified');
    }

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = await this.createGoogleUser(googlePayload, email);
    } else if (user.provider !== UserProvider.GOOGLE || user.providerId !== googlePayload.sub) {
      user = await this.userRepository.update(user.id, {
        provider: UserProvider.GOOGLE,
        providerId: googlePayload.sub,
        avatarUrl: user.avatarUrl || googlePayload.picture,
      });
    }

    if (!user || user.status !== UserStatus.ACTIVE) {
      const userId = user?.id;
      await this.auditLogRepository.create({
        userId,
        action: AuditActionType.LOGIN_FAILED,
        ipAddress,
        userAgent,
        metadata: { provider: UserProvider.GOOGLE, reason: 'User not active', email },
      });
      throw new UnauthorizedException('User not found or inactive');
    }

    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    await this.auditLogRepository.create({
      userId: user.id,
      action: AuditActionType.LOGIN_SUCCESS,
      ipAddress,
      userAgent,
      metadata: { provider: UserProvider.GOOGLE },
    });

    const userWithRoles = await this.userRepository.findWithRolesAndPermissions(user.id);
    const accessToken = this.generateAccessToken(userWithRoles ?? user);
    const refreshToken = await this.generateAndSaveRefreshToken(user.id, ipAddress, userAgent);

    return {
      accessToken,
      refreshToken,
      user: await this.buildCurrentUserDto(userWithRoles ?? user),
    };
  }

  async refreshToken(oldRefreshToken: string): Promise<TokenResponseDto> {
    // Hash the token to find it in DB
    const tokenHash = this.hashToken(oldRefreshToken);

    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is revoked
    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const user = await this.userRepository.findWithRoles(storedToken.userId);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Revoke old token
    await this.refreshTokenRepository.revokeToken(storedToken.id);

    // Generate new tokens
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateAndSaveRefreshToken(
      user.id,
      storedToken.ipAddress,
      storedToken.userAgent,
    );

    // Link old token to new one
    await this.refreshTokenRepository.update(storedToken.id, {
      replacedByTokenId: (await this.refreshTokenRepository.findByTokenHash(
        this.hashToken(newRefreshToken),
      )).id,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (storedToken) {
      await this.refreshTokenRepository.revokeToken(storedToken.id);

      await this.auditLogRepository.create({
        userId: storedToken.userId,
        action: AuditActionType.LOGOUT,
      });
    }
  }

  async logoutAllDevices(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllUserTokens(userId);

    await this.auditLogRepository.create({
      userId,
      action: AuditActionType.LOGOUT,
      metadata: { allDevices: true },
    });
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!passwordMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userRepository.update(userId, {
      passwordHash: newPasswordHash,
    });

    // Revoke all other device tokens
    const activeTokens = await this.refreshTokenRepository.findActiveTokensByUserId(userId);
    for (const token of activeTokens) {
      await this.refreshTokenRepository.revokeToken(token.id);
    }

    // Audit log
    await this.auditLogRepository.create({
      userId,
      action: AuditActionType.CHANGE_PASSWORD,
    });
  }

  async getCurrentUser(userId: string): Promise<CurrentUserDto> {
    const user = await this.userRepository.findWithRolesAndPermissions(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.buildCurrentUserDto(user);
  }

  async blockUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
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
  }

  // ==================== Private Helper Methods ====================

  private async verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    if (!clientId) {
      throw new UnauthorizedException('Google login is not configured');
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  private async createGoogleUser(
    googlePayload: TokenPayload,
    email: string,
  ): Promise<any> {
    const customerRole = await this.roleRepository.findByCode(RoleCode.CUSTOMER);
    if (!customerRole) {
      throw new InternalServerErrorException('Customer role not found');
    }

    const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
    const fullName = googlePayload.name || email.split('@')[0];

    return this.userRepository.create({
      email,
      passwordHash,
      fullName,
      avatarUrl: googlePayload.picture,
      status: UserStatus.ACTIVE,
      provider: UserProvider.GOOGLE,
      providerId: googlePayload.sub,
      roles: [customerRole],
    });
  }

  private generateAccessToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((r: any) => r.code) || [],
      permissions: this.extractPermissionsFromUser(user),
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiry as any,
      secret: this.configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  private async generateAndSaveRefreshToken(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);

    const expiresAt = new Date(Date.now() + this.refreshTokenMaxAge);

    await this.refreshTokenRepository.create({
      userId,
      tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return token;
  }

  private async buildAuthResponse(user: any): Promise<AuthResponseDto> {
    if (!user) {
      throw new InternalServerErrorException('User could not be loaded');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateAndSaveRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: await this.buildCurrentUserDto(user),
    };
  }

  private async buildCurrentUserDto(user: any): Promise<CurrentUserDto> {
    const permissions = this.extractPermissionsFromUser(user);

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      roles: user.roles?.map((r: any) => r.code) || [],
      permissions,
    };
  }

  private extractPermissionsFromUser(user: any): string[] {
    if (!user.roles || user.roles.length === 0) {
      return [];
    }

    const permissions = new Set<string>();

    for (const role of user.roles) {
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach((p: any) => {
          permissions.add(p.code);
        });
      }
    }

    // ADMIN has all permissions
    if (user.roles.some((r: any) => r.code === RoleCode.ADMIN)) {
      return ['*']; // Special permission meaning "all"
    }

    return Array.from(permissions);
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseExpiryToMilliseconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error('Invalid expiry format');
    }

    const [, amount, unit] = match;
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return parseInt(amount) * multipliers[unit as keyof typeof multipliers];
  }
}
