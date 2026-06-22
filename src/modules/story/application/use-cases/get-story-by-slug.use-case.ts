import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Story } from '../../domain/entities/story.entity';
import { STORY_REPOSITORY, StoryRepository } from '../../domain/repositories/story.repository';

@Injectable()
export class GetStoryBySlugUseCase {
  constructor(
    @Inject(STORY_REPOSITORY)
    private readonly storyRepository: StoryRepository,
  ) {}

  async execute(slug: string): Promise<Story> {
    const story = await this.storyRepository.findBySlug(slug);

    if (!story) {
      throw new NotFoundException(`Story with slug "${slug}" not found`);
    }

    return story;
  }
}
