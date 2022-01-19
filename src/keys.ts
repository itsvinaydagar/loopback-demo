import { BindingKey } from '@loopback/core';
import { AuthService } from './services/auth-service';
import { BcryptHash } from './services/hash-password';

export namespace BinderKeys {
  export const AUTHSERVICE = BindingKey.create<AuthService>('auth.service');
  export const ENCRYPT = BindingKey.create<BcryptHash>('encrypt');
}
