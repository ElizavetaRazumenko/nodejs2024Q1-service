import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    }
    throw new ForbiddenException('User not found');
  }
}
