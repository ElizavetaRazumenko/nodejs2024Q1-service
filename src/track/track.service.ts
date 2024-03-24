import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  public async findAll() {
    return await this.prisma.track.findMany();
  }

  public async findOne(id: string) {
    return await this.findTrack(id);
  }

  public async create(dto: CreateDto) {
    const { artistId, albumId, ...rest } = dto;

    return await this.prisma.track.create({
      data: {
        ...rest,
        artistId: artistId || null,
        albumId: albumId || null,
      },
    });
  }

  public async update(id: string, dto: UpdateDto) {
    await this.findTrack(id);
    const { artistId, albumId, ...rest } = dto;

    return await this.prisma.track.update({
      where: { id },
      data: {
        ...rest,
        artistId: artistId || null,
        albumId: albumId || null,
      },
    });
  }

  public async delete(id: string) {
    await this.findTrack(id);
    await this.prisma.track.delete({
      where: { id },
    });
  }

  private async findTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track with this ID not found');
    }

    return track;
  }
}
