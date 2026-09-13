import { SOCIAL_PLATFORMS, WEBSITE_PLATFORM_CONFIG } from './platforms';
import { DetectedSocialPlatform, SocialPlatformConfig, SocialPlatformId } from './types';

/**
 * Normalizes and validates a social media or website URL.
 * Automatically prepends https:// if scheme is missing.
 * Rejects dangerous protocols (javascript:, data:, vbscript:, etc.).
 */
export function normalizeSocialUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  // Explicitly reject dangerous or malicious schemes
  const lowerTrimmed = trimmed.toLowerCase();
  if (
    lowerTrimmed.startsWith('javascript:') ||
    lowerTrimmed.startsWith('data:') ||
    lowerTrimmed.startsWith('vbscript:') ||
    lowerTrimmed.startsWith('file:')
  ) {
    return null;
  }

  let urlWithScheme = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    // If it has another scheme (e.g. ftp://, telnet://), reject
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
      return null;
    }
    urlWithScheme = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(urlWithScheme);

    // Only allow http: and https: protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    const hostname = parsed.hostname.toLowerCase();
    // Hostname must be valid and contain at least one dot (e.g. domain.com)
    if (!hostname || !hostname.includes('.') || hostname.startsWith('.') || hostname.endsWith('.')) {
      return null;
    }

    let href = parsed.href;
    // Strip unnecessary trailing slash on paths (e.g. https://domain.com/user/ -> https://domain.com/user)
    if (parsed.pathname.length > 1 && href.endsWith('/')) {
      href = href.slice(0, -1);
    }

    return href;
  } catch {
    return null;
  }
}

/**
 * Detects the social platform from a given URL.
 * Returns null if the URL is invalid or malformed.
 * Returns { platform: 'website', ... } if the URL is valid HTTP/HTTPS but not one of the 14 branded platforms.
 */
export function detectSocialPlatform(rawUrl: string): DetectedSocialPlatform | null {
  const normalized = normalizeSocialUrl(rawUrl);
  if (!normalized) {
    return null;
  }

  try {
    const parsed = new URL(normalized);
    const hostname = parsed.hostname.toLowerCase();

    for (const config of Object.values(SOCIAL_PLATFORMS)) {
      for (const domain of config.domains) {
        const lowerDomain = domain.toLowerCase();
        // Exact match (e.g. facebook.com) or valid subdomain (e.g. m.facebook.com, www.facebook.com)
        if (hostname === lowerDomain || hostname.endsWith(`.${lowerDomain}`)) {
          return {
            platform: config.id,
            name: config.name,
            normalizedUrl: normalized,
            isFallbackWebsite: false,
          };
        }
      }
    }

    // If it's a valid URL but unrecognized brand, treat as generic website
    return {
      platform: 'website',
      name: WEBSITE_PLATFORM_CONFIG.name,
      normalizedUrl: normalized,
      isFallbackWebsite: true,
    };
  } catch {
    return null;
  }
}

/**
 * Returns configuration details for a given platform ID.
 */
export function getSocialPlatformConfig(platformId: SocialPlatformId): SocialPlatformConfig {
  if (platformId === 'website') {
    return WEBSITE_PLATFORM_CONFIG;
  }
  return SOCIAL_PLATFORMS[platformId] || WEBSITE_PLATFORM_CONFIG;
}

/**
 * Validates a social URL and returns detection info or error message.
 */
export function validateSocialUrl(rawUrl: string): {
  isValid: boolean;
  error?: string;
  detected?: DetectedSocialPlatform;
} {
  if (!rawUrl || !rawUrl.trim()) {
    return { isValid: false, error: 'URL is required' };
  }

  const detected = detectSocialPlatform(rawUrl);
  if (!detected) {
    return { isValid: false, error: 'Please enter a valid web or social media URL' };
  }

  return {
    isValid: true,
    detected,
  };
}
