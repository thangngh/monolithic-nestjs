import { ModuleMetadata, Type } from '@nestjs/common';
import { LoggerMode } from './logger.constants';

export interface LoggerModuleOptions {
  mode?: LoggerMode;
  appName?: string;
  level?: string;
  thirdPartyOptions?: Record<string, any>;
  fileOptions?: {
    destination?: string;
    syncWrite?: boolean;
  };
  useDatabase?: boolean;
  refreshInterval?: number;
}

export interface LoggerOptionsFactory {
  createLoggerOptions(): Promise<LoggerModuleOptions> | LoggerModuleOptions;
}

export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<LoggerOptionsFactory>;
  useClass?: Type<LoggerOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  inject?: any[];
}

export interface LoggerStrategy {
  createLogger(options: LoggerModuleOptions): any;
}
