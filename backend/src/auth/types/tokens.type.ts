export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  tokens: AuthTokens;
}
