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
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [RegionOrmEntity, ProductOrmEntity, StoryOrmEntity],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
