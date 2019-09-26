import { Injectable } from '@nestjs/common';

import { Dao, DataContextManager } from 'formn-nestjs-utils';

import { MotionRecording } from '../entity/motion-recording.entity';

@Injectable()
export class MotionRecordingsDao extends Dao<MotionRecording> {
  constructor(private dcMgr: DataContextManager) {
    super(dcMgr, MotionRecording, 'mr');
  }
}
