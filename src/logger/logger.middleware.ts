import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  use(req: Request, res: Response, next: () => void) {
    const { query, method, body, originalUrl } = req;

    res.on('finish', () => {
      this.customLoggerService.log(
        `${method} ${originalUrl}: Query params: ${JSON.stringify(
          query,
        )}, Body: ${JSON.stringify(body)}, ${res.statusCode}.)}`,
      );
    });
    next();
  }
}
