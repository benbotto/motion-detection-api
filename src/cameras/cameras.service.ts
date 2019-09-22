import { Injectable } from '@nestjs/common';

import { CRUDService, DataContextManager } from 'formn-nestjs-utils';

import { Camera } from '../entity/camera.entity';
import { CamerasDao } from './cameras.dao';

@Injectable()
export class CamerasService extends CRUDService<Camera> {
  constructor(
    protected dataContext: DataContextManager,
    protected dao: CamerasDao) {

    super(dao);
  }
}
