import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //swagger base document metadata
  const config = new DocumentBuilder()
    .setTitle('Nest Ecommerce Api')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth() // optional if you're using JWT
    .addServer('http://localhost:3000', 'Local Env')
    .build();
  //project Description
  app.setGlobalPrefix('api/v1');

  //use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //remove extra attribute or field from request
      forbidNonWhitelisted: true, //convert req object compatible with dto
      transform: true, //covert to dto
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //use cors for allow origin
  const allowedOrigins = process.env.ALLOW_CORS_ORIGIN?.split(',') ?? [];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  //api docs swagger
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep token between refreshes
      tagsSorter: 'alpha', // Sort tags
      operationsSorter: 'alpha', // Sort endpoints inside tags
      docExpansion: 'none', // Collapse sections by default (optional)
      displayRequestDuration: true, // Shows request durations (optional)
    },
    customSiteTitle: 'API Docs',
    customfavIcon: 'https://swagger.io/docs/favicon-32x32.png', // optional icon
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .scheme-container { display: none }
    `, // optional styling
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  Logger.error('Error Occurred on starting app : ', err);
  process.exit(1);
});
