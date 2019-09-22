import { Module } from '@nestjs/common';

import { NoticeController } from './notice.controller';

@Module({
  imports: [
  ],
  providers: [
  ],
  exports: [
  ],
  controllers: [
    NoticeController,
  ]
})
export class NoticeModule {}
