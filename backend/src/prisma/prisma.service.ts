import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

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
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL via Prisma');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL via Prisma', error);
      // We do not rethrow in development if the connection is pending user database credentials,
      // but log a clear diagnostic message.
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
