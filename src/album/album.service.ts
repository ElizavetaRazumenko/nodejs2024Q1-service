import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  public async findAll() {
    return await this.prisma.album.findMany();
  }

  public async findOne(id: string) {
    return await this.findAlbum(id);
  }

  public async create(dto: CreateDto) {
    const { artistId, ...rest } = dto;

    return await this.prisma.album.create({
      data: {
        ...rest,
        artistId: artistId || null,
      },
    });
  }

  public async update(id: string, dto: UpdateDto) {
    await this.findAlbum(id);
    const { artistId, ...rest } = dto;

    return await this.prisma.album.update({
      where: { id },
      data: {
        ...rest,
        artistId: artistId || null,
      },
    });
  }

  public async delete(id: string) {
    await this.findAlbum(id);
    await this.prisma.album.delete({
      where: { id },
    });
  }

  private async findAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album with this ID not found');
    }

    return album;
  }
}
