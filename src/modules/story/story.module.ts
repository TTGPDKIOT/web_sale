import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateStoryUseCase } from './application/use-cases/create-story.use-case';
import { GetStoriesUseCase } from './application/use-cases/get-stories.use-case';
import { STORY_REPOSITORY } from './domain/repositories/story.repository';
import { StoryOrmEntity } from './infrastructure/persistence/typeorm/entities/story.orm-entity';
import { TypeOrmStoryRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-story.repository';
import { StoryController } from './presentation/http/story.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoryOrmEntity])],
  controllers: [StoryController],
  providers: [
    GetStoriesUseCase,
    CreateStoryUseCase,
    {
      provide: STORY_REPOSITORY,
      useClass: TypeOrmStoryRepository,
    },
  ],
})
export class StoryModule {}
