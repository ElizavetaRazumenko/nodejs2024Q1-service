import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

@Module({
  imports: [PrismaModule],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
