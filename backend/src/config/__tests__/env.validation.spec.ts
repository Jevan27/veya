import { validate } from '../env.validation';
import configuration from '../configuration';

describe('Environment Configuration Validation (Security)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('JWT Secret Hardening', () => {
    it('should throw an error if JWT_ACCESS_SECRET and JWT_SECRET are missing', () => {
      const config = {
        NODE_ENV: 'development',
        PORT: '3000',
        JWT_REFRESH_SECRET: 'super-secure-refresh-secret',
      };

      expect(() => validate(config)).toThrow(
        /Missing required JWT secret environment variable\(s\): JWT_ACCESS_SECRET/,
      );
    });

    it('should throw an error if JWT_REFRESH_SECRET is missing', () => {
      const config = {
        NODE_ENV: 'development',
        PORT: '3000',
        JWT_ACCESS_SECRET: 'super-secure-access-secret',
      };

      expect(() => validate(config)).toThrow(
        /Missing required JWT secret environment variable\(s\): JWT_REFRESH_SECRET/,
      );
    });

    it('should throw an error if JWT secrets are empty or whitespace strings', () => {
      const config = {
        NODE_ENV: 'development',
        PORT: '3000',
        JWT_ACCESS_SECRET: '   ',
        JWT_REFRESH_SECRET: 'super-secure-refresh-secret',
      };

      expect(() => validate(config)).toThrow(
        /Missing required JWT secret environment variable\(s\): JWT_ACCESS_SECRET/,
      );
    });

    it('should pass validation when valid access and refresh secrets are provided', () => {
      const config = {
        NODE_ENV: 'development',
        PORT: '3000',
        JWT_ACCESS_SECRET: 'valid-access-secret',
        JWT_REFRESH_SECRET: 'valid-refresh-secret',
      };

      const result = validate(config);
      expect(result.JWT_ACCESS_SECRET).toBe('valid-access-secret');
      expect(result.JWT_REFRESH_SECRET).toBe('valid-refresh-secret');
    });

    it('should accept JWT_SECRET as legacy access secret fallback if JWT_ACCESS_SECRET is absent', () => {
      const config = {
        NODE_ENV: 'development',
        PORT: '3000',
        JWT_SECRET: 'valid-legacy-secret',
        JWT_REFRESH_SECRET: 'valid-refresh-secret',
      };

      const result = validate(config);
      expect(result.JWT_SECRET).toBe('valid-legacy-secret');
      expect(result.JWT_REFRESH_SECRET).toBe('valid-refresh-secret');
    });
  });

  describe('Configuration Fallback Elimination', () => {
    it('should not contain any predictable hardcoded fallback secrets', () => {
      delete process.env.JWT_ACCESS_SECRET;
      delete process.env.JWT_SECRET;
      delete process.env.JWT_REFRESH_SECRET;

      const loadedConfig = configuration();

      expect(loadedConfig.jwt.accessSecret).not.toContain('veya_default');
      expect(loadedConfig.jwt.refreshSecret).not.toContain('veya_default');
      expect(loadedConfig.jwt.accessSecret).toBe('');
      expect(loadedConfig.jwt.refreshSecret).toBe('');
    });
  });
});
