import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import helmet from 'helmet';
import * as compression from 'compression';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });

  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription('The API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Docs',
    customCss:
      '.swagger-container .swagger-ui { max-width: 800px; margin: 0 auto; }',
  });

  app.use(helmet());
  app.use(compression());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const PORT = configService.get<string>('PORT') || 3000;

  await app.listen(PORT, async () =>
    console.log(`Server running on ${await app.getUrl()}`),
  );
}

bootstrap()
  .then(() => {
    console.log('Application is running');
  })
  .catch((err) => console.error('Application Error: ', err));
