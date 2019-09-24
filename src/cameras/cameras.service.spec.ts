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

  describe('.updateModel()', () => {
    let isUnqSpy: jasmine.Spy;
    let updateSpy: jasmine.Spy;
    let retSpy: jasmine.Spy;
    let exCam: Camera;

    beforeEach(() => {
      isUnqSpy = spyOn(cameraSvc, 'isUnique');
      isUnqSpy.and.returnValue(Promise.resolve());

      updateSpy = mockDC.getExecuter().update as jasmine.Spy;

      exCam = new Camera();
      exCam.id = 42;
      exCam.name = 'fake';
      exCam.ip = '1.1.1.1';

      retSpy = spyOn(cameraSvc, 'retrieveById');
      retSpy.and.returnValue(Promise.resolve(exCam));
    });

    it('validates the camera.', async () => {
      try {
        const cam = new Camera();

        await cameraSvc.updateModel(cam);
        expect(true).toBe(false);
      }
      catch (err) {
        expect(err.name).toBe('ValidationErrorList');
        // id required.
        expect(err.errors.length).toBe(1);
      }
    });

    it('checks that the camera is unique.', async () => {
      const cam = new Camera();

      cam.id = 42;
      cam.name = 'fake';
      cam.ip = '1.1.1.1';

      await cameraSvc.updateModel(cam);

      expect(isUnqSpy).toHaveBeenCalledWith('fake', '1.1.1.1', 42);
    });

    it('pulls the camera if the ip is missing and the name is set.', async () => {
      const cam = new Camera();

      cam.id = 42;
      cam.name = 'asdf';

      await cameraSvc.updateModel(cam);

      expect(retSpy).toHaveBeenCalledWith(42);
      expect(isUnqSpy).toHaveBeenCalledWith('asdf', '1.1.1.1', 42);
    });

    it('pulls the camera if the name is missing and the ip is set.', async () => {
      const cam = new Camera();

      cam.id = 42;
      cam.ip = '2.2.2.2';

      await cameraSvc.updateModel(cam);

      expect(retSpy).toHaveBeenCalledWith(42);
      expect(isUnqSpy).toHaveBeenCalledWith('fake', '2.2.2.2', 42);
    });

    it('does not pull the camera if neither the name no ip is set.', async () => {
      const cam = new Camera();

      cam.id = 42;

      await cameraSvc.updateModel(cam);

      expect(retSpy).not.toHaveBeenCalled();
      expect(isUnqSpy).not.toHaveBeenCalled();
    });

    it('updates the camera.', async () => {
      const cam = new Camera();

      cam.id = 42;
      cam.name = 'fake';
      cam.ip = '1.1.1.1';

      await cameraSvc.updateModel(cam);

      expect(updateSpy.calls.argsFor(0)[1]).toEqual({
        cameras_id_0: cam.id,
        cameras_ip_0: cam.ip,
        cameras_name_1: cam.name,
      });
    });
  });

  describe('.retrieveByIp()', () => {
    let selectSpy: jasmine.Spy;

    beforeEach(() => {
      selectSpy = mockDC.getExecuter().select as jasmine.Spy;
    });

    it('throws a NotFoundError if the camera is not found.', async () => {
      try {
        selectSpy.and.returnValue(Promise.resolve([]));
        await cameraSvc.retrieveByIp('1.1.1.1');
        expect(true).toBe(false);
      }
      catch (err) {
        expect(err.name).toBe('NotFoundError');
        expect(err.message).toBe('Camera not found by ip "1.1.1.1."');
      }
    });

    it('returns the camera.', async () => {
      selectSpy.and.returnValue(Promise.resolve([{'c.id': 42}]));

      const cam = await cameraSvc.retrieveByIp('1.1.1.1');

      expect(selectSpy.calls.argsFor(0)[1]).toEqual({ip: '1.1.1.1'});
    });
  });

  describe('.createByIpIfNotFound()', () => {
    let selectSpy: jasmine.Spy;
    let insertSpy: jasmine.Spy;

    beforeEach(() => {
      selectSpy = mockDC.getExecuter().select as jasmine.Spy;
      insertSpy = mockDC.getExecuter().insert as jasmine.Spy;
    });

    it('returns the camera if it is found.', async () => {
      selectSpy.and.returnValue(Promise.resolve([{'c.id': 42}]));

      const cam = await cameraSvc.createByIpIfNotFound('1.1.1.1');

      expect(selectSpy.calls.argsFor(0)[1]).toEqual({ip: '1.1.1.1'});
      expect(insertSpy).not.toHaveBeenCalled();
    });

    it('inserts the camera if it is not found.', async () => {
      selectSpy.and.returnValue(Promise.resolve([]));

      const cam = await cameraSvc.createByIpIfNotFound('1.1.1.1');

      expect(insertSpy.calls.argsFor(0)[1]).toEqual({
        ip: '1.1.1.1',
        name: '1.1.1.1',
      });
    });
  });
});
