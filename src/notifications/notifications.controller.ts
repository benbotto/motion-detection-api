import {
  Controller, Get, Post, Body, Param, ParseIntPipe, Delete, Req
} from '@nestjs/common';

import { Request } from 'express';

import { ModelTransformerPipe } from 'formn-nestjs-utils';

import { Notification } from '../entity/notification.entity';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private notificationsSvc: NotificationsService) {
  }

  @Post()
  async create(
    @Body(new ModelTransformerPipe()) notification: Notification,
    @Req() req: Request): Promise<Notification> {

    return this.notificationsSvc
      .createForCamera(notification, req.connection.remoteAddress);
  }

  @Get()
  retrieve(): Promise<Notification[]> {
    return this.notificationsSvc
      .retrieve();
  }

  @Get(':id')
  retrieveById(@Param('id', new ParseIntPipe()) id: number): Promise<Notification> {
    return this.notificationsSvc
      .retrieveById(id);
  }

  @Post(':id')
  update(@Body(new ModelTransformerPipe()) notification: Notification): Promise<Notification> {
    return this.notificationsSvc
      .updateModel(notification);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<Notification> {
    return this.notificationsSvc
      .deleteById(id);
  }
}
