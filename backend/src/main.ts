import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join, resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  const imagenesPath = resolve(process.env.CAMERA_IMAGES_PATH || join(__dirname, '..', '..', 'imagenes'));
  app.useStaticAssets(imagenesPath, { prefix: '/camera/' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
