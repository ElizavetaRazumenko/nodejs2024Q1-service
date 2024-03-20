import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Album } from 'src/database/entities/album.entity';
import { Artist } from 'src/database/entities/artist.entity';
import { Entity, Favs } from 'src/database/entities/favs.entity';
import { Track } from 'src/database/entities/track.entity';

@Injectable()
export class FavsService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): Favs {
    return this.dbService.favs;
  }

  public add(entityName: Entity, id: string): void {
    const entity = this.findEntity(entityName, id);

    const entityInFavs = this.dbService.favs[entityName].find(
      (entity: Artist | Album | Track) => entity.id === id,
    );

    if (!entityInFavs) {
      this.dbService.favs[entityName].push(entity);
    }
  }

  public delete(entityName: Entity, id: string): void {
    const entity = this.dbService.favs[entityName].find(
      (entity: Artist | Album | Track) => entity.id === id,
    );

    if (!entity) {
      throw new NotFoundException(
        `${
          entityName[0].toUpperCase + entityName.slice(1)
        } with this ID not found`,
      );
    }

    const entityIndex = this.dbService.favs[entityName].indexOf(entity);

    this.dbService.favs[entityName].splice(entityIndex, 1);
  }

  private findEntity(entityName: Entity, id: string): Artist | Album | Track {
    const entity = this.dbService[entityName].find(
      (entity: Artist | Album | Track) => entity.id === id,
    );

    if (!entity) {
      throw new UnprocessableEntityException(
        `${
          entityName[0].toUpperCase + entityName.slice(1)
        } with this ID doesn't exist`,
      );
    }

    return entity;
  }
}
