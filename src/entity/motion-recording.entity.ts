import { Table, Column, ManyToOne } from 'formn';

import { Camera } from './camera.entity';

@Table({name: 'motion_recordings'})
export class MotionRecording {
  @Column({isNullable: false, sqlDataType: 'int'})
  cameraId: number;

  @Column({hasDefault: true, isNullable: false, sqlDataType: 'timestamp'})
  createdOn: Date;

  @Column({isNullable: false, maxLength: 255, sqlDataType: 'varchar'})
  fileName: string;

  @Column({isPrimary: true, isGenerated: true, isNullable: false, sqlDataType: 'int'})
  id: number;

  @Column({sqlDataType: 'datetime'})
  viewedOn: Date;

  @ManyToOne<MotionRecording, Camera>(() => Camera, (l, r) => [l.cameraId, r.id])
  camera: Camera;
}
