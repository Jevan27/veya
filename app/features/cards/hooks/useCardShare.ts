import { useState, useRef, useEffect, useCallback, RefObject } from 'react';
import { View, Share, Platform, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { downloadCardViaWebCanvas, CardCanvasExportParams } from '../utils/card-canvas-export';

export function useCardShare() {
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) {
        clearTimeout(downloadTimerRef.current);
      }
    };
  }, []);

  const shareCard = useCallback(async (displayName: string, cardUrl: string) => {
    try {
      await Share.share({
        title: `${displayName} — Veya Digital Business Card`,
        message: `Connect with ${displayName} on Veya:\n${cardUrl}`,
        url: cardUrl,
      });
    } catch (err) {
      console.warn('Share card error:', err);
    }
  }, []);

  const downloadCardPng = useCallback(
    async (
      cardSnapshotRef: RefObject<View | null>,
      canvasParams: CardCanvasExportParams,
      onSuccessToast: () => void
    ) => {
      setIsDownloading(true);
      try {
        // 1. Web browser download
        if (Platform.OS === 'web') {
          try {
            if (cardSnapshotRef.current) {
              const uri = await captureRef(cardSnapshotRef, {
                format: 'png',
                quality: 1,
              });
              const link = document.createElement('a');
              link.download = `${canvasParams.name.toLowerCase().replace(/\s+/g, '_')}_card.png`;
              link.href = uri;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              onSuccessToast();
              return;
            }
          } catch {
            // Fallback to HTML5 2D canvas drawing
            downloadCardViaWebCanvas(canvasParams);
            onSuccessToast();
            return;
          }
        }

        // 2. Native Mobile (iOS / Android)
        if (cardSnapshotRef.current) {
          const uri = await captureRef(cardSnapshotRef, {
            format: 'png',
            quality: 1,
            result: 'tmpfile',
          });

          // 2a. Attempt automatic save directly to device Gallery / Photos
          let autoSaved = false;
          try {
            // @ts-expect-error optional runtime import for expo-modules-core
            const { requireNativeModule } = await import('expo-modules-core').catch(() => ({}));
            if (typeof requireNativeModule === 'function') {
              interface NativeMediaLibrary {
                requestPermissionsAsync?: (writeOnly: boolean) => Promise<{ granted: boolean }>;
                saveToLibraryAsync?: (uri: string) => Promise<void>;
                createAssetAsync?: (uri: string) => Promise<unknown>;
              }
              let nativeMedia: NativeMediaLibrary | null = null;
              try {
                nativeMedia = requireNativeModule('ExpoMediaLibrary') as NativeMediaLibrary;
              } catch {}

              if (nativeMedia) {
                if (nativeMedia.requestPermissionsAsync) {
                  try {
                    await nativeMedia.requestPermissionsAsync(true);
                  } catch {}
                }

                if (nativeMedia.saveToLibraryAsync) {
                  await nativeMedia.saveToLibraryAsync(uri);
                  autoSaved = true;
                } else if (nativeMedia.createAssetAsync) {
                  await nativeMedia.createAssetAsync(uri);
                  autoSaved = true;
                }
              }
            }
          } catch (mediaErr) {
            console.warn('Auto-save to gallery attempt error:', mediaErr);
          }

          // Trigger success toast
          onSuccessToast();

          // 2b. Open native share sheet so user can also share or save
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
              mimeType: 'image/png',
              dialogTitle: autoSaved ? 'Card Saved! Share Business Card' : 'Save / Share Business Card',
              UTI: 'public.png',
            });
          } else {
            await Share.share({
              title: `${canvasParams.name} — Business Card`,
              url: uri,
            });
          }
        }
      } catch (err) {
        console.warn('Card snapshot download failed:', err);
        Alert.alert(
          'Card Download',
          'Could not save picture directly. Card URL has been copied for sharing.'
        );
      } finally {
        if (downloadTimerRef.current) {
          clearTimeout(downloadTimerRef.current);
        }
        downloadTimerRef.current = setTimeout(() => setIsDownloading(false), 1400);
      }
    },
    []
  );

  return {
    isDownloading,
    shareCard,
    downloadCardPng,
  };
}
