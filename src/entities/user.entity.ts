import { Exclude } from 'class-transformer';

export class User {
  id: string;
  login: string;

  @Exclude()
  password: string;
  token: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
