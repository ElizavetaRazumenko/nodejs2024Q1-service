import { Injectable } from '@nestjs/common';
import { Album } from './entities/album.entity';
import { Artist } from './entities/artist.entity';
import { Track } from './entities/track.entity';
import { User } from './entities/user.entity';

@Injectable()
export class DatabaseService {
  public users: User[] = [];

  public tracks: Track[] = [];

  public artists: Artist[] = [];

  public albums: Album[] = [];
}
