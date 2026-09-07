import { UserDto, AuthTokens } from '@veya/shared';

export { AuthTokens };

export interface AuthResult {
  user: UserDto;
  tokens: AuthTokens;
}
