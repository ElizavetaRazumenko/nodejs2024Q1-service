/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  async findAll() {
    const users = await this.userService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const { password, ...rest } = await this.userService.findOne(id);
    return rest;
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @Header('Content-Type', 'application/json')
  async create(@Body() dto: CreateDto) {
    const { password, ...rest } = await this.userService.create(dto);
    return rest;
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDto) {
    const { password, ...rest } = await this.userService.update(id, dto);
    return rest;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.delete(id);
  }
}
