import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';

import { CamerasModule } from '../cameras/cameras.module';

import { raw } from 'body-parser';

import { MotionRecordingsDao } from './motion-recordings.dao';
import { MotionRecordingsService } from './motion-recordings.service';
import { MotionRecordingsController } from './motion-recordings.controller';

@Module({
  imports: [
    // Client for RabbitMQ.
    ClientsModule
      .register([{
        name: 'CLASSIFY_MESSAGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.MQ_HOST}:${process.env.MQ_PORT}`],
          queue: process.env.MQ_NOTIFY_QUEUE,
          queueOptions: {durable: false},
        }
      }]),

    CamerasModule,
  ],
  providers: [
    MotionRecordingsDao,
    MotionRecordingsService,
  ],
  exports: [
    MotionRecordingsService,
  ],
  controllers: [
    MotionRecordingsController,
  ]
})
export class MotionRecordingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Raw Buffer data for video/mp4 posts on the motion-recordings route.
    consumer
      .apply(raw({
        type: 'video/mp4',
        limit: '200mb'
      }))
      .forRoutes(MotionRecordingsController);
  }
}
