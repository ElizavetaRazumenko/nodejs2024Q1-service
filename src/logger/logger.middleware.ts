import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      this.customLoggerService.log(
        `${req.method} ${req.originalUrl}: Query params: ${JSON.stringify(
          req.query,
        )}, Body: ${JSON.stringify(req.body)}, ${res.statusCode}.)}`,
      );
    });

    next();
  }
}
