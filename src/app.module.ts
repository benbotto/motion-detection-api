import { Module } from '@nestjs/common';

import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    NoticeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
