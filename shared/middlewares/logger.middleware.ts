import { LoggerService } from '@config/logger/logger.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    // const { method, originalUrl } = req;

    // Log request
    this.loggerService.logRequest(req);

    res.on('finish', () => {
      const responseTime = Date.now() - start;
      this.loggerService.logHTTP(req, res, responseTime);
    });

    next();
  }
}
