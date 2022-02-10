import { Provider } from '@loopback/context';
import { repository } from '@loopback/repository';
import { verify } from 'jsonwebtoken';
import { VerifyFunction } from 'loopback4-authentication';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories';

export interface AuthUser extends User {
  permissions?: string[];
}

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      const user = verify(
        token,
        (process.env.JWT_SECRET as string) || 'the secretKEy',
      ) as AuthUser;

      console.log(user, 'verify');

      return user;
    };
  }
}
