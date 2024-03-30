import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from 'src/logger/logger.service';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const argumentHost = host.switchToHttp();

    const res = argumentHost.getResponse<Response>();
    const { url, method, headers, query, body } =
      argumentHost.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.customLoggerService.error({
        message: 'Internal server error',
        trace: (exception as Error).stack,
        statusCode: status,
        url,
        query,
        method,
        headers,
        body,
      });
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      message: exception.message || 'Internal server error',
    };

    res.status(status).json(errorResponse);
  }
}
