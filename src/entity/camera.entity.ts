import { Table, Column, OneToMany } from 'formn';

import { Notification } from './notification.entity';

@Table({name: 'cameras'})
export class Camera {
  @Column({hasDefault: true, isNullable: false, sqlDataType: 'timestamp'})
  createdOn: Date;

  @Column({isPrimary: true, isGenerated: true, isNullable: false, sqlDataType: 'int'})
  id: number;

  @Column({isNullable: false, maxLength: 100, sqlDataType: 'varchar'})
  ip: string;

  @Column({isNullable: false, maxLength: 255, sqlDataType: 'varchar'})
  name: string;

  @OneToMany<Camera, Notification>(() => Notification, (l, r) => [l.id, r.cameraId])
  notifications: Notification[];
}
