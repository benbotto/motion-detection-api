import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

import { BsyErrorHandlerFilter } from 'formn-nestjs-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Custom error handler.
  app.useGlobalFilters(new BsyErrorHandlerFilter());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.MQ_CONNECTION_STRING],
      queue: process.env.MQ_SAVE_QUEUE,
      queueOptions: {durable: false},
    }
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
