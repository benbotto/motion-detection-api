import {
  Controller, Get, Post, Delete, Body, Param, ParseIntPipe
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { ModelTransformerPipe } from 'formn-nestjs-utils';

import { Classification } from '../entity/classification.entity';
import { ClassificationsService } from './classifications.service';

@Controller('classifications')
export class ClassificationsController {
  constructor(private readonly classificationsSvc: ClassificationsService) {
  }

  @Post()
  create(@Body(new ModelTransformerPipe()) classification: Classification): Promise<Classification> {
    return this.classificationsSvc
      .create(classification);
  }

  @Get()
  retrieve(): Promise<Classification[]> {
    return this.classificationsSvc
      .retrieve();
  }

  @Get(':id')
  retrieveById(@Param('id', new ParseIntPipe()) id: number): Promise<Classification> {
    return this.classificationsSvc
      .retrieveById(id);
  }

  @Post(':id')
  update(@Body(new ModelTransformerPipe()) classification: Classification): Promise<Classification> {
    return this.classificationsSvc
      .updateModel(classification);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<Classification> {
    return this.classificationsSvc
      .deleteById(id);
  }

  /**
   * The motion-detection-classifier code sends this through RabbitMQ after a
   * video is checked of objects of interest (people, dogs, cats...).  If there
   * is at least one object of interest then the video is kept and the
   * classifications are saved in the DB.
   */
  @EventPattern('save_classifications')
  onSaveEvent(classifications: Classification[]): Promise<Classification[]> {
    return this.classificationsSvc
      .createAll(classifications);
  }
}
