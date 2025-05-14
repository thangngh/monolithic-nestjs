import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@src/auth/auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWTPayload } from 'shared/dtos/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    protected readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret') || 'jwt.refreshSecret',
    });
  }

  async validate(payload: JWTPayload) {
    return await this.authService.verifyToken(payload);
  }
}
