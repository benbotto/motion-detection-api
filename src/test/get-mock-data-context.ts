import { DataContextManager } from 'formn-nestjs-utils';
import { MySQLDataContext, MySQLExecuter, MySQLTransactionalDataContext } from 'formn';

export function getMockDataContext() {
  // Mocks out the query executer and returns fake data.  Default returns are
  // provided.
  const mockExecuter: jasmine.SpyObj<MySQLExecuter> = jasmine
    .createSpyObj('mockExecuter', [
      'select', 'insert', 'update', 'delete', 'query'
    ]);

  mockExecuter.select.and.returnValue(Promise.resolve([]));
  mockExecuter.insert.and.returnValue(Promise.resolve({insertId: 42}));
  mockExecuter.update.and.returnValue(Promise.resolve({affectedRows: 1}));
  mockExecuter.delete.and.returnValue(Promise.resolve({affectedRows: 1}));
  mockExecuter.query.and.returnValue(Promise.resolve({}));

  // A MySQLDataContext is used.
  // The executer is swapped out.
  // The connection methods (connect; end) do nothing.
  // The transaction methods return the mockDC rather than starting a transaction.
  const mockDataContext = new MySQLDataContext();

  spyOn(mockDataContext, 'getExecuter').and.returnValue(mockExecuter);
  spyOn(mockDataContext, 'connect').and.returnValue(Promise.resolve(mockDataContext));
  spyOn(mockDataContext, 'end').and.returnValue(Promise.resolve());
  spyOn(mockDataContext, 'beginTransaction').and
    .callFake(callback => callback(mockDataContext as MySQLTransactionalDataContext));
  spyOn(mockDataContext, 'rollbackTransaction').and.returnValue(Promise.resolve());

  // A DataContextManager is used by services/DAOs.
  return new DataContextManager(mockDataContext);
}
