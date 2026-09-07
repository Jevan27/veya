/**
 * Shared User representation across client and server.
 * Never includes sensitive fields like password hashes or salt.
 */
export interface UserDto {
  id: string;
  email: string;
  name?: string | null;
  company?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  onboardingCompleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Authentication tokens returned upon successful login, registration, or token refresh.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

/**
 * Authentication response payload returned to mobile client.
 */
export interface AuthResponse {
  user: UserDto;
  tokens: AuthTokens;
}

/**
 * Payload required for user registration.
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * Payload required to update user profile during or after onboarding.
 */
export interface UpdateProfileRequest {
  name?: string;
  company?: string;
  role?: string;
  avatarUrl?: string;
  phoneNumber?: string;
}

/**
 * Payload required for user login.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Payload required to refresh an access token.
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Payload required to request a password reset email.
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Payload required to reset password with a token.
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Response when completing onboarding.
 */
export interface CompleteOnboardingResponse {
  success: boolean;
  user: UserDto;
}
