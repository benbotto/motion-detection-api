import { Injectable } from '@nestjs/common';

import { get } from 'request-promise-native';

import { CRUDService, DataContextManager } from 'formn-nestjs-utils';

import { Camera } from '../entity/camera.entity';
import { CamerasService } from '../cameras/cameras.service';

import { Mailer } from '../mail/mailer.service';

import { Notification } from '../entity/notification.entity';
import { NotificationsDao } from './notifications.dao';

@Injectable()
export class NotificationsService extends CRUDService<Notification> {
  constructor(
    protected dataContext: DataContextManager,
    protected dao: NotificationsDao,
    protected camSvc: CamerasService,
    protected mailer: Mailer) {

    super(dao);
  }

  /**
   * Create a notification record, assigned to the camera with the supplied IP,
   * and send and email notification.
   */
  createForCamera(notification: Notification, ip: string): Promise<Notification> {
    return this.dataContext.beginTransaction(async () => {
      // The camera is pulled by IP so that the cameraId can be set on the
      // notification.  If the camera does not exists, it's created (the ip is
      // used as the default name).
      const cam = await this.camSvc
        .createByIpIfNotFound(ip);

      notification.cameraId = cam.id;

      // TEMP: Make this better.  TODO
      /*
      const img = await get(`http://${cam.ip}/img/snapshot.cgi`, {encoding: null});

      const msg = {
        to: process.env.ADMIN_EMAIL,
        from: 'motion@busybin.com',
        subject: `Notification on ${cam.name}`,
        text: `Notification on ${cam.name}`,
        attachments: [
          {
            content: img.toString('base64'),
            type: 'image/jpeg',
            filename: 'notification.jpeg',
          }
        ]
      };

      this.mailer.send(msg);
      console.log('sent');
      */

      return super.create(notification);
    });
  }
}
