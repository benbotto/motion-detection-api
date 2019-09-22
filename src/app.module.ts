import { Module } from '@nestjs/common';

import { FormnModule } from 'formn-nestjs-utils';
import { ConnectionsFileReader } from 'formn';

import { CamerasModule } from './cameras/cameras.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    FormnModule
      .forRoot(new ConnectionsFileReader()
        .readConnectionOptions('./connections.json')[0]),

    CamerasModule,
    NoticeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
