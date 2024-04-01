import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction) {
    const { query, method, body, originalUrl } = request;

    response.on('finish', () => {
      const message = `${method} ROUTE:${originalUrl} - Status Code:${
        response.statusCode
      } - Query:${JSON.stringify(query)} - Body:${JSON.stringify(body)}}`;

      if (response.statusCode < 500 && response.statusCode > 399) {
        this.logger.warn(message);
      } else if (response.statusCode > 499) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
