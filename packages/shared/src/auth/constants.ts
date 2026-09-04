/**
 * Authentication Constants
 */
export const AUTH_ROUTES = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'veya_access_token',
  REFRESH_TOKEN: 'veya_refresh_token',
  USER_DATA: 'veya_user_data',
} as const;

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Incorrect email or password.',
  NETWORK_ERROR: "We couldn't connect. Check your connection and try again.",
  SERVER_ERROR: 'Something went wrong. Please try again.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  UNAUTHORIZED: 'Session expired. Please sign in again.',
} as const;
