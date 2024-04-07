import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Entity } from 'src/entities/favs.entity';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  private entities = ['track', 'album', 'artist'];

  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post(':entity/:id')
  async add(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (this.entities.includes(entity)) {
      return this.favsService.add(entity as Entity, id);
    } else {
      throw new BadRequestException('Invalid entity');
    }
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  async delete(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (this.entities.includes(entity)) {
      return await this.favsService.delete(entity as Entity, id);
    } else {
      throw new BadRequestException('Invalid entity');
    }
  }
}
