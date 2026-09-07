import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AUTH_ERROR_MESSAGES, AUTH_ROUTES } from '@veya/shared';
import { TokenStorage } from '../storage/token.storage';

/**
 * Resolves the active backend API base URL.
 * Automatically discovers the developer machine's LAN IP when running on
 * a physical mobile device via Expo Go or Dev Client so that 'localhost'
 * doesn't cause connection failures on physical phones.
 */
export function getBaseApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  // 1. If pointing to a deployed/remote server (e.g. https://), always use it
  if (envUrl && envUrl.startsWith('https://')) {
    return envUrl;
  }

  // 2. On Web, localhost resolves directly to the machine running the browser
  if (Platform.OS === 'web') {
    return envUrl || 'http://localhost:3000/api/v1';
  }

  // 3. In local development on mobile (Expo Go / Dev Client), automatically discover host IP
  if (__DEV__) {
    const hostUri =
      Constants.expoConfig?.hostUri ??
      (Constants as unknown as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })?.manifest2?.extra?.expoGo?.debuggerHost;

    if (hostUri) {
      const hostIp = hostUri.split(':')[0];
      return `http://${hostIp}:3000/api/v1`;
    }
  }

  return envUrl || 'http://localhost:3000/api/v1';
}

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  skipRefresh?: boolean;
}

export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly raw?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

/**
 * Shared token refresh coordinator.
 * Mutually excludes concurrent refresh calls and queues waiting requests.
 */
export async function refreshAuthTokens(): Promise<string> {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      addRefreshSubscriber((newToken) => {
        if (!newToken) {
          reject(new ApiError(AUTH_ERROR_MESSAGES.UNAUTHORIZED, 401));
        } else {
          resolve(newToken);
        }
      });
    });
  }

  isRefreshing = true;
  try {
    const refreshToken = await TokenStorage.getRefreshToken();
    if (!refreshToken) {
      await TokenStorage.clearTokens();
      onRefreshed(null);
      throw new ApiError(AUTH_ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const baseUrl = getBaseApiUrl();
    const refreshRes = await fetch(`${baseUrl}${AUTH_ROUTES.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      await TokenStorage.clearTokens();
      onRefreshed(null);
      throw new ApiError(AUTH_ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const data = await refreshRes.json();
    await TokenStorage.setTokens(data);
    onRefreshed(data.accessToken);
    return data.accessToken;
  } catch (refreshErr) {
    await TokenStorage.clearTokens();
    onRefreshed(null);
    throw refreshErr instanceof ApiError
      ? refreshErr
      : new ApiError(AUTH_ERROR_MESSAGES.UNAUTHORIZED, 401, refreshErr);
  } finally {
    isRefreshing = false;
  }
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = new Headers(options.headers || {});

  const isFormData =
    options.body instanceof FormData ||
    Boolean(options.body && typeof options.body === 'object' && '_parts' in (options.body as unknown as Record<string, unknown>));

  if (!headers.has('Content-Type') && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach access token if auth is required or by default if token is present
  const accessToken = await TokenStorage.getAccessToken();
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.warn(`[ApiClient] Network request failed for ${url}:`, error);
    throw new ApiError(AUTH_ERROR_MESSAGES.NETWORK_ERROR, 0, error);
  }

  // Handle 401 Unauthorized with token refresh (avoid infinite loop on auth routes)
  if (
    response.status === 401 &&
    !options.skipRefresh &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/refresh')
  ) {
    const newAccessToken = await refreshAuthTokens();
    headers.set('Authorization', `Bearer ${newAccessToken}`);
    const retryRes = await fetch(url, { ...options, headers });
    return parseResponse<T>(retryRes, endpoint);
  }

  return parseResponse<T>(response, endpoint);
}

async function parseResponse<T>(response: Response, endpoint?: string): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    let message: string = AUTH_ERROR_MESSAGES.SERVER_ERROR;

    if (data && typeof data === 'object') {
      if (typeof data.message === 'string' && data.message.trim()) {
        message = data.message;
      } else if (Array.isArray(data.message) && data.message.length > 0) {
        message = data.message[0];
      }
    }

    if (response.status === 401) {
      const isLoginRoute = endpoint && endpoint.includes('/auth/login');
      if (isLoginRoute) {
        message =
          message !== AUTH_ERROR_MESSAGES.SERVER_ERROR
            ? message
            : AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
      } else {
        // Authenticated session failure
        message =
          message &&
          message !== AUTH_ERROR_MESSAGES.SERVER_ERROR &&
          message !== 'Unauthorized' &&
          message !== AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
            ? message
            : AUTH_ERROR_MESSAGES.UNAUTHORIZED;
      }
    }

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  retryCount?: number;
}

/**
 * Uploads a file via React Native's native XMLHttpRequest, which natively
 * supports React Native's FormData `{ uri, name, type }` objects without
 * triggering the modern WinterCG fetch `Unsupported FormDataPart implementation` error.
 * Handles automatic JWT refresh on 401 with bounded single retry.
 */
export async function uploadFileXhr<T>(
  endpoint: string,
  formData: FormData,
  options: UploadOptions = {},
): Promise<T> {
  const { onProgress, retryCount = 0 } = options;
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const accessToken = await TokenStorage.getAccessToken();

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = event.loaded / event.total;
          onProgress(progress);
        }
      };
    }

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(xhr.responseText as unknown as T);
        }
        return;
      }

      // Handle 401 with token refresh & bounded single retry
      if (xhr.status === 401 && retryCount < 1 && !endpoint.includes('/auth/')) {
        try {
          await refreshAuthTokens();
          // Retry upload once with new access token
          const retryResult = await uploadFileXhr<T>(endpoint, formData, {
            onProgress,
            retryCount: retryCount + 1,
          });
          resolve(retryResult);
          return;
        } catch (refreshErr) {
          reject(
            refreshErr instanceof ApiError
              ? refreshErr
              : new ApiError(AUTH_ERROR_MESSAGES.UNAUTHORIZED, 401, refreshErr),
          );
          return;
        }
      }

      try {
        const errData = JSON.parse(xhr.responseText);
        let message = Array.isArray(errData?.message)
          ? errData.message[0]
          : errData?.message || 'File upload failed';

        if (xhr.status === 401) {
          message = AUTH_ERROR_MESSAGES.UNAUTHORIZED;
        }

        reject(new ApiError(message, xhr.status, errData));
      } catch {
        const fallbackMsg =
          xhr.status === 401 ? AUTH_ERROR_MESSAGES.UNAUTHORIZED : 'File upload failed';
        reject(new ApiError(fallbackMsg, xhr.status));
      }
    };

    xhr.onerror = (e) => {
      console.warn(`[uploadFileXhr] Native XHR error for ${url}:`, e);
      reject(new ApiError(AUTH_ERROR_MESSAGES.NETWORK_ERROR, 0, e));
    };

    xhr.send(formData);
  });
}
