import { SocialLinkDto } from '../social/types';

/**
 * Visual background composition styles for digital business cards.
 */
export type CardBackgroundStyle = 'minimal' | 'flow' | 'glass' | 'geometric' | 'organic' | 'dot-fade';

export interface CardBackgroundStyleOption {
  id: CardBackgroundStyle;
  name: string;
  description: string;
}

export const CARD_BACKGROUND_STYLES: CardBackgroundStyleOption[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and elegant with subtle curves and generous negative space.',
  },
  {
    id: 'flow',
    name: 'Flow',
    description: 'Smooth flowing waves and layered abstract shapes.',
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Translucent layers, soft blur, subtle reflections, and depth.',
  },
  {
    id: 'geometric',
    name: 'Geometric',
    description: 'Subtle grids, lines, circles, and structured geometric shapes.',
  },
  {
    id: 'organic',
    name: 'Organic',
    description: 'Soft, natural curves and gentle flowing shapes.',
  },
  {
    id: 'dot-fade',
    name: 'Dot Fade',
    description: 'Subtle radial matrix of soft dissolving dots.',
  },
];

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
  backgroundStyle?: CardBackgroundStyle | null;
  socialLinks?: SocialLinkDto[] | null;
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
  backgroundStyle?: CardBackgroundStyle | null;
  socialLinks?: SocialLinkDto[] | null;
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
  backgroundStyle?: CardBackgroundStyle;
  socialLinks?: SocialLinkDto[] | null;
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
  backgroundStyle?: CardBackgroundStyle;
  socialLinks?: SocialLinkDto[] | null;
  isDefault?: boolean;
  isPublished?: boolean;
  slug?: string;
}

/**
 * Backwards-compatibility alias for UpdateCardDto.
 */
export type UpdateBusinessCardDto = UpdateCardDto;


