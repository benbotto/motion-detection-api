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

      await super.create(rec);

      // Clean up recordings in the background.
      this.cleanup();

      return rec;
    });

    // Notify the object detection service of the new video.
    this.messenger.send<MotionRecording>('classify', rec)
      .subscribe();

    return rec;
  }

  /**
   * Clean up recordings when they hit a threshold.
   */
  async cleanup(): Promise<void> {
    const recordings = await this.retrieve();
    const threshold  = 5; // TODO:

    if (recordings.length > threshold) {
      recordings
        .sort((l, r) => l.createdOn.getTime() - r.createdOn.getTime())
        .splice(recordings.length - threshold);

      for (const recording of recordings)
        await this.deleteById(recording.id);
    }
  }

  /**
   * Delete a recording by ID and remove the file.
   */
  deleteById(id: number): Promise<MotionRecording> {
    return this.dataContext.beginTransaction(async () => {
      const rec = await this.retrieveById(id);

      try {
        await fs.unlink(`/var/motion/uploads/${rec.fileName}`);
      }
      catch (err) {
        console.log(`Failed to delete "${rec.fileName}": ${err.message}`)
      }

      return super.deleteById(id);
    });
  }
}
