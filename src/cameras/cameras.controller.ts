import {
  Controller, Get, Post, Body, Param, ParseIntPipe, Delete
} from '@nestjs/common';

import { ModelTransformerPipe } from 'formn-nestjs-utils';

import { Camera } from '../entity/camera.entity';
import { CamerasService } from './cameras.service';

@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasSvc: CamerasService) {
  }

  @Post()
  create(@Body(new ModelTransformerPipe()) camera: Camera): Promise<Camera> {
    return this.camerasSvc
      .create(camera);
  }

  @Get()
  retrieve(): Promise<Camera[]> {
    return this.camerasSvc
      .retrieve();
  }

  @Get(':id')
  retrieveById(@Param('id', new ParseIntPipe()) id: number): Promise<Camera> {
    return this.camerasSvc
      .retrieveById(id);
  }

  @Post(':id')
  update(@Body(new ModelTransformerPipe()) camera: Camera): Promise<Camera> {
    return this.camerasSvc
      .updateModel(camera);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<Camera> {
    return this.camerasSvc
      .deleteById(id);
  }
}
