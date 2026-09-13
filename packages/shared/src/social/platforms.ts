import { SocialPlatformConfig, SocialPlatformId } from './types';

export const SOCIAL_PLATFORMS: Record<Exclude<SocialPlatformId, 'website'>, SocialPlatformConfig> = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    domains: ['facebook.com', 'fb.com', 'fb.me'],
    urlPlaceholder: 'https://facebook.com/username',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    domains: ['linkedin.com'],
    urlPlaceholder: 'https://linkedin.com/in/username',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    domains: ['instagram.com', 'instagr.am'],
    urlPlaceholder: 'https://instagram.com/username',
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    domains: ['x.com', 'twitter.com'],
    urlPlaceholder: 'https://x.com/username',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    domains: ['tiktok.com'],
    urlPlaceholder: 'https://tiktok.com/@username',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    domains: ['youtube.com', 'youtu.be'],
    urlPlaceholder: 'https://youtube.com/@username',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    domains: ['github.com'],
    urlPlaceholder: 'https://github.com/username',
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    domains: ['t.me', 'telegram.org', 'telegram.me'],
    urlPlaceholder: 'https://t.me/username',
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    domains: ['whatsapp.com', 'wa.me'],
    urlPlaceholder: 'https://wa.me/1234567890',
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    domains: ['threads.net'],
    urlPlaceholder: 'https://threads.net/@username',
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    domains: ['pinterest.com', 'pin.it'],
    urlPlaceholder: 'https://pinterest.com/username',
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    domains: ['reddit.com', 'redd.it'],
    urlPlaceholder: 'https://reddit.com/user/username',
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    domains: ['discord.com', 'discord.gg', 'discordapp.com'],
    urlPlaceholder: 'https://discord.gg/invitecode',
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    domains: ['snapchat.com'],
    urlPlaceholder: 'https://snapchat.com/add/username',
  },
};

export const WEBSITE_PLATFORM_CONFIG: SocialPlatformConfig = {
  id: 'website',
  name: 'Website',
  domains: [],
  urlPlaceholder: 'https://example.com',
};

export const ALL_SOCIAL_PLATFORMS_LIST: SocialPlatformConfig[] = [
  ...Object.values(SOCIAL_PLATFORMS),
  WEBSITE_PLATFORM_CONFIG,
];
