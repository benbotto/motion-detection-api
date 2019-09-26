import { DataContextManager } from 'formn-nestjs-utils';
import { getMockDataContext } from '../test/get-mock-data-context';

import { CamerasService } from '../cameras/cameras.service';

import { MotionRecording } from '../entity/motion-recording.entity';
import { MotionRecordingsDao } from './motion-recordings.dao';
import { MotionRecordingsService } from './motion-recordings.service';

describe('MotionRecordingsService()', () => {
  let mockDC: DataContextManager;
  let camSvc: jasmine.SpyObj<CamerasService>;
  let motionRecDao: MotionRecordingsDao;
  let motionRecSvc: MotionRecordingsService;

  beforeEach(() => {
    mockDC  = getMockDataContext();

    camSvc = jasmine.createSpyObj('CamerasService', ['createByIpIfNotFound']);

    motionRecDao = new MotionRecordingsDao(mockDC);
    motionRecSvc = new MotionRecordingsService(mockDC, motionRecDao, camSvc);
  });
});
