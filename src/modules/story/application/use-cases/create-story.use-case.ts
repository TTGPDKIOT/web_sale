import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Story } from '../../domain/entities/story.entity';
import { STORY_REPOSITORY, StoryRepository } from '../../domain/repositories/story.repository';
import { CreateStoryDto } from '../dtos/create-story.dto';

@Injectable()
export class CreateStoryUseCase {
  constructor(
    @Inject(STORY_REPOSITORY)
    private readonly storyRepository: StoryRepository,
  ) {}

  async execute(dto: CreateStoryDto): Promise<Story> {
    const story = new Story(
      randomUUID(),
      dto.title,
      dto.slug,
      dto.content,
      dto.type,
      dto.summary,
      dto.regionId ?? null,
      dto.coverImageUrl ?? null,
      dto.status ?? 'DRAFT',
    );

    return this.storyRepository.save(story);
  }
}
