import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/storage', express.static(path.join(__dirname, '..', 'public', 'storage'))); // เพื่อให้เข้าถึงไฟล์ที่อยู่ใน folder ได้
  await app.listen(3000);
}
bootstrap();