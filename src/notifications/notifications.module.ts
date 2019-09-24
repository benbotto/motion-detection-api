import { Module } from '@nestjs/common';

import { CamerasModule } from '../cameras/cameras.module';
import { MailModule } from '../mail/mail.module';

import { NotificationsDao } from './notifications.dao';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    CamerasModule,
    MailModule,
  ],
  providers: [
    NotificationsDao,
    NotificationsService,
  ],
  exports: [
    NotificationsService,
  ],
  controllers: [
    NotificationsController,
  ]
})
export class NotificationsModule {}
