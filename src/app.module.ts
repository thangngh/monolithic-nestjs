import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nConfigModule } from 'config/i18n/i18n-config.module';
import { ConfigModule } from '@nestjs/config';
import DatabaseModule from '@config/database/database.module';
import { LoggerModule } from '@config/logger/logger.module';
import { LoggerMode } from '@config/logger/logger.constants';
import { LoggerMiddleware } from 'shared/middlewares/logger.middleware';
import database from '../config/env/database';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database],
    }),
    I18nConfigModule,
    DatabaseModule,
    LoggerModule.forRoot({
      mode: LoggerMode.FILE, // default mode: FILE if not get from database
      appName: 'my-nest-app',
      level: 'info',
      fileOptions: {
        destination: 'logs',
        syncWrite: false,
      },
      useDatabase: true,
      // refreshInterval: 60000,
      // thirdPartyOptions: {
      //   @Todo: 'Configure third-party logger options',
      // }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
