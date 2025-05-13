import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfigService from './databaseConfig.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseConfigService,
    }),
  ],
  providers: [DatabaseConfigService],
  exports: [TypeOrmModule],
})
export default class DatabaseModule {}
