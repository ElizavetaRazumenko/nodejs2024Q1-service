import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Album } from 'src/entities/album.entity';
import { Artist } from 'src/entities/artist.entity';
import { Entity, Favs } from 'src/entities/favs.entity';
import { Track } from 'src/entities/track.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  public async findAll(): Promise<Favs> {
    await this.getFavorites();

    return await this.prisma.favorites.findFirst({
      select: {
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true,
          },
        },
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true,
          },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            artistId: true,
            albumId: true,
          },
        },
      },
    });
  }

  public async add(entityName: Entity, id: string): Promise<void> {
    await this.findEntity(entityName, id);

    const favorites = await this.getFavorites();

    switch (entityName) {
      case 'artist':
        await this.prisma.favorites.update({
          where: { id: favorites.id },
          data: { artists: { connect: { id } } },
        });
        break;
      case 'album':
        await this.prisma.favorites.update({
          where: { id: favorites.id },
          data: { albums: { connect: { id } } },
        });
        break;
      case 'track':
        await this.prisma.favorites.update({
          where: { id: favorites.id },
          data: { tracks: { connect: { id } } },
        });
        break;
    }
  }

  public async delete(entityName: Entity, id: string): Promise<void> {
    await this.findEntity(entityName, id);

    const favorites = await this.getFavorites();

    switch (entityName) {
      case 'artist':
        await this.prisma.favorites.update({
          where: { id: favorites.id },
          data: { artists: { disconnect: { id } } },
        });
        break;
      case 'album':
        await this.prisma.favorites.update({
          where: { id: favorites.id },
          data: { albums: { disconnect: { id } } },
        });
        break;
      case 'track':
        await this.prisma.favorites.update({
          where: { id: favorites.id },
          data: { tracks: { disconnect: { id } } },
        });
        break;
    }
  }

  private async getFavorites() {
    const favorites = await this.prisma.favorites.findFirst();

    if (!favorites) {
      return await this.prisma.favorites.create({ data: {} });
    } else {
      return favorites;
    }
  }

  private async findEntity(
    entityName: Entity,
    id: string,
  ): Promise<Artist | Album | Track> {
    let entity: Artist | Album | Track;

    switch (entityName) {
      case 'artist':
        entity = await this.prisma.artist.findUnique({
          where: { id },
        });
        break;
      case 'album':
        entity = await this.prisma.album.findUnique({
          where: { id },
        });
        break;
      case 'track':
        entity = await this.prisma.track.findUnique({
          where: { id },
        });
        break;
    }

    if (!entity) {
      throw new UnprocessableEntityException(
        `${
          entityName[0].toUpperCase + entityName.slice(1)
        } with this ID doesn't exist`,
      );
    }

    return entity;
  }
}
