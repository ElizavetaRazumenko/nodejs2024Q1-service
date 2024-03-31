import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  public async signUp(dto: SignUpDto) {
    try {
      return await this.userService.create(dto);
    } catch (e) {
      this.customLoggerService.error({
        message: 'Error while signing up',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorResponse: e.message,
      });
      throw new InternalServerErrorException('Error during signing up');
    }
  }

  public async login(dto: LoginDto) {
    try {
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
    } catch (e) {
      this.customLoggerService.error({
        message: 'Error during logging in',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorResponse: e.message,
      });
      throw new InternalServerErrorException('Error during logging in');
    }
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

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });

      return { accessToken, refreshToken };
    } catch (e) {
      this.customLoggerService.error({
        message: 'Error while refreshing tokens',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorResponse: e.message,
      });
      throw new InternalServerErrorException('Error during refreshing tokens');
    }
  }

  // public async validateUser(payload: JwtPayload) {
  //   try {
  //     return this.userService.findOne(payload.userId);
  //   } catch (error) {
  //     this.customLoggerService.error({
  //       message: 'Error while validating user',
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       errorResponse: error.message,
  //     });
  //     throw new InternalServerErrorException('Error while validating user');
  //   }
  // }
}
