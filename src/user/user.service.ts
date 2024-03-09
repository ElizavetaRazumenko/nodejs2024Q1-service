import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { isUUID } from 'class-validator';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { User, UserResponse } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  public findAll(): UserResponse[] {
    return this.users.map((user) => this.convertUser(user));
  }

  public findOne(id: string): UserResponse {
    const user = this.findUser(id);
    return this.convertUser(user);
  }

  public create(dto: CreateDto): UserResponse {
    const { login, password } = dto;

    const user: User = {
      id: uuidv4(),
      login: login,
      password: password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);

    return this.convertUser(user);
  }

  public update(id: string, dto: UpdateDto): UserResponse {
    const { oldPassword, newPassword } = dto;
    const user = this.findUser(id);
    const { password } = user;

    if (oldPassword !== password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.convertUser(user);
  }

  public delete(id: string): void {
    const user = this.findUser(id);
    const userIndex = this.users.indexOf(user);

    this.users.splice(userIndex, 1);
  }

  private convertUser(user: User): UserResponse {
    const { password, ...rest } = user;

    return rest;
  }

  private findUser(id: string): User {
    if (!id || !isUUID(id)) {
      throw new BadRequestException('ID is not an UUID type');
    }

    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with ID=${id} not found`);
    }

    return user;
  }
}
