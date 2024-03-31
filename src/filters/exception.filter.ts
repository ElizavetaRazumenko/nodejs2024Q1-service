import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
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

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any;

    switch (true) {
      case exception instanceof HttpException:
        statusCode = exception.getStatus();
        errorResponse = exception.getResponse();

        break;

      case exception instanceof ForbiddenException:
        statusCode = HttpStatus.FORBIDDEN;
        errorResponse = {
          statusCode,
          message: 'Access forbidden.',
        };

        break;

      case exception instanceof UnauthorizedException:
        statusCode = HttpStatus.FORBIDDEN;
        errorResponse = {
          statusCode,
          message: 'Authentication failed.',
        };

        break;

      case exception instanceof BadRequestException:
        statusCode = HttpStatus.BAD_REQUEST;
        errorResponse = {
          statusCode,
          message: exception.getResponse(),
        };

        break;

      default:
        errorResponse = {
          statusCode,
          message: 'Internal server error.',
        };
    }

    this.customLoggerService.error({
      url,
      query,
      method,
      statusCode,
      headers,
      body,
      trace,
      errorResponse,
      message: errorResponse.message || 'Internal server error',
    });

    res.status(statusCode).json({
      errorResponse,
    });
  }
}
