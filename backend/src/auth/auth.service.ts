import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { AuthResult, AuthTokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existingUser = await this.usersService.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    // Hash password with Argon2id
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const user = await this.usersService.create({
      name: dto.name?.trim() || null,
      email: normalizedEmail,
      passwordHash,
      provider: 'email',
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });

    // Hash refresh token before persisting
    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    // Generic error message: do not reveal whether user exists
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });

    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    // Generate new token pair (rotation)
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });

    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    await this.usersService.updateHashedRefreshToken(userId, null);
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (user) {
      this.logger.log(
        `Password reset requested for user: ${user.id} (${normalizedEmail}). Email delivery service is not configured yet.`,
      );
    } else {
      this.logger.log(`Password reset requested for non-existent email: ${normalizedEmail}`);
    }

    // Always return generic safe message to prevent email enumeration
    return {
      message: 'If an account with this email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    this.logger.log(`Password reset attempt with token: ${dto.token.slice(0, 8)}...`);
    return {
      message: 'Password reset functionality will be enabled when email delivery is configured.',
    };
  }

  private async updateHashedRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashed = await argon2.hash(refreshToken, {
      type: argon2.argon2id,
    });
    await this.usersService.updateHashedRefreshToken(userId, hashed);
  }

  private async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    const accessSecret = this.configService.get<string>('jwt.accessSecret');
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret');
    const accessExpiresIn = this.configService.get<string>('jwt.accessExpiresIn') || '15m';
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn as unknown as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as unknown as JwtSignOptions['expiresIn'],
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
