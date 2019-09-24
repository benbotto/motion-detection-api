import { Injectable } from '@nestjs/common';

import { Dao, DataContextManager } from 'formn-nestjs-utils';

import { Notification } from '../entity/notification.entity';

@Injectable()
export class NotificationsDao extends Dao<Notification> {
  constructor(private dcMgr: DataContextManager) {
    super(dcMgr, Notification, 'n');
  }
}
