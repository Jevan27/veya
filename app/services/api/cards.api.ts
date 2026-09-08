import { apiClient, uploadFileXhr } from './client';
import {
  CardDto,
  CreateCardDto,
  UpdateCardDto,
  BusinessCardDto,
  CreateBusinessCardDto,
  UpdateBusinessCardDto,
} from '@veya/shared';

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];

export const cardsApi = {
  /**
   * Fetch all cards belonging to the authenticated user
   */
  async getCards(): Promise<CardDto[]> {
    return apiClient<CardDto[]>('/cards');
  },

  /**
   * Fetch a single card by ID
   */
  async getCard(cardId: string): Promise<CardDto> {
    return apiClient<CardDto>(`/cards/${cardId}`);
  },

  /**
   * Create a new digital card record in the database
   */
  async createCard(payload: CreateCardDto | CreateBusinessCardDto): Promise<CardDto> {
    return apiClient<CardDto>('/cards', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing card record
   */
  async updateCard(cardId: string, payload: UpdateCardDto | UpdateBusinessCardDto): Promise<CardDto> {
    return apiClient<CardDto>(`/cards/${cardId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a card record
   */
  async deleteCard(cardId: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/cards/${cardId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Upload card profile photo to Cloudflare R2 isolated to a specific card
   */
  async uploadCardAvatar(cardId: string, localUri: string): Promise<{ avatarUrl: string }> {
    const filename = localUri.split('/').pop() || 'avatar.png';
    const ext = (filename.split('.').pop() || 'png').toLowerCase();

    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      throw new Error(`Only image files (${ALLOWED_IMAGE_EXTENSIONS.join(', ')}) are allowed`);
    }

    const type = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    const formData = new FormData();
    formData.append('photo', {
      uri: localUri,
      name: filename,
      type,
    } as unknown as Blob);

    const endpoint = cardId ? `/cards/${cardId}/upload/avatar` : '/cards/upload/avatar';
    return uploadFileXhr<{ avatarUrl: string }>(endpoint, formData);
  },

  /**
   * Upload company logo image to Cloudflare R2 isolated to a specific card
   */
  async uploadCardLogo(cardId: string, localUri: string): Promise<{ companyLogoUrl: string }> {
    const filename = localUri.split('/').pop() || 'logo.png';
    const ext = (filename.split('.').pop() || 'png').toLowerCase();

    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      throw new Error(`Only image files (${ALLOWED_IMAGE_EXTENSIONS.join(', ')}) are allowed`);
    }

    const type = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    const formData = new FormData();
    formData.append('logo', {
      uri: localUri,
      name: filename,
      type,
    } as unknown as Blob);

    const endpoint = cardId ? `/cards/${cardId}/upload/logo` : '/cards/upload/logo';
    return uploadFileXhr<{ companyLogoUrl: string }>(endpoint, formData);
  },

  /**
   * Upload company logo image to Cloudflare R2 (Legacy/Default method)
   */
  async uploadCompanyLogo(localUri: string, cardId = ''): Promise<{ companyLogoUrl: string }> {
    return this.uploadCardLogo(cardId, localUri);
  },

  /**
   * Upload company logo via Base64 JSON
   */
  async uploadCompanyLogoBase64(
    base64: string,
    mimeType = 'image/png',
    fileName?: string,
    cardId?: string,
  ): Promise<{ companyLogoUrl: string }> {
    const endpoint = cardId ? `/cards/${cardId}/upload/logo` : '/cards/upload/logo';
    return apiClient<{ companyLogoUrl: string }>(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        base64,
        mimeType,
        fileName,
      }),
    });
  },
};

export type { CardDto, CreateCardDto, UpdateCardDto, BusinessCardDto };
