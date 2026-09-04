import {
  AUTH_ROUTES,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@veya/shared';
import { apiClient } from './client';

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>(AUTH_ROUTES.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
      skipRefresh: true,
    });
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>(AUTH_ROUTES.REGISTER, {
      method: 'POST',
      body: JSON.stringify(payload),
      skipRefresh: true,
    });
  },

  async logout(): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(AUTH_ROUTES.LOGOUT, {
      method: 'POST',
    });
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<{ message: string }> {
    return apiClient<{ message: string }>(AUTH_ROUTES.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(payload),
      skipRefresh: true,
    });
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient<{ message: string }>(AUTH_ROUTES.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(payload),
      skipRefresh: true,
    });
  },
};
