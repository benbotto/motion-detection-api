import { Table, Column } from 'formn';

@Table({name: 'cameras'})
export class Camera {
  @Column({hasDefault: true, isNullable: false, sqlDataType: 'timestamp'})
  createdOn: Date;

  @Column({isPrimary: true, isGenerated: true, isNullable: false, sqlDataType: 'int'})
  id: number;

  @Column({isNullable: false, maxLength: 100, sqlDataType: 'varchar'})
  ip: string;

  @Column({maxLength: 255, sqlDataType: 'varchar'})
  name: string;
}
