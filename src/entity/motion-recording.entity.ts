import { Table, Column, ManyToOne, OneToMany } from 'formn';

import { Camera } from './camera.entity';
import { Classification } from './classification.entity';

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

  @OneToMany<MotionRecording, Classification>(() => Classification, (l, r) => [l.id, r.motionRecordingId])
  classifications: Classification[];
}
