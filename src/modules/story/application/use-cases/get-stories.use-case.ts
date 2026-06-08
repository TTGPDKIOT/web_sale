import { Inject, Injectable } from '@nestjs/common';
import { Story } from '../../domain/entities/story.entity';
import { STORY_REPOSITORY, StoryRepository } from '../../domain/repositories/story.repository';

@Injectable()
export class GetStoriesUseCase {
  constructor(
    @Inject(STORY_REPOSITORY)
    private readonly storyRepository: StoryRepository,
  ) {}

  async execute(): Promise<Story[]> {
    return this.storyRepository.findAll();
  }
}
