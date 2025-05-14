import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt_refresh_token',
) {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const cookieHeader = req.headers.cookie;
        const refreshToken = cookieHeader
          ?.split(';')
          .find((cookie) => cookie.trim().startsWith('rfToken='))
          ?.split('=')[1]
          .trim();
        return refreshToken;
      },
      secretOrKey:
        config.get<string>('jwt.refreshSecret') || 'jwt.refreshSecret',
      passReqToCallback: true,
    });
  }

  validate(req: Request) {
    const cookieHeader = req.headers.cookie;
    const refreshToken = cookieHeader
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith('rfToken='))
      ?.split('=')[1]
      .trim();

    return { refreshToken };
  }
}
