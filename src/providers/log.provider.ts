import { Provider, ValueOrPromise } from '@loopback/core';
import { ILogger } from '../logger.interface';
import { WinstonLogger } from '../winston-logger';

export class LoggerProvider implements Provider<ILogger> {
  constructor() {
    this.logger = new WinstonLogger();
  }

  logger: ILogger;

  value(): ValueOrPromise<ILogger> {
    return this.logger;
  }
}
