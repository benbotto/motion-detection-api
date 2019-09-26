import { Injectable } from '@nestjs/common';

import { CRUDService, DataContextManager } from 'formn-nestjs-utils';

import { CamerasService } from '../cameras/cameras.service';

import { MotionRecording } from '../entity/motion-recording.entity';
import { MotionRecordingsDao } from './motion-recordings.dao';

@Injectable()
export class MotionRecordingsService extends CRUDService<MotionRecording> {
  constructor(
    protected dataContext: DataContextManager,
    protected dao: MotionRecordingsDao,
    protected camSvc: CamerasService) {

    super(dao);
  }

  /**
   * Create a motion recording record assigned to a camera by IP.
   */
  createForCamera(rec: MotionRecording, ip: string): Promise<MotionRecording> {
    return this.dataContext.beginTransaction(async () => {
      // The camera is pulled by IP so that the cameraId can be set on the
      // recording.  If the camera does not exists, it's created (the ip is
      // used as the default name).
      const cam = await this.camSvc
        .createByIpIfNotFound(ip);

      rec.cameraId = cam.id;

      return super.create(rec);
    });
  }
}
