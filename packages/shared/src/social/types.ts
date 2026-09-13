export type SocialPlatformId =
  | 'facebook'
  | 'linkedin'
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'youtube'
  | 'github'
  | 'telegram'
  | 'whatsapp'
  | 'threads'
  | 'pinterest'
  | 'reddit'
  | 'discord'
  | 'snapchat'
  | 'website';

export interface SocialPlatformConfig {
  id: SocialPlatformId;
  name: string;
  domains: string[];
  urlPlaceholder: string;
}

export interface SocialLinkDto {
  id: string;
  platform: SocialPlatformId;
  url: string;
  label?: string | null;
  displayOrder: number;
}

export interface DetectedSocialPlatform {
  platform: SocialPlatformId;
  name: string;
  normalizedUrl: string;
  isFallbackWebsite: boolean;
}
