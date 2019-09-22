import { Module } from '@nestjs/common';

import { CamerasDao } from './cameras.dao';
import { CamerasService } from './cameras.service';
import { CamerasController } from './cameras.controller';

@Module({
  imports: [
  ],
  providers: [
    CamerasDao,
    CamerasService,
  ],
  exports: [
    CamerasService,
  ],
  controllers: [
    CamerasController,
  ]
})
export class CamerasModule {}
