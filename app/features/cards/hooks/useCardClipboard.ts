import { useState, useRef, useEffect, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';

export function useCardClipboard() {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return;

    try {
      await Clipboard.setStringAsync(text);
    } catch (err) {
      // Fallback for web if Clipboard.setStringAsync fails
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // Ignore
        }
      } else {
        console.warn('[useCardClipboard] Failed to copy to clipboard:', err);
      }
    }

    setShowCopyFeedback(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowCopyFeedback(false);
    }, 2200);
  }, []);

  return {
    showCopyFeedback,
    copyToClipboard,
  };
}
