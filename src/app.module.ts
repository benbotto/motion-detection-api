import { Module } from '@nestjs/common';

import { CamerasModule } from './cameras/cameras.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    CamerasModule,
    NoticeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
