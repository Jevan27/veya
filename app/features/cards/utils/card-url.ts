import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Resolves the public card web URL.
 * In development, automatically discovers the developer machine's host IP on port 3001
 * so that tapping "Copy Link", sharing, or scanning the QR code on a physical phone
 * immediately opens the Next.js public website in the phone's mobile browser.
 */
export function getPublicCardWebUrl(identifier?: string | null): string {
  const targetId = identifier || 'demo';
  const envWebUrl = process.env.EXPO_PUBLIC_WEB_URL;

  if (envWebUrl) {
    return `${envWebUrl.replace(/\/+$/, '')}/card/${targetId}`;
  }

  if (__DEV__) {
    const hostUri =
      Constants.expoConfig?.hostUri ??
      (Constants as unknown as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })?.manifest2?.extra?.expoGo?.debuggerHost;

    if (hostUri) {
      const hostIp = hostUri.split(':')[0];
      return `http://${hostIp}:3001/card/${targetId}`;
    }

    if (Platform.OS === 'web') {
      return `http://localhost:3001/card/${targetId}`;
    }
  }

  return `https://veya.app/card/${targetId}`;
}
