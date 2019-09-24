import { DataContextManager } from 'formn-nestjs-utils';
import { getMockDataContext } from '../test/get-mock-data-context';

import { Notification } from '../entity/notification.entity';
import { NotificationsDao } from './notifications.dao';
import { NotificationsService } from './notifications.service';

describe('NotificationsService()', () => {
  let mockDC: DataContextManager;
  let notificationDao: NotificationsDao;
  let notificationSvc: NotificationsService;

  beforeEach(() => {
    mockDC  = getMockDataContext();

    notificationDao = new NotificationsDao(mockDC);
    notificationSvc = new NotificationsService(mockDC, notificationDao);
  });
});
