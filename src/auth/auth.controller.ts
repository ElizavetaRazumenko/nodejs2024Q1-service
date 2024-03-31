import {
  Body,
  Controller,
  ForbiddenException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    return (
      (await this.authService.signUp(dto)) && {
        message: 'User created successfully',
      }
    );
  }

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return this.authService.login(dto);
    } catch (e) {
      if (e.status === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('Authentication failed');
      }
      throw e;
    }
  }

  @UsePipes(new ValidationPipe())
  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }
}
