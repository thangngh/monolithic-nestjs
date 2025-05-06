import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@config/document/swagger';
import { LoggerService } from '@config/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  setupSwagger(app);

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  await app.listen(3000);
}

require('module-alias/register');

bootstrap();
