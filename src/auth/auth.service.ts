import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IUserService } from '@src/modules/user/interfaces/user-service.interface';
import { USER_SERVICE } from '@src/modules/user/user.constants';
import { JWTPayload } from 'shared/dtos/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  async verifyToken(payload: JWTPayload) {
    const { id } = payload;

    const user = await this.userService.findById(id);

    return user;
  }
}
