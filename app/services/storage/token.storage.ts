import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AUTH_STORAGE_KEYS } from '@veya/shared';

// In-memory fallback for environments where SecureStore is unavailable (e.g. web fallback)
const memoryStorage = new Map<string, string>();

let secureStoreAvailableCache: boolean | null = null;

async function isSecureStoreAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (secureStoreAvailableCache !== null) return secureStoreAvailableCache;

  try {
    if (typeof SecureStore.isAvailableAsync === 'function') {
      secureStoreAvailableCache = await SecureStore.isAvailableAsync();
    } else {
      secureStoreAvailableCache = false;
    }
  } catch {
    secureStoreAvailableCache = false;
  }
  return secureStoreAvailableCache;
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    const available = await isSecureStoreAvailable();
    if (!available) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      } else {
        memoryStorage.set(key, value);
      }
      return;
    }

    const options =
      SecureStore.AFTER_FIRST_UNLOCK !== undefined
        ? { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK }
        : undefined;

    await SecureStore.setItemAsync(key, value, options);
  } catch (error) {
    console.warn(`[TokenStorage] Error saving ${key} to SecureStore:`, error);
    memoryStorage.set(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  try {
    const available = await isSecureStoreAvailable();
    if (!available) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
      return memoryStorage.get(key) ?? null;
    }

    if (typeof SecureStore.getItemAsync !== 'function') {
      return memoryStorage.get(key) ?? null;
    }

    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn(`[TokenStorage] Error reading ${key} from SecureStore:`, error);
    return memoryStorage.get(key) ?? null;
  }
}

async function deleteItem(key: string): Promise<void> {
  try {
    const available = await isSecureStoreAvailable();
    if (!available) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
      memoryStorage.delete(key);
      return;
    }

    if (typeof SecureStore.deleteItemAsync !== 'function') {
      memoryStorage.delete(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn(`[TokenStorage] Error deleting ${key} from SecureStore:`, error);
    memoryStorage.delete(key);
  }
}

export const TokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setAccessToken(token: string): Promise<void> {
    await setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async setTokens(tokens: { accessToken: string; refreshToken: string }): Promise<void> {
    await Promise.all([
      setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      deleteItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
      deleteItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  },
};
