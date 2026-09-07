jest.mock('@nestjs/jwt', () => ({
  JwtService: class MockJwtService {
    signAsync = jest.fn();
    verifyAsync = jest.fn();
    decode = jest.fn();
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import * as argon2 from 'argon2';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '@prisma/client';

describe('AuthService — Lifecycle, Security & Regression Suite', () => {
  let authService: AuthService;
  let mockUsersService: {
    findByEmail: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    updateHashedRefreshToken: jest.Mock;
    toUserDto: jest.Mock;
  };
  let mockJwtService: {
    signAsync: jest.Mock;
    verifyAsync: jest.Mock;
  };
  let mockConfigService: {
    get: jest.Mock;
  };

  const rawPassword = 'StrongPassword123!';
  let realArgonHash: string;

  beforeAll(async () => {
    realArgonHash = await argon2.hash(rawPassword, { type: argon2.argon2id });
  });

  beforeEach(async () => {
    mockUsersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateHashedRefreshToken: jest.fn(),
      toUserDto: jest.fn((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        onboardingCompleted: u.onboardingCompleted ?? false,
      })),
    };

    mockJwtService = {
      signAsync: jest.fn().mockImplementation((payload, opts) => {
        return Promise.resolve(`jwt-${opts?.expiresIn || 'default'}-${payload.sub}`);
      }),
      verifyAsync: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'jwt.accessSecret') return 'test-access-secret-12345';
        if (key === 'jwt.refreshSecret') return 'test-refresh-secret-67890';
        if (key === 'jwt.accessExpiresIn') return '15m';
        if (key === 'jwt.refreshExpiresIn') return '7d';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('Registration Flow & Invariants', () => {
    it('should register a new user with Argon2id password hash and initial onboardingCompleted: false', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const createdUser: User = {
        id: 'user-new-1',
        email: 'newuser@veya.app',
        name: 'New User',
        passwordHash: 'argon2id-hash-created',
        avatarUrl: null,
        provider: 'email',
        providerId: null,
        phoneNumber: null,
        company: null,
        role: null,
        hashedRefreshToken: null,
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.create.mockResolvedValue(createdUser);
      mockUsersService.updateHashedRefreshToken.mockResolvedValue(createdUser);

      const result = await authService.register({
        email: 'NewUser@Veya.app ',
        password: rawPassword,
        name: 'New User',
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('newuser@veya.app');
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'newuser@veya.app',
          name: 'New User',
          provider: 'email',
        })
      );
      // Password must be hashed with argon2id
      const passedHash = mockUsersService.create.mock.calls[0][0].passwordHash;
      expect(passedHash).not.toBe(rawPassword);
      expect(passedHash.startsWith('$argon2id$')).toBe(true);

      // Verify tokens issued
      expect(result.tokens.accessToken).toBe('jwt-15m-user-new-1');
      expect(result.tokens.refreshToken).toBe('jwt-7d-user-new-1');
      expect(result.user.onboardingCompleted).toBe(false);

      // Refresh token must be hashed before saving
      expect(mockUsersService.updateHashedRefreshToken).toHaveBeenCalled();
      const savedRefreshHash = mockUsersService.updateHashedRefreshToken.mock.calls[0][1];
      expect(savedRefreshHash).not.toBe('jwt-7d-user-new-1');
      expect(savedRefreshHash.startsWith('$argon2id$')).toBe(true);
    });

    it('should reject registration when email already exists with HTTP 409 ConflictException', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 'existing-id' });

      await expect(
        authService.register({
          email: 'existing@veya.app',
          password: 'Password123!',
          name: 'Existing',
        })
      ).rejects.toThrow(ConflictException);

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should validate RegisterDto using class-validator', async () => {
      const dto = new RegisterDto();
      dto.email = 'not-an-email';
      dto.password = 'short'; // under 8 chars
      dto.name = '';

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'email')).toBe(true);
      expect(errors.some((e) => e.property === 'password')).toBe(true);
    });
  });

  describe('Login Flow & Enumeration Timing Defense', () => {
    it('should authenticate valid credentials and issue tokens', async () => {
      const existingUser: User = {
        id: 'user-valid',
        email: 'user@veya.app',
        name: 'Valid User',
        passwordHash: realArgonHash,
        avatarUrl: null,
        provider: 'email',
        providerId: null,
        phoneNumber: null,
        company: null,
        role: null,
        hashedRefreshToken: null,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.findByEmail.mockResolvedValue(existingUser);
      mockUsersService.updateHashedRefreshToken.mockResolvedValue(existingUser);

      const result = await authService.login({
        email: 'User@Veya.app',
        password: rawPassword,
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('user@veya.app');
      expect(result.tokens.accessToken).toBe('jwt-15m-user-valid');
      expect(result.tokens.refreshToken).toBe('jwt-7d-user-valid');
      expect(result.user.onboardingCompleted).toBe(true);
      expect(mockUsersService.updateHashedRefreshToken).toHaveBeenCalled();
    });

    it('should reject invalid password with UnauthorizedException', async () => {
      const existingUser: User = {
        id: 'user-valid',
        email: 'user@veya.app',
        name: 'Valid User',
        passwordHash: realArgonHash,
        avatarUrl: null,
        provider: 'email',
        providerId: null,
        phoneNumber: null,
        company: null,
        role: null,
        hashedRefreshToken: null,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.findByEmail.mockResolvedValue(existingUser);

      await expect(
        authService.login({
          email: 'user@veya.app',
          password: 'WrongPassword!',
        })
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.updateHashedRefreshToken).not.toHaveBeenCalled();
    });

    it('should reject non-existent user with UnauthorizedException while executing dummy hash verification', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const argonVerifySpy = jest.spyOn(argon2, 'verify');

      await expect(
        authService.login({
          email: 'nonexistent@veya.app',
          password: 'AnyPassword123!',
        })
      ).rejects.toThrow(UnauthorizedException);

      // Verify timing attack defense: Argon2 verify was called with DUMMY_HASH
      expect(argonVerifySpy).toHaveBeenCalled();
      argonVerifySpy.mockRestore();
    });

    it('should validate LoginDto using class-validator', async () => {
      const dto = new LoginDto();
      dto.email = 'bad-email';
      dto.password = '';

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'email')).toBe(true);
      expect(errors.some((e) => e.property === 'password')).toBe(true);
    });
  });

  describe('Token Refresh Flow & Verification', () => {
    it('should verify valid refresh token against stored Argon2 hash and return new tokens', async () => {
      const plainRefreshToken = 'valid-refresh-token-xyz';
      const hashedRefresh = await argon2.hash(plainRefreshToken, { type: argon2.argon2id });

      const user: User = {
        id: 'user-refresh-1',
        email: 'refresh@veya.app',
        name: 'Refresh User',
        passwordHash: realArgonHash,
        avatarUrl: null,
        provider: 'email',
        providerId: null,
        phoneNumber: null,
        company: null,
        role: null,
        hashedRefreshToken: hashedRefresh,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(user);
      mockUsersService.updateHashedRefreshToken.mockResolvedValue(user);

      const result = await authService.refreshTokens('user-refresh-1', plainRefreshToken);

      expect(result.accessToken).toBe('jwt-15m-user-refresh-1');
      expect(result.refreshToken).toBe('jwt-7d-user-refresh-1');
      expect(mockUsersService.updateHashedRefreshToken).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when refresh token does not match stored hash', async () => {
      const validToken = 'token-original';
      const hashedRefresh = await argon2.hash(validToken, { type: argon2.argon2id });

      const user: User = {
        id: 'user-refresh-2',
        email: 'tamper@veya.app',
        name: 'Tamper User',
        passwordHash: realArgonHash,
        avatarUrl: null,
        provider: 'email',
        providerId: null,
        phoneNumber: null,
        company: null,
        role: null,
        hashedRefreshToken: hashedRefresh,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(user);

      await expect(
        authService.refreshTokens('user-refresh-2', 'tampered-or-forged-token')
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.updateHashedRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when stored hashedRefreshToken is null', async () => {
      const user: User = {
        id: 'user-logged-out',
        email: 'loggedout@veya.app',
        name: 'Logged Out',
        passwordHash: realArgonHash,
        avatarUrl: null,
        provider: 'email',
        providerId: null,
        phoneNumber: null,
        company: null,
        role: null,
        hashedRefreshToken: null, // logged out or revoked
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(user);

      await expect(
        authService.refreshTokens('user-logged-out', 'any-token')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        authService.refreshTokens('non-existent-user', 'any-token')
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
