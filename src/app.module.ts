import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [UserModule, TrackModule, ArtistModule],
})
export class AppModule {}
