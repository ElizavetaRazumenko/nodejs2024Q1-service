import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types';
import { decode } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async signUp(dto: SignUpDto) {
    return await this.userService.create(dto);
  }

  public async login({ login, password }: LoginDto) {
    const user = await this.userService.findOneByLogin(login);

    if (user) {
      const isCorrectPassword = bcrypt.compare(password, user.password);

      if (!isCorrectPassword) {
        throw new NotFoundException('Invalid credentials');
      }

      const { id, login } = user;

      const payload: JwtPayload = { userId: id, login };

      const tokens = this.getTokens(payload);

      return { ...payload, ...tokens };
    }

    throw new NotFoundException('User not found');
  }

  public async refreshToken(token: string) {
    try {
      await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
    } catch {
      throw new ForbiddenException('Refresh token is not valid');
    }

    const payload = decode(token) as JwtPayload;

    const tokens = this.getTokens(payload);

    return { ...payload, ...tokens };
  }

  private getTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });

    return { accessToken, refreshToken };
  }
}
