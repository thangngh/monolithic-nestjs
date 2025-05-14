import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/entities/user.entity';
import { USER_SERVICE } from './user.constants';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_SERVICE,
      useExisting: UserService,
    },
  ],
  exports: [USER_SERVICE],
})
export class UserModule {}
