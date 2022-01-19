import { inject } from '@loopback/core';
import { genSalt, hash } from 'bcryptjs';
interface PaswordHasher<T> {
  hashPassword(password: T): Promise<T>;
}

export class BcryptHash implements PaswordHasher<string> {
  @inject('bcrypt.rounds')
  public readonly rounds: number;

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }
}
