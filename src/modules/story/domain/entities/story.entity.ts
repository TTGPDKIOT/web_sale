export type StoryType = 'PRODUCT_STORY' | 'REGION_STORY' | 'PRODUCER_STORY' | 'BLOG';
export type StoryStatus = 'DRAFT' | 'PUBLISHED';

export class Story {
  constructor(
    public readonly id: string,
    public title: string,
    public slug: string,
    public content: string,
    public type: StoryType,
    public summary?: string,
    public regionId?: string | null,
    public coverImageUrl?: string | null,
    public status: StoryStatus = 'DRAFT',
  ) {}
}
