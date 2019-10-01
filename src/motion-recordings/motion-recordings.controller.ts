import {
  Controller, Get, Post, Body, Param, ParseIntPipe, Delete, Req
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { Request } from 'express';

import { ModelTransformerPipe } from 'formn-nestjs-utils';

import { MotionRecording } from '../entity/motion-recording.entity';
import { MotionRecordingsService } from './motion-recordings.service';

import { promises as fs } from 'fs';
import * as moment from 'moment';

@Controller('motion-recordings')
export class MotionRecordingsController {
  constructor(private readonly motionRecordingsSvc: MotionRecordingsService) {
  }

  @Post()
  async create(
    @Body() body: Buffer,
    @Req() req: Request): Promise<MotionRecording> {

    const rec    = new MotionRecording();
    rec.fileName = `${moment().format('YYYY-MM-DD_HH-mm-ss_SSS')}.mp4`;

    await fs.writeFile(`/var/motion/uploads/${rec.fileName}`, body);

    return this.motionRecordingsSvc
      .createForCamera(rec, req.connection.remoteAddress);
  }

  @Get()
  retrieve(): Promise<MotionRecording[]> {
    return this.motionRecordingsSvc
      .retrieve();
  }

  @Get(':id')
  retrieveById(@Param('id', new ParseIntPipe()) id: number): Promise<MotionRecording> {
    return this.motionRecordingsSvc
      .retrieveById(id);
  }

  @Post(':id')
  update(@Body(new ModelTransformerPipe()) motionRecording: MotionRecording): Promise<MotionRecording> {
    return this.motionRecordingsSvc
      .updateModel(motionRecording);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<MotionRecording> {
    return this.motionRecordingsSvc
      .deleteById(id);
  }

  /**
   * The motion-detection-classifier code sends this through RabbitMQ after a
   * video is classified.  If there are no objects of interest in any frame,
   * then the video is deleted.
   */
  @EventPattern('delete_motion_recording')
  onDeleteEvent(rec: MotionRecording): Promise<MotionRecording> {
    return this.motionRecordingsSvc
      .deleteById(rec.id);
  }
}
