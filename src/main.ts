import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as config from 'config';

import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(compression());

  if (process.env.NODE_ENV === 'develoment') {
    app.enableCors();
  } else {
    logger.log(`Accepting request from origin ${serverConfig.origin}`);
    app.enableCors({ origin: serverConfig.origin });
  }

  const options = new DocumentBuilder()
    .setTitle('Taks Example')
    .setDescription('Tasks description')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}.`);
}
bootstrap();
