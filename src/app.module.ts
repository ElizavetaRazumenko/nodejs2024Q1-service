import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { HttpExceptionFilter } from './filters/exception.filter';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
    PrismaModule,
    AuthModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
