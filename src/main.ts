import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';

import { AppModule } from './app.module';
import * as compression from 'compression';


async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(compression({level:9}));

  if (process.env.NODE_ENV === 'develoment') {
    app.enableCors();
  } else {
    logger.log(`Accepting request from origin ${serverConfig.origin}`);
    app.enableCors({ origin: serverConfig.origin });
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}.`);
}
bootstrap();
