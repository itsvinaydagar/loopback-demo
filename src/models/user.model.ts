import { Entity, model, property } from '@loopback/repository';

export enum Role {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Subscriber = 'Subscriber',
}

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
  role: string;

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
    type: 'date',
    default: Date.now(),
  })
  createdOn?: string;

  @property({
    type: 'date',
  })
  modifiedOn?: string;

  @property({
    type: 'number',
  })
  roleId?: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
