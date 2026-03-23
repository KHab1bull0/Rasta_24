import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService({ database: databaseConfig() });

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get('database.url'),
  keepConnectionAlive: true,
  logging: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
} as DataSourceOptions);
