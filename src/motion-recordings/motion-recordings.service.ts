import { promises as fs } from 'fs';

import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CRUDService, DataContextManager } from 'formn-nestjs-utils';

import { CamerasService } from '../cameras/cameras.service';

import { MotionRecording } from '../entity/motion-recording.entity';
import { MotionRecordingsDao } from './motion-recordings.dao';

@Injectable()
export class MotionRecordingsService extends CRUDService<MotionRecording> {
  constructor(
    protected dataContext: DataContextManager,
    protected dao: MotionRecordingsDao,
    protected camSvc: CamerasService,
    @Inject('CLASSIFY_MESSAGE_SERVICE') protected messenger: ClientProxy) {

    super(dao);
  }

  /**
   * Create a motion recording record assigned to a camera by IP.
   */
  async createForCamera(rec: MotionRecording, ip: string): Promise<MotionRecording> {
    await this.dataContext.beginTransaction(async () => {
      // The camera is pulled by IP so that the cameraId can be set on the
      // recording.  If the camera does not exists, it's created (the ip is
      // used as the default name).
      const cam = await this.camSvc
        .createByIpIfNotFound(ip);

      rec.cameraId = cam.id;

      return super.create(rec);
    });

    // Notify the object detection service of the new video.
    this.messenger.send<MotionRecording>('classify', rec)
      .subscribe();

    return rec;
  }

  /**
   * Delete a recording by ID and remove the file.
   */
  deleteById(id: number): Promise<MotionRecording> {
    return this.dataContext.beginTransaction(async () => {
      const rec = await this.retrieveById(id);

      await fs.unlink(`/var/motion/uploads/${rec.fileName}`);

      return super.deleteById(id);
    });
  }
}
