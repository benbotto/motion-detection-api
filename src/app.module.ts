import { Module } from '@nestjs/common';

import { FormnModule } from 'formn-nestjs-utils';

import { CamerasModule } from './cameras/cameras.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';

import { ConnectionsFileReader } from 'formn';

@Module({
  imports: [
    FormnModule
      .forRoot(new ConnectionsFileReader()
        .readConnectionOptions('./connections.json')[0]),

    CamerasModule,
    MailModule
      .forRoot(process.env.SENDGRID_API_KEY),
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
