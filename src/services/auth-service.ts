import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { compare } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories';

interface IAuthService<> {
  authenticateUser(email: string, password: string): Promise<number>;
}

export class AuthService implements IAuthService {
  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,
  ) {}

  async authenticateUser(email: string, password: string): Promise<number> {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new HttpErrors.NotFound('User not found');

    return (await compare(password, user.password as string))
      ? (user.id as number)
      : 0;
  }

  signJwt(payload: object | string): string {
    return jwt.sign(payload, 'the secretKEy', {
      expiresIn: '1d',
    });
  }

  verifyJwt(token: string): jwt.JwtPayload | string {
    return jwt.verify(token, 'the secretKEy');
  }
}
