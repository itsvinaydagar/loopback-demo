import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
  getJsonSchemaRef,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import { BinderKeys } from '../keys';
import { User } from '../models';
import {
  AuditLogRepository,
  RoleRepository,
  UserRepository,
} from '../repositories';
import { AuthService } from '../services/auth-service';
import { BcryptHash } from '../services/hash-password';

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(AuditLogRepository)
    public auditRepository: AuditLogRepository,
    @inject(BinderKeys.ENCRYPT)
    public encrypt: BcryptHash,
    @inject(BinderKeys.AUTHSERVICE)
    public auth: AuthService,
  ) {}

  @post('/authh/register/{role}')
  @response(201, {
    content: {
      'application/json': { schema: getJsonSchemaRef(User) },
    },
  })
  async signup(
    @param.path.string('role') role: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
          }),
        },
      },
    })
    user: User,
  ): Promise<User> {
    const userRole = await this.roleRepository.findOne({
      where: {
        key: role,
      },
    });

    if (!userRole) throw new Error('Role not defined');

    const hashedPassword = await this.encrypt.hashPassword(
      user.password as string,
    );

    console.log(hashedPassword, 'password');

    const newUser = await this.userRepository.create({
      ...user,
      password: hashedPassword,
      roleId: userRole.id,
    });

    // await (
    //   await this.userRepository.getAuditLogRepository()
    // ).create({
    //   id: Date.now().toString(),
    //   action: Action.INSERT_ONE,
    //   actedAt: new Date(),
    //   entityId: newUser.id?.toString(),
    //   actionKey: 'User_Logs',
    //   actor: 'user',
    // });

    // await this.auditRepository.create({
    //   // id: '1',
    //   action: Action.INSERT_ONE,
    //   actedAt: new Date(),
    //   entityId: newUser.id?.toString(),
    //   // actionKey: 'user_created',
    //   actor: 'user',
    // });

    delete newUser.password;
    return newUser;
  }

  @post('/auth/login')
  @response(200, {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      description: 'User Login Credentials',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
              password: {
                type: 'string',
                minLength: 6,
              },
            },
          },
        },
      },
    })
    credentials: {
      email: string;
      password: string;
    },
  ): Promise<{ token: string }> {
    const userId = await this.auth.authenticateUser(
      credentials.email,
      credentials.password,
    );

    if (!userId) throw new HttpErrors.NotFound('Password does not matched!');

    const token = this.auth.signJwt({ userId });
    return { token };
  }
}
