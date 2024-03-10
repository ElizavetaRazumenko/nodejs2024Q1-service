import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import * as dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = YAML.load('doc/api.yaml');
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}

bootstrap();
