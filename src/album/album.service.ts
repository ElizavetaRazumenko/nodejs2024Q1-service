import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Album } from 'src/database/entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class AlbumService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): Album[] {
    return this.dbService.albums;
  }

  public findOne(id: string): Album {
    return this.findAlbum(id);
  }

  public create(dto: CreateDto): Album {
    const album: Album = {
      id: uuidv4(),
      ...dto,
    };

    this.dbService.albums.push(album);

    return album;
  }

  public update(id: string, dto: UpdateDto): Album {
    const track = this.findAlbum(id);

    return Object.assign(track, dto);
  }

  public delete(id: string): void {
    const album = this.findAlbum(id);
    const albumIndex = this.dbService.albums.indexOf(album);

    this.dbService.albums.splice(albumIndex, 1);
    this.dbService.tracks
      .filter((track) => track.albumId === album.id)
      .forEach((track) => (track.albumId = null));
  }

  private findAlbum(id: string): Album {
    const album = this.dbService.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException('Album with this ID not found');
    }

    return album;
  }
}
