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

    const trace = exception instanceof Error ? exception.stack : undefined;
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { statusCode, message: 'Internal server error' };

    this.customLoggerService.error({
      url,
      query,
      method,
      statusCode,
      headers,
      body,
      trace,
      errorResponse,
      message: 'Internal server error',
    });

    res.status(statusCode).json({
      errorResponse,
    });
  }
}
