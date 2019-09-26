import { Table, Column, ManyToOne } from 'formn';

import { Camera } from './camera.entity';

@Table({name: 'notifications'})
export class Notification {
  @Column({isNullable: false, sqlDataType: 'int'})
  cameraId: number;

  @Column({hasDefault: true, isNullable: false, sqlDataType: 'timestamp'})
  createdOn: Date;

  @Column({isPrimary: true, isGenerated: true, isNullable: false, sqlDataType: 'int'})
  id: number;

  @Column({sqlDataType: 'datetime'})
  viewedOn: Date;

  @ManyToOne<Notification, Camera>(() => Camera, (l, r) => [l.cameraId, r.id])
  camera: Camera;
}
