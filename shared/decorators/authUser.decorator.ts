import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { extractToken } from 'commons/extractToken';
import { JWTPayload } from 'shared/dtos/jwt-payload.dto';
import { IRequest } from 'shared/interfaces/auth.interface';

export const authUser = createParamDecorator(
  <T extends JWTPayload>(_data: string, ctx: ExecutionContext): T => {
    const req = ctx.switchToHttp().getRequest<IRequest<T>>();
    return extractToken(req.user);
  },
);
