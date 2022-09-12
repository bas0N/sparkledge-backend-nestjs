import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as AWS from 'aws-sdk';
import { allowedOrigins } from './config/allowedOrigins';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './config/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //to be changed
  app.enableCors({
    origin: function (origin, callback) {
      console.log('allowed origins: ', JSON.stringify(allowedOrigins));
      console.log('origin:  ', origin);
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(
          new Error(
            `NOT ALLOWED BY CORS: ${origin}, allowed: ${JSON.stringify(
              allowedOrigins,
            )}`,
          ),
        );
      }
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Sparkledge API')
    .setDescription('Sparkledge backend endpoints')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
