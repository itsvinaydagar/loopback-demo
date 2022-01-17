import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Role, RoleRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {

  public readonly y: HasOneRepositoryFactory<User, typeof Role.prototype.id>;

  constructor(
    @inject('datasources.Postgres') dataSource: PostgresDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Role, dataSource);
    this.y = this.createHasOneRepositoryFactoryFor('y', userRepositoryGetter);
    this.registerInclusionResolver('y', this.y.inclusionResolver);
  }
}
