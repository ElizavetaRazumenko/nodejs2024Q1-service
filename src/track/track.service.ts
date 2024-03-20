import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Track } from 'src/database/entities/track.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class TrackService {
  constructor(private dbService: DatabaseService) {}

  public findAll(): Track[] {
    return this.dbService.tracks;
  }

  public findOne(id: string): Track {
    return this.findTrack(id);
  }

  public create(dto: CreateDto): Track {
    const track: Track = {
      id: uuidv4(),
      ...dto,
    };

    this.dbService.tracks.push(track);

    return track;
  }

  public update(id: string, dto: UpdateDto): Track {
    const track = this.findTrack(id);

    return Object.assign(track, dto);
  }

  public delete(id: string): void {
    const track = this.findTrack(id);
    const trackIndex = this.dbService.tracks.indexOf(track);

    this.dbService.tracks.splice(trackIndex, 1);
    const trackInFavs = this.dbService.favs.tracks.find(
      (track) => track.id === id,
    );

    if (trackInFavs) {
      const trackIndex = this.dbService.favs.tracks.indexOf(trackInFavs);
      this.dbService.favs.tracks.splice(trackIndex, 1);
    }
  }

  private findTrack(id: string): Track {
    const track = this.dbService.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track with this ID not found');
    }

    return track;
  }
}
