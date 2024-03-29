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
    const { login, password } = dto;
    const hash = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      login,
      password: hash,
    });

    return user;
  }

  public async login(dto: LoginDto) {
    const { login, password } = dto;

    const user = await this.userService.findOneByLogin(login);

    if (user) {
      const isCorrectPassword = bcrypt.compare(password, user.password);

      if (!isCorrectPassword) {
        throw new ForbiddenException('Invalid credentials');
      }

      const { id, login } = user;

      const jwtPayload: JwtPayload = { userId: id, login };

      const accessToken = this.jwtService.sign(jwtPayload, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      });

      const refreshToken = this.jwtService.sign(jwtPayload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      });

      return { accessToken, refreshToken };
    }

    throw new ForbiddenException('User not found');
  }

  public async refreshToken(token: string) {
    try {
      const decoded = await this.jwtService.verify(token);

      const user = await this.userService.findOne(decoded.userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { id, login } = user;

      const payload: JwtPayload = { userId: id, login };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });

      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}
