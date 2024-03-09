import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  public findAll(): Artist[] {
    return this.artists;
  }

  public findOne(id: string): Artist {
    return this.findArtist(id);
  }

  public create(dto: CreateDto): Artist {
    const artist: Artist = {
      id: uuidv4(),
      ...dto,
    };

    this.artists.push(artist);

    return artist;
  }

  public update(id: string, dto: UpdateDto): Artist {
    const artist = this.findArtist(id);

    return Object.assign(artist, dto);
  }

  public delete(id: string): void {
    const artist = this.findArtist(id);
    const artistIndex = this.artists.indexOf(artist);

    this.artists.splice(artistIndex, 1);
  }

  private findArtist(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException('Artist with this ID not found');
    }

    return artist;
  }
}
