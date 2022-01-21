import { Constructor, Getter, inject } from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {
  AuditDbSourceName,
  // AuditLogRepository,
  AuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import { PostgresDataSource } from '../datasources';
import { Role, User, UserRelations } from '../models';
import { AuditLogRepository } from './audit.repository';
import { RoleRepository } from './role.repository';

const userAuditOpts: IAuditMixinOptions = {
  actionKey: 'User_Logs',
};
export class UserRepository extends AuditRepositoryMixin<
  User,
  typeof User.prototype.id,
  UserRelations,
  number,
  Constructor<
    DefaultCrudRepository<User, typeof User.prototype.id, UserRelations>
  >
>(DefaultCrudRepository, userAuditOpts) {
  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>;

  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: PostgresDataSource,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(User, dataSource);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
