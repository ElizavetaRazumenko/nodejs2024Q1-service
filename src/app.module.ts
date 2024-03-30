import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CustomLoggerService } from './logger/logger.service';
import { ExceptionsFilter } from './filters/exception.filter';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
    PrismaModule,
    AuthModule,
  ],
  providers: [
    ExceptionsFilter,
    CustomLoggerService,
    {
      provide: APP_FILTER,
      useValue: new ExceptionsFilter(new CustomLoggerService()),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
