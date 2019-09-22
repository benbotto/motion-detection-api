import { DataContextManager } from 'formn-nestjs-utils';
import { getMockDataContext } from '../test/get-mock-data-context';

import { Camera } from '../entity/camera.entity';
import { CamerasDao } from './cameras.dao';
import { CamerasService } from './cameras.service';

describe('CamerasService()', () => {
  let mockDC: DataContextManager;
  let cameraDao: CamerasDao;
  let cameraSvc: CamerasService;

  beforeEach(() => {
    mockDC  = getMockDataContext();

    cameraDao = new CamerasDao(mockDC);
    cameraSvc = new CamerasService(mockDC, cameraDao);
  });

  describe('.isUnique()', () => {
    let selectSpy: jasmine.Spy;

    beforeEach(() => {
      selectSpy = mockDC.getExecuter().select as jasmine.Spy;
    });

    it('throws a DuplicateError if the ip or name is taken.', async () => {
      selectSpy.and.returnValue(Promise.resolve([{'c.id': 42}]));

      try {
        await cameraSvc.isUnique('name', '192.168.3.4');
        expect(true).toBe(false);
      }
      catch (err) {
        expect(err.name).toBe('DuplicateError');
      }
    });

    it('resolves if the camera is not a dupe.', async () => {
      selectSpy.and.returnValue(Promise.resolve([]));

      await cameraSvc.isUnique('fake name', '192.168.3.4', 42);

      expect(selectSpy.calls.argsFor(0)[1]).toEqual({
        name: 'fake name',
        ip: '192.168.3.4',
        excludeId: 42
      });
    });
  });

  describe('.create()', () => {
    let isUnqSpy: jasmine.Spy;
    let insertSpy: jasmine.Spy;

    beforeEach(() => {
      isUnqSpy = spyOn(cameraSvc, 'isUnique');
      isUnqSpy.and.returnValue(Promise.resolve());

      insertSpy = mockDC.getExecuter().insert as jasmine.Spy;
    });

    it('validates the camera.', async () => {
      try {
        const cam = new Camera();

        await cameraSvc.create(cam);
        expect(true).toBe(false);
      }
      catch (err) {
        expect(err.name).toBe('ValidationErrorList');
        // name and ip required.
        expect(err.errors.length).toBe(2);
      }
    });

    it('checks that the camera is unique.', async () => {
      const cam = new Camera();

      cam.name = 'fake';
      cam.ip = '1.1.1.1';

      await cameraSvc.create(cam);

      expect(isUnqSpy).toHaveBeenCalledWith('fake', '1.1.1.1');
    });

    it('inserts the camera.', async () => {
      const cam = new Camera();

      cam.name = 'fake';
      cam.ip = '1.1.1.1';

      await cameraSvc.create(cam);

      expect(insertSpy.calls.argsFor(0)[1]).toEqual({
        name: cam.name,
        ip: cam.ip
      });

      expect(cam.id).toBe(42);
    });
  });
});
