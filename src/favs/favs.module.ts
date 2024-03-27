import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';

@Module({
  imports: [PrismaModule],
  providers: [FavsService],
  controllers: [FavsController],
})
export class FavsModule {}
