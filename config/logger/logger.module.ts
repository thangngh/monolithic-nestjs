// import { LoggerModule } from 'nestjs-pino';
// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     LoggerModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => {
//         return {
//           pinoHttp: {
//             transport: configService.get('loggerConfig.transport'),
//             level: configService.get('loggerConfig.level'),
//             formatters: {
//               level(label: string) {
//                 return { level: label };
//               },
//             },
//           },
//         };
//       },
//       inject: [ConfigService],
//     }),
//   ],
//   exports: [],
// })
// export default class LogModules {}
import { DynamicModule, Module, Global, Provider } from '@nestjs/common';

import { LoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerSettingsEntity } from '@src/entities/logger.entity';
import {
  LoggerModuleAsyncOptions,
  LoggerModuleOptions,
  LoggerOptionsFactory,
} from './logger.interface';
import { LOGGER_MODULE_OPTIONS } from './logger.constants';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoggerSettingsEntity])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: [TypeOrmModule.forFeature([LoggerSettingsEntity])],
      providers: [
        {
          provide: LOGGER_MODULE_OPTIONS,
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        ...(options.imports || []),
        TypeOrmModule.forFeature([LoggerSettingsEntity]),
      ],
      providers: [...this.createAsyncProviders(options), LoggerService],
      exports: [LoggerService],
    };
  }

  private static createAsyncProviders(
    options: LoggerModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: LoggerModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: LOGGER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: LOGGER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: LoggerOptionsFactory) =>
        await optionsFactory.createLoggerOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
