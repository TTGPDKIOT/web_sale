import { Region } from '../entities/region.entity';

export const REGION_REPOSITORY = Symbol('REGION_REPOSITORY');

export interface RegionRepository {
  findAll(): Promise<Region[]>;
  findBySlug(slug: string): Promise<Region | null>;
  save(region: Region): Promise<Region>;
}
