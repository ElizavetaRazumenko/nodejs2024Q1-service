import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';

@Module({
  imports: [PrismaModule],
  providers: [ArtistService],
  controllers: [ArtistController],
})
export class ArtistModule {}
