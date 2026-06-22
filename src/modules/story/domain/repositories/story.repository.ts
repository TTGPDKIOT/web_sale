import { Story } from '../entities/story.entity';

export const STORY_REPOSITORY = Symbol('STORY_REPOSITORY');

export interface StoryRepository {
  findAll(): Promise<Story[]>;
  findBySlug(slug: string): Promise<Story | null>;
  save(story: Story): Promise<Story>;
}
