import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user') // don't forget to remove
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
