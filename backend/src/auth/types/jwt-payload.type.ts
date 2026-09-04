export interface JwtPayload {
  sub: string; // user id
  email: string;
  name?: string;
}

export interface JwtRefreshPayload {
  sub: string;
  refreshToken: string;
}
