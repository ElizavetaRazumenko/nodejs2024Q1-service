import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  public findAll(): User[] {
    return this.users;
  }

  public findOne(id: string): User {
    return this.findUser(id);
  }

  public create(dto: CreateDto): User {
    const user: User = {
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...dto,
    };

    this.users.push(user);

    return user;
  }

  public update(id: string, dto: UpdateDto): User {
    const { oldPassword, newPassword } = dto;
    const user = this.findUser(id);
    const { password } = user;

    if (oldPassword !== password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  public delete(id: string): void {
    const user = this.findUser(id);
    const userIndex = this.users.indexOf(user);

    this.users.splice(userIndex, 1);
  }

  private findUser(id: string): User {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User with this ID not found');
    }

    return user;
  }
}
