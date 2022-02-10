import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { User } from '../models';
import { RoleRepository, UserRepository } from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: ['Admin'] })
  @get('/users/count', {
    responses: {
      200: {
        description: 'User model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: ['*'] })
  @get('/users', {
    responses: {
      200: {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find({
      ...filter,
      include: [
        {
          relation: 'role',
        },
      ],
    });
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, { exclude: 'where' })
    filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, {
      ...filter,
      // include: [{ relation: 'role' }],
    });
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    user.modifiedOn = new Date().toString();
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
