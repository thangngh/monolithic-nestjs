import {
  LoggerModuleOptions,
  LoggerStrategy,
} from '@config/logger/logger.interface';
import { Injectable } from '@nestjs/common';

import pino from 'pino';

@Injectable()
export class ThirdPartyLoggerStrategy implements LoggerStrategy {
  createLogger(options: LoggerModuleOptions): any {
    const thirdPartyTransport = pino.transport({
      target: 'pino-pretty',
      options: {
        ...options.thirdPartyOptions,
      },
    });

    return pino(
      {
        name: options.appName || 'nest-app',
        level: options.level || 'info',
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
      },
      thirdPartyTransport,
    );
  }
}
