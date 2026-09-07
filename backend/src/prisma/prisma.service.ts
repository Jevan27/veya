import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly isProduction: boolean;
  private readonly isStrictStartup: boolean;

  constructor(configService: ConfigService) {
    const dbUrl = configService.get<string>('DATABASE_URL');
    super(
      dbUrl
        ? {
            datasources: {
              db: {
                url: dbUrl,
              },
            },
          }
        : undefined,
    );

    const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
    this.isProduction = nodeEnv === 'production';
    this.isStrictStartup = configService.get<string>('PRISMA_STRICT_STARTUP') === 'true';
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL via Prisma');
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to connect to PostgreSQL via Prisma: ${errMsg}`);

      // In production or when strict startup is enabled, fail-fast immediately
      if (this.isProduction || this.isStrictStartup) {
        throw new Error(
          `Prisma database connection failed during startup: ${errMsg}. Application cannot start without a healthy database in this environment.`,
        );
      }

      // In non-strict development environments, warn clearly to preserve developer ergonomics
      this.logger.warn(
        'Prisma failed to connect to the database in development mode. Database queries will fail safely until a valid connection is established.',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
