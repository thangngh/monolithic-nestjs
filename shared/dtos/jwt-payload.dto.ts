import { IsNotEmpty, IsString } from 'class-validator';

export class JWTPayload {
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @IsString()
  @IsNotEmpty()
  public username!: string;
}
