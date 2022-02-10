import winston, { Logger } from 'winston';
import { ILogger } from './logger.interface';

export class WinstonLogger implements ILogger {
  logger: Logger;
  constructor() {
    this.logger = winston.createLogger();
  }

  info(msg: string, key?: string): void {
    this.logger.info(`${msg}`);
  }

  error(msg: string, key?: string): void {
    this.logger.error(`${msg}`);
  }

  verbose(msg: string, key?: string): void {
    this.logger.verbose(`${msg}`);
  }
}
