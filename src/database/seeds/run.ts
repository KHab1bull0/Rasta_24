import { NestFactory } from '@nestjs/core';
import { SeedModule } from 'src/database/seeds/seed.module';
import { SeedService } from 'src/database/seeds/seed.service';

const run = async () => {
  const app = await NestFactory.create(SeedModule);
  await app.get(SeedService).run();
  await app.close();
};

void run();
