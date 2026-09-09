/**
 * Veya Website & Landing Page Global Configuration
 */

/**
 * Direct Android APK download destination.
 * Intentionally configured as empty string until the production release APK is deployed.
 * When empty, the UI displays a clean release preparation modal/notice instead of failing.
 */
export const APK_DOWNLOAD_URL = process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL || '';

export const siteConfig = {
  name: 'Veya',
  tagline: 'A digital business card that works anywhere.',
  description:
    'Instant, contactless digital business cards for modern professionals. Share via QR, NFC, or direct link with zero app required for recipients.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://veya.app',
  ogImage: '/og-image.png',
  navItems: [
    { label: 'What is Veya', href: '#about' },
    { label: 'Why Veya', href: '#why-veya' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'FAQ', href: '#faq' },
  ],
  links: {
    download: '#download',
    privacy: '/privacy',
    terms: '/terms',
  },
  platforms: {
    android: {
      name: 'Android',
      status: 'available', // Ready for APK download
      fileType: 'APK',
    },
    ios: {
      name: 'iOS',
      status: 'coming_soon',
      label: 'Coming Soon',
    },
    web: {
      name: 'Web Profile',
      status: 'live',
      label: 'Zero App Required for Viewers',
    },
  },
};
