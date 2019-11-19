import { Injectable } from '@nestjs/common';

import { Dao, DataContextManager } from 'formn-nestjs-utils';

import { Classification } from '../entity/classification.entity';

@Injectable()
export class ClassificationsDao extends Dao<Classification> {
  constructor(private dcMgr: DataContextManager) {
    super(dcMgr, Classification, 'c');
  }
}
