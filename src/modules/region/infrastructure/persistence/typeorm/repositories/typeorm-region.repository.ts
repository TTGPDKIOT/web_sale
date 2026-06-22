import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Region } from '../../../../domain/entities/region.entity';
import { RegionRepository } from '../../../../domain/repositories/region.repository';
import { RegionOrmEntity } from '../entities/region.orm-entity';

@Injectable()
export class TypeOrmRegionRepository implements RegionRepository {
  private readonly repo: Repository<RegionOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(RegionOrmEntity);
  }

  async findAll(): Promise<Region[]> {
    const rows = await this.repo.find({ order: { name: 'ASC' } });
    return rows.map(this.toDomain);
  }

  async findBySlug(slug: string): Promise<Region | null> {
    const row = await this.repo.findOne({ where: { slug } });
    return row ? this.toDomain(row) : null;
  }

  async save(region: Region): Promise<Region> {
    const row = this.repo.create(region);
    const saved = await this.repo.save(row);
    return this.toDomain(saved);
  }

  private toDomain(row: RegionOrmEntity): Region {
    return new Region(
      row.id,
      row.name,
      row.slug,
      row.type,
      row.description ?? undefined,
      row.parentId ?? null,
      row.imageUrl ?? null,
      row.latitude ?? null,
      row.longitude ?? null,
      row.isActive,
    );
  }
}
