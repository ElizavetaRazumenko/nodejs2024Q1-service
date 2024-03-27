import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class AuthService {
  public findAll() {
    return 'find all';
  }

  public findOne(id: string) {
    return 'find one ' + id;
  }

  public create(dto: CreateDto) {
    console.log(dto);
    return 'user created';
  }

  public update(id: string, dto: UpdateDto) {
    console.log(dto);
    return 'user updated' + id;
  }

  public delete(id: string) {
    return 'user deleted' + id;
  }
}
