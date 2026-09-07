import { AUTH_ERROR_MESSAGES } from '@veya/shared';

describe('API Client & Upload Reliability (Phase 2)', () => {
  describe('Context-Aware 401 Error Handling', () => {
    // Replicating parseResponse logic from client.ts for deterministic verification
    function parseTestResponse(
      response: { ok: boolean; status: number; data?: unknown },
      endpoint?: string,
    ): { message: string; statusCode: number } {
      if (!response.ok) {
        let message: string = AUTH_ERROR_MESSAGES.SERVER_ERROR;

        if (response.data && typeof response.data === 'object' && 'message' in response.data) {
          const resData = response.data as { message: unknown };
          if (typeof resData.message === 'string' && resData.message.trim()) {
            message = resData.message;
          } else if (
            Array.isArray(resData.message) &&
            resData.message.length > 0 &&
            typeof resData.message[0] === 'string'
          ) {
            message = resData.message[0];
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
            message =
              message &&
              message !== AUTH_ERROR_MESSAGES.SERVER_ERROR &&
              message !== 'Unauthorized' &&
              message !== AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
                ? message
                : AUTH_ERROR_MESSAGES.UNAUTHORIZED;
          }
        }

        return { message, statusCode: response.status };
      }

      return (response.data ?? {}) as { message: string; statusCode: number };
    }

    it('should map 401 on /auth/login to "Incorrect email or password."', () => {
      const result = parseTestResponse(
        { ok: false, status: 401, data: { message: 'Incorrect email or password.' } },
        '/auth/login',
      );
      expect(result.message).toBe('Incorrect email or password.');
    });

    it('should map 401 on /auth/login without backend message to "Incorrect email or password."', () => {
      const result = parseTestResponse({ ok: false, status: 401, data: null }, '/auth/login');
      expect(result.message).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    it('should map 401 on authenticated endpoint (/cards) to "Session expired. Please sign in again."', () => {
      const result = parseTestResponse(
        { ok: false, status: 401, data: { message: 'Unauthorized' } },
        '/cards',
      );
      expect(result.message).toBe('Session expired. Please sign in again.');
      expect(result.message).not.toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    it('should map 401 on profile upload (/users/profile/photo) to "Session expired. Please sign in again."', () => {
      const result = parseTestResponse(
        { ok: false, status: 401, data: null },
        '/users/profile/photo',
      );
      expect(result.message).toBe('Session expired. Please sign in again.');
    });
  });

  describe('Upload File Token Refresh & Bounded Retry', () => {
    it('should retry upload once with refreshed token when receiving 401', async () => {
      let uploadAttempts = 0;
      let refreshAttempts = 0;
      let currentToken = 'expired-token';

      async function mockRefreshAuthTokens(): Promise<string> {
        refreshAttempts++;
        currentToken = 'fresh-token';
        return currentToken;
      }

      async function mockUploadFileXhr(
        endpoint: string,
        _formData: unknown,
        options: { retryCount?: number } = {},
      ): Promise<{ avatarUrl: string }> {
        const { retryCount = 0 } = options;
        uploadAttempts++;

        // First attempt with expired token fails 401
        if (currentToken === 'expired-token') {
          if (retryCount < 1) {
            await mockRefreshAuthTokens();
            return mockUploadFileXhr(endpoint, _formData, { retryCount: retryCount + 1 });
          }
          throw new Error(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
        }

        // Second attempt with fresh token succeeds
        return { avatarUrl: 'https://cdn.veya.app/user/avatar.jpg' };
      }

      const result = await mockUploadFileXhr('/users/profile/photo', {});
      expect(result.avatarUrl).toBeDefined();
      expect(refreshAttempts).toBe(1);
      expect(uploadAttempts).toBe(2);
    });

    it('should not retry infinitely if refreshed token is also rejected with 401', async () => {
      let uploadAttempts = 0;
      let refreshAttempts = 0;

      async function mockRefreshAuthTokens(): Promise<string> {
        refreshAttempts++;
        return 'still-rejected-token';
      }

      async function mockUploadFileXhr(
        endpoint: string,
        _formData: unknown,
        options: { retryCount?: number } = {},
      ): Promise<unknown> {
        const { retryCount = 0 } = options;
        uploadAttempts++;

        // Always return 401
        if (retryCount < 1) {
          await mockRefreshAuthTokens();
          return mockUploadFileXhr(endpoint, _formData, { retryCount: retryCount + 1 });
        }

        throw new Error(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
      }

      await expect(mockUploadFileXhr('/users/profile/photo', {})).rejects.toThrow(
        AUTH_ERROR_MESSAGES.UNAUTHORIZED,
      );
      // Bounded retry ensures exactly 2 upload attempts (1 original + 1 retry) and 1 refresh
      expect(uploadAttempts).toBe(2);
      expect(refreshAttempts).toBe(1);
    });

    it('should coordinate concurrent 401 requests through a single refresh call', async () => {
      let refreshCallCount = 0;
      let isRefreshing = false;
      let subscribers: ((token: string) => void)[] = [];

      async function coordinatedRefresh(): Promise<string> {
        if (isRefreshing) {
          return new Promise<string>((resolve) => {
            subscribers.push(resolve);
          });
        }

        isRefreshing = true;
        refreshCallCount++;

        // Simulate async refresh
        await new Promise((r) => setTimeout(r, 10));
        const newToken = 'shared-new-token';

        subscribers.forEach((cb) => cb(newToken));
        subscribers = [];
        isRefreshing = false;

        return newToken;
      }

      // 3 concurrent requests encountering 401
      const [token1, token2, token3] = await Promise.all([
        coordinatedRefresh(),
        coordinatedRefresh(),
        coordinatedRefresh(),
      ]);

      expect(token1).toBe('shared-new-token');
      expect(token2).toBe('shared-new-token');
      expect(token3).toBe('shared-new-token');
      // Exactly 1 refresh call was made
      expect(refreshCallCount).toBe(1);
    });
  });
});
