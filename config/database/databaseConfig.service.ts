import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export default class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('database.host'),
      port: this.config.get<number>('database.port'),
      username: this.config.get<string>('database.user'),
      password: this.config.get<string>('database.password'),
      database: this.config.get<string>('database.database'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: false,
    };
  }
}
