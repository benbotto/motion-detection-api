import { Injectable } from '@nestjs/common';

import { Dao, DataContextManager } from 'formn-nestjs-utils';

import { Camera } from '../entity/camera.entity';

@Injectable()
export class CamerasDao extends Dao<Camera> {
  constructor(private dcMgr: DataContextManager) {
    super(dcMgr, Camera, 'c');
  }
}
