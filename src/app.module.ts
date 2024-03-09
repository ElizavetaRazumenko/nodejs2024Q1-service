import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { DatabaseService } from './database/database.service';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';

@Module({
  imports: [UserModule, TrackModule, ArtistModule, AlbumModule, FavsModule],
})
export class AppModule {}
