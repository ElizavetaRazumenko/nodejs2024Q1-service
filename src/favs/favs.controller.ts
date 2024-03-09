import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Entity, Favs } from 'src/database/entities/favs.entity';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  private entities = ['track', 'album', 'artist'];

  constructor(private readonly favsService: FavsService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  findAll(): Favs {
    return this.favsService.findAll();
  }

  @Post(':entity/:id')
  @Header('Content-Type', 'application/json')
  add(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): string {
    if (this.entities.includes(entity)) {
      this.favsService.add(this.convertToPlural(entity), id);
      return `${
        entity[0].toUpperCase + entity.slice(1)
      } successfully added to favorites`;
    } else {
      throw new BadRequestException('Invalid entity');
    }
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  delete(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): string {
    if (this.entities.includes(entity)) {
      this.favsService.delete(this.convertToPlural(entity), id);
      return `${
        entity[0].toUpperCase + entity.slice(1)
      } successfully deleted from favorites`;
    } else {
      throw new BadRequestException('Invalid entity');
    }
  }

  private convertToPlural(entityName: string): Entity {
    return `${entityName}s` as Entity;
  }
}
