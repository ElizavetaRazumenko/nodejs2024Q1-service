import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [FavsService],
  controllers: [FavsController],
})
export class FavsModule {}
