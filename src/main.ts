import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupSwagger } from '@config/document/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true,
  });
  setupSwagger(app);

  await app.listen(3000);
}

require('module-alias/register');

bootstrap();
