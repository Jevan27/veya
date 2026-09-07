import { useState, useRef, useEffect, useCallback } from 'react';

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
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // @ts-expect-error optional runtime import for expo-clipboard
        const Clipboard = await import('expo-clipboard').catch(() => null);
        if (Clipboard?.setStringAsync) {
          await Clipboard.setStringAsync(text);
        }
      }
    } catch {
      // Fallback
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
