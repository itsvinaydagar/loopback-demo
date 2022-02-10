import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { AuditDbSourceName } from '@sourceloop/audit-log';
import { PostgresDataSource } from '../datasources';
import { Role, RoleRelations } from '../models';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: PostgresDataSource,
  ) {
    super(Role, dataSource);
  }
}
