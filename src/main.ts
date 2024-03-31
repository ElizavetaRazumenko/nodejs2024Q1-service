import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './logger/logger.service';
import { ExceptionsFilter } from './filters/exception.filter';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const customLoggerService = app.get(CustomLoggerService);
  const exceptionsFilter = new ExceptionsFilter(customLoggerService);

  app.useGlobalFilters(exceptionsFilter);

  const document = YAML.load('doc/api.yaml');
  SwaggerModule.setup('api', app, document);

  process.on('unhandledRejection', (error) => {
    customLoggerService.error({
      message: 'Unhandled Rejection',
      trace: error instanceof Error ? error.stack : String(error),
      statusCode: 500,
    });

    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    customLoggerService.error({
      message: 'Uncaught Exception',
      trace: error.stack,
      statusCode: 500,
    });

    process.exit(1);
  });

  await app.listen(PORT);
}

bootstrap();
