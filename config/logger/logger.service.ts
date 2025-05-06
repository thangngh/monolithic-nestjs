import {
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
  OnModuleInit,
} from '@nestjs/common';

import { ModuleRef } from '@nestjs/core';
// import { Interval } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LOGGER_MODULE_OPTIONS, LoggerMode } from './logger.constants';
import { FileLoggerStrategy } from 'shared/strategies/file.strategy';
import { ThirdPartyLoggerStrategy } from 'shared/strategies/third-party.strategy';
import { LoggerSettingsEntity } from '@src/entities/logger.entity';
import { LoggerModuleOptions, LoggerStrategy } from './logger.interface';

@Injectable()
export class LoggerService implements NestLoggerService, OnModuleInit {
  private logger: any;
  private readonly strategies = new Map<LoggerMode, LoggerStrategy>();
  private currentMode: LoggerMode = LoggerMode.FILE; // Mặc định là FILE

  constructor(
    @Inject(LOGGER_MODULE_OPTIONS)
    private readonly options: LoggerModuleOptions,
    private readonly moduleRef: ModuleRef,
    @InjectRepository(LoggerSettingsEntity)
    private loggerSettingsRepository: Repository<LoggerSettingsEntity>,
  ) {
    this.registerStrategies();
  }

  async onModuleInit() {
    await this.loadConfigFromDatabase();

    this.createLogger();
  }

  private registerStrategies(): void {
    this.strategies.set(LoggerMode.FILE, new FileLoggerStrategy());
    this.strategies.set(LoggerMode.THIRD_PARTY, new ThirdPartyLoggerStrategy());
  }

  // @Interval(60000)
  async refreshLoggerConfig() {
    if (this.options.useDatabase) {
      const configChanged = await this.loadConfigFromDatabase();
      if (configChanged) {
        this.createLogger();
      }
    }
  }

  private async loadConfigFromDatabase(): Promise<boolean> {
    if (!this.options.useDatabase) {
      this.currentMode = this.options.mode || LoggerMode.FILE;
      return false;
    }

    try {
      const loggerConfig = await this.loggerSettingsRepository.findOne({
        where: { key: 'logger_mode' },
      });

      if (loggerConfig) {
        const newMode =
          loggerConfig.value === 'third-party'
            ? LoggerMode.THIRD_PARTY
            : LoggerMode.FILE;

        if (newMode !== this.currentMode) {
          this.currentMode = newMode;
          return true;
        }
      } else {
        this.currentMode = this.options.mode || LoggerMode.FILE;

        const newSetting = new LoggerSettingsEntity();
        newSetting.key = 'logger_mode';
        newSetting.value = this.currentMode;
        newSetting.description = 'Logger mode configuration (file/third-party)';
        await this.loggerSettingsRepository.save(newSetting);
      }
    } catch (error) {
      this.currentMode = this.options.mode || LoggerMode.FILE;
    }

    return false;
  }

  private createLogger(): void {
    const strategy = this.strategies.get(this.currentMode);
    if (!strategy) {
      throw new Error(`Unknown logger mode: ${this.currentMode}`);
    }

    const currentOptions = {
      ...this.options,
      mode: this.currentMode,
    };

    this.logger = strategy.createLogger(currentOptions);
  }

  log(message: any, context?: string): void {
    this.logger.info({ context, msg: message });
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error({ context, msg: message, trace });
  }

  warn(message: any, context?: string): void {
    this.logger.warn({ context, msg: message });
  }

  debug(message: any, context?: string): void {
    this.logger.debug({ context, msg: message });
  }

  verbose(message: any, context?: string): void {
    this.logger.trace({ context, msg: message });
  }

  logRequest(req: any): void {
    this.logger.info({
      type: 'request',
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    });
  }

  logResponse(res: any, responseTime?: number): void {
    this.logger.info({
      type: 'response',
      statusCode: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
    });
  }

  logHTTP(req: any, res: any, responseTime: number): void {
    this.logger.info({
      type: 'http',
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection?.remoteAddress,
    });
  }

  getLogger(): any {
    return this.logger;
  }
}
