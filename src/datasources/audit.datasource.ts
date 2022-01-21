import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { AuditDbSourceName } from '@sourceloop/audit-log';

const config = {
  name: 'audit',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'lb',
};

@lifeCycleObserver('datasource')
export class AuditDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = AuditDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.audit', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
