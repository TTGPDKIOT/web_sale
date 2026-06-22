import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../modules/product/infrastructure/persistence/typeorm/entities/product.orm-entity';
import { RegionOrmEntity } from '../modules/region/infrastructure/persistence/typeorm/entities/region.orm-entity';
import { StoryOrmEntity } from '../modules/story/infrastructure/persistence/typeorm/entities/story.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const password = config.get<string>('DB_PASSWORD');

        if (!password) {
          throw new Error('Missing DB_PASSWORD in .env file');
        }

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST') ?? 'localhost',
          port: Number(config.get<string>('DB_PORT') ?? 5432),
          username: config.get<string>('DB_USERNAME') ?? 'postgres',
          password: String(password),
          database: config.get<string>('DB_DATABASE') ?? 'dac_san_db',
          entities: [RegionOrmEntity, ProductOrmEntity, StoryOrmEntity],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}