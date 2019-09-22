import { Table, Column } from 'formn';

@Table({name: 'formn_migrations'})
export class FormnMigration {
  @Column({isPrimary: true, isGenerated: true, isNullable: false, sqlDataType: 'int'})
  id: number;

  @Column({isNullable: false, maxLength: 255, sqlDataType: 'varchar'})
  name: string;

  @Column({hasDefault: true, isNullable: false, sqlDataType: 'timestamp'})
  runOn: Date;
}
