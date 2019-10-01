import { Injectable } from '@nestjs/common';

import { CRUDService, DataContextManager } from 'formn-nestjs-utils';

import { Classification } from '../entity/classification.entity';
import { ClassificationsDao } from './classifications.dao';

@Injectable()
export class ClassificationsService extends CRUDService<Classification> {
  constructor(
    protected dataContext: DataContextManager,
    protected dao: ClassificationsDao) {

    super(dao);
  }

  createAll(classifications: Classification[]): Promise<Classification[]> {
    return this.dataContext.beginTransaction(async () => {
      for (const classification of classifications)
        await this.create(classification);

      return classifications;
    });
  }
}
