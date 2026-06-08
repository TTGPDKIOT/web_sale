import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './modules/product/product.module';
import { RegionModule } from './modules/region/region.module';
import { StoryModule } from './modules/story/story.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RegionModule,
    ProductModule,
    StoryModule,
  ],
})
export class AppModule {}
