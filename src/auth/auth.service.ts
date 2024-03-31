import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types';

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
        throw new ForbiddenException('Invalid credentials');
      }

      const { id, login } = user;

      return this.getTokens(id, login);
    }

    throw new ForbiddenException('User not found');
  }

  public async refreshToken(token: string) {
    if (token) {
      try {
        const { userId } = this.jwtService.verify(token);
        const user = await this.userService.findOne(userId);

        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        const { id, login } = user;

        return this.getTokens(id, login);
      } catch (error) {
        throw new ForbiddenException('Invalid refresh token');
      }
    }

    throw new UnauthorizedException('Request body should be with refreshToken');
  }

  private getTokens(id: string, login: string) {
    const payload: JwtPayload = { userId: id, login };

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
