import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackController],
  providers: [TrackService]
})
export class TrackModule {}
