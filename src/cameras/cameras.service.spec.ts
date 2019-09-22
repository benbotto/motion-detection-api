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
});
