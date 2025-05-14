import { JWTPayload } from 'shared/dtos/jwt-payload.dto';

export interface ILogin {
  username: string;
  password: string;
}

export interface IRequest<T extends JWTPayload> {
  user: T & { [key: string]: unknown };
}
