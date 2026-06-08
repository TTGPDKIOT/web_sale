import { IsIn, IsOptional, IsString } from 'class-validator';
import { StoryStatus, StoryType } from '../../domain/entities/story.entity';

export class CreateStoryDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsString()
  content!: string;

  @IsIn(['PRODUCT_STORY', 'REGION_STORY', 'PRODUCER_STORY', 'BLOG'])
  type!: StoryType;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  regionId?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED'])
  status?: StoryStatus;
}
