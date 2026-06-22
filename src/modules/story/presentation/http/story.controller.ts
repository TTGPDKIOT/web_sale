import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateStoryDto } from '../../application/dtos/create-story.dto';
import { CreateStoryUseCase } from '../../application/use-cases/create-story.use-case';
import { GetStoriesUseCase } from '../../application/use-cases/get-stories.use-case';
import { GetStoryBySlugUseCase } from '../../application/use-cases/get-story-by-slug.use-case';

@Controller('stories')
export class StoryController {
  constructor(
    private readonly getStoriesUseCase: GetStoriesUseCase,
    private readonly getStoryBySlugUseCase: GetStoryBySlugUseCase,
    private readonly createStoryUseCase: CreateStoryUseCase,
  ) {}

  @Get()
  findAll() {
    return this.getStoriesUseCase.execute();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.getStoryBySlugUseCase.execute(slug);
  }

  @Post()
  create(@Body() dto: CreateStoryDto) {
    return this.createStoryUseCase.execute(dto);
  }
}
