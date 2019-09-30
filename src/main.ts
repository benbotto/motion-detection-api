import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { BsyErrorHandlerFilter } from 'formn-nestjs-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Custom error handler.
  app.useGlobalFilters(new BsyErrorHandlerFilter());

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
