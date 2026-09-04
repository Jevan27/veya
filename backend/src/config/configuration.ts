export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET ||
      process.env.JWT_SECRET ||
      'veya_default_access_secret_change_in_production',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || 'veya_default_refresh_secret_change_in_production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origins: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:8082'],
  },
});
