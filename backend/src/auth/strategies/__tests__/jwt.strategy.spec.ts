import { ConfigService } from '@nestjs/config';

jest.mock('@nestjs/passport', () => ({
  PassportStrategy: () => {
    return class MockPassportStrategy {
      constructor(public options: unknown) {}
    };
  },
}));

import { JwtStrategy } from '../jwt.strategy';
import { JwtRefreshStrategy } from '../jwt-refresh.strategy';
import { UsersService } from '../../../users/users.service';

describe('JWT Strategies Security (Fail-Safe Initialization)', () => {
  let mockUsersService: Partial<UsersService>;

  beforeEach(() => {
    mockUsersService = {
      findById: jest.fn(),
    };
  });

  describe('JwtStrategy', () => {
    it('should throw an error during instantiation if jwt.accessSecret is missing', () => {
      const mockConfigService = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as ConfigService;

      expect(() => new JwtStrategy(mockConfigService, mockUsersService as UsersService)).toThrow(
        'JWT_ACCESS_SECRET is required to initialize JwtStrategy',
      );
    });

    it('should throw an error during instantiation if jwt.accessSecret is empty', () => {
      const mockConfigService = {
        get: jest.fn().mockReturnValue(''),
      } as unknown as ConfigService;

      expect(() => new JwtStrategy(mockConfigService, mockUsersService as UsersService)).toThrow(
        'JWT_ACCESS_SECRET is required to initialize JwtStrategy',
      );
    });

    it('should initialize cleanly when jwt.accessSecret is provided', () => {
      const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'jwt.accessSecret') return 'valid-secret-key-123456';
          return undefined;
        }),
      } as unknown as ConfigService;

      expect(() => new JwtStrategy(mockConfigService, mockUsersService as UsersService)).not.toThrow();
    });
  });

  describe('JwtRefreshStrategy', () => {
    it('should throw an error during instantiation if jwt.refreshSecret is missing', () => {
      const mockConfigService = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as ConfigService;

      expect(() => new JwtRefreshStrategy(mockConfigService)).toThrow(
        'JWT_REFRESH_SECRET is required to initialize JwtRefreshStrategy',
      );
    });

    it('should throw an error during instantiation if jwt.refreshSecret is empty', () => {
      const mockConfigService = {
        get: jest.fn().mockReturnValue(''),
      } as unknown as ConfigService;

      expect(() => new JwtRefreshStrategy(mockConfigService)).toThrow(
        'JWT_REFRESH_SECRET is required to initialize JwtRefreshStrategy',
      );
    });

    it('should initialize cleanly when jwt.refreshSecret is provided', () => {
      const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'jwt.refreshSecret') return 'valid-refresh-secret-123456';
          return undefined;
        }),
      } as unknown as ConfigService;

      expect(() => new JwtRefreshStrategy(mockConfigService)).not.toThrow();
    });
  });
});
