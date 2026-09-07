// eslint-disable-next-line @typescript-eslint/no-require-imports
const crypto = require('crypto');

interface MockTokenPayload {
  sub: string;
  email: string;
  purpose: string;
  pwdHashVersion: string;
  iat?: number;
  exp?: number;
}

function base64UrlEncode(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function base64UrlDecode<T = unknown>(str: string): T {
  return JSON.parse(Buffer.from(str, 'base64url').toString('utf8')) as T;
}

function mockSign(payload: MockTokenPayload, secret: string, expiresIn?: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  let exp = now + 3600;
  if (typeof expiresIn === 'string') {
    if (expiresIn.startsWith('-') || expiresIn === '0s') {
      exp = now - 60;
    } else if (expiresIn.endsWith('s')) {
      exp = now + parseInt(expiresIn, 10);
    } else if (expiresIn.endsWith('m')) {
      exp = now + parseInt(expiresIn, 10) * 60;
    } else if (expiresIn.endsWith('h')) {
      exp = now + parseInt(expiresIn, 10) * 3600;
    }
  }
  const body = { ...payload, iat: now, exp };
  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(body);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64url');
  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

function mockVerify(token: string, secret: string): MockTokenPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token structure');
  const [headerEncoded, payloadEncoded, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64url');
  if (signature !== expectedSig) {
    throw new Error('invalid signature');
  }
  const payload = base64UrlDecode<MockTokenPayload>(payloadEncoded);
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    const err = new Error('jwt expired');
    err.name = 'TokenExpiredError';
    throw err;
  }
  return payload;
}

jest.mock('@nestjs/jwt', () => ({
  JwtService: class MockJwtService {
    async signAsync(payload: MockTokenPayload, options?: { secret?: string; expiresIn?: string }) {
      return mockSign(payload, options?.secret || 'default-secret', options?.expiresIn);
    }
    async verifyAsync(token: string, options?: { secret?: string }) {
      return mockVerify(token, options?.secret || 'default-secret');
    }
    decode(token: string): MockTokenPayload | null {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      try {
        return base64UrlDecode<MockTokenPayload>(parts[1]);
      } catch {
        return null;
      }
    }
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';

describe('Password Reset Security & Reliability', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let mockUsersService: Partial<UsersService>;
  let mockConfigService: Partial<ConfigService>;

  const ACCESS_SECRET = 'super-secure-access-secret-123456';
  let inMemoryUser: User;

  beforeEach(async () => {
    const initialPasswordHash = await argon2.hash('InitialP@ss123!', { type: argon2.argon2id });

    inMemoryUser = {
      id: 'user-pw-123',
      email: 'alex@example.com',
      name: 'Alex',
      company: null,
      role: null,
      avatarUrl: null,
      phoneNumber: null,
      provider: null,
      providerId: null,
      passwordHash: initialPasswordHash,
      hashedRefreshToken: 'existing-hashed-refresh-token',
      onboardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'jwt.accessSecret') return ACCESS_SECRET;
        if (key === 'jwt.refreshSecret') return 'refresh-secret-123456';
        return undefined;
      }),
    };

    mockUsersService = {
      findByEmail: jest.fn().mockImplementation(async (email: string) => {
        if (email === inMemoryUser.email) return inMemoryUser;
        return null;
      }),
      findById: jest.fn().mockImplementation(async (id: string) => {
        if (id === inMemoryUser.id) return inMemoryUser;
        return null;
      }),
      updatePassword: jest.fn().mockImplementation(async (userId: string, newHash: string) => {
        inMemoryUser.passwordHash = newHash;
        inMemoryUser.hashedRefreshToken = null; // Session revoked
        return inMemoryUser;
      }),
      toUserDto: jest.fn().mockImplementation((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        onboardingCompleted: u.onboardingCompleted,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      updateHashedRefreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('forgotPassword (Enumeration Defense)', () => {
    it('should return identical generic message for an existing email', async () => {
      const result = await authService.forgotPassword({ email: 'alex@example.com' });
      expect(result.message).toBe(
        'If an account with this email exists, a password reset link has been sent.',
      );
    });

    it('should return identical generic message for a non-existing email', async () => {
      const result = await authService.forgotPassword({ email: 'nonexistent@example.com' });
      expect(result.message).toBe(
        'If an account with this email exists, a password reset link has been sent.',
      );
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate a valid signed JWT with sub, purpose, and pwdHashVersion', async () => {
      const token = await authService.generatePasswordResetToken(inMemoryUser);
      expect(token).toBeDefined();

      const decoded = await jwtService.verifyAsync(token, { secret: ACCESS_SECRET });
      expect(decoded.sub).toBe(inMemoryUser.id);
      expect(decoded.purpose).toBe('password-reset');
      expect(decoded.pwdHashVersion).toBe(inMemoryUser.passwordHash!.slice(-10));
    });
  });

  describe('resetPassword Execution & Invalidation', () => {
    it('should successfully reset password, allow login with new password, and revoke sessions', async () => {
      const token = await authService.generatePasswordResetToken(inMemoryUser);

      const response = await authService.resetPassword({
        token,
        newPassword: 'BrandNewPassword123!',
      });

      expect(response.message).toContain('Password has been reset successfully');
      expect(mockUsersService.updatePassword).toHaveBeenCalled();
      expect(inMemoryUser.hashedRefreshToken).toBeNull();

      // Verify login with new password succeeds
      const loginRes = await authService.login({
        email: 'alex@example.com',
        password: 'BrandNewPassword123!',
      });
      expect(loginRes.user.id).toBe(inMemoryUser.id);

      // Verify login with old password fails
      await expect(
        authService.login({
          email: 'alex@example.com',
          password: 'InitialP@ss123!',
        }),
      ).rejects.toThrow();
    });

    it('should reject a token that has already been used (single-use enforcement)', async () => {
      const token = await authService.generatePasswordResetToken(inMemoryUser);

      // First reset succeeds
      await authService.resetPassword({
        token,
        newPassword: 'FirstNewPassword123!',
      });

      // Second reset with the same token MUST be rejected
      await expect(
        authService.resetPassword({
          token,
          newPassword: 'SecondNewPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject an expired reset token', async () => {
      // Sign a token that has already expired
      const expiredToken = await jwtService.signAsync(
        {
          sub: inMemoryUser.id,
          email: inMemoryUser.email,
          purpose: 'password-reset',
          pwdHashVersion: inMemoryUser.passwordHash!.slice(-10),
        },
        {
          secret: ACCESS_SECRET,
          expiresIn: '-1s',
        },
      );

      await expect(
        authService.resetPassword({
          token: expiredToken,
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject a malformed or forged reset token', async () => {
      await expect(
        authService.resetPassword({
          token: 'invalid.forged.jwt.token',
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject a token with wrong purpose', async () => {
      const wrongPurposeToken = await jwtService.signAsync(
        {
          sub: inMemoryUser.id,
          purpose: 'email-verification',
          pwdHashVersion: inMemoryUser.passwordHash!.slice(-10),
        },
        {
          secret: ACCESS_SECRET,
          expiresIn: '1h',
        },
      );

      await expect(
        authService.resetPassword({
          token: wrongPurposeToken,
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('ResetPasswordDto Validation', () => {
    it('should reject passwords shorter than 8 characters', async () => {
      const dto = plainToInstance(ResetPasswordDto, {
        token: 'valid-token',
        newPassword: 'short',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.minLength).toBeDefined();
    });

    it('should reject empty token', async () => {
      const dto = plainToInstance(ResetPasswordDto, {
        token: '',
        newPassword: 'ValidPassword123!',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
