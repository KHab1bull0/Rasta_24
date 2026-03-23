import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';
import { SeedService } from 'src/database/seeds/seed.service';
import { TypeOrmConfigService } from 'src/database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_PATH,
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [SeedService],
})
export class SeedModule {}
