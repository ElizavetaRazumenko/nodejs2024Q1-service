import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { httpAdapter } = this.httpAdapterHost;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const path = httpAdapter.getRequestUrl(request);

    this.logger.error(
      `${request.method} - StatusCode: ${status} - Message: ${message}`,
      (exception as HttpException).stack,
    );

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path,
      message,
    };

    httpAdapter.reply(response, responseBody, status);
  }
}
