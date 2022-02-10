import { BindingKey } from '@loopback/core';
import { ILogger } from './logger.interface';
import { AuthService } from './services/auth-service';
import { BcryptHash } from './services/hash-password';

export namespace BinderKeys {
  export const AUTHSERVICE = BindingKey.create<AuthService>('auth.service');
  export const ENCRYPT = BindingKey.create<BcryptHash>('encrypt');
  export const LOGGER = BindingKey.create<ILogger>('logger');
}
