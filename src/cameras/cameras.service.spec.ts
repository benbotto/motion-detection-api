import { DataContextManager } from 'formn-nestjs-utils';
import { getMockDataContext } from '../test/get-mock-data-context';

import { Camera } from '../entity/camera.entity';
import { CamerasDao } from './cameras.dao';
import { CamerasService } from './cameras.service';

describe('CamerasService()', () => {
  let mockDC: DataContextManager;
  let cameraDao: CamerasDao;
  let cameraSvc: CamerasService;

  beforeEach(() => {
    mockDC  = getMockDataContext();

    cameraDao = new CamerasDao(mockDC);
    cameraSvc = new CamerasService(mockDC, cameraDao);
  });
});
