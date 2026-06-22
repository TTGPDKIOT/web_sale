import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Story } from '../../../../domain/entities/story.entity';
import { StoryRepository } from '../../../../domain/repositories/story.repository';
import { StoryOrmEntity } from '../entities/story.orm-entity';

@Injectable()
export class TypeOrmStoryRepository implements StoryRepository {
  private readonly repo: Repository<StoryOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(StoryOrmEntity);
  }

  async findAll(): Promise<Story[]> {
    const rows = await this.repo.find({ order: { title: 'ASC' } });
    return rows.map(this.toDomain);
  }

  async findBySlug(slug: string): Promise<Story | null> {
    const row = await this.repo.findOne({ where: { slug } });
    return row ? this.toDomain(row) : null;
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
