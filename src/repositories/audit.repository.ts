import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { AuditDbSourceName } from '@sourceloop/audit-log';
import { PostgresDataSource } from '../datasources';
import { AuditLog } from '../models';

export class AuditLogRepository extends DefaultCrudRepository<
  AuditLog,
  typeof AuditLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: PostgresDataSource,
  ) {
    super(AuditLog, dataSource);
  }
}
