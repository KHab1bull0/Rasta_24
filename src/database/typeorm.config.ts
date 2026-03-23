import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.configService.get<string>('database.url'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: ['../migrations/*{.ts,.js}'],
      synchronize: false,
      logging: false,
    } as TypeOrmModuleOptions;
  }
}
