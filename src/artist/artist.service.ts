import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  public async findAll() {
    return await this.prisma.artist.findMany();
  }

  public async findOne(id: string) {
    return await this.findArtist(id);
  }

  public async create(dto: CreateDto) {
    return await this.prisma.artist.create({
      data: dto,
    });
  }

  public async update(id: string, dto: UpdateDto) {
    await this.findArtist(id);

    return await this.prisma.artist.update({
      where: { id },
      data: dto,
    });
  }

  public async delete(id: string) {
    await this.findArtist(id);
    await this.prisma.artist.delete({
      where: { id },
    });
  }

  private async findArtist(id: string) {
    const artist = this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException('Artist with this ID not found');
    }

    return artist;
  }
}
