import { PublicCardDto } from '@veya/shared';

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return `http://${host}:3000`;
  }
  return process.env.API_URL || 'http://localhost:3000';
}

/**
 * Fetches a public business card by public ID or slug.
 * Throws an error or returns null if not found or unpublished.
 */
export async function fetchPublicCard(identifier: string): Promise<PublicCardDto | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/v1/public/cards/${encodeURIComponent(identifier)}`, {
      next: { revalidate: 60 }, // Cache on Next.js edge for 60 seconds
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch card: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`[PublicCardAPI] Error loading card '${identifier}':`, err);
    return null;
  }
}

/**
 * Returns the direct URL to download the card's vCard (.vcf) file.
 */
export function getVCardDownloadUrl(identifier: string): string {
  return `${getApiBaseUrl()}/api/v1/public/cards/${encodeURIComponent(identifier)}/vcf`;
}
