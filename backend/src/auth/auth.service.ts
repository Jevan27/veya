import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
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

  private static readonly DUMMY_HASH =
    '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$P2GgQ5gX7J5t9Z6m8K3v2Q';

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
      user: this.usersService.toUserDto(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    // Equalize timing to prevent email enumeration via execution time disparity
    const hashToVerify = user?.passwordHash || AuthService.DUMMY_HASH;
    let passwordMatches = false;
    try {
      passwordMatches = await argon2.verify(hashToVerify, dto.password);
    } catch {
      passwordMatches = false;
    }

    // Generic error message: do not reveal whether user exists
    if (!user || !user.passwordHash || !passwordMatches) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });

    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.usersService.toUserDto(user),
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

  /**
   * Generates a cryptographically signed, single-use password reset token.
   * Encodes user ID and a slice of current passwordHash so any password change
   * automatically and immediately invalidates the token against reuse.
   */
  async generatePasswordResetToken(user: User): Promise<string> {
    const accessSecret = this.configService.get<string>('jwt.accessSecret');
    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is required to generate password reset token');
    }

    const pwdHashVersion = user.passwordHash ? user.passwordHash.slice(-10) : 'none';

    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        purpose: 'password-reset',
        pwdHashVersion,
      },
      {
        secret: accessSecret,
        expiresIn: '1h',
      },
    );
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (user) {
      await this.generatePasswordResetToken(user);
      this.logger.log(`Password reset token successfully created for user: ${user.id} (${normalizedEmail})`);
    } else {
      this.logger.log(`Password reset requested for non-existent email: ${normalizedEmail}`);
    }

    // Always return generic safe message to prevent email enumeration
    return {
      message: 'If an account with this email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const accessSecret = this.configService.get<string>('jwt.accessSecret');
    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is required to verify password reset token');
    }

    let payload: { sub?: string; purpose?: string; pwdHashVersion?: string };
    try {
      payload = await this.jwtService.verifyAsync(dto.token, {
        secret: accessSecret,
      });
    } catch {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    if (payload.purpose !== 'password-reset' || !payload.sub) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.passwordHash) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    // Single-use token enforcement: verify password hash has not changed since token generation
    const currentHashVersion = user.passwordHash.slice(-10);
    if (payload.pwdHashVersion !== currentHashVersion) {
      throw new BadRequestException('Password reset token has already been used or is expired.');
    }

    // Hash new password using Argon2id
    const newPasswordHash = await argon2.hash(dto.newPassword, {
      type: argon2.argon2id,
    });

    // Update password and revoke all active refresh tokens/sessions
    await this.usersService.updatePassword(user.id, newPasswordHash);

    this.logger.log(`Password reset successfully executed for user: ${user.id}`);

    return {
      message: 'Password has been reset successfully. Please sign in with your new password.',
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

    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET is required to generate access token');
    }
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is required to generate refresh token');
    }

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
