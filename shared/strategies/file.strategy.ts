import { Injectable } from '@nestjs/common';
import {
  LoggerModuleOptions,
  LoggerStrategy,
} from '@config/logger/logger.interface';

import * as fs from 'fs';
import * as path from 'path';
import pino from 'pino';

@Injectable()
export class FileLoggerStrategy implements LoggerStrategy {
  createLogger(options: LoggerModuleOptions): any {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const dateString = `${day}-${month}-${year}`;

    const logsDir = options.fileOptions?.destination || 'logs';

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const appLogPath = path.join(logsDir, `logger.app.${dateString}`);
    const appTransport = pino.transport({
      target: 'pino/file',
      options: {
        destination: appLogPath,
        mkdir: true,
        sync: options.fileOptions?.syncWrite || false,
      },
      level: 'info',
    });

    const errorLogPath = path.join(logsDir, `logger.error.${dateString}`);
    const errorTransport = pino.transport({
      target: 'pino/file',
      options: {
        destination: errorLogPath,
        mkdir: true,
        sync: options.fileOptions?.syncWrite || false,
      },
      level: 'error',
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
      pino.multistream([
        { stream: appTransport },
        { stream: errorTransport, level: 'error' },
      ]),
    );
  }
}
