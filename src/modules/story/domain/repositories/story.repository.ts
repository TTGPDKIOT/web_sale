import { Story } from '../entities/story.entity';

export const STORY_REPOSITORY = Symbol('STORY_REPOSITORY');

export interface StoryRepository {
  findAll(): Promise<Story[]>;
  save(story: Story): Promise<Story>;
}
