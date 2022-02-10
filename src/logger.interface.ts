export interface ILogger {
  info(msg: string, key?: string): void;
  error(msg: string, key?: string): void;
  verbose(msg: string, key?: string): void;
}
