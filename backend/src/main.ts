import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS configuration
  const corsOriginsConfig = configService.get<string>('CORS_ORIGIN');
  let allowedOrigins: (string | RegExp)[] | boolean = true;

  if (nodeEnv === 'production') {
    if (corsOriginsConfig) {
      allowedOrigins = corsOriginsConfig.split(',').map((origin) => origin.trim());
    } else {
      allowedOrigins = false; // Never use '*' in production without configured origins
    }
  } else {
    // In development allow localhost origins or configured list
    if (corsOriginsConfig) {
      allowedOrigins = corsOriginsConfig.split(',').map((origin) => origin.trim());
    } else {
      allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:8081',
        'http://localhost:19006',
        /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
        /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/,
      ];
    }
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Swagger OpenAPI documentation at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Veya API')
    .setDescription('Digital Business Card Platform REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(`Server running at http://localhost:${port}`);
  logger.log(`API documentation available at http://localhost:${port}/api/docs`);
  logger.log(`Health check at http://localhost:${port}/api/v1/health`);
}

void bootstrap();
