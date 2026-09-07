import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

describe('PrismaService Startup & Connection Reliability (Fail-Fast)', () => {
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'DATABASE_URL') return 'postgresql://postgres:password@localhost:5432/veya_test';
        if (key === 'NODE_ENV') return 'development';
        if (key === 'PRISMA_STRICT_STARTUP') return 'false';
        return undefined;
      }),
    };
  });

  it('should initialize cleanly and log success when $connect succeeds', async () => {
    const prismaService = new PrismaService(mockConfigService as ConfigService);
    jest.spyOn(prismaService, '$connect').mockResolvedValue(undefined);

    await expect(prismaService.onModuleInit()).resolves.not.toThrow();
  });

  it('should throw and halt application startup if $connect fails in production environment', async () => {
    (mockConfigService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'DATABASE_URL') return 'postgresql://postgres:password@localhost:5432/veya_test';
      if (key === 'NODE_ENV') return 'production';
      return undefined;
    });

    const prismaService = new PrismaService(mockConfigService as ConfigService);
    jest.spyOn(prismaService, '$connect').mockRejectedValue(new Error('Connection refused at 10.0.0.1:5432'));

    await expect(prismaService.onModuleInit()).rejects.toThrow(
      /Prisma database connection failed during startup/,
    );
  });

  it('should throw and halt application startup if PRISMA_STRICT_STARTUP is enabled', async () => {
    (mockConfigService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'DATABASE_URL') return 'postgresql://postgres:password@localhost:5432/veya_test';
      if (key === 'NODE_ENV') return 'development';
      if (key === 'PRISMA_STRICT_STARTUP') return 'true';
      return undefined;
    });

    const prismaService = new PrismaService(mockConfigService as ConfigService);
    jest.spyOn(prismaService, '$connect').mockRejectedValue(new Error('Connection timeout'));

    await expect(prismaService.onModuleInit()).rejects.toThrow(
      /Prisma database connection failed during startup/,
    );
  });

  it('should log diagnostic warning without throwing in non-strict development environment', async () => {
    (mockConfigService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'DATABASE_URL') return 'postgresql://postgres:password@localhost:5432/veya_test';
      if (key === 'NODE_ENV') return 'development';
      if (key === 'PRISMA_STRICT_STARTUP') return 'false';
      return undefined;
    });

    const prismaService = new PrismaService(mockConfigService as ConfigService);
    jest.spyOn(prismaService, '$connect').mockRejectedValue(new Error('Local db not running'));

    // Should not throw in non-strict development mode
    await expect(prismaService.onModuleInit()).resolves.not.toThrow();
  });
});
