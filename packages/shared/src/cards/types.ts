/**
 * Shared Business Card representation across client and server.
 */
export interface BusinessCardDto {
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
  isDefault?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateBusinessCardDto {
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
  isDefault?: boolean;
}

export interface UpdateBusinessCardDto {
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
  isDefault?: boolean;
}
