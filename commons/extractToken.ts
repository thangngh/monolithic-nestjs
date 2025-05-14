import { UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from 'shared/dtos/jwt-payload.dto';

export function extractToken<T extends JWTPayload>(token: T): T | never {
  if (!token) {
    throw new UnauthorizedException();
  }
  return token;
}
