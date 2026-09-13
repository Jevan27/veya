/**
 * @veya/shared
 * Shared types, interfaces, constants, and utilities across Veya applications.
 */

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp?: string;
  uptime?: number;
}

export const API_VERSION = 'v1';
export const DEFAULT_PORT = 3000;

export * from './auth/types';
export * from './auth/constants';
export * from './cards/types';
export * from './cards/dot-fade-pattern';
export * from './cards/geometric-palette';
export * from './social';
