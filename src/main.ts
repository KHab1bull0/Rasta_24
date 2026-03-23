import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'initData'],
    credentials: true,
  });

  const config = app.get(ConfigService);
  const PORT = config.get('app.port');

  setupSwagger(app, config);

  await app.listen(PORT, () => {
    console.log(`App mode: ${process.env.APP_MODE}`);
    console.log(`Server:   http://localhost:\x1b[33m${PORT}\x1b[0m`);
    console.log(`Swagger:  http://localhost:\x1b[33m${PORT}\x1b[0m/api-docs`);
  });
}
bootstrap();
