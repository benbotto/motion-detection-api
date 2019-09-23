import { Injectable } from '@nestjs/common';

import { DuplicateError } from 'bsy-error';

import { ConditionBuilder, InsertModelValidator, UpdateModelValidator } from 'formn';
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

  /**
   * Create a camera.
   */
  async create(cam: Camera): Promise<Camera> {
    const val = new InsertModelValidator();

    await val.validate(cam, Camera);

    return this.dataContext.beginTransaction(async () => {
      await this.isUnique(cam.name, cam.ip);

      return super.create(cam);
    });
  }

  /**
   * Update a camera.
   */
  async updateModel(cam: Camera): Promise<Camera> {
    const val = new UpdateModelValidator();

    await val.validate(cam, Camera);

    return this.dataContext.beginTransaction(async () => {
      let name = cam.name;
      let ip   = cam.ip;

      // If name or ip is being updated then a dupe check is needed.
      if (cam.name || cam.ip) {
        // If name or ip is missing then pull by id for the dupe check.
        if (!cam.name || !cam.ip) {
          const exCam = await this.retrieveById(cam.id);

          name = name || exCam.name;
          ip   = ip   || exCam.ip;
        }

        await this.isUnique(name, ip, cam.id);
      }

      return super.updateModel(cam);
    });
  }
}
