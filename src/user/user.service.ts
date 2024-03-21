import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((user) => this.convertUser(user));
  }

  public async findOne(id: string) {
    const user = await this.findUser(id);

    return this.convertUser(user);
  }

  public async create(dto: CreateDto) {
    const user = await this.prisma.user.create({
      data: {
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...dto,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  public async update(id: string, dto: UpdateDto) {
    const { oldPassword, newPassword } = dto;
    const user = (await this.findUser(id)) as unknown as User;
    const { password } = user;

    if (oldPassword !== password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.convertUser(updatedUser);
  }

  public async delete(id: string): Promise<void> {
    await this.findUser(id);
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private async findUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User with this ID not found');
    }

    return user;
  }

  private convertUser(user) {
    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }
}
