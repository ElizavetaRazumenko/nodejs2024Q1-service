import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/database/entities/user.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  findAll(): User[] {
    const users = this.userService.findAll();
    return users.map((user) => plainToClass(User, user));
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  findOne(@Param('id', ParseUUIDPipe) id: string): User {
    const user = this.userService.findOne(id);
    return plainToClass(User, user);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() dto: CreateDto): User {
    const user = this.userService.create(dto);
    return plainToClass(User, user);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDto): User {
    const user = this.userService.update(id, dto);
    return plainToClass(User, user);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseUUIDPipe) id: string): void {
    this.userService.delete(id);
  }
}
