import { Table, Column, ManyToOne } from 'formn';

import { MotionRecording } from './motion-recording.entity';

@Table({name: 'classifications'})
export class Classification {
  @Column({isNullable: false, maxLength: 255, sqlDataType: 'varchar'})
  class: string;

  @Column({isNullable: false, sqlDataType: 'float'})
  confidence: number;

  @Column({isNullable: false, sqlDataType: 'int'})
  frame: number;

  @Column({isPrimary: true, isGenerated: true, isNullable: false, sqlDataType: 'int'})
  id: number;

  @Column({isNullable: false, sqlDataType: 'int'})
  motionRecordingId: number;

  @ManyToOne<Classification, MotionRecording>(() => MotionRecording, (l, r) => [l.motionRecordingId, r.id])
  motionRecording: MotionRecording;
}
