import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '../../../../domain/entities/story.entity';
import { StoryRepository } from '../../../../domain/repositories/story.repository';
import { StoryOrmEntity } from '../entities/story.orm-entity';

@Injectable()
export class TypeOrmStoryRepository implements StoryRepository {
  constructor(
    @InjectRepository(StoryOrmEntity)
    private readonly repo: Repository<StoryOrmEntity>,
  ) {}

  async findAll(): Promise<Story[]> {
    const rows = await this.repo.find({ order: { title: 'ASC' } });
    return rows.map(this.toDomain);
  }

  async save(story: Story): Promise<Story> {
    const row = this.repo.create(story);
    const saved = await this.repo.save(row);
    return this.toDomain(saved);
  }

  private toDomain(row: StoryOrmEntity): Story {
    return new Story(
      row.id,
      row.title,
      row.slug,
      row.content,
      row.type,
      row.summary,
      row.regionId ?? null,
      row.coverImageUrl ?? null,
      row.status,
    );
  }
}
