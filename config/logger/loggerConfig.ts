import { LoggerOptions } from 'pino';

export const loggerConfig: LoggerOptions & {
  transport?: {
    target: string;
    options?: Record<string, any>;
  };
} = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
      singleLine: true,
    },
  },
};
