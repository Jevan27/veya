import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token: string | null = null;
          if (request && request.body && request.body.refreshToken) {
            token = request.body.refreshToken;
          }
          if (!token && request.headers && request.headers.authorization) {
            token = request.headers.authorization.replace('Bearer ', '').trim();
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwt.refreshSecret') || 'veya_default_refresh_secret_fallback',
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload) {
    let refreshToken: string = req.body?.refreshToken;
    if (!refreshToken && req.headers?.authorization) {
      refreshToken = req.headers.authorization.replace('Bearer ', '').trim();
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is malformed');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
