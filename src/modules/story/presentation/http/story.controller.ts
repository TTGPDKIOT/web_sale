import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateStoryDto } from '../../application/dtos/create-story.dto';
import { CreateStoryUseCase } from '../../application/use-cases/create-story.use-case';
import { GetStoriesUseCase } from '../../application/use-cases/get-stories.use-case';

@Controller('stories')
export class StoryController {
  constructor(
    private readonly getStoriesUseCase: GetStoriesUseCase,
    private readonly createStoryUseCase: CreateStoryUseCase,
  ) {}

  @Get()
  findAll() {
    return this.getStoriesUseCase.execute();
  }

  @Post()
  create(@Body() dto: CreateStoryDto) {
    return this.createStoryUseCase.execute(dto);
  }
}
