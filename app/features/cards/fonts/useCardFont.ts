import { useState, useEffect, useRef } from 'react';
import * as Font from 'expo-font';
import { getFontDefinition, FontDefinition } from './font-registry';

// Global cache of successfully loaded font family names
const loadedFontsCache = new Set<string>();
// In-flight loading promises to avoid duplicate requests
const loadingPromises = new Map<string, Promise<void>>();

/**
 * Loads a font on demand from remote CDN or local cache.
 * Returns a promise that resolves once the font is ready to render.
 */
export async function loadCardFontAsync(fontDef: FontDefinition): Promise<void> {
  const fontKey = fontDef.fontFamilyName;

  if (loadedFontsCache.has(fontKey) || Font.isLoaded(fontKey)) {
    loadedFontsCache.add(fontKey);
    return;
  }

  if (loadingPromises.has(fontKey)) {
    return loadingPromises.get(fontKey);
  }

  const promise = (async () => {
    try {
      await Font.loadAsync({
        [fontKey]: fontDef.remoteUrls.regular,
      });
      loadedFontsCache.add(fontKey);
    } catch (err) {
      console.warn(`[useCardFont] Failed to load remote font ${fontKey}:`, err);
      // Do not throw; fallback will safely handle system font
    } finally {
      loadingPromises.delete(fontKey);
    }
  })();

  loadingPromises.set(fontKey, promise);
  return promise;
}

export interface UseCardFontResult {
  /** The font family string to supply to React Native style.fontFamily (undefined if using system fallback) */
  fontFamily: string | undefined;
  /** True if the font is currently being downloaded and registered */
  isLoading: boolean;
  /** True if the font has successfully loaded and is ready */
  isLoaded: boolean;
  /** The resolved font metadata definition */
  definition: FontDefinition;
}

/**
 * Custom hook to consume and dynamically load a card's chosen font family.
 * Ensures instant fallback rendering with zero layout crashes or blocking.
 */
export function useCardFont(fontId?: string | null): UseCardFontResult {
  const definition = getFontDefinition(fontId);
  const fontKey = definition.fontFamilyName;

  const [isFontReady, setIsFontReady] = useState<boolean>(() => {
    return loadedFontsCache.has(fontKey) || Font.isLoaded(fontKey);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (loadedFontsCache.has(fontKey) || Font.isLoaded(fontKey)) {
      setIsFontReady(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let isCancelled = false;

    loadCardFontAsync(definition).then(() => {
      if (mountedRef.current && !isCancelled) {
        setIsFontReady(loadedFontsCache.has(fontKey) || Font.isLoaded(fontKey));
        setIsLoading(false);
      }
    });

    return () => {
      isCancelled = true;
      mountedRef.current = false;
    };
  }, [fontKey, definition]);

  return {
    fontFamily: isFontReady ? fontKey : undefined,
    isLoading,
    isLoaded: isFontReady,
    definition,
  };
}
