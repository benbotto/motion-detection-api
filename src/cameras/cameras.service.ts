import { Injectable } from '@nestjs/common';

import { DuplicateError } from 'bsy-error';

import { ConditionBuilder } from 'formn';
import { CRUDService, DataContextManager } from 'formn-nestjs-utils';

import { Camera } from '../entity/camera.entity';
import { CamerasDao } from './cameras.dao';

@Injectable()
export class CamerasService extends CRUDService<Camera> {
  constructor(
    protected dataContext: DataContextManager,
    protected dao: CamerasDao) {

    super(dao);
  }

  /**
   * Check if a camera is unique on name and ip (both independently)
   * or raise a DuplicateError.
   */
  async isUnique(name: string, ip: string, excludeId?: number): Promise<void> {
    const cb = new ConditionBuilder();
    let cond = cb
      .or(
        cb.eq('c.name', ':name', name),
        cb.eq('c.ip', ':ip', ip));

    if (excludeId) {
      cond = cb.and(cond, cb.neq('c.id', ':excludeId', excludeId));
    }

    const cams = await this.retrieve(cond);

    if (cams.length)
      throw new DuplicateError('Duplicate camera.', 'name-ip', cams[0].id);
  }
}
