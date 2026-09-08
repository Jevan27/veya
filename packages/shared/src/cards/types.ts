/**
 * Shared Digital Card representation across client and server.
 */
export interface CardDto {
  id: string;
  userId: string;
  name: string;
  role?: string | null;
  company?: string | null;
  slogan?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  location?: string | null;
  website?: string | null;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  primaryColor?: string | null;
  cardBackgroundColor?: string | null;
  fontFamily?: string | null;
  isDefault?: boolean;
  isPublished?: boolean;
  slug?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Publicly exposable Digital Card representation for web visitor viewing and vCard generation.
 * Omits userId, sensitive authentication data, and private account metadata.
 */
export interface PublicCardDto {
  id: string;
  slug?: string | null;
  name: string;
  role?: string | null;
  company?: string | null;
  slogan?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  location?: string | null;
  website?: string | null;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  primaryColor?: string | null;
  cardBackgroundColor?: string | null;
  fontFamily?: string | null;
  isPublished: boolean;
}

/**
 * Backwards-compatibility alias for CardDto.
 */
export type BusinessCardDto = CardDto;

export interface CreateCardDto {
  name: string;
  role?: string;
  company?: string;
  slogan?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
  website?: string;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  primaryColor?: string;
  cardBackgroundColor?: string;
  fontFamily?: string;
  isDefault?: boolean;
  isPublished?: boolean;
  slug?: string;
}

/**
 * Backwards-compatibility alias for CreateCardDto.
 */
export type CreateBusinessCardDto = CreateCardDto;

export interface UpdateCardDto {
  name?: string;
  role?: string;
  company?: string;
  slogan?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
  website?: string;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  primaryColor?: string;
  cardBackgroundColor?: string;
  fontFamily?: string;
  isDefault?: boolean;
  isPublished?: boolean;
  slug?: string;
}

/**
 * Backwards-compatibility alias for UpdateCardDto.
 */
export type UpdateBusinessCardDto = UpdateCardDto;

