jest.mock('@nestjs/jwt', () => ({
  JwtService: class MockJwtService {
    signAsync = jest.fn();
    verifyAsync = jest.fn();
    decode = jest.fn();
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

describe('Auth & Onboarding State Synchronization', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;
  let mockJwtService: Partial<JwtService>;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'jwt.accessSecret') return 'test-access-secret-123456';
        if (key === 'jwt.refreshSecret') return 'test-refresh-secret-123456';
        if (key === 'jwt.accessExpiresIn') return '15m';
        if (key === 'jwt.refreshExpiresIn') return '7d';
        return undefined;
      }),
    };

    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked.jwt.token'),
    };

    mockUsersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateHashedRefreshToken: jest.fn(),
      toUserDto: jest.fn().mockImplementation((u) => ({
        id: u.id,
        email: u.email,
        name: u.name ?? null,
        company: u.company ?? null,
        role: u.role ?? null,
        avatarUrl: u.avatarUrl ?? null,
        phoneNumber: u.phoneNumber ?? null,
        onboardingCompleted: u.onboardingCompleted,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
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

  describe('Registration Flow', () => {
    it('should return onboardingCompleted === false for newly registered users', async () => {
      (mockUsersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (mockUsersService.create as jest.Mock).mockResolvedValue({
        id: 'new-user-123',
        email: 'newuser@example.com',
        name: 'New User',
        passwordHash: 'hashed-password',
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register({
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User',
      });

      expect(result.user).toBeDefined();
      expect(result.user.onboardingCompleted).toBe(false);
      expect(result.tokens).toBeDefined();
      expect(mockUsersService.toUserDto).toHaveBeenCalled();
    });
  });

  describe('Login Flow', () => {
    it('should return onboardingCompleted === true for existing users who finished onboarding', async () => {
      const password = 'CorrectPassword123!';
      const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

      (mockUsersService.findByEmail as jest.Mock).mockResolvedValue({
        id: 'existing-user-completed',
        email: 'completed@example.com',
        passwordHash,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.login({
        email: 'completed@example.com',
        password,
      });

      expect(result.user).toBeDefined();
      expect(result.user.onboardingCompleted).toBe(true);
      expect(result.tokens).toBeDefined();
    });

    it('should return onboardingCompleted === false for existing users who have NOT finished onboarding', async () => {
      const password = 'CorrectPassword123!';
      const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

      (mockUsersService.findByEmail as jest.Mock).mockResolvedValue({
        id: 'existing-user-incomplete',
        email: 'incomplete@example.com',
        passwordHash,
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.login({
        email: 'incomplete@example.com',
        password,
      });

      expect(result.user).toBeDefined();
      expect(result.user.onboardingCompleted).toBe(false);
    });
  });
});
