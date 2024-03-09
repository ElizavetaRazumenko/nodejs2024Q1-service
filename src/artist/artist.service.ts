import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Artist } from 'src/database/entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class ArtistService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): Artist[] {
    return this.dbService.artists;
  }

  public findOne(id: string): Artist {
    return this.findArtist(id);
  }

  public create(dto: CreateDto): Artist {
    const artist: Artist = {
      id: uuidv4(),
      ...dto,
    };

    this.dbService.artists.push(artist);

    return artist;
  }

  public update(id: string, dto: UpdateDto): Artist {
    const artist = this.findArtist(id);

    return Object.assign(artist, dto);
  }

  public delete(id: string): void {
    const artist = this.findArtist(id);
    const artistIndex = this.dbService.artists.indexOf(artist);

    this.dbService.artists.splice(artistIndex, 1);
    this.dbService.tracks
      .filter((track) => track.artistId === artist.id)
      .forEach((track) => (track.artistId = null));
    this.dbService.albums
      .filter((album) => album.artistId === artist.id)
      .forEach((album) => (album.artistId = null));
  }

  private findArtist(id: string): Artist {
    const artist = this.dbService.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist with this ID not found');
    }

    return artist;
  }
}
