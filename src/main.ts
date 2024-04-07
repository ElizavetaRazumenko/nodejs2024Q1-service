import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { load } from 'js-yaml';
import { readFile } from 'fs/promises';
import { join, dirname } from 'node:path';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { HttpExceptionFilter } from './filters/exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const PORT = process.env.PORT || 4000;

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  const api = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );

  const document = load(api) as OpenAPIObject;

  SwaggerModule.setup('doc', app, document);

  process.on('unhandledRejection', (reason) => {
    logger.error(
      'Unhandled Rejection!',
      reason instanceof Error ? reason.stack : String(reason),
    );
  });

  process.on('uncaughtException', (e: Error) => {
    logger.error('Uncaught Exception!', e.stack);
    process.exit(1);
  });

  await app.listen(PORT, () => {
    console.log(`Application is running on ${PORT} port`);
  });
}

bootstrap();
