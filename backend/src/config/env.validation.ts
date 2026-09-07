import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  DATABASE_URL?: string;

  @IsString()
  @IsOptional()
  JWT_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_ACCESS_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRES_IN?: string = '15m';

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN?: string = '7d';

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;

  @IsString()
  @IsOptional()
  R2_ACCOUNT_ID?: string;

  @IsString()
  @IsOptional()
  R2_ACCESS_KEY_ID?: string;

  @IsString()
  @IsOptional()
  R2_SECRET_ACCESS_KEY?: string;

  @IsString()
  @IsOptional()
  R2_BUCKET_NAME?: string;

  @IsString()
  @IsOptional()
  R2_PUBLIC_DOMAIN?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  // JWT secrets are strictly required in all environments to prevent running with predictable fallbacks
  const missingJwt: string[] = [];
  const accessSecret = (validatedConfig.JWT_ACCESS_SECRET || validatedConfig.JWT_SECRET || '').trim();
  const refreshSecret = (validatedConfig.JWT_REFRESH_SECRET || '').trim();

  if (!accessSecret) {
    missingJwt.push('JWT_ACCESS_SECRET (or JWT_SECRET)');
  }
  if (!refreshSecret) {
    missingJwt.push('JWT_REFRESH_SECRET');
  }

  if (missingJwt.length > 0) {
    throw new Error(
      `Configuration error: Missing required JWT secret environment variable(s): ${missingJwt.join(', ')}. The application will not run without explicit, non-empty secrets.`,
    );
  }

  // Ensure production security checks
  if (validatedConfig.NODE_ENV === Environment.Production) {
    const missingProd: string[] = [];
    if (!validatedConfig.DATABASE_URL) missingProd.push('DATABASE_URL');

    if (missingProd.length > 0) {
      throw new Error(
        `Production configuration error: Missing required environment variables: ${missingProd.join(', ')}`,
      );
    }
  }

  return validatedConfig;
}
