import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  public findAll() {
    return 'find all users';
  }

  public findOne(id: string) {
    return `find one user with id = ${id}`;
  }

  public create(dto: CreateDto) {
    return 'create new user';
  }

  public update(id: string, dto: UpdateDto) {
    return 'update user';
  }

  public delete(id: string) {
    return 'remove user';
  }
}
