import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  public findAll(): Track[] {
    return this.tracks;
  }

  public findOne(id: string): Track {
    return this.findTrack(id);
  }

  public create(dto: CreateDto): Track {
    const track: Track = {
      id: uuidv4(),
      ...dto,
    };

    this.tracks.push(track);

    return track;
  }

  public update(id: string, dto: UpdateDto): Track {
    const track = this.findTrack(id);

    return Object.assign(track, dto);
  }

  public delete(id: string): void {
    const track = this.findTrack(id);
    const trackIndex = this.tracks.indexOf(track);

    this.tracks.splice(trackIndex, 1);
  }

  private findTrack(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException('Track with this ID not found');
    }

    return track;
  }
}
