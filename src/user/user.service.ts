import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

  public async findOneByLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      // It might be worth cleaning it up later.
      where: { login },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.convertUser(user);
  }

  public async create({ login, password }: CreateDto) {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        login,
        password: hash,
        version: 1,
        createdAt: new Date(),
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

    return this.convertUser(user);
  }

  public async update(id: string, dto: UpdateDto) {
    const { oldPassword, newPassword } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        login: true,
        password: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User with this ID not found');
    }
    const { password } = user;

    const cryptoPassword = bcrypt.compare(oldPassword, password);

    if (!cryptoPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hash,
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
