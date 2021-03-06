import { Module } from '@nestjs/common';

import { FormnModule } from 'formn-nestjs-utils';

import { CamerasModule } from './cameras/cameras.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { MailModule } from './mail/mail.module';
import { MotionRecordingsModule} from './motion-recordings/motion-recordings.module';
import { NotificationsModule } from './notifications/notifications.module';

import { ConnectionsFileReader } from 'formn';

@Module({
  imports: [
    FormnModule
      .forRoot(new ConnectionsFileReader()
        .readConnectionOptions('./connections.json')[0]),

    CamerasModule,
    ClassificationsModule,
    MailModule
      .forRoot(process.env.SENDGRID_API_KEY),
    MotionRecordingsModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
