import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Role } from '.';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  middleName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'number',
  })
  phone?: number;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
    required: true,
  })
  password?: string;

  @property({
    type: 'date',
    default: new Date(),
  })
  createdOn?: string;

  @property({
    type: 'date',
  })
  modifiedOn?: string;

  // @property({
  //   type: 'number',
  // })
  // roleId?: number;

  @belongsTo(() => Role)
  roleId: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  role?: Role;
}

export type UserWithRelations = User & UserRelations;
