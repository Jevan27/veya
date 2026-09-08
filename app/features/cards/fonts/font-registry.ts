/**
 * Curated Font Registry for Veya Digital Business Cards.
 * Supports on-demand font loading via remote TTF URLs from Google Fonts.
 */

export interface FontDefinition {
  /** Stable font identifier persisted to database/DTO (e.g. 'inter', 'playfair-display') */
  id: string;
  /** Human-readable display label in UI (e.g. 'Playfair Display') */
  displayName: string;
  /** Typographic classification */
  category: 'sans-serif' | 'serif' | 'display';
  /** Brief description for UI display */
  description: string;
  /** Preview sample text for font picker */
  previewSample: string;
  /** React Native fontFamily identifier once loaded via Font.loadAsync */
  fontFamilyName: string;
  /** Remote font asset URLs for on-demand downloading */
  remoteUrls: {
    regular: string;
    bold?: string;
  };
}

export const DEFAULT_FONT_ID = 'inter';

export const CARD_FONTS: FontDefinition[] = [
  {
    id: 'inter',
    displayName: 'Inter',
    category: 'sans-serif',
    description: 'Modern, clean & highly legible',
    previewSample: 'PEOPLE · IDEAS · OPPORTUNITIES',
    fontFamilyName: 'Inter-Regular',
    remoteUrls: {
      regular: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf',
      bold: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf',
    },
  },
  {
    id: 'playfair-display',
    displayName: 'Playfair Display',
    category: 'serif',
    description: 'Elegant, premium & sophisticated',
    previewSample: 'PEOPLE · IDEAS · OPPORTUNITIES',
    fontFamilyName: 'PlayfairDisplay-Regular',
    remoteUrls: {
      regular: 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-400-normal.ttf',
      bold: 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf',
    },
  },
  {
    id: 'poppins',
    displayName: 'Poppins',
    category: 'sans-serif',
    description: 'Modern, friendly & geometric',
    previewSample: 'PEOPLE · IDEAS · OPPORTUNITIES',
    fontFamilyName: 'Poppins-Regular',
    remoteUrls: {
      regular: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-400-normal.ttf',
      bold: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-700-normal.ttf',
    },
  },
  {
    id: 'montserrat',
    displayName: 'Montserrat',
    category: 'sans-serif',
    description: 'Strong, bold & architectural',
    previewSample: 'PEOPLE · IDEAS · OPPORTUNITIES',
    fontFamilyName: 'Montserrat-Regular',
    remoteUrls: {
      regular: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-normal.ttf',
      bold: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-700-normal.ttf',
    },
  },
  {
    id: 'lora',
    displayName: 'Lora',
    category: 'serif',
    description: 'Refined, editorial & literary',
    previewSample: 'PEOPLE · IDEAS · OPPORTUNITIES',
    fontFamilyName: 'Lora-Regular',
    remoteUrls: {
      regular: 'https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-400-normal.ttf',
      bold: 'https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-700-normal.ttf',
    },
  },
];

const FONT_MAP = new Map<string, FontDefinition>(
  CARD_FONTS.map((font) => [font.id.toLowerCase(), font])
);

/**
 * Returns the FontDefinition corresponding to the given font ID.
 * Safely falls back to DEFAULT_FONT_ID ('inter') if the font is unknown, null, or undefined.
 */
export function getFontDefinition(fontId?: string | null): FontDefinition {
  if (!fontId) {
    return FONT_MAP.get(DEFAULT_FONT_ID)!;
  }
  return FONT_MAP.get(fontId.toLowerCase()) || FONT_MAP.get(DEFAULT_FONT_ID)!;
}
