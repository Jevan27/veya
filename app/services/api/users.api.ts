import { apiClient, uploadFileXhr } from './client';
import { UserDto, UpdateProfileRequest, CompleteOnboardingResponse } from '@veya/shared';

export const usersApi = {
  /**
   * Fetch current authenticated user's profile
   */
  async getMe(): Promise<UserDto> {
    return apiClient<UserDto>('/users/me');
  },

  /**
   * Update user profile information (name, company, role, avatarUrl)
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<UserDto> {
    return apiClient<UserDto>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Upload user profile photo via native XMLHttpRequest (bypasses WinterCG FormData bug)
   */
  async uploadProfilePhoto(localUri: string): Promise<{ avatarUrl: string }> {
    const filename = localUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('photo', {
      uri: localUri,
      name: filename,
      type,
    } as unknown as Blob);

    return uploadFileXhr<{ avatarUrl: string }>('/users/profile/photo', formData);
  },

  /**
   * Upload user profile photo via Base64 JSON (zero multipart overhead, 100% platform-independent)
   */
  async uploadProfilePhotoBase64(base64: string, mimeType = 'image/jpeg'): Promise<{ avatarUrl: string }> {
    return apiClient<{ avatarUrl: string }>('/users/profile/photo', {
      method: 'POST',
      body: JSON.stringify({
        base64,
        mimeType,
      }),
    });
  },

  /**
   * Finalize onboarding process
   */
  async completeOnboarding(): Promise<CompleteOnboardingResponse> {
    return apiClient<CompleteOnboardingResponse>('/users/onboarding/complete', {
      method: 'POST',
    });
  },

  /**
   * Permanently delete user account and associated media
   */
  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>('/users/account', {
      method: 'DELETE',
    });
  },
};
