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

  // On Web, localhost resolves directly to the machine running the browser
  if (Platform.OS === 'web') {
    return envUrl || 'http://localhost:3000/api/v1';
  }

  // If explicit LAN IP or remote domain is configured, prioritize it
  if (
    envUrl &&
    !envUrl.includes('localhost') &&
    !envUrl.includes('127.0.0.1')
  ) {
    return envUrl;
  }

  // In Expo Go / Dev Client on a mobile device, hostUri provides the computer's LAN IP
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    return `http://${hostIp}:3000/api/v1`;
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
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshToken = await TokenStorage.getRefreshToken();
        if (!refreshToken) {
          await TokenStorage.clearTokens();
          throw new ApiError(AUTH_ERROR_MESSAGES.UNAUTHORIZED, 401);
        }

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

        // Retry original request with new token
        headers.set('Authorization', `Bearer ${data.accessToken}`);
        const retryRes = await fetch(url, { ...options, headers });
        return parseResponse<T>(retryRes);
      } catch (refreshErr) {
        await TokenStorage.clearTokens();
        throw refreshErr instanceof ApiError
          ? refreshErr
          : new ApiError(AUTH_ERROR_MESSAGES.UNAUTHORIZED, 401, refreshErr);
      } finally {
        isRefreshing = false;
      }
    } else {
      // Wait for ongoing refresh
      return new Promise<T>((resolve, reject) => {
        addRefreshSubscriber(async (newToken) => {
          if (!newToken) {
            reject(new ApiError(AUTH_ERROR_MESSAGES.UNAUTHORIZED, 401));
            return;
          }
          headers.set('Authorization', `Bearer ${newToken}`);
          try {
            const retryRes = await fetch(url, { ...options, headers });
            resolve(await parseResponse<T>(retryRes));
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }

  return parseResponse<T>(response);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    let message: string = AUTH_ERROR_MESSAGES.SERVER_ERROR;

    if (data && typeof data === 'object') {
      if (typeof data.message === 'string') {
        message = data.message;
      } else if (Array.isArray(data.message) && data.message.length > 0) {
        message = data.message[0];
      }
    }

    if (response.status === 401) {
      message = AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    }

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

/**
 * Uploads a file via React Native's native XMLHttpRequest, which natively
 * supports React Native's FormData `{ uri, name, type }` objects without
 * triggering the modern WinterCG fetch `Unsupported FormDataPart implementation` error.
 */
export async function uploadFileXhr<T>(endpoint: string, formData: FormData): Promise<T> {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const accessToken = await TokenStorage.getAccessToken();

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(xhr.responseText as unknown as T);
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          const message = Array.isArray(errData?.message)
            ? errData.message[0]
            : errData?.message || 'File upload failed';
          reject(new ApiError(message, xhr.status, errData));
        } catch {
          reject(new ApiError('File upload failed', xhr.status));
        }
      }
    };

    xhr.onerror = (e) => {
      console.warn(`[uploadFileXhr] Native XHR error for ${url}:`, e);
      reject(new ApiError(AUTH_ERROR_MESSAGES.NETWORK_ERROR, 0, e));
    };

    xhr.send(formData);
  });
}
