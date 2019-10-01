import { Module } from '@nestjs/common';

import { ClassificationsDao } from './classifications.dao';
import { ClassificationsService } from './classifications.service';
import { ClassificationsController } from './classifications.controller';

@Module({
  imports: [
  ],
  providers: [
    ClassificationsDao,
    ClassificationsService,
  ],
  exports: [
    ClassificationsService,
  ],
  controllers: [
    ClassificationsController,
  ]
})
export class ClassificationsModule {}
